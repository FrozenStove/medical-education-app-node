import { Router } from 'express';
import { z } from 'zod';
import { OpenAI } from 'openai';
import { getChromaClient } from '../services/chroma';

const router = Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const chatRequestSchema = z.object({
    message: z.string().min(1),
    context: z.array(z.string()).optional()
});

router.post('/', async (req, res) => {
    try {
        const { message, context } = chatRequestSchema.parse(req.body);

        // Get relevant documents from ChromaDB
        const chromaClient = getChromaClient();
        const collection = await chromaClient.getCollection('medical_articles');

        // Query the vector database
        const results = await collection.query({
            queryTexts: [message],
            nResults: 3
        });

        // Prepare context from retrieved documents
        const contextText = results.documents[0].join('\n\n');

        // Generate response using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a medical education assistant specializing in radiation oncology. Use the provided context to give accurate and educational responses."
                },
                {
                    role: "user",
                    content: `Context: ${contextText}\n\nQuestion: ${message}`
                }
            ],
            temperature: 0.7,
        });

        res.json({
            response: completion.choices[0].message.content,
            context: results.documents[0]
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

export const chatRouter = router; 