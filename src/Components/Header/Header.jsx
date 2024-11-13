import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from './GoCamper.png';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const Header = () => {
    const { currentUser, logout } = useContext(AuthContext);  // Dostęp do stanu logowania i funkcji logout z kontekstu
    const navigate = useNavigate();  // Hook do nawigacji po wylogowaniu

    // Funkcja obsługująca wylogowanie użytkownika
    const handleLogout = () => {
        logout();  // Wywołanie funkcji logout z AuthContext
        navigate('/home');  // Przekierowanie do strony głównej po wylogowaniu
    };

    return (
        <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light">
            <Container>
                {/* Logo, które przekierowuje do strony głównej */}
                <Navbar.Brand as={Link} to="/home" className="logo-container">
                    <img src={logo} className="d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>

                {/* Przycisk rozwijania na urządzeniach mobilnych */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                
                {/* Nawigacja */}
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav>
                        {/* Linki, które są widoczne zawsze */}
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/aboutUs">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Kontakt</Nav.Link>
                        <Nav.Link as={Link} to="/camper">Campery</Nav.Link>

                        {/* Sprawdzanie, czy użytkownik jest zalogowany */}
                        {!currentUser ? (
                            // Jeśli nie jest zalogowany, pokazujemy linki do logowania i rejestracji
                            <>
                                <Nav.Link as={Link} to="/login">Logowanie</Nav.Link>
                                <Nav.Link as={Link} to="/register">Rejestracja</Nav.Link>
                            </>
                        ) : (
                            // Jeśli użytkownik jest zalogowany, pokazujemy linki do rezerwacji i wylogowania
                            <>
                                <Nav.Link as={Link} to="/reservations">Rezerwacje</Nav.Link>
                                <Nav.Link as={Link} to="/" onClick={handleLogout}>Wyloguj się</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
