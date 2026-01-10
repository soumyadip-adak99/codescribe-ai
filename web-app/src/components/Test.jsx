import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Test() {
    const [text, setText] = useState('Loading...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiCall = async () => {
            try {
                const apiUrl = 'http://localhost:8080/app/api/public/';
                const response = await axios.get(apiUrl);
                setText(response.data);
            } catch (err) {
                setError(err.message);
                setText('Failed to load data');
                console.error('API Error:', err);
            }
        };

        apiCall();
    }, []);

    return (
        <div className='text-red-500 text-2xl p-4'>
            {error ? (
                <div>
                    <p>Error: {error}</p>
                    <p className='text-sm'>Check console for details</p>
                </div>
            ) : (
                <p>{text}</p>
            )}
        </div>
    );
}

export default Test;