import fs from 'fs/promises';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import dotenv from 'dotenv';
import pdfParse from 'pdf-parse';

console.log('Starting ingestion script...');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ARTICLES_DIR = path.join(__dirname, '../../articles');
const CHUNK_SIZE = 1000; // Characters per chunk

console.log('Articles directory:', ARTICLES_DIR);

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
        console.log('Initializing ChromaDB client...');
        // Initialize ChromaDB client
        const chromaClient = new ChromaClient({
            path: process.env.CHROMA_DB_URL || 'http://localhost:8000'
        });

        console.log('Initializing embedding function...');
        // Initialize embedding function
        const embeddingFunction = new OpenAIEmbeddingFunction({
            openai_api_key: process.env.OPENAI_API_KEY || '',
            openai_model: 'text-embedding-ada-002'
        });

        console.log('Getting or creating collection...');
        // Create or get collection
        const collection = await chromaClient.getOrCreateCollection({
            name: 'medical_articles',
            embeddingFunction
        });

        console.log('Reading articles directory...');
        // Read all files from articles directory
        const files = await fs.readdir(ARTICLES_DIR);
        console.log('Found files:', files);

        for (const file of files) {
            const fileExtension = path.extname(file).toLowerCase();
            if (!['.pdf', '.txt', '.md'].includes(fileExtension)) {
                console.log(`Skipping unsupported file: ${file}`);
                continue;
            }

            console.log(`Processing ${file}...`);
            const filePath = path.join(ARTICLES_DIR, file);

            try {
                const content = await readFileContent(filePath);
                console.log(`Read ${content.length} characters from ${file}`);

                // Split content into chunks
                const chunks = await chunkText(content);
                console.log(`Created ${chunks.length} chunks from ${file}`);

                // Prepare data for insertion
                const ids = chunks.map((_, i) => `${file}-${i}`);
                const metadatas = chunks.map(() => ({
                    source: file,
                    type: 'medical_article',
                    format: fileExtension.slice(1)
                }));

                console.log(`Adding ${chunks.length} chunks to ChromaDB...`);
                // Add to collection
                await collection.add({
                    ids,
                    documents: chunks,
                    metadatas
                });

                console.log(`Successfully added ${chunks.length} chunks from ${file}`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
                continue;
            }
        }

        console.log('Ingestion completed successfully!');
    } catch (error) {
        console.error('Error during ingestion:', error);
        process.exit(1);
    }
}

console.log('Starting ingestion process...');
ingestArticles().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
}); 