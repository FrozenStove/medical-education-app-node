// Environment variables for different environments
// For production, we use relative URLs that will be proxied by nginx
// For development, you can override this with REACT_APP_API_URL environment variable
export const SERVER_URL = process.env.REACT_APP_API_URL || "";
