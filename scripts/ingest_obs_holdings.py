#!/usr/bin/python3

"""Ingest NVP observations from local files and POST to the Django API.

This keeps the existing parsing/normalization logic, but replaces direct
database writes with HTTP POSTs to:

- `POST {API_BASE_URL}/holdings/`
- `POST {API_BASE_URL}/observations/`

Environment variables:

- `NVP_DATA_DIR`      Directory containing NVP `.txt` files
- `API_BASE_URL`      Base API URL (default: `http://localhost:8000/api`)
- `API_USERNAME`      Basic auth username for POSTs (optional)
- `API_PASSWORD`      Basic auth password for POSTs (optional)
- `API_TOKEN`         Token auth value for POSTs (optional; preferred)
- `OBS_BATCH_SIZE`    Observations POST batch size (default: 500)

Optional test-mode environment variables:

- `FORCE_TODAY`       If truthy, override all observation UTC dates to today's
                      UTC date (keeps the original time-of-day)
- `FORCE_DAYS_OFFSET` Integer days offset from today (UTC) to apply when forcing
                      dates. Example: `-1` forces yesterday.
"""

import argparse
import base64
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.request
import zlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any


# Directory containing NVP .txt files.
DATA_DIR = Path(os.getenv("NVP_DATA_DIR", "/Users/anujdivesh/Desktop/django/realtime-tide/sea_level_db/data"))

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000/api").rstrip("/")
API_USERNAME = os.getenv("API_USERNAME")
API_PASSWORD = os.getenv("API_PASSWORD")
API_TOKEN = '0b2e393df26f66a5c245872fb91db3d9d1ad30af'

OBS_BATCH_SIZE = int(os.getenv("OBS_BATCH_SIZE", "500"))


def _env_truthy(name: str, default: bool = False) -> bool:
    val = os.getenv(name)
    if val is None:
        return default
    return val.strip().lower() in ("1", "true", "t", "yes", "y", "on")


def _env_int(name: str) -> int | None:
    val = os.getenv(name)
    if val is None:
        return None
    val = val.strip()
    if val == "":
        return None
    try:
        return int(val)
    except ValueError:
        raise ValueError(f"Invalid integer for {name}: {val!r}")


def _force_dt_to_date(dt: datetime.datetime, target_date: datetime.date) -> datetime.datetime:
    """Return dt with date replaced by target_date (keeps time-of-day)."""

    return dt.replace(year=target_date.year, month=target_date.month, day=target_date.day)


def _parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest NVP observations from local files into the Django API")
    parser.add_argument(
        "--force-today",
        action="store_true",
        help="Override all observation UTC dates to today's UTC date (keeps time-of-day).",
    )
    parser.add_argument(
        "--force-days-offset",
        type=int,
        default=None,
        help="Force observation UTC dates to (today + offset days) in UTC; keeps time-of-day. Example: -1 = yesterday.",
    )
    return parser.parse_args(argv)


def eprint(*args, **kwargs) -> None:
    """Print to stderr (used instead of logging)."""
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


def _choose_auth_header() -> str | None:
    # Prefer token auth when provided.
    return _token_auth_header(API_TOKEN) or _basic_auth_header(API_USERNAME, API_PASSWORD)


def _http_json(
    method: str,
    url: str,
    payload: Any | None = None,
    auth_header: str | None = None,
    timeout_s: int = 60,
) -> tuple[int, Any]:
    data_bytes: bytes | None = None
    headers = {"Accept": "application/json"}
    if auth_header:
        headers["Authorization"] = auth_header
    if payload is not None:
        data_bytes = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
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

def parse(line: str) -> dict | None:
    """Given a string which represents an NVP message, return a dictionary."""
    try:
        result = dict([field.split("=") for field in line.strip().split("|")])
    except ValueError:
        eprint(f"Error in parse: {line}")
        return None
    return result


def convert_to_none(msg: dict) -> None:
    """ Convert empty strings to None"""
    for element in msg:
        if msg[element] == "":
            msg[element] = None


def convert_fields(msg: dict, line: int, filename, *, round_to_minute: bool = True) -> bool:
    """ Given a message in the form of a dictionary - convert fields to
    correct types"""

    # Handle datetime
    try:
        dt = datetime.datetime.strptime(msg["UTC"], "%Y%m%d%H%M%S")
        if round_to_minute:
            dt = dt + datetime.timedelta(seconds=round(dt.second / 60) * 60 - dt.second)
        msg["UTC"] = dt
    except ValueError:
        eprint(
            f"Error in file: {filename} - cannot convert UTC: "
            f"{msg['UTC']}  - Line: {line}"
        )
        return False

    # Handle floats
    for element in ["T", "QFE", "S", "SX", "WT", "WLA", "BV", "ET"]:

        if element in msg and msg[element] is not None:
            try:
                msg[element] = float(msg[element])
            except ValueError:
                eprint(
                    f"Error in file: {filename}  - cannot convert to float "
                    f"- msg[{element}] - Line: {line}"
                )
                return False

    # Handle integers
    for element in ["D", "MN"]:
        if msg[element] is not None:
            try:
                msg[element] = int(msg[element])
            except Exception:
                eprint(
                    f"Error in file: {filename} - "
                    f"cannot convert to int - msg[{element}] - "
                    f"Line: {line}"
                )
                return False
    return True


def add_missing_keys(msg: dict) -> bool:
    """ Add optional keys that may be missing to the msg"""
    keys = "T QFE S SX WT WLA QFEQ SQ TQ D MN ET BV".split()
    for key in keys:
        if not key in msg:
            msg[key] = None
    return True

@dataclass(frozen=True)
class StationData:
    stn_name: str
    active_sensor: int | None
    sensor_hierarchy: str | None


def fetch_station_data(api_base_url: str) -> dict[int, StationData]:
    """Fetch station data via the API and return mapping keyed by station number."""

    status, payload = _http_json("GET", f"{api_base_url}/stations/")
    if status != 200:
        raise RuntimeError(f"GET stations failed ({status}): {payload}")
    if not isinstance(payload, list):
        raise RuntimeError("GET stations: expected a JSON array")

    station_data: dict[int, StationData] = {}
    for item in payload:
        if not isinstance(item, dict):
            continue
        try:
            stn_num = int(item.get("stn_num"))
        except Exception:
            continue
        station_data[stn_num] = StationData(
            stn_name=str(item.get("stn_name") or ""),
            active_sensor=item.get("active_sensor"),
            sensor_hierarchy=item.get("sensor_hierarchy"),
        )
    return station_data


def write_csv_record(msg: dict, filename: str, n: int) -> None:
    """Write a message to a csv file."""

    try:
        print(
            f'{msg["STN"]},{msg["UTC"]},{msg["T"]},{msg["TQ"]},{msg["QFE"]},{msg["QFEQ"]},{msg["D"]},{msg["S"]},'
            f'{msg["SX"]},{msg["SQ"]},{msg["WT"]},{msg["WLA"]},{msg["MN"]},{msg["instrument_num"]}'
            f'{msg["BV"]},{msg["ET"]}'
        )
    except Exception as e:
        eprint(f"Error writing to csv. File:{filename} Line: {n} {e}")


def check_mandatory(msg: dict, filename: str, n: int) -> bool:
    """Check that all mandatory fields are present in record."""
    for element in "STN UTC".split():
        if element not in msg:
            eprint(f"Missing mandatory field: {element}. File:{filename} Line: {n}")
            return False
    return True


def sensor_to_key(sensor_number: int) -> str:
    """ Convert a sensor number to its key

    Since the first sensor is called WLA and subsequent sensors are
    numbered WLA2, WLA3 etc. This is a helper function to simplify  the logic
    """
    if sensor_number == 1:
        return "WLA"
    return f"WLA_{sensor_number}"


def find_water_level(msg: dict, stations: dict[int, StationData]) -> None:
    """Given an NVP message, pick the first water level value available.

    Uses station `active_sensor` first, then falls back through the configured
    `sensor_hierarchy`.
    """

    station = int(msg["STN"])
    st = stations.get(station)
    if st is None:
        return

    hierarchy: list[int] = []
    if st.sensor_hierarchy:
        for part in st.sensor_hierarchy.split(","):
            part = part.strip()
            if not part:
                continue
            try:
                hierarchy.append(int(part))
            except ValueError:
                continue

    active_sensor = st.active_sensor
    if active_sensor is None:
        active_sensor = hierarchy[0] if hierarchy else 1

    search_order: list[int] = [active_sensor]
    for s in hierarchy:
        if s not in search_order:
            search_order.append(s)

    water_level: Any = msg.get(sensor_to_key(active_sensor), "")
    sensor_used: int = active_sensor

    if water_level in ("", None):
        eprint(f"No water level for active sensor (active_sensor={active_sensor}, Station={st.stn_name}). ")
        for s in search_order:
            water_level = msg.get(sensor_to_key(s), "")
            if water_level not in ("", None):
                sensor_used = s
                break

    msg["WLA"] = water_level
    msg["instrument_num"] = sensor_used
    if water_level in ("", None):
        eprint(
            f"No water level for any sensor.  Hierarchy: {st.sensor_hierarchy} (Station={st.stn_name}). "
        )
        msg["WLA"] = None


def _utc_to_api_string(dt: datetime.datetime) -> str:
    # Store as UTC with explicit Z suffix.
    # The API converts aware->naive UTC; it also accepts naive strings.
    if dt.tzinfo is not None:
        dt = dt.astimezone(datetime.UTC).replace(tzinfo=None)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def _signed_crc32_int(value: str) -> int:
    """Deterministic 32-bit signed int for API `seq`.

    Postgres `integer` is signed 32-bit. We map crc32 into that range.
    """

    unsigned = zlib.crc32(value.encode("utf-8")) & 0xFFFFFFFF
    if unsigned >= 2**31:
        return int(unsigned - 2**32)
    return int(unsigned)


def _obs_to_api_payload(msg: dict) -> dict[str, Any]:
    stn_num = str(int(msg["STN"]))
    utc_str = _utc_to_api_string(msg["UTC"])
    seq = _signed_crc32_int(f"{stn_num}|{utc_str}")
    return {
        "stn_num": stn_num,
        "utc": utc_str,
        "seq": seq,
        "air_temp": msg.get("T"),
        "air_temp_qual": msg.get("TQ"),
        "pressure": msg.get("QFE"),
        "pressure_qual": msg.get("QFEQ"),
        "wind_dir": msg.get("D"),
        "wind_spd": msg.get("S"),
        "wind_spd_max": msg.get("SX"),
        "wind_spd_qual": msg.get("SQ"),
        "wtr_temp": msg.get("WT"),
        "wtr_level": msg.get("WLA"),
        "msg_num": msg.get("MN"),
        "instrument_num": msg.get("instrument_num"),
        "battery_voltage": msg.get("BV"),
        "enclosure_temperature": msg.get("ET"),
    }


def post_observations(
    api_base_url: str,
    observations: list[dict[str, Any]],
    auth_header: str | None,
    max_seq_retries: int = 5,
) -> tuple[int, int]:
    """POST observations and retry a few times on seq collisions."""

    created_total = 0
    updated_total = 0
    if not observations:
        return created_total, updated_total

    url = f"{api_base_url}/observations/"
    pending = observations

    for attempt in range(max_seq_retries + 1):
        status, resp = _http_json("POST", url, payload=pending, auth_header=auth_header)
        if status == 200 and isinstance(resp, dict):
            created_total += int(resp.get("created", 0))
            updated_total += int(resp.get("updated", 0))
            return created_total, updated_total

        # Multi-status: may include per-index errors.
        if status == 207 and isinstance(resp, dict):
            created_total += int(resp.get("created", 0))
            updated_total += int(resp.get("updated", 0))
            errors = resp.get("errors")

            if not isinstance(errors, list) or not errors:
                return created_total, updated_total

            # If errors look like unique constraint on seq, bump seq and retry.
            retry_indexes: list[int] = []
            non_retryable: list[dict[str, Any]] = []
            for err in errors:
                if not isinstance(err, dict):
                    continue
                idx = err.get("index")
                msg = str(err.get("error") or "")
                if isinstance(idx, int) and "observations_seq_idx" in msg and "duplicate key" in msg:
                    retry_indexes.append(idx)
                else:
                    non_retryable.append(err)

            if non_retryable:
                raise RuntimeError(f"POST observations returned non-retryable errors: {non_retryable[:3]}")

            if not retry_indexes:
                raise RuntimeError(f"POST observations returned errors (not retryable): {errors[:3]}")

            if attempt >= max_seq_retries:
                raise RuntimeError(f"Seq collisions persist after retries: {errors[:3]}")

            retry_payload: list[dict[str, Any]] = []
            for idx in retry_indexes:
                if idx < 0 or idx >= len(pending):
                    continue
                item = dict(pending[idx])
                try:
                    item["seq"] = int(item["seq"]) + 1
                except Exception:
                    pass
                retry_payload.append(item)

            pending = retry_payload
            continue

        raise RuntimeError(f"POST observations failed ({status}): {resp}")

    return created_total, updated_total


def post_holding(api_base_url: str, filename: str, auth_header: str | None) -> None:
    url = f"{api_base_url}/holdings/"
    status, resp = _http_json("POST", url, payload={"filename": filename}, auth_header=auth_header)
    if status not in (200, 207):
        raise RuntimeError(f"POST holding failed ({status}): {resp}")


def process_file(
    path: Path,
    stations: dict[int, StationData],
    api_base_url: str,
    auth_header: str | None,
    batch_size: int,
    force_obs_date: datetime.date | None = None,
) -> int:
    """Given a local file path, read lines and ingest."""

    errors = 0
    filename = path.name

    print(filename)
    try:
        batch: list[dict[str, Any]] = []
        created_total = 0
        updated_total = 0
        with path.open("r", encoding="utf-8", errors="replace") as f:
            for n, line in enumerate(f):
                msg = parse(line)
                if msg is None:
                    continue
                station = int(msg["STN"])
                if station not in stations:
                    continue

                if not check_mandatory(msg, filename, n):
                    continue

                convert_to_none(msg)
                find_water_level(msg, stations)
                add_missing_keys(msg)
                if not convert_fields(msg, n, filename, round_to_minute=(force_obs_date is None)):
                    continue
                if force_obs_date is not None:
                    try:
                        msg["UTC"] = _force_dt_to_date(msg["UTC"], force_obs_date)
                    except Exception as exc:
                        eprint(f"Error overriding UTC date. File:{filename} Line:{n} {exc}")
                        errors += 1
                        continue
                try:
                    batch.append(_obs_to_api_payload(msg))
                except Exception as exc:
                    eprint(f"Error building observation payload. File:{filename} Line:{n} {exc}")
                    errors += 1
                    continue

                if len(batch) >= batch_size:
                    try:
                        created, updated = post_observations(api_base_url, batch, auth_header)
                        created_total += created
                        updated_total += updated
                    except Exception as exc:
                        eprint(f"Error posting observations batch. File:{filename} Line:{n} {exc}")
                        errors += 1
                    batch = []

        if batch:
            try:
                created, updated = post_observations(api_base_url, batch, auth_header)
                created_total += created
                updated_total += updated
            except Exception as exc:
                eprint(f"Error posting final observations batch. File:{filename} {exc}")
                errors += 1

        print(f"  posted observations: created={created_total} updated={updated_total} errors={errors}")
    except OSError as e:
        eprint(f"Error reading file: {path} ({e})")
        errors += 1

    return errors


def _extract_timestamp_from_name(name: str) -> datetime.datetime | None:
    """Extract YYYYMMDDHHMM timestamp from a filename like '*202604152112.txt'."""

    match = re.search(r"(\d{12})\.txt$", name)
    if match is None:
        return None
    try:
        return datetime.datetime.strptime(match.group(1), "%Y%m%d%H%M")
    except ValueError:
        return None


def get_files_after(data_dir: Path, last_date: datetime.datetime | None) -> list[Path]:
    """Return local NVP files in data_dir with timestamp >= last_date."""

    if not data_dir.exists():
        eprint(f"Data directory does not exist: {data_dir}")
        return []

    candidates: list[tuple[datetime.datetime, Path]] = []
    for path in data_dir.glob("*.txt"):
        ts = _extract_timestamp_from_name(path.name)
        if ts is None:
            continue
        if last_date is None or ts >= last_date:
            candidates.append((ts, path))

    candidates.sort(key=lambda t: t[0])
    return [p for _, p in candidates]


def get_last_date_from_api(api_base_url: str) -> datetime.datetime | None:
    """Return last ingested timestamp based on holdings filenames via API."""

    status, payload = _http_json("GET", f"{api_base_url}/holdings/")
    if status != 200:
        raise RuntimeError(f"GET holdings failed ({status}): {payload}")
    if not isinstance(payload, list):
        return None

    latest: datetime.datetime | None = None
    for item in payload:
        if not isinstance(item, dict):
            continue
        filename = item.get("filename")
        if not isinstance(filename, str):
            continue
        ts = _extract_timestamp_from_name(filename)
        if ts is None:
            continue
        if latest is None or ts > latest:
            latest = ts
    return latest


def ingest_nvp(*, force_obs_date: datetime.date | None = None) -> None:
    """Ingest NVP data since last ingest.

    Edit `DATA_DIR` near the top of this file to control where files are read from.
    """

    if not DATA_DIR.exists():
        eprint(f"Data directory does not exist: {DATA_DIR}")
        return

    auth_header = _choose_auth_header()

    stations = fetch_station_data(API_BASE_URL)
    last_date = get_last_date_from_api(API_BASE_URL)
    paths = get_files_after(DATA_DIR, last_date)

    if not paths:
        print("No new files to ingest")
        return

    for path in paths:
        errors = process_file(
            path,
            stations,
            api_base_url=API_BASE_URL,
            auth_header=auth_header,
            batch_size=max(1, OBS_BATCH_SIZE),
            force_obs_date=force_obs_date,
        )
        if errors:
            eprint(f"File had {errors} errors; still posting holding to mark it ingested")
        try:
            post_holding(API_BASE_URL, path.name, auth_header)
        except Exception as exc:
            eprint(f"Error posting holding for {path.name}: {exc}")


if __name__ == "__main__":
    args = _parse_args(sys.argv[1:])

    # Date forcing controls:
    # - --force-days-offset / FORCE_DAYS_OFFSET: explicit offset (e.g. -1 = yesterday)
    # - --force-today / FORCE_TODAY: shorthand for offset=0
    try:
        env_offset = _env_int("FORCE_DAYS_OFFSET")
    except ValueError as exc:
        eprint(str(exc))
        raise SystemExit(2)

    arg_offset = args.force_days_offset
    force_today = bool(args.force_today or _env_truthy("FORCE_TODAY"))

    offset: int | None
    if arg_offset is not None:
        offset = int(arg_offset)
        force_today = True
    elif env_offset is not None:
        offset = int(env_offset)
        force_today = True
    else:
        offset = 0

    force_obs_date: datetime.date | None = None
    if force_today:
        force_obs_date = datetime.datetime.now(datetime.UTC).date() + datetime.timedelta(days=offset)

    ingest_nvp(force_obs_date=force_obs_date)
