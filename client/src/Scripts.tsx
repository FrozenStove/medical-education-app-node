import React, { useState } from 'react';
import './Scripts.css';
import { SERVER_URL } from './constants';

type ScriptName = 'ingest' | 'verify' | 'check';

type ScriptResult = {
    scriptName: ScriptName;
    documentCount: number;
    successfulFiles: number;
    failedFiles: number;
    data: any;
    error?: string;
}


function Scripts() {
    const [auth, setAuth] = useState('');
    const [result, setResult] = useState('');
    const [data, setData] = useState<ScriptResult | null>(null);
    let Result = (<div>
        {data && (
            <>
                <p>Script Name: {data.scriptName}</p>
                <p>Document Count: {data.documentCount}</p>
                <p>Successful Files: {data.successfulFiles}</p>
                <p>Failed Files: {data.failedFiles}</p>
            </>
        )}
    </div>)

    const handleButtonClick = async (button: string) => {
        setResult('');
        console.log(`${SERVER_URL}/api/scripts/${button}`);
        setData(null);
        try {
            const response = await fetch(`${SERVER_URL}/api/scripts/${button}`, {
                method: 'GET',
                headers: {
                    'auth': auth
                }
            });
            const data: ScriptResult = await response.json();
            if (data.error) {
                setResult('Error: ' + data.error);
            } else {
                setData(data);
                setResult('Success: ' + data.scriptName);
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
            {Result}
        </div>
    );
}

export default Scripts