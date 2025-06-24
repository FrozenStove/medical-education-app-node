# Medical Education App

A medical education assistant application built with React, Node.js, and ChromaDB.

## Quick Start

### Using Docker Compose (Recommended)

1. Create a `docker-compose.yml` file:

```yaml
services:
  client:
    image: frozenstove/medical-education-app:client
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
      - REACT_APP_ENV=production
    restart: unless-stopped
    depends_on:
      - server

  server:
    image: frozenstove/medical-education-app:server
    ports:
      - "3010:3010"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - chromadb

  chromadb:
    image: frozenstove/medical-education-app:chromadb
    ports:
      - "8010:8000"
    environment:
      - CHROMA_SERVER_HOST=0.0.0.0
      - CHROMA_SERVER_HTTP_PORT=8000
    volumes:
      - chromadb_data:/chroma/chroma
    restart: unless-stopped

volumes:
  chromadb_data:
```

2. Run the application:

```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost
   - API: http://localhost:3010
   - ChromaDB: http://localhost:8010

### Using Individual Images

#### Client (React Frontend)
```bash
docker run -d \
  --name medical-education-client \
  -p 80:80 \
  -e NODE_ENV=production \
  frozenstove/medical-education-app:client
```

#### Server (Node.js Backend)
```bash
docker run -d \
  --name medical-education-server \
  -p 3010:3010 \
  -e NODE_ENV=production \
  frozenstove/medical-education-app:server
```

#### ChromaDB (Vector Database)
```bash
docker run -d \
  --name medical-education-chromadb \
  -p 8010:8000 \
  -e CHROMA_SERVER_HOST=0.0.0.0 \
  -e CHROMA_SERVER_HTTP_PORT=8000 \
  -v chromadb_data:/chroma/chroma \
  frozenstove/medical-education-app:chromadb
```

## Architecture

- **Client**: React frontend served by nginx
- **Server**: Node.js backend API
- **ChromaDB**: Vector database for medical knowledge storage

## Environment Variables

### Client
- `NODE_ENV`: Set to `production`
- `REACT_APP_ENV`: Set to `production`

### Server
- `NODE_ENV`: Set to `production`
- Additional environment variables can be added as needed

### ChromaDB
- `CHROMA_SERVER_HOST`: Set to `0.0.0.0`
- `CHROMA_SERVER_HTTP_PORT`: Set to `8000`

## Networking

The application uses Docker's internal networking:
- Client proxies API requests to the server
- Server connects to ChromaDB for data storage
- Only the client (nginx) is exposed to external traffic

## Volumes

- `chromadb_data`: Persistent storage for ChromaDB data

## Security

- Backend server is not directly exposed to external traffic
- All API requests go through the nginx proxy
- ChromaDB is only accessible within the Docker network

## Support

For issues or questions, please refer to the source repository or create an issue. 