#!/bin/bash

# Stop script - equivalent to docker-compose down
echo "🛑 Stopping Medical Education App..."

# Stop and remove containers
docker stop medical-education-client medical-education-server medical-education-chromadb 2>/dev/null || true
docker rm medical-education-client medical-education-server medical-education-chromadb 2>/dev/null || true

echo "✅ All containers stopped and removed!"
echo ""
echo "🧹 To remove the network: docker network rm medical-education-network"
echo "🗑️  To remove the volume: docker volume rm chromadb_data" 