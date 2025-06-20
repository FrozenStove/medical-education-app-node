import React, { useState } from 'react';
import './Scripts.css';
import { SERVER_URL } from './constants';

function Scripts() {
    const [auth, setAuth] = useState('');

    const handleButtonClick = (button: string) => {
        fetch(`${SERVER_URL}/api/scripts/${button}`, {
            method: 'GET',
            headers: {
                'auth': auth
            }
        });

    }

    return (
        <div className="scripts-container">
            <h1>Scripts</h1>
            <input type="text" placeholder="Auth" value={auth} onChange={(e) => setAuth(e.target.value)} />
            <button onClick={() => handleButtonClick('ingest')}>Ingest</button>
            <button onClick={() => handleButtonClick('verify')}>Verify</button>
            <button onClick={() => handleButtonClick('check')}>Check</button>
        </div>
    );
}

export default Scripts