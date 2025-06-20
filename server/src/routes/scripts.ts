import { NextFunction, Router, Request, Response } from 'express';
import { ingestArticles } from '@/scripts/ingestArticles';
import { verifyIngestion } from '@/scripts/verifyIngestion';
import { checkChroma } from '@/scripts/checkChroma';

const scriptsRouter = Router();

export async function verifyScriptsAuth(req: Request, res: Response, next: NextFunction) {
    if (req.header('auth') !== "1234567890") {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

scriptsRouter.get('/ingest', async (req, res) => {
    try {
        await ingestArticles();
        res.status(200).json({ message: 'Articles ingested successfully' });
    } catch (error) {
        console.error('Error ingesting articles:', error);
        res.status(500).json({ error: 'Failed to ingest articles' });
    }
});

scriptsRouter.get('/verify', async (req, res) => {
    try {
        await verifyIngestion();
        res.status(200).json({ message: 'Ingestion verified successfully' });
    } catch (error) {
        console.error('Error verifying ingestion:', error);
        res.status(500).json({ error: 'Failed to verify ingestion' });
    }
});

scriptsRouter.get('/check', async (req, res) => {
    try {
        await checkChroma();
        res.status(200).json({ message: 'ChromaDB checked successfully' });
    } catch (error) {
        console.error('Error checking ChromaDB:', error);
        res.status(500).json({ error: 'Failed to check ChromaDB' });
    }
});

export default scriptsRouter; 