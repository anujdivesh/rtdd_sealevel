import json
import base64
import csv
from datetime import date, datetime, time, timezone as dt_timezone
from typing import Any

from django.contrib.auth import authenticate
from django.http import HttpRequest, JsonResponse, StreamingHttpResponse
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Holding, Observation, Station, TidePrediction, Timezone


def _parse_date(value: Any) -> date | None:
    if value in (None, ""):
        return None
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        # Upstream uses YYYY-MM-DD
        return date.fromisoformat(value)
    raise ValueError(f"Invalid date value: {value!r}")


def _to_station_dict(station: Station) -> dict[str, Any]:
    return {
        "stn_num": station.stn_num,
        "stn_name": station.stn_name,
        "disp_name": station.disp_name,
        "country": station.country,
        "latitude": station.latitude,
        "longitude": station.longitude,
        "elevation": station.elevation,
        "date_open": station.date_open.isoformat() if station.date_open else None,
        "date_close": station.date_close.isoformat() if station.date_close else None,
        "callsign": station.callsign,
        "ip_address": str(station.ip_address) if station.ip_address else None,
        "sensor_hierarchy": station.sensor_hierarchy,
        "active_sensor": station.active_sensor,
        "aac": station.aac,
        "antt": station.antt,
        "timezone": station.timezone_id if station.timezone_id else None,
        "network": station.network,
        "user_id": station.user_id,
    }


def _to_holding_dict(holding: Holding) -> dict[str, Any]:
    return {
        "filename": holding.filename,
        "date_created": holding.date_created.isoformat() if holding.date_created else None,
    }


def _to_observation_dict(obs: Observation) -> dict[str, Any]:
    return {
        "stn_num": obs.stn_num,
        "utc": obs.utc.isoformat() if obs.utc else None,
        "air_temp": obs.air_temp,
        "air_temp_qual": obs.air_temp_qual,
        "pressure": obs.pressure,
        "pressure_qual": obs.pressure_qual,
        "wind_dir": obs.wind_dir,
        "wind_spd": obs.wind_spd,
        "wind_spd_max": obs.wind_spd_max,
        "wind_spd_qual": obs.wind_spd_qual,
        "wtr_temp": obs.wtr_temp,
        "wtr_level": obs.wtr_level,
        "msg_num": obs.msg_num,
        "date_created": obs.date_created.isoformat() if obs.date_created else None,
        "date_updated": obs.date_updated.isoformat() if obs.date_updated else None,
        "seq": obs.seq,
        "air_temp_qc": obs.air_temp_qc,
        "pressure_qc": obs.pressure_qc,
        "wind_dir_qc": obs.wind_dir_qc,
        "wind_spd_qc": obs.wind_spd_qc,
        "wind_spd_max_qc": obs.wind_spd_max_qc,
        "wtr_temp_qc": obs.wtr_temp_qc,
        "wtr_level_qc": obs.wtr_level_qc,
        "instrument_num": obs.instrument_num,
        "battery_voltage": obs.battery_voltage,
        "enclosure_temperature": obs.enclosure_temperature,
        "wla_1": obs.wla_1,
        "wla_2": obs.wla_2,
        "wla_3": obs.wla_3,
        "wla_4": obs.wla_4,
        "insert_datetime": obs.insert_datetime.isoformat() if obs.insert_datetime else None,
    }


def _parse_utc_datetime(value: Any):
    if value in (None, ""):
        return None
    if not isinstance(value, str):
        raise ValueError("utc must be an ISO datetime string")
    dt = parse_datetime(value)
    if dt is None:
        raise ValueError("Invalid utc datetime")
    if timezone.is_aware(dt):
        dt = timezone.make_naive(dt, timezone=dt_timezone.utc)
    return dt


def _parse_query_datetime(value: Any, *, is_end: bool) -> datetime:
    """Parse querystring datetimes.

    Accepts either full ISO datetimes (e.g. 2026-05-03T00:00:00Z)
    or date-only values (YYYY-MM-DD). Returned value is a naive UTC
    datetime for consistent filtering against the DB.
    """

    if value in (None, ""):
        raise ValueError("Missing datetime")
    if not isinstance(value, str):
        raise ValueError("Datetime must be a string")

    if "T" in value:
        dt = parse_datetime(value)
        if dt is None:
            raise ValueError("Invalid datetime")
        if timezone.is_aware(dt):
            dt = timezone.make_naive(dt, timezone=dt_timezone.utc)
        return dt

    d = parse_date(value)
    if d is None:
        raise ValueError("Invalid date")
    dt = datetime.combine(d, time.max if is_end else time.min)
    return dt


def _obs_csv_rows(observations: list[Observation]):
    columns = [
        "stn_num",
        "utc",
        "air_temp",
        "air_temp_qual",
        "pressure",
        "pressure_qual",
        "wind_dir",
        "wind_spd",
        "wind_spd_max",
        "wind_spd_qual",
        "wtr_temp",
        "wtr_level",
        "msg_num",
        "date_created",
        "date_updated",
        "seq",
        "air_temp_qc",
        "pressure_qc",
        "wind_dir_qc",
        "wind_spd_qc",
        "wind_spd_max_qc",
        "wtr_temp_qc",
        "wtr_level_qc",
        "instrument_num",
        "battery_voltage",
        "enclosure_temperature",
        "wla_1",
        "wla_2",
        "wla_3",
        "wla_4",
        "insert_datetime",
    ]

    class _Echo:
        def write(self, value: str):
            return value

    writer = csv.writer(_Echo())
    yield writer.writerow(columns)
    for obs in observations:
        row = _to_observation_dict(obs)
        yield writer.writerow([row.get(col) for col in columns])


def _to_tide_prediction_dict(tp: TidePrediction) -> dict[str, Any]:
    return {
        "stn_num": tp.stn_num,
        "utc": tp.utc.isoformat() if tp.utc else None,
        "prediction": tp.prediction,
        "date_created": tp.date_created.isoformat() if tp.date_created else None,
    }


def _require_authenticated_post(request: HttpRequest) -> JsonResponse | None:
    if getattr(request, "user", None) is not None and request.user.is_authenticated:
        return None

    auth_header = request.META.get("HTTP_AUTHORIZATION") or ""

    # Support DRF-style token authentication for simple ingest clients.
    # Format: Authorization: Token <40-hex>
    if auth_header.startswith("Token "):
        token_key = auth_header.split(" ", 1)[1].strip()
        if not token_key:
            resp = JsonResponse({"error": "Invalid token"}, status=401)
            resp["WWW-Authenticate"] = 'Token realm="rtdd"'
            return resp
        try:
            from rest_framework.authtoken.models import Token  # type: ignore

            token_obj = Token.objects.select_related("user").filter(key=token_key).first()
        except Exception:
            token_obj = None

        if token_obj is None or token_obj.user_id is None:
            resp = JsonResponse({"error": "Invalid token"}, status=401)
            resp["WWW-Authenticate"] = 'Token realm="rtdd"'
            return resp

        request.user = token_obj.user
        return None

    if not auth_header.startswith("Basic "):
        resp = JsonResponse({"error": "Authentication required"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="rtdd"'
        return resp

    try:
        decoded = base64.b64decode(auth_header.split(" ", 1)[1]).decode("utf-8")
        username, password = decoded.split(":", 1)
    except Exception:
        resp = JsonResponse({"error": "Invalid Authorization header"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="rtdd"'
        return resp

    user = authenticate(request, username=username, password=password)
    if user is None:
        resp = JsonResponse({"error": "Invalid credentials"}, status=401)
        resp["WWW-Authenticate"] = 'Basic realm="rtdd"'
        return resp

    # Allow the request.
    return None


@csrf_exempt
@require_http_methods(["GET", "POST"])
def stations(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Station.objects.select_related("timezone").all().order_by("stn_num")
        return JsonResponse([_to_station_dict(s) for s in items], safe=False)

    try:
        payload = json.loads((request.body or b"").decode("utf-8"))
    except json.JSONDecodeError as exc:
        return JsonResponse({"error": f"Invalid JSON: {exc}"}, status=400)

    if isinstance(payload, dict) and "stations" in payload:
        payload = payload["stations"]

    if not isinstance(payload, list):
        return JsonResponse({"error": "Expected a JSON array of stations"}, status=400)

    allowed_keys = {
        "stn_num",
        "stn_name",
        "disp_name",
        "country",
        "latitude",
        "longitude",
        "elevation",
        "date_open",
        "date_close",
        "callsign",
        "ip_address",
        "sensor_hierarchy",
        "active_sensor",
        "aac",
        "antt",
        "timezone",
        "network",
        "user_id",
    }

    created = 0
    updated = 0
    errors: list[dict[str, Any]] = []

    for index, raw in enumerate(payload):
        if not isinstance(raw, dict):
            errors.append({"index": index, "error": "Station entry must be an object"})
            continue

        stn_num = raw.get("stn_num")
        stn_name = raw.get("stn_name")
        if not stn_num or not stn_name:
            errors.append({"index": index, "stn_num": stn_num, "error": "Missing stn_num or stn_name"})
            continue

        data = {k: raw.get(k) for k in allowed_keys if k in raw}

        timezone_value = data.pop("timezone", None)
        timezone_obj = None
        if timezone_value not in (None, ""):
            if not isinstance(timezone_value, str):
                errors.append({"index": index, "stn_num": stn_num, "error": "timezone must be a string"})
                continue
            timezone_obj, _ = Timezone.objects.get_or_create(name=timezone_value)

        try:
            defaults: dict[str, Any] = {
                "stn_name": data.get("stn_name"),
                "disp_name": data.get("disp_name") or "",
                "country": data.get("country"),
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "elevation": data.get("elevation"),
                "date_open": _parse_date(data.get("date_open")),
                "date_close": _parse_date(data.get("date_close")),
                "callsign": data.get("callsign"),
                "ip_address": data.get("ip_address"),
                "sensor_hierarchy": data.get("sensor_hierarchy"),
                "active_sensor": data.get("active_sensor"),
                "aac": data.get("aac"),
                "antt": data.get("antt"),
                "timezone": timezone_obj,
                "network": data.get("network") or "aus",
                "user_id": data.get("user_id"),
            }
        except Exception as exc:
            errors.append({"index": index, "stn_num": stn_num, "error": str(exc)})
            continue

        obj, was_created = Station.objects.update_or_create(stn_num=stn_num, defaults=defaults)
        if was_created:
            created += 1
        else:
            updated += 1

    status = 200 if not errors else 207  # multi-status style
    return JsonResponse({"created": created, "updated": updated, "errors": errors}, status=status)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def holdings(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        items = Holding.objects.all().order_by("filename")
        return JsonResponse([_to_holding_dict(h) for h in items], safe=False)

    auth_error = _require_authenticated_post(request)
    if auth_error is not None:
        return auth_error

    try:
        payload = json.loads((request.body or b"").decode("utf-8"))
    except json.JSONDecodeError as exc:
        return JsonResponse({"error": f"Invalid JSON: {exc}"}, status=400)

    if isinstance(payload, dict) and "holdings" in payload:
        payload = payload["holdings"]

    if isinstance(payload, dict):
        payload = [payload]

    if not isinstance(payload, list):
        return JsonResponse({"error": "Expected a JSON object or array of holdings"}, status=400)

    created = 0
    updated = 0
    errors: list[dict[str, Any]] = []

    for index, raw in enumerate(payload):
        if not isinstance(raw, dict):
            errors.append({"index": index, "error": "Holding entry must be an object"})
            continue

        filename = raw.get("filename")
        if not filename:
            errors.append({"index": index, "error": "Missing filename"})
            continue

        try:
            _, was_created = Holding.objects.update_or_create(
                filename=str(filename),
                defaults={},
            )
            if was_created:
                created += 1
            else:
                updated += 1
        except Exception as exc:
            errors.append({"index": index, "filename": filename, "error": str(exc)})

    status = 200 if not errors else 207
    return JsonResponse({"created": created, "updated": updated, "errors": errors}, status=status)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def observations(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        qs = Observation.objects.all()

        stn_num = request.GET.get("stn_num")
        if stn_num:
            qs = qs.filter(stn_num=stn_num)

        start_time = request.GET.get("start_time")
        if start_time:
            try:
                start_dt = _parse_utc_datetime(start_time)
            except Exception as exc:
                return JsonResponse({"error": f"Invalid start_time: {exc}"}, status=400)
            qs = qs.filter(utc__gte=start_dt)

        end_time = request.GET.get("end_time")
        if end_time:
            try:
                end_dt = _parse_utc_datetime(end_time)
            except Exception as exc:
                return JsonResponse({"error": f"Invalid end_time: {exc}"}, status=400)
            qs = qs.filter(utc__lte=end_dt)

        try:
            limit = int(request.GET.get("limit", "1000"))
        except ValueError:
            return JsonResponse({"error": "limit must be an integer"}, status=400)
        limit = max(1, min(limit, 5000))

        qs = qs.order_by("-utc")[:limit]
        return JsonResponse([_to_observation_dict(o) for o in qs], safe=False)

    auth_error = _require_authenticated_post(request)
    if auth_error is not None:
        return auth_error

    try:
        payload = json.loads((request.body or b"").decode("utf-8"))
    except json.JSONDecodeError as exc:
        return JsonResponse({"error": f"Invalid JSON: {exc}"}, status=400)

    if isinstance(payload, dict) and "observations" in payload:
        payload = payload["observations"]

    if isinstance(payload, dict):
        payload = [payload]

    if not isinstance(payload, list):
        return JsonResponse({"error": "Expected a JSON object or array of observations"}, status=400)

    created = 0
    updated = 0
    errors: list[dict[str, Any]] = []

    allowed_keys = {
        "stn_num",
        "utc",
        "air_temp",
        "air_temp_qual",
        "pressure",
        "pressure_qual",
        "wind_dir",
        "wind_spd",
        "wind_spd_max",
        "wind_spd_qual",
        "wtr_temp",
        "wtr_level",
        "msg_num",
        "date_created",
        "date_updated",
        "seq",
        "air_temp_qc",
        "pressure_qc",
        "wind_dir_qc",
        "wind_spd_qc",
        "wind_spd_max_qc",
        "wtr_temp_qc",
        "wtr_level_qc",
        "instrument_num",
        "battery_voltage",
        "enclosure_temperature",
        "wla_1",
        "wla_2",
        "wla_3",
        "wla_4",
        "insert_datetime",
    }

    for index, raw in enumerate(payload):
        if not isinstance(raw, dict):
            errors.append({"index": index, "error": "Observation entry must be an object"})
            continue

        data = {k: raw.get(k) for k in allowed_keys if k in raw}
        stn_num = data.get("stn_num")
        utc_value = data.get("utc")
        seq_value = data.get("seq")
        if not stn_num or not utc_value:
            errors.append({"index": index, "error": "Missing stn_num or utc"})
            continue
        if seq_value in (None, ""):
            errors.append({"index": index, "stn_num": stn_num, "error": "Missing seq (required)"})
            continue

        try:
            utc_dt = _parse_utc_datetime(utc_value)
            insert_dt = _parse_utc_datetime(data.get("insert_datetime")) if "insert_datetime" in data else None
            created_dt = _parse_utc_datetime(data.get("date_created")) if "date_created" in data else None
            updated_dt = _parse_utc_datetime(data.get("date_updated")) if "date_updated" in data else None
        except Exception as exc:
            errors.append({"index": index, "stn_num": stn_num, "error": str(exc)})
            continue

        defaults: dict[str, Any] = {
            "seq": int(seq_value),
            "air_temp": data.get("air_temp"),
            "air_temp_qual": data.get("air_temp_qual"),
            "pressure": data.get("pressure"),
            "pressure_qual": data.get("pressure_qual"),
            "wind_dir": data.get("wind_dir"),
            "wind_spd": data.get("wind_spd"),
            "wind_spd_max": data.get("wind_spd_max"),
            "wind_spd_qual": data.get("wind_spd_qual"),
            "wtr_temp": data.get("wtr_temp"),
            "wtr_level": data.get("wtr_level"),
            "msg_num": data.get("msg_num"),
            "date_created": created_dt,
            "date_updated": updated_dt,
            "air_temp_qc": data.get("air_temp_qc"),
            "pressure_qc": data.get("pressure_qc"),
            "wind_dir_qc": data.get("wind_dir_qc"),
            "wind_spd_qc": data.get("wind_spd_qc"),
            "wind_spd_max_qc": data.get("wind_spd_max_qc"),
            "wtr_temp_qc": data.get("wtr_temp_qc"),
            "wtr_level_qc": data.get("wtr_level_qc"),
            "instrument_num": data.get("instrument_num"),
            "battery_voltage": data.get("battery_voltage"),
            "enclosure_temperature": data.get("enclosure_temperature"),
            "wla_1": data.get("wla_1"),
            "wla_2": data.get("wla_2"),
            "wla_3": data.get("wla_3"),
            "wla_4": data.get("wla_4"),
            "insert_datetime": insert_dt,
        }

        try:
            obj, was_created = Observation.objects.update_or_create(
                stn_num=str(stn_num),
                utc=utc_dt,
                defaults=defaults,
            )
        except Exception as exc:
            errors.append({"index": index, "stn_num": stn_num, "error": str(exc)})
            continue

        if was_created:
            created += 1
        else:
            updated += 1

    status = 200 if not errors else 207
    return JsonResponse({"created": created, "updated": updated, "errors": errors}, status=status)


@require_http_methods(["GET"])
def get_latest_obs(request: HttpRequest) -> JsonResponse:
    stn_num = request.GET.get("stn_num")
    if not stn_num:
        return JsonResponse({"error": "stn_num is required"}, status=400)

    obs = Observation.objects.filter(stn_num=str(stn_num)).order_by("-utc").first()
    if obs is None:
        return JsonResponse([], safe=False)
    return JsonResponse([_to_observation_dict(obs)], safe=False)


@require_http_methods(["GET"])
def get_obs(request: HttpRequest):
    """Front-end compatible observations endpoint.

    Example:
      /api/get_obs?start_time=...&end_time=...&stn_num=...&step=1

    Optional:
      format=csv
    """

    stn_num = request.GET.get("stn_num")
    if not stn_num:
        return JsonResponse({"error": "stn_num is required"}, status=400)

    try:
        start_dt = _parse_query_datetime(request.GET.get("start_time"), is_end=False)
    except Exception as exc:
        return JsonResponse({"error": f"Invalid start_time: {exc}"}, status=400)

    try:
        end_dt = _parse_query_datetime(request.GET.get("end_time"), is_end=True)
    except Exception as exc:
        return JsonResponse({"error": f"Invalid end_time: {exc}"}, status=400)

    try:
        step = int(request.GET.get("step", "1"))
    except ValueError:
        return JsonResponse({"error": "step must be an integer"}, status=400)
    step = max(1, min(step, 1000))

    qs = (
        Observation.objects.filter(stn_num=str(stn_num))
        .filter(utc__gte=start_dt, utc__lte=end_dt)
        .order_by("utc")
    )

    observations_list = list(qs)
    if step > 1:
        observations_list = observations_list[::step]

    if (request.GET.get("format") or "").lower() == "csv":
        filename = f"observations_{stn_num}.csv"
        resp = StreamingHttpResponse(_obs_csv_rows(observations_list), content_type="text/csv")
        resp["Content-Disposition"] = f'attachment; filename="{filename}"'
        return resp

    return JsonResponse([_to_observation_dict(o) for o in observations_list], safe=False)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def tide_prediction(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        qs = TidePrediction.objects.all()

        stn_num = request.GET.get("stn_num")
        if stn_num:
            qs = qs.filter(stn_num=stn_num)

        start_time = request.GET.get("start_time")
        if start_time:
            try:
                start_dt = _parse_utc_datetime(start_time)
            except Exception as exc:
                return JsonResponse({"error": f"Invalid start_time: {exc}"}, status=400)
            qs = qs.filter(utc__gte=start_dt)

        end_time = request.GET.get("end_time")
        if end_time:
            try:
                end_dt = _parse_utc_datetime(end_time)
            except Exception as exc:
                return JsonResponse({"error": f"Invalid end_time: {exc}"}, status=400)
            qs = qs.filter(utc__lte=end_dt)

        try:
            limit = int(request.GET.get("limit", "2000"))
        except ValueError:
            return JsonResponse({"error": "limit must be an integer"}, status=400)
        limit = max(1, min(limit, 20000))

        qs = qs.order_by("-utc")[:limit]
        return JsonResponse([_to_tide_prediction_dict(t) for t in qs], safe=False)

    auth_error = _require_authenticated_post(request)
    if auth_error is not None:
        return auth_error

    try:
        payload = json.loads((request.body or b"").decode("utf-8"))
    except json.JSONDecodeError as exc:
        return JsonResponse({"error": f"Invalid JSON: {exc}"}, status=400)

    if isinstance(payload, dict) and "tide_prediction" in payload:
        payload = payload["tide_prediction"]
    if isinstance(payload, dict) and "predictions" in payload:
        payload = payload["predictions"]

    if isinstance(payload, dict):
        payload = [payload]

    if not isinstance(payload, list):
        return JsonResponse({"error": "Expected a JSON object or array of tide predictions"}, status=400)

    created = 0
    updated = 0
    errors: list[dict[str, Any]] = []

    for index, raw in enumerate(payload):
        if not isinstance(raw, dict):
            errors.append({"index": index, "error": "Entry must be an object"})
            continue

        stn_num = raw.get("stn_num")
        utc_value = raw.get("utc")
        prediction = raw.get("prediction")
        if not stn_num or not utc_value or prediction is None:
            errors.append({"index": index, "error": "Missing stn_num, utc, or prediction"})
            continue

        try:
            utc_dt = _parse_utc_datetime(utc_value)
            date_created = _parse_utc_datetime(raw.get("date_created")) if raw.get("date_created") else None
        except Exception as exc:
            errors.append({"index": index, "stn_num": stn_num, "error": str(exc)})
            continue

        try:
            _, was_created = TidePrediction.objects.update_or_create(
                stn_num=str(stn_num),
                utc=utc_dt,
                defaults={
                    "prediction": float(prediction),
                    "date_created": date_created,
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1
        except Exception as exc:
            errors.append({"index": index, "stn_num": stn_num, "error": str(exc)})

    status = 200 if not errors else 207
    return JsonResponse({"created": created, "updated": updated, "errors": errors}, status=status)
