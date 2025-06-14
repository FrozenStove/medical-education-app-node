import fs from 'fs/promises';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse';

dotenv.config();

const ARTICLES_DIR = path.join(__dirname, '../../articles');
const CHUNK_SIZE = 1000; // Characters per chunk

async function chunkText(text: string): Promise<string[]> {
    const chunks: string[] = [];
    let currentChunk = '';

    // Split by paragraphs first
    const paragraphs = text.split(/\n\s*\n/);

    for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > CHUNK_SIZE) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = paragraph;
        } else {
            currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

async function readFileContent(filePath: string): Promise<string> {
    const fileExtension = path.extname(filePath).toLowerCase();

    if (fileExtension === '.pdf') {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } else if (['.txt', '.md'].includes(fileExtension)) {
        return fs.readFile(filePath, 'utf-8');
    } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
}

async function ingestArticles() {
    try {
        // Initialize ChromaDB client
        const chromaClient = new ChromaClient({
            path: process.env.CHROMA_DB_URL || 'http://localhost:8000'
        });

        // Initialize embedding function
        const embeddingFunction = new OpenAIEmbeddingFunction({
            openai_api_key: process.env.OPENAI_API_KEY || '',
            openai_model: 'text-embedding-ada-002'
        });

        // Create or get collection
        const collection = await chromaClient.getOrCreateCollection({
            name: 'medical_articles',
            embeddingFunction
        });

        // Read all files from articles directory
        const files = await fs.readdir(ARTICLES_DIR);

        for (const file of files) {
            const fileExtension = path.extname(file).toLowerCase();
            if (!['.pdf', '.txt', '.md'].includes(fileExtension)) continue;

            console.log(`Processing ${file}...`);
            const filePath = path.join(ARTICLES_DIR, file);

            try {
                const content = await readFileContent(filePath);

                // Split content into chunks
                const chunks = await chunkText(content);

                // Prepare data for insertion
                const ids = chunks.map((_, i) => `${file}-${i}`);
                const metadatas = chunks.map(() => ({
                    source: file,
                    type: 'medical_article',
                    format: fileExtension.slice(1)
                }));

                // Add to collection
                await collection.add({
                    ids,
                    documents: chunks,
                    metadatas
                });

                console.log(`Added ${chunks.length} chunks from ${file}`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
                continue; // Continue with next file if one fails
            }
        }

        console.log('Ingestion completed successfully!');
    } catch (error) {
        console.error('Error during ingestion:', error);
        process.exit(1);
    }
}

ingestArticles(); 