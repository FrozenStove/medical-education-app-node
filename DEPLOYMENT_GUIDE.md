# Medical Education App - Google Cloud Run Deployment Guide

## Overview

This guide explains how to deploy your React frontend and Node.js backend to Google Cloud Run with proper communication between services.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │───▶│  Cloud Run      │───▶│  Cloud Run      │
│                 │    │  Frontend       │    │  Backend        │
│                 │    │  (Nginx + React)│    │  (Node.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  ChromaDB       │
                       │  (Vector DB)    │
                       └─────────────────┘
```

## How the Proxy Works

### 1. Nginx Proxy Configuration

- **Frontend**: Serves React app at `/`
- **API Proxy**: Routes `/api/*` requests to backend server
- **Static Assets**: Serves JS/CSS files with caching

### 2. Request Flow

1. User visits `https://your-frontend-url.com`
2. React app loads and makes API call to `/api/chat`
3. Nginx receives the request and proxies it to backend URL
4. Backend processes request and returns response
5. Nginx forwards response back to React app

### 3. Environment Variables

- `BACKEND_URL`: Set to backend Cloud Run service URL
- `NODE_ENV`: Set to `production`
- `REACT_APP_ENV`: Set to `production`

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **Cloud Build API** enabled
3. **Cloud Run API** enabled
4. **Container Registry API** enabled
5. **gcloud CLI** installed and configured

## Deployment Steps

### Step 1: Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Set Project ID

```bash
export PROJECT_ID=$(gcloud config get-value project)
echo "Using project: $PROJECT_ID"
```

### Step 3: Deploy Using Cloud Build

```bash
# Trigger the build
gcloud builds submit --config cloudbuild.yaml
```

### Step 4: Verify Deployment

```bash
# Check frontend service
gcloud run services describe medical-education-client --region=us-west1

# Check backend service
gcloud run services describe medical-education-server --region=us-west1

# Test health endpoints
curl https://your-frontend-url.com/health
curl https://your-backend-url.com/health
```

## Local Development

### Running Locally

```bash
# Start all services
./run-local.sh

# Or manually with docker-compose
docker-compose up --build
```

### Testing the Proxy

1. **Frontend**: http://localhost
2. **Backend**: http://localhost:3010
3. **Health Check**: http://localhost:3010/health

## Configuration Files Explained

### 1. `client/nginx.conf`

- **Purpose**: Nginx configuration for serving React app and proxying API calls
- **Key Sections**:
  - `location /api/`: Proxies API requests to backend
  - `location /`: Serves React app with SPA routing
  - `location /health`: Health check endpoint

### 2. `client/Dockerfile`

- **Multi-stage build**: Builds React app, then serves with Nginx
- **Environment substitution**: Uses `envsubst` to inject backend URL
- **Health checks**: Includes nginx configuration validation

### 3. `cloudbuild.yaml`

- **Builds both containers**: Client and server
- **Deploys server first**: Gets URL for client configuration
- **Sets environment variables**: Passes backend URL to frontend

## Troubleshooting

### Common Issues

1. **Container fails to start**

   - Check logs: `gcloud run services logs read medical-education-client --region=us-west1`
   - Verify nginx configuration: Check for syntax errors
   - Ensure environment variables are set correctly

2. **API calls fail**

   - Verify `BACKEND_URL` is set correctly
   - Check backend service is running
   - Test backend health endpoint directly

3. **CORS errors**
   - Backend should have CORS configured for frontend domain
   - Check nginx proxy headers are set correctly

### Debugging Commands

```bash
# View frontend logs
gcloud run services logs read medical-education-client --region=us-west1

# View backend logs
gcloud run services logs read medical-education-server --region=us-west1

# Test backend directly
curl -X POST https://your-backend-url.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Test frontend proxy
curl https://your-frontend-url.com/api/chat
```

## Security Considerations

1. **Authentication**: Consider adding authentication to your API endpoints
2. **HTTPS**: Cloud Run provides HTTPS by default
3. **CORS**: Configure CORS properly in your backend
4. **Environment Variables**: Use Google Secret Manager for sensitive data

## Cost Optimization

1. **Scaling**: Set appropriate min/max instances
2. **Memory/CPU**: Right-size your container resources
3. **Region**: Choose region close to your users

## Next Steps

1. **Domain**: Set up custom domain for your services
2. **SSL**: Configure custom SSL certificates if needed
3. **Monitoring**: Set up Cloud Monitoring and Logging
4. **CI/CD**: Configure automatic deployments on git push
