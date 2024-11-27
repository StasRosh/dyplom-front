import React from 'react';
import AdminReservations from './AdminReservations'; // Importuj podstrony
import AdminUsers from './AdminUsers';
import AdminCampers from './AdminCampers';
import { Routes, Route } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div>
            <h1>Panel Administratora</h1>
            <Routes>
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="campers" element={<AdminCampers />} />
            </Routes>
        </div>
    );
};

export default AdminPage;
