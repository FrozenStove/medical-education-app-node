import React, { useState } from 'react';
import './Scripts.css';
import { SERVER_URL } from './constants';

function Scripts() {
    const [auth, setAuth] = useState('');
    const [result, setResult] = useState('');

    const handleButtonClick = async (button: string) => {
        setResult('');
        console.log(`${SERVER_URL}/api/scripts/${button}`);
        try {
            const response = await fetch(`${SERVER_URL}/api/scripts/${button}`, {
                method: 'GET',
                headers: {
                    'auth': auth
                }
            });
            const data = await response.json();
            if (data.error) {
                setResult('Error: ' + data.error);
            } else {
                setResult('Success: ' + data.message);
            }
        } catch (error) {
            console.log(error);
            setResult('Error: ' + error);
        }
    }

    return (
        <div className="scripts-container">
            <h1>Scripts</h1>
            <input type="text" placeholder="Auth" value={auth} onChange={(e) => setAuth(e.target.value)} />
            <button onClick={() => handleButtonClick('ingest')}>Ingest</button>
            <button onClick={() => handleButtonClick('verify')}>Verify</button>
            <button onClick={() => handleButtonClick('check')}>Check</button>
            <div className="result">{result}</div>
        </div>
    );
}

export default Scripts