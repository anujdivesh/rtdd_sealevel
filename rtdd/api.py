import json
from datetime import date
import base64

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Holding, Station, Timezone


def _parse_iso_date(value):
    if value in (None, ""):
        return None
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return date.fromisoformat(value)
    raise ValueError(f"Unsupported date value: {type(value)!r}")


def _station_to_dict(station: Station):
    return {
        "stn_num": station.stn_num,
        "stn_name": station.stn_name,
        "country": station.country,
        "latitude": station.latitude,
        "longitude": station.longitude,
        "elevation": station.elevation,
        "date_open": station.date_open.isoformat() if station.date_open else None,
        "date_close": station.date_close.isoformat() if station.date_close else None,
        "callsign": station.callsign,
        "ip_address": str(station.ip_address) if station.ip_address else None,
        "sensor_hierarchy": station.sensor_hierarchy,
        "disp_name": station.disp_name,
        "active_sensor": station.active_sensor,
        "aac": station.aac,
        "antt": station.antt,
        "timezone": station.timezone_id,
        "network": station.network,
        # These exist in the upstream API but are not modeled here.
        "short_name": None,
        "status": None,
    }


def _holding_to_dict(holding: Holding):
    return {
        "filename": holding.filename,
        "date_created": holding.date_created.isoformat() if holding.date_created else None,
    }


def _require_auth(request):
    if getattr(request, "user", None) is not None and request.user.is_authenticated:
        return None

    auth_header = request.META.get("HTTP_AUTHORIZATION") or ""
    if not auth_header.startswith("Basic "):
        resp = JsonResponse({"detail": "Authentication required"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="holdings"'
        return resp

    try:
        decoded = base64.b64decode(auth_header.split(" ", 1)[1]).decode("utf-8")
        username, password = decoded.split(":", 1)
    except Exception:  # noqa: BLE001
        resp = JsonResponse({"detail": "Invalid Authorization header"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="holdings"'
        return resp

    user = authenticate(request, username=username, password=password)
    if user is None:
        resp = JsonResponse({"detail": "Invalid credentials"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="holdings"'
        return resp

    request.user = user
    return None


@csrf_exempt
def stations_api(request):
    if request.method == "GET":
        stations = Station.objects.all().order_by("disp_name", "stn_num")
        return JsonResponse([_station_to_dict(s) for s in stations], safe=False)

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        body = request.body.decode("utf-8") if request.body else ""
        payload = json.loads(body) if body else None
    except json.JSONDecodeError as exc:
        return JsonResponse({"detail": f"Invalid JSON: {exc.msg}"}, status=400)

    if payload is None:
        return JsonResponse({"detail": "Missing JSON body"}, status=400)

    if isinstance(payload, dict):
        items = [payload]
    elif isinstance(payload, list):
        items = payload
    else:
        return JsonResponse({"detail": "Expected a JSON object or list"}, status=400)

    created = 0
    updated = 0
    errors = []

    for idx, item in enumerate(items):
        if not isinstance(item, dict):
            errors.append({"index": idx, "detail": "Each station must be an object"})
            continue

        stn_num = item.get("stn_num")
        stn_name = item.get("stn_name")
        if not stn_num or not stn_name:
            errors.append({"index": idx, "detail": "Missing stn_num or stn_name"})
            continue

        try:
            timezone_name = item.get("timezone")
            timezone_obj = None
            if timezone_name not in (None, ""):
                timezone_obj, _ = Timezone.objects.get_or_create(name=timezone_name)

            defaults = {
                "stn_name": stn_name,
                "disp_name": item.get("disp_name") or "",
                "country": item.get("country") or "",
                "network": item.get("network") or "aus",
                "date_open": _parse_iso_date(item.get("date_open")),
                "date_close": _parse_iso_date(item.get("date_close")),
                "longitude": item.get("longitude"),
                "latitude": item.get("latitude"),
                "elevation": item.get("elevation"),
                "user_id": item.get("user_id") or "",
                "callsign": item.get("callsign") or "",
                "ip_address": item.get("ip_address"),
                "sensor_hierarchy": item.get("sensor_hierarchy") or "",
                "active_sensor": item.get("active_sensor"),
                "aac": item.get("aac") or "",
                "antt": item.get("antt") or "",
                "timezone": timezone_obj,
            }

            obj, was_created = Station.objects.update_or_create(
                stn_num=str(stn_num),
                defaults=defaults,
            )
            if was_created:
                created += 1
            else:
                updated += 1
        except Exception as exc:  # noqa: BLE001
            errors.append({"index": idx, "stn_num": stn_num, "detail": str(exc)})

    status = 200 if not errors else 207
    return JsonResponse(
        {
            "created": created,
            "updated": updated,
            "received": len(items),
            "errors": errors,
        },
        status=status,
    )


@csrf_exempt
def holdings_api(request):
    if request.method == "GET":
        holdings = Holding.objects.all().order_by("filename")
        return JsonResponse([_holding_to_dict(h) for h in holdings], safe=False)

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    auth_error = _require_auth(request)
    if auth_error is not None:
        return auth_error

    try:
        body = request.body.decode("utf-8") if request.body else ""
        payload = json.loads(body) if body else None
    except json.JSONDecodeError as exc:
        return JsonResponse({"detail": f"Invalid JSON: {exc.msg}"}, status=400)

    if payload is None:
        return JsonResponse({"detail": "Missing JSON body"}, status=400)

    if isinstance(payload, dict):
        items = [payload]
    elif isinstance(payload, list):
        items = payload
    else:
        return JsonResponse({"detail": "Expected a JSON object or list"}, status=400)

    created = 0
    updated = 0
    errors = []

    for idx, item in enumerate(items):
        if not isinstance(item, dict):
            errors.append({"index": idx, "detail": "Each holding must be an object"})
            continue

        filename = item.get("filename")
        if not filename:
            errors.append({"index": idx, "detail": "Missing filename"})
            continue

        try:
            obj, was_created = Holding.objects.update_or_create(
                filename=str(filename),
                defaults={},
            )
            if was_created:
                created += 1
            else:
                updated += 1
        except Exception as exc:  # noqa: BLE001
            errors.append({"index": idx, "filename": filename, "detail": str(exc)})

    status = 200 if not errors else 207
    return JsonResponse(
        {
            "created": created,
            "updated": updated,
            "received": len(items),
            "errors": errors,
        },
        status=status,
    )
