import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { SERVER_URL } from './constants';
import './App.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function App() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Add user message to conversation
        const userMessage: Message = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await fetch(`${SERVER_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: query,
                    conversation: messages // Send conversation history
                }),
            });

            const data = await response.json();
            // Add assistant response to conversation
            const assistantMessage: Message = { role: 'assistant', content: data.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setQuery(''); // Clear input after sending
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="App">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <div className={`app-content ${sidebarOpen ? 'app-with-sidebar' : 'app-without-sidebar'}`}>
                <header className="App-header">
                    <h1>Medical Education Assistant</h1>
                </header>
                <main className="App-main">
                    <div className="conversation-container">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                            >
                                <div className="message-content">{message.content}</div>
                            </div>
                        ))}
                    </div>
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
                </main>
            </div>
        </div>
    );
}

export default App; 