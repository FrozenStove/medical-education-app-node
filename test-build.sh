#!/bin/bash

echo "=== Testing Docker Build ==="

# Test client build
echo "Building client container..."
cd client
docker build -t test-client .

# Test if the container can start
echo "Testing client container startup..."
docker run --rm -e BACKEND_URL=http://test-backend:3010 -e NODE_ENV=production -e REACT_APP_ENV=production test-client /docker-entrypoint.sh &
CLIENT_PID=$!

# Wait a moment for startup
sleep 5

# Check if process is still running
if kill -0 $CLIENT_PID 2>/dev/null; then
    echo "✅ Client container started successfully"
    kill $CLIENT_PID
else
    echo "❌ Client container failed to start"
    exit 1
fi

cd ..

echo "=== Build Test Complete ===" 