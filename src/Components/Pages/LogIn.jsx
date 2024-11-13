import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import loginImage from './Image/kamper10.png';

const LogIn = () => {
    const { login, currentUser, errorMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (currentUser) {
            navigate('/');  // Jeśli użytkownik jest już zalogowany, przekierowujemy go na stronę główną
        }
    }, [currentUser, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);  // Próba zalogowania użytkownika

        if (currentUser) {
            navigate('/');  // Jeśli logowanie jest udane, przekierowujemy na stronę główną
        }
    };

    return (
        <div className="login-container">
            <div className="image-header">
                <img src={loginImage} alt="Logowanie" className="login-image" />
            </div>
            <hr className="divider" />
            <h2>Logowanie</h2>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Zaloguj się</button>
                </form>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            <hr className="divider" />
        </div>
    );
};

export default LogIn;
