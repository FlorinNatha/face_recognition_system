#!/bin/sh
# entrypoint that ensures PORT is set and starts gunicorn
: "${PORT:=5000}"
echo "Starting Gunicorn on 0.0.0.0:${PORT}"
exec gunicorn app:app --bind 0.0.0.0:${PORT}
