# rtdd_django

## Installation & Setup

1.  **Check out the repository**:
    ```bash
    git clone git@gitlab.com:martin_schweitzer/rtdd_django.git
    cd rtdd_django
    ```

2.  **Set up the Python environment**:
    This project uses `uv` for Python package management.
    ```bash
    uv venv
    source .venv/bin/activate
    uv sync
    ```

3.  **Set up the Frontend**:
    Install [Node.js](https://nodejs.org/) dependencies for Vite in the project's base directory:
    ```bash
    npm install
    ```

4.  **Environment Variables**:
    Create a `.env` file in the root directory and configure the following:
    - `SECRET_KEY`
    - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

5. **JavaScript Environment Variables**:
    Create a `.env` file in the subdirectory `frontend`.  This has a single
    environment variable `VITE_API_HOSTNAME`
    which is the name of the API url.  E.g. `VITE_API_HOSTNAME='https://sea-level.dev.clide.cloud/`
## Running the Project

### Development Mode

To run the project locally with Hot Module Replacement (HMR) for the frontend:

1.  **Start the Vite development server**:
    ```bash
    npm run dev
    ```
    This runs in the background at `http://localhost:5173` and provides Hot Module Replacement (HMR).

2.  **Start the Django development server**:
    In another terminal, run:
    ```bash
    uv run python manage.py runserver
    ```
    Django will automatically detect the Vite server and load assets from it while `DEBUG=True`.

3.  **Access the Dashboard**:
    The development frontend can be accessed at `http://localhost:8000/rtdd/dashboard`.

### Testing Production Build Locally (No Nginx)

If you want to quickly verify the production build is working:

1.  **Generate the bundle**:
    ```bash
    npm run build
    ```

2.  **Collect static files**:
    ```bash
    uv run python manage.py collectstatic --clear
    ```
    The `--clear` flag ensures Django doesn't collect previous Vite bundle builds`.

3.  **Run the Django server with `--insecure`**:
    ```bash
    uv run python manage.py runserver --insecure
    ```
    The `--insecure` flag allows Django to serve static files even when `DEBUG=False`.

### Test Production Mode Build Locally (with Nginx)

To run using the Gunicorn application server with minified/bundled assets:

1.  **Generate the bundle**:
    ```bash
    npm run build
    ```
    This creates minified assets in `static/vite/` and a `manifest.json`.

2.  **Collect static files**:
    ```bash
    uv run python manage.py collectstatic
    ```

3.  **Run Gunicorn**:
    ```bash
    uv run gunicorn rtdd_django.wsgi:application --bind 127.0.0.1:8080 --workers 3
    ```

## Setting up `nginx`

Create a file `django` in `/etc/nginx/sites-available` with the following
content:

```
server {
    listen 80;
    server_name sea-level.dev.clide.cloud;  # Replace with your domain or IP

    # Static files
    location /static/ {
        alias /var/www/html/django/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files (user uploads)
    location /media/ {
        alias /path/to/your/media/;  # Set your MEDIA_ROOT path
        expires 30d;
    }

    # Other files
    location /web/ {
        alias /var/www/html/web/;
        expires 30d;
    }

    location /api/ {
            proxy_pass http://localhost:8000/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy all other requests to Django
    location / {
        proxy_pass http://127.0.0.1:8080;  # Your Gunicorn/uWSGI address
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optional: Increase max upload size if needed
    client_max_body_size 100M;
}
```

Create a symbolic link to this file from `/etc/nginx/sites-enabled`.  This
should be the only link in `sites-enabled`.

Test the syntax with `sudo nginx -t`

Restart `nginx` with the command `sudo systemctl restart nginx.service`.

## Frontend Development

### Managing Font Awesome Icons

If you need to add a new icon:
1.  Open `frontend/js/main.js`.
2.  Import the icon from the appropriate set (usually `free-solid-svg-icons`). Note that icon names are in camelCase (e.g., `faChartLine` for `fa-chart-line`).
3.  Add the icon to the `library` using `library.add()`.
4.  Use the icon in your HTML/template.

Example:
```javascript
import { faPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faPlus);
```

### CSS Tree Shaking (PurgeCSS)

This project uses **PostCSS** with **PurgeCSS** to remove unused CSS from the production build. This is important because we import the full Tabler CSS bundle, but only use a small fraction of it.

- **How it works**: During `npm run build`, PurgeCSS scans all files in `rtdd/templates/` and `frontend/js/` to identify which CSS classes are actually used.
- **Configuration**: See `postcss.config.js` for the PurgeCSS configuration, including the `safelist` for classes that are added dynamically via JavaScript (e.g., `text-view-mode`, `show`, `fade`).
- **Development**: PurgeCSS is only active during the production build. In development mode (`npm run dev`), the full CSS is loaded.
