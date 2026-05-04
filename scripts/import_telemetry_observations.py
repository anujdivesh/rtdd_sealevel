#!/usr/bin/python3

"""Import telemetry water level readings into the RTDD Django API.

Fetches observations from the SPC telemetry API (opmdata.gem.spc.int) and inserts
(or updates) them into the local Django API observations endpoint.

Maps:
- telemetry `timestamp` -> observation `utc`
- telemetry `reading`   -> observation `wtr_level`

Authentication:
- By default, this script uses hardcoded tokens for both the SPC telemetry API
    (`x-api-key`) and the local Django API (`Authorization: Token ...`).
- You can still override either via environment variables if needed.

Optional environment variables (override defaults):
- `TELEMETRY_BASE_URL`  Base URL for telemetry API
                         (default: https://opmdata.gem.spc.int/telemetry/api)
- `TELEMETRY_API_KEY`   API key for SPC telemetry (sent as `x-api-key`)
- `API_BASE_URL`        Base URL for local Django API (default: http://localhost:8000/api)
- `API_TOKEN`           Token auth value for POSTs to local API (preferred)
- `API_USERNAME`        Basic auth username (optional)
- `API_PASSWORD`        Basic auth password (optional)
- `BATCH_SIZE`          POST batch size (default: 500)

Examples:
    # Default run: station TEMP_FJ_MALAU, sensor_id=1, last 5 days (UTC)
    python scripts/import_telemetry_observations.py

    # Optional override of sensor/dates
    python scripts/import_telemetry_observations.py --sensor-id 1 --start 2026-05-01 --end 2026-05-04

Notes:
- `seq` is required by the local observations API; this script derives it
  deterministically from `crc32(f"{stn_num}|{utc}")` mapped into signed int32.
"""

import argparse
import base64
import datetime
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
import zlib
from typing import Any


TELEMETRY_BASE_URL = os.getenv("TELEMETRY_BASE_URL", "https://opmdata.gem.spc.int/telemetry/api").rstrip("/")

# Hardcoded defaults (can be overridden by env vars).
DEFAULT_TELEMETRY_API_KEY = "VYMrSYGBPfpbA8CLxgijzSmrO_BUlKdrtQcMiIdK9h8"
DEFAULT_LOCAL_API_TOKEN = "0b2e393df26f66a5c245872fb91db3d9d1ad30af"

TELEMETRY_API_KEY = os.getenv("TELEMETRY_API_KEY", DEFAULT_TELEMETRY_API_KEY)

# Per request: write only to this station.
STN_NUM = "11111"

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api").rstrip("/")
API_USERNAME = os.getenv("API_USERNAME")
API_PASSWORD = os.getenv("API_PASSWORD")
API_TOKEN = os.getenv("API_TOKEN", DEFAULT_LOCAL_API_TOKEN)

BATCH_SIZE = int(os.getenv("BATCH_SIZE", "500"))


def eprint(*args, **kwargs) -> None:
    print(*args, file=sys.stderr, **kwargs)


def _basic_auth_header(username: str | None, password: str | None) -> str | None:
    if not username or not password:
        return None
    token = base64.b64encode(f"{username}:{password}".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def _token_auth_header(token: str | None) -> str | None:
    if not token:
        return None
    return f"Token {token.strip()}"


def _choose_local_auth_header() -> str | None:
    return _token_auth_header(API_TOKEN) or _basic_auth_header(API_USERNAME, API_PASSWORD)


def _http_json(
    method: str,
    url: str,
    *,
    payload: Any | None = None,
    headers: dict[str, str] | None = None,
    timeout_s: int = 60,
) -> tuple[int, Any]:
    data_bytes: bytes | None = None
    req_headers = {"Accept": "application/json"}
    if headers:
        req_headers.update(headers)
    if payload is not None:
        data_bytes = json.dumps(payload).encode("utf-8")
        req_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data_bytes, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else None
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8") if exc.fp else ""
        try:
            parsed = json.loads(body) if body else {"error": body or exc.reason}
        except Exception:
            parsed = {"error": body or str(exc)}
        return exc.code, parsed
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Request failed: {method} {url}: {exc}")


def _signed_crc32_int(value: str) -> int:
    unsigned = zlib.crc32(value.encode("utf-8")) & 0xFFFFFFFF
    if unsigned >= 2**31:
        return int(unsigned - 2**32)
    return int(unsigned)


def _parse_telemetry_timestamp(value: str) -> datetime.datetime:
    # Telemetry returns e.g. "2026-05-01T00:33:30Z".
    v = value.strip()
    if v.endswith("Z"):
        v = v[:-1] + "+00:00"
    dt = datetime.datetime.fromisoformat(v)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=datetime.UTC)
    return dt.astimezone(datetime.UTC)


def _parse_iso_date(value: str) -> datetime.date:
    try:
        return datetime.date.fromisoformat(value)
    except Exception as exc:
        raise ValueError(f"Invalid date {value!r} (expected YYYY-MM-DD): {exc}")


def _utc_to_api_string(dt: datetime.datetime) -> str:
    # Local API accepts aware strings; it stores naive UTC.
    dt = dt.astimezone(datetime.UTC)
    return dt.replace(tzinfo=None).strftime("%Y-%m-%dT%H:%M:%SZ")


def _build_observation_payload(*, stn_num: str, utc: datetime.datetime, wtr_level: float, instrument_num: int) -> dict[str, Any]:
    utc_str = _utc_to_api_string(utc)
    seq = _signed_crc32_int(f"{stn_num}|{utc_str}")
    return {
        "stn_num": stn_num,
        "utc": utc_str,
        "seq": seq,
        "wtr_level": wtr_level,
        "instrument_num": instrument_num,
    }


def _fetch_local_station_ids(api_base_url: str) -> set[str]:
    status, payload = _http_json("GET", f"{api_base_url}/stations/")
    if status != 200:
        raise RuntimeError(f"GET stations failed ({status}): {payload}")
    if not isinstance(payload, list):
        raise RuntimeError("GET stations: expected a JSON array")
    out: set[str] = set()
    for item in payload:
        if isinstance(item, dict) and item.get("stn_num"):
            out.add(str(item.get("stn_num")))
    return out


def _fetch_telemetry_observations(
    *,
    telemetry_base_url: str,
    api_key: str,
    sensor_id: int,
    start_date: str,
    end_date: str,
) -> list[dict[str, Any]]:
    query = urllib.parse.urlencode(
        {
            "sensor_id": str(int(sensor_id)),
            "start": start_date,
            "end": end_date,
        }
    )
    url = f"{telemetry_base_url}/observations/?{query}"

    status, payload = _http_json(
        "GET",
        url,
        headers={
            "accept": "application/json",
            "x-api-key": api_key,
        },
        timeout_s=60,
    )
    if status != 200:
        raise RuntimeError(f"Telemetry GET failed ({status}): {payload}")
    if not isinstance(payload, list):
        raise RuntimeError("Telemetry response: expected a JSON array")
    return payload


def _post_observations_batch(
    *,
    api_base_url: str,
    auth_header: str | None,
    batch: list[dict[str, Any]],
) -> tuple[int, int]:
    url = f"{api_base_url}/observations/"
    headers: dict[str, str] = {}
    if auth_header:
        headers["Authorization"] = auth_header
    status, resp = _http_json("POST", url, payload=batch, headers=headers, timeout_s=120)
    if status == 200 and isinstance(resp, dict):
        return int(resp.get("created", 0)), int(resp.get("updated", 0))
    if status == 207 and isinstance(resp, dict):
        # Partial success; still return created/updated and print errors.
        errors = resp.get("errors")
        if errors:
            eprint(f"Batch had errors (showing up to 3): {errors[:3] if isinstance(errors, list) else errors}")
        return int(resp.get("created", 0)), int(resp.get("updated", 0))
    raise RuntimeError(f"POST observations failed ({status}): {resp}")


def _parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Import SPC telemetry observations into RTDD")
    p.add_argument("--sensor-id", type=int, default=1, help="Telemetry sensor_id (default: 1)")
    p.add_argument("--end", default=None, help="End date (YYYY-MM-DD); default: today (UTC)")
    p.add_argument("--days", type=int, default=1, help="Days back from end date (default: 5)")
    p.add_argument("--start", default=None, help="Start date (YYYY-MM-DD); default: end - days")
    p.add_argument("--instrument-num", type=int, default=1, help="instrument_num to set on observations")
    p.add_argument("--batch-size", type=int, default=BATCH_SIZE)
    p.add_argument("--skip-station-check", action="store_true")
    return p.parse_args(argv)


def main(argv: list[str]) -> int:
    args = _parse_args(argv)

    if not TELEMETRY_API_KEY:
        eprint("Missing TELEMETRY_API_KEY (set env var to override defaults)")
        return 2

    auth_header = _choose_local_auth_header()

    # Default date range: last N days ending today (UTC).
    end_date = _parse_iso_date(args.end) if args.end else datetime.datetime.now(datetime.UTC).date()
    if args.start:
        start_date = _parse_iso_date(args.start)
    else:
        start_date = end_date - datetime.timedelta(days=max(0, int(args.days)))
    if start_date > end_date:
        eprint(f"Invalid date range: start={start_date.isoformat()} end={end_date.isoformat()}")
        return 2

    if not args.skip_station_check:
        station_ids = _fetch_local_station_ids(API_BASE_URL)
        if STN_NUM not in station_ids:
            eprint(f"Station {STN_NUM!r} not found in local /stations/ API")
            return 2

    telemetry_rows = _fetch_telemetry_observations(
        telemetry_base_url=TELEMETRY_BASE_URL,
        api_key=TELEMETRY_API_KEY,
        sensor_id=args.sensor_id,
        start_date=start_date.isoformat(),
        end_date=end_date.isoformat(),
    )

    # Normalize + sort by timestamp for predictable batching.
    items: list[tuple[datetime.datetime, float]] = []
    skipped = 0
    for row in telemetry_rows:
        if not isinstance(row, dict):
            skipped += 1
            continue
        ts = row.get("timestamp")
        reading = row.get("reading")
        if not isinstance(ts, str) or reading in (None, ""):
            skipped += 1
            continue
        try:
            utc = _parse_telemetry_timestamp(ts)
            wtr_level = float(reading) / 10000.0
        except Exception:
            skipped += 1
            continue
        items.append((utc, wtr_level))

    items.sort(key=lambda t: t[0])

    if not items:
        print("No telemetry observations to ingest")
        return 0

    created_total = 0
    updated_total = 0
    batch: list[dict[str, Any]] = []

    for utc, wtr_level in items:
        batch.append(
            _build_observation_payload(
                stn_num=STN_NUM,
                utc=utc,
                wtr_level=wtr_level,
                instrument_num=int(args.instrument_num),
            )
        )
        if len(batch) >= max(1, int(args.batch_size)):
            created, updated = _post_observations_batch(api_base_url=API_BASE_URL, auth_header=auth_header, batch=batch)
            created_total += created
            updated_total += updated
            batch = []

    if batch:
        created, updated = _post_observations_batch(api_base_url=API_BASE_URL, auth_header=auth_header, batch=batch)
        created_total += created
        updated_total += updated

    print(
        f"Telemetry rows={len(telemetry_rows)} parsed={len(items)} skipped={skipped} "
        f"posted created={created_total} updated={updated_total} station={STN_NUM} "
        f"range={start_date.isoformat()}..{end_date.isoformat()} sensor_id={int(args.sensor_id)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
