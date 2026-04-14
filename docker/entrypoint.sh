#!/usr/bin/env sh
set -eu

# Wait for DB (optional). If DB_HOST is not set, skip.
if [ -n "${DB_HOST:-}" ]; then
  echo "Waiting for database at $DB_HOST:${DB_PORT:-5432}..."
  python - <<'PY'
import os, socket, time
host = os.environ.get('DB_HOST')
port = int(os.environ.get('DB_PORT', '5432'))
if not host:
    raise SystemExit(0)
start = time.time()
while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            break
    except OSError:
        if time.time() - start > 60:
            raise
        time.sleep(1)
print('DB reachable')
PY
fi

# Apply migrations and collect static assets
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput

exec "$@"
