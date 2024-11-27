import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';

const AdminContact = () => {
    const { sendMessage } = useContext(AuthContext);
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(message);
        setMessage("");
    };

    return (
        <div>
            <h1>Kontakt</h1>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    rows="5" 
                    placeholder="Wpisz swoją wiadomość..." 
                />
                <button type="submit">Wyślij</button>
            </form>
        </div>
    );
};

export default AdminContact;
