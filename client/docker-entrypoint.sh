#!/bin/bash
set -e

echo "=== Starting Medical Education Frontend ==="
echo "Current directory: $(pwd)"
echo "Backend URL: ${BACKEND_URL}"
echo "Node ENV: ${NODE_ENV}"
echo "React App ENV: ${REACT_APP_ENV}"

# Check if nginx config template exists
if [ ! -f /etc/nginx/nginx.conf.template ]; then
    echo "ERROR: nginx.conf.template not found!"
    ls -la /etc/nginx/
    exit 1
fi

# Substitute environment variables in nginx config
echo "Generating nginx configuration..."
envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "Nginx configuration generated successfully"

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx..."

# Start nginx in foreground
nginx -g "daemon off;" 