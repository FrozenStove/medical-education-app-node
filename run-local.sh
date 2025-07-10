#!/bin/bash

# Local development script for medical education app
echo "Starting Medical Education App locally..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start the services
echo "Building and starting services with docker-compose..."

# Set environment variables for local development
export BACKEND_URL=http://localhost:3010
export NODE_ENV=development
export REACT_APP_ENV=development

# Start the services
docker-compose up --build

echo "Services are starting up..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:3010"
echo "Health check: http://localhost:3010/health"
echo ""
echo "Press Ctrl+C to stop the services" 