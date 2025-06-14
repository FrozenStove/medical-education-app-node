import { ChromaClient } from 'chromadb';

let chromaClient: ChromaClient;

export const initializeChromaDB = async () => {
    try {
        chromaClient = new ChromaClient({
            path: process.env.CHROMA_DB_URL || 'http://localhost:8000'
        });
        console.log('ChromaDB initialized successfully');
    } catch (error) {
        console.error('Failed to initialize ChromaDB:', error);
        throw error;
    }
};

export const getChromaClient = () => {
    if (!chromaClient) {
        throw new Error('ChromaDB client not initialized');
    }
    return chromaClient;
}; 