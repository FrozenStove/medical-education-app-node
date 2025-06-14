import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import { initializeChromaDB } from './services/chroma';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
initializeChromaDB();

// Setup routes
setupRoutes(app);

// Log all registered routes
console.log('\nRegistered Routes:');
app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
        // Routes registered directly on the app
        console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
                console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
            }
        });
    }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`\nServer is running on port ${port}`);
}); 