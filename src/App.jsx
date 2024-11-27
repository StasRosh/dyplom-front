import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header/Header';
import AdminHeader from './Components/Header/AdminHeader';  // Importowanie nagłówka dla administratora
import Contact from './Components/Pages/Contact';
import Footer from './Components/Footer/Footer';
import Home from './Components/Pages/Home';
import AboutUs from './Components/Pages/AboutUs';
import LogIn from './Components/Pages/LogIn';
import Register from './Components/Pages/Register';
import Camper from './Components/Pages/Camper';
import Reservations from './Components/Pages/Reservations';
import AdminPage from './Components/Pages/Admin/AdminPage';
import Camper1 from './Components/Pages/Campers/Camper1';
import Camper2 from './Components/Pages/Campers/Camper2';
import Camper3 from './Components/Pages/Campers/Camper3';
import Camper4 from './Components/Pages/Campers/Camper4';
import AdminUsers from './Components/Pages/Admin/AdminUsers';
import AdminCampers from './Components/Pages/Admin/AdminCampers';
import AdminReservations from './Components/Pages/Admin/AdminReservations';
import { AuthContext } from './Context/AuthContext';

const App = () => {
    const { currentUser, addReservation, removeReservation, logout } = useContext(AuthContext);

    // Dodajemy stan dla kamperów
    const [campersData, setCampersData] = useState([]);

    // Wczytanie danych kamperów z localStorage
    useEffect(() => {
        const savedCampers = JSON.parse(localStorage.getItem('campers')) || [];
        setCampersData(savedCampers);
    }, []);

    return (
        <Router>
            <div className="App">
                {/* Renderowanie nagłówka w zależności od roli użytkownika */}
                {currentUser?.role === 'admin' ? (
                    <AdminHeader />
                ) : (
                    <Header currentUser={currentUser} logout={logout} />
                )}
                
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LogIn />} />
                        <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
                        <Route path="/camper/1" element={<Camper1 addReservation={addReservation} />} />
                        <Route path="/camper/2" element={<Camper2 addReservation={addReservation} />} />
                        <Route path="/camper/3" element={<Camper3 addReservation={addReservation} />} />
                        <Route path="/camper/4" element={<Camper4 addReservation={addReservation} />} />
                        <Route path="/camper" element={<Camper addReservation={addReservation} />} />
                        <Route path="/reservations" element={<Reservations removeReservation={removeReservation} />} />

                        {/* Trasy administracyjne */}
                        <Route 
                            path="/admin" 
                            element={currentUser?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />}
                        />
                        <Route 
                            path="/admin/users" 
                            element={currentUser?.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />}
                        />
                        <Route 
                            path="/admin/campers" 
                            element={currentUser?.role === 'admin' ? <AdminCampers campersData={campersData} setCampersData={setCampersData} /> : <Navigate to="/" />}
                        />
                        <Route 
                            path="/admin/reservations" 
                            element={currentUser?.role === 'admin' ? <AdminReservations /> : <Navigate to="/" />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
