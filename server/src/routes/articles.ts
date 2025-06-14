import { Router } from 'express';
import { z } from 'zod';
import { getChromaClient } from '../services/chroma';

const router = Router();

const articleSchema = z.object({
    title: z.string(),
    content: z.string(),
    metadata: z.record(z.string()).optional()
});

router.post('/', async (req, res) => {
    try {
        const article = articleSchema.parse(req.body);
        const chromaClient = getChromaClient();
        const collection = await chromaClient.getCollection('medical_articles');

        // Add document to collection
        await collection.add({
            ids: [Date.now().toString()],
            documents: [article.content],
            metadatas: [{
                title: article.title,
                ...article.metadata
            }]
        });

        res.status(201).json({ message: 'Article added successfully' });
    } catch (error) {
        console.error('Error adding article:', error);
        res.status(500).json({ error: 'Failed to add article' });
    }
});

router.get('/', async (req, res) => {
    try {
        const chromaClient = getChromaClient();
        const collection = await chromaClient.getCollection('medical_articles');

        const results = await collection.get({
            include: ['metadatas', 'documents']
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

export const articlesRouter = router; 