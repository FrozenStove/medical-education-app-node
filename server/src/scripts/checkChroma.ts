import { ChromaClient, IncludeEnum, OpenAIEmbeddingFunction } from 'chromadb';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkChroma() {
    try {
        console.log('Connecting to ChromaDB...');
        const client = new ChromaClient({
            path: process.env.CHROMA_DB_URL || 'http://localhost:8000'
        });

        // List all collections
        const collections = await client.listCollections();
        console.log('\nCollections:', collections);

        if (collections.length === 0) {
            console.log('No collections found in ChromaDB');
            return;
        }

        // Check each collection
        for (const collection of collections) {
            console.log(`\nChecking collection: ${collection}`);
            const coll = await client.getCollection({
                name: collection, embeddingFunction: new OpenAIEmbeddingFunction({
                    openai_api_key: process.env.OPENAI_API_KEY || '',
                    openai_model: 'text-embedding-ada-002'
                })
            });

            // Get count
            const count = await coll.count();
            console.log(`Total documents: ${count}`);

            if (count > 0) {
                // Get a sample
                const sample = await coll.get({
                    limit: 3,
                    include: [IncludeEnum.Metadatas, IncludeEnum.Documents]
                });

                console.log('\nSample documents:');
                sample.ids.forEach((id, index) => {
                    console.log(`\nDocument ${index + 1}:`);
                    console.log(`ID: ${id}`);
                    console.log(`Source: ${sample.metadatas?.[index]?.source ?? 'N/A'}`);
                    console.log('Content Preview:');
                    console.log(sample.documents?.[index]?.substring(0, 200) ?? 'No content' + '...');
                });
            }
        }
    } catch (error) {
        console.error('Error checking ChromaDB:', error);
    }
}

checkChroma();