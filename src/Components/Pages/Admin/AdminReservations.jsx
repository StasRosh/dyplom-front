import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import './AdminReservations.css';

const AdminReservations = () => {
    const { getReservationsByUserId, users, currentUser, acceptReservation, cancelReservation, removeReservation } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            const fetchedReservations = getReservationsByUserId();
            setReservations(fetchedReservations);
        } else if (currentUser) {
            const fetchedReservations = getReservationsByUserId(currentUser.id);
            setReservations(fetchedReservations);
        }
    }, [currentUser, getReservationsByUserId]);

    const handleAccept = (reservationId) => {
        acceptReservation(reservationId);
    };

    const handleCancel = (reservationId) => {
        cancelReservation(reservationId);
    };

    const handleRemove = (reservationId) => {
        removeReservation(reservationId);
    };

    const getCamperById = (camperId) => {
        const allCampers = JSON.parse(localStorage.getItem('campers')) || [];
        return allCampers.find(camper => camper.id === camperId) || null;
    };

    return (
        <div className="admin-reservations-container">
            <h2 className="admin-reservation-title">Zarządzanie Rezerwacjami Kamperów</h2>
            <div className="admin-reservations-list">
                {reservations.length === 0 ? (
                    <p>Brak rezerwacji</p>
                ) : (
                    reservations.map(reservation => {
                        const user = users.find(user => user.id === reservation.userId);
                        const camper = getCamperById(reservation.camperId);

                        return (
                            <div key={reservation.id} className="admin-reservation-card">
                                <div className="reservation-details">
                                    <h3>ID: {reservation.id}</h3>
                                    <p><strong>Użytkownik:</strong> {user ? user.email : 'Nieznany'}</p>
                                    <p>
                                        <strong>Kamper:</strong>{' '}
                                        {camper ? `${camper.name} (${camper.category})` : 'Nieznany'}
                                    </p>
                                    <p>
                                        <strong>Okres:</strong>{' '}
                                        {reservation.startDate && reservation.endDate
                                            ? `${reservation.startDate} - ${reservation.endDate}`
                                            : 'Brak dat'}
                                    </p>
                                    <p><strong>Status:</strong> {reservation.status || 'Oczekująca'}</p>
                                </div>
                                <div className="admin-reservation-actions">
                                    {currentUser && currentUser.role === 'admin' && reservation.status !== 'Zaakceptowana' && (
                                        <Button className="btn-success" onClick={() => handleAccept(reservation.id)}>
                                            Zaakceptuj
                                        </Button>
                                    )}
                                    {currentUser && currentUser.role === 'admin' && reservation.status !== 'Anulowana' && (
                                        <Button className="btn-danger" onClick={() => handleCancel(reservation.id)}>
                                            Anuluj
                                        </Button>
                                    )}
                                    <Button className="btn-remove" onClick={() => handleRemove(reservation.id)}>
                                        Usuń
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminReservations;
