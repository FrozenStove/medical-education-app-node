import { ChromaClient, IncludeEnum } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import dotenv from 'dotenv';
import path from 'path';
import { CHROMA_DB_URL } from '@/constants';
import { OPENAI_API_KEY } from '@/constants';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export async function verifyIngestion() {
    try {
        // Initialize ChromaDB client
        const chromaClient = new ChromaClient({
            path: CHROMA_DB_URL
        });

        // Initialize embedding function
        const embeddingFunction = new OpenAIEmbeddingFunction({
            openai_api_key: OPENAI_API_KEY,
            openai_model: 'text-embedding-ada-002'
        });

        // Get the collection
        const collection = await chromaClient.getCollection({
            name: 'medical_articles',
            embeddingFunction
        });

        // Get collection info
        const count = await collection.count();
        console.log(`Total documents in collection: ${count}`);

        // Get a sample of documents
        const sample = await collection.get({
            limit: 5,
            include: [IncludeEnum.Metadatas, IncludeEnum.Documents]
        });

        console.log('\nSample of ingested documents:');
        console.log('------------------------');

        sample.ids.forEach((id, index) => {
            console.log(`\nDocument ${index + 1}:`);
            console.log(`ID: ${id}`);
            console.log(`Source: ${sample.metadatas?.[index]?.source ?? 'N/A'}`);
            console.log(`Format: ${sample.metadatas?.[index]?.format ?? 'N/A'}`);
            console.log('Content Preview:');
            console.log(sample.documents?.[index]?.substring(0, 200) ?? 'No content available' + '...');
            console.log('------------------------');
        });

        // Test a simple query
        console.log('\nTesting a simple query...');
        const queryResult = await collection.query({
            queryTexts: ['medical education'],
            nResults: 1
        });

        console.log('\nQuery Test Result:');
        console.log('------------------------');
        console.log('Query: "medical education"');
        console.log('Best match preview:');
        console.log(queryResult.documents?.[0]?.[0]?.substring(0, 200) ?? 'No results found' + '...');

    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

