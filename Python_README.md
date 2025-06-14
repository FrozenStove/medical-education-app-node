# Medical Education Assistant

A web application that uses RAG (Retrieval-Augmented Generation) with ChatGPT to provide personalized medical education for healthcare professionals.

## Features

- Socratic learning method for medical education
- RAG implementation with OpenAI embeddings and ChromaDB
- Interactive chat interface with ChatGPT
- Persistent knowledge base for medical articles
- Specialized for radiation oncologists

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Start the application:
```bash
streamlit run app.py
```

## Adding Medical Articles

To add new medical articles to the knowledge base:

1. Place your articles in the `articles` directory
2. Run the ingestion script to process and store them in the vector database

## Usage

- Open the application in your web browser
- Start chatting with the AI assistant
- The assistant will use both the knowledge base and ChatGPT to provide educational responses
