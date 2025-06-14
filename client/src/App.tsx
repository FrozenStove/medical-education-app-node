import React, { useState } from 'react';
import './App.css';

function App() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
            setResponse('Sorry, there was an error processing your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Medical Education Assistant</h1>
            </header>
            <main className="App-main">
                <form onSubmit={handleSubmit} className="query-form">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a medical question..."
                        className="query-input"
                    />
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Processing...' : 'Ask'}
                    </button>
                </form>
                {response && (
                    <div className="response-container">
                        <h2>Response:</h2>
                        <div className="response-content">{response}</div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App; 