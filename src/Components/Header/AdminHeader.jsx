import React, { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Używamy tych samych stylów co w Header
import { AuthContext } from '../../Context/AuthContext';

const AdminHeader = () => {
    const { logout } = useContext(AuthContext);  // Pobieramy funkcję wylogowania z kontekstu
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    return (
        <Navbar fixed="top" collapseOnSelect expand="md" bg="light" variant="light" className="navbar">
            <Container>
                <Navbar.Brand as={Link} to="/admin" className="logo-container">
                    Panel Administratora
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav className="navbar-nav">
                        <Nav.Link as={Link} to="/admin/users">Użytkownicy</Nav.Link>
                        <Nav.Link as={Link} to="/admin/campers">Campery</Nav.Link>
                        <Nav.Link as={Link} to="/admin/reservations">Rezerwacje</Nav.Link>
                        <Nav.Link as={Link} to="/admin/insurances">Ubezpieczenia</Nav.Link>
                        <Nav.Link as={Link} to="/admin/prices">Ceny</Nav.Link>
                        <Nav.Link as={Link} to="/admin/reports">Raporty</Nav.Link>
                        <Nav.Link as={Link} to="/admin/repairs">Naprawy</Nav.Link>
                        <Nav.Link as={Link} to="/" onClick={handleLogout}>Wyloguj się</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminHeader;
