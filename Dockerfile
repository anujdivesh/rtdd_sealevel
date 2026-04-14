# syntax=docker/dockerfile:1

FROM python:3.13-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (kept minimal). curl for potential debugging; ca-certs for TLS.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Install uv inside the image
RUN pip install --no-cache-dir uv

# Install Python deps first (better layer caching)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy application code
COPY . .

# App runtime env
ENV DJANGO_SETTINGS_MODULE=rtdd_django.settings

# Entrypoint runs migrations + collectstatic, then starts gunicorn
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD [".venv/bin/gunicorn", "rtdd_django.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
