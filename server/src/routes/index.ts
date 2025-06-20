import { Express } from 'express';
import chatRouter from './chat';
import articlesRouter from './articles';
import scriptsRouter, { verifyScriptsAuth } from './scripts';

export const setupRoutes = (app: Express) => {
    app.use('/api/chat', chatRouter);
    app.use('/api/articles', articlesRouter);
    app.use('/api/scripts', verifyScriptsAuth, scriptsRouter);
}; 