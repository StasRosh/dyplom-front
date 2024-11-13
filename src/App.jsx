import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header/Header';
import Contact from './Components/Pages/Contact';
import Footer from './Components/Footer/Footer';
import Home from './Components/Pages/Home';
import AboutUs from './Components/Pages/AboutUs';
import LogIn from './Components/Pages/LogIn';
import Register from './Components/Pages/Register';
import Camper from './Components/Pages/Camper';
import Reservations from './Components/Pages/Reservations';
import Camper1 from './Components/Pages/Campers/Camper1';
import Camper2 from './Components/Pages/Campers/Camper2';
import Camper3 from './Components/Pages/Campers/Camper3';
import { AuthContext } from './Context/AuthContext'; // Importujemy AuthContext

const App = () => {
    const { currentUser, addReservation, removeReservation, logout } = useContext(AuthContext);  // Uzyskujemy dostęp do AuthContext

    return (
        <Router>
            <div className="App">
                <Header currentUser={currentUser} logout={logout} />  {/* Przekazujemy logout do Header */}
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
                        <Route path="/camper" element={<Camper addReservation={addReservation} />} />
                        <Route 
                            path="/reservations" 
                            element={<Reservations removeReservation={removeReservation} />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
