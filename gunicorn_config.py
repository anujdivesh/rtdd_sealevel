# gunicorn_config.py
bind = "0.0.0.0:8080"
workers = 3  # (2 x $num_cores) + 1
timeout = 120
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"
