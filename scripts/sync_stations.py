#!/usr/bin/env python
import argparse
import json
import sys
import ssl
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_SOURCE = "https://sea-level.dev.clide.cloud/api/stations/"
DEFAULT_TARGET = "http://localhost:8000/api/stations/"
DEFAULT_DATA_FILE = "data.json"


def _build_ssl_context(*, cafile: str | None, insecure: bool) -> ssl.SSLContext | None:
    # For plain HTTP requests, urllib ignores the SSL context.
    if insecure:
        return ssl._create_unverified_context()  # noqa: SLF001

    if cafile:
        return ssl.create_default_context(cafile=cafile)

    try:
        import certifi

        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        # Fall back to system defaults.
        return ssl.create_default_context()


def http_get_json(url: str, *, cafile: str | None, insecure: bool) -> Any:
    req = urllib.request.Request(url, method="GET")
    context = _build_ssl_context(cafile=cafile, insecure=insecure)
    with urllib.request.urlopen(req, context=context) as resp:
        data = resp.read().decode("utf-8")
    return json.loads(data)


def file_get_json(path: str) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _default_data_path() -> str:
    return str((Path(__file__).resolve().parent / DEFAULT_DATA_FILE))


def http_post_json(url: str, payload: Any, *, cafile: str | None, insecure: bool) -> Any:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    context = _build_ssl_context(cafile=cafile, insecure=insecure)
    with urllib.request.urlopen(req, context=context) as resp:
        data = resp.read().decode("utf-8")
    return json.loads(data) if data else None


def _as_station_list(payload: Any, label: str) -> list[dict[str, Any]]:
    if isinstance(payload, dict) and "stations" in payload:
        payload = payload["stations"]
    if not isinstance(payload, list):
        raise SystemExit(f"{label} did not return a JSON array")
    out: list[dict[str, Any]] = []
    for item in payload:
        if isinstance(item, dict):
            out.append(item)
    return out


def _load_source_stations(
    *,
    source_url: str,
    source_file: str | None,
    cafile: str | None,
    insecure: bool,
) -> list[dict[str, Any]]:
    if source_file:
        payload = file_get_json(source_file)
        return _as_station_list(payload, f"source_file={source_file}")
    payload = http_get_json(source_url, cafile=cafile, insecure=insecure)
    return _as_station_list(payload, f"source_url={source_url}")


def cmd_get(args: argparse.Namespace) -> int:
    if args.file:
        stations = _as_station_list(file_get_json(args.file), f"file={args.file}")
    else:
        stations = _as_station_list(
            http_get_json(args.url, cafile=args.cafile, insecure=args.insecure),
            "GET",
        )
    print(json.dumps(stations, indent=2))
    return 0


def cmd_preview(args: argparse.Namespace) -> int:
    try:
        source = _load_source_stations(
            source_url=args.source,
            source_file=args.source_file,
            cafile=args.cafile,
            insecure=args.insecure,
        )
    except urllib.error.URLError as e:
        raise SystemExit(
            "Failed to fetch source stations. If this URL works in your browser but fails here, "
            "the server is likely missing part of its TLS certificate chain (Python/OpenSSL is stricter).\n"
            "Workarounds:\n"
            "- Download the JSON in a browser and run: python sync_stations.py preview --source-file stations.json\n"
            "- Or (less safe) rerun with: --insecure\n"
            f"\nUnderlying error: {e}"
        )

    try:
        target = _as_station_list(
            http_get_json(args.target, cafile=args.cafile, insecure=args.insecure),
            "target",
        )
    except urllib.error.URLError as e:
        raise SystemExit(
            "Failed to fetch target stations. Is your local Django server running at "
            f"{args.target}?\nUnderlying error: {e}"
        )

    source_map = {str(s.get("stn_num")): s for s in source if s.get("stn_num")}
    target_ids = {str(s.get("stn_num")) for s in target if s.get("stn_num")}

    new_ids = sorted([sid for sid in source_map.keys() if sid not in target_ids])

    print(f"Source stations: {len(source_map)}")
    print(f"Target stations: {len(target_ids)}")
    print(f"Would add: {len(new_ids)}")

    if args.show:
        for sid in new_ids[: args.show]:
            s = source_map[sid]
            print(f"- {sid}: {s.get('disp_name') or s.get('stn_name')}")

    if args.write_json:
        to_add = [source_map[sid] for sid in new_ids]
        with open(args.write_json, "w", encoding="utf-8") as f:
            json.dump(to_add, f, indent=2)
        print(f"Wrote {len(to_add)} stations to {args.write_json}")

    return 0


def cmd_push(args: argparse.Namespace) -> int:
    try:
        source = _load_source_stations(
            source_url=args.source,
            source_file=args.source_file,
            cafile=args.cafile,
            insecure=args.insecure,
        )
    except urllib.error.URLError as e:
        raise SystemExit(
            "Failed to fetch source stations. If this URL works in your browser but fails here, "
            "download it locally and pass --source-file, or use --insecure.\n"
            f"Underlying error: {e}"
        )

    # The upstream payload contains extra fields (status, short_name, ...)
    # The API endpoint will ignore unknown keys.
    try:
        result = http_post_json(args.target, source, cafile=args.cafile, insecure=args.insecure)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"POST failed: HTTP {e.code}\n{err_body}")
    except urllib.error.URLError as e:
        raise SystemExit(
            "Request failed (URLError). Common causes:\n"
            f"- Local server not running at {args.target}\n"
            "- Port mismatch (runserver on a different port)\n"
            "- You are using HTTPS locally but target is HTTP\n"
            f"\nUnderlying error: {e}"
        )

    print(json.dumps(result, indent=2))
    return 0


def main(argv: list[str]) -> int:
    # No-args mode: read ./data.json and POST to the local API.
    # This avoids TLS issues fetching the upstream API (browser download works).
    if not argv:
        default_path = _default_data_path()
        if not Path(default_path).exists():
            raise SystemExit(
                f"Default data file not found: {default_path}\n"
                "Save the stations JSON as 'data.json' next to this script, then rerun."
            )
        argv = ["push", "--source-file", default_path]

    parser = argparse.ArgumentParser(description="Sync stations into local Django via /api/stations/")
    parser.add_argument(
        "--cafile",
        default=None,
        help="Path to a CA bundle to use for HTTPS verification (defaults to certifi if installed)",
    )
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="Disable HTTPS certificate verification (not recommended)",
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_get = sub.add_parser("get", help="GET and print stations from a URL")
    p_get.add_argument("url", nargs="?", default=DEFAULT_SOURCE)
    p_get.add_argument("--file", default=None, help="Read stations JSON from a local file instead of URL")
    p_get.set_defaults(func=cmd_get)

    p_preview = sub.add_parser("preview", help="Compare source vs target and show what would be added")
    p_preview.add_argument("--source", default=DEFAULT_SOURCE)
    p_preview.add_argument("--source-file", default=None, help="Read source stations from a local JSON file")
    p_preview.add_argument("--target", default=DEFAULT_TARGET)
    p_preview.add_argument("--show", type=int, default=20, help="Show up to N station ids/names")
    p_preview.add_argument("--write-json", default=None, help="Write the would-add list to a JSON file")
    p_preview.set_defaults(func=cmd_preview)

    # Alias to avoid common typo.
    p_review = sub.add_parser("review", help="Alias for 'preview'")
    p_review.add_argument("--source", default=DEFAULT_SOURCE)
    p_review.add_argument("--source-file", default=None, help="Read source stations from a local JSON file")
    p_review.add_argument("--target", default=DEFAULT_TARGET)
    p_review.add_argument("--show", type=int, default=20, help="Show up to N station ids/names")
    p_review.add_argument("--write-json", default=None, help="Write the would-add list to a JSON file")
    p_review.set_defaults(func=cmd_preview)

    p_push = sub.add_parser("push", help="POST stations from source into the local target")
    p_push.add_argument("--source", default=DEFAULT_SOURCE)
    p_push.add_argument("--source-file", default=None, help="Read source stations from a local JSON file")
    p_push.add_argument("--target", default=DEFAULT_TARGET)
    p_push.set_defaults(func=cmd_push)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
