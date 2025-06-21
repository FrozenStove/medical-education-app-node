#!/bin/bash

# Local testing script - equivalent to docker-compose up
set -e

echo "🚀 Starting Medical Education App locally..."

# Create a custom network
echo "📡 Creating network..."
docker network create medical-education-network 2>/dev/null || echo "Network already exists"

# Build images if they don't exist
echo "🔨 Building images..."
docker build -t medical-education-client ./client
docker build -t medical-education-server ./server

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker stop medical-education-chromadb medical-education-server medical-education-client 2>/dev/null || true
docker rm medical-education-chromadb medical-education-server medical-education-client 2>/dev/null || true

# Start ChromaDB first
echo "🗄️ Starting ChromaDB..."
docker run -d \
  --name medical-education-chromadb \
  --network medical-education-network \
  -p 8010:8000 \
  -e CHROMA_SERVER_HOST=0.0.0.0 \
  -e CHROMA_SERVER_HTTP_PORT=8000 \
  -v chromadb_data:/chroma/chroma \
  chromadb/chroma:latest

# Start Server
echo "🔌 Starting Server..."
docker run -d \
  --name medical-education-server \
  --network medical-education-network \
  -p 3010:3010 \
  -e NODE_ENV=production \
  medical-education-server

# Start Client
echo "🌐 Starting Client..."
docker run -d \
  --name medical-education-client \
  --network medical-education-network \
  -p 80:80 \
  -e NODE_ENV=production \
  -e REACT_APP_ENV=production \
  medical-education-client

echo "✅ All containers started!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost"
echo "   API:      http://localhost:3010"
echo "   ChromaDB: http://localhost:8010"
echo ""
echo "📊 Container status:"
docker ps --filter "name=medical-education"
echo ""
echo "📝 To view logs:"
echo "   docker logs -f medical-education-client"
echo "   docker logs -f medical-education-server"
echo "   docker logs -f medical-education-chromadb"
echo ""
echo "🛑 To stop: ./stop-local.sh" 