# Build the client
FROM node:18-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build the server
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Copy the built client
COPY --from=client-builder /app/client/build ./public

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 