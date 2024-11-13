import React, { useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import './Register.css';

const Register = () => {
    const { register } = useContext(AuthContext);  // Funkcja rejestracji z kontekstu
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = { email, password };  // Dane nowego użytkownika

        // Przykładowa walidacja
        if (!email || !password) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }

        setError(null);
        register(newUser);  // Wywołanie funkcji rejestracji
    };

    return (
        <div className="register-container">
            <h2 className="register-header">Rejestracja</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="register-input"
                />
                
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="register-input"
                />
                
                <button type="submit" className="register-button">Zarejestruj się</button>
            </form>
        </div>
    );
};

export default Register;
