import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';

const AdminReservations = () => {
    const { getReservationsByUserId, users, currentUser, acceptReservation, cancelReservation, removeReservation } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        if (currentUser && currentUser.role === 'admin') {
            const fetchedReservations = getReservationsByUserId(); // Wszystkie rezerwacje dla administratora
            setReservations(fetchedReservations);
        } else if (currentUser) {
            const fetchedReservations = getReservationsByUserId(currentUser.id); // Rezerwacje tylko dla zalogowanego użytkownika
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

    // Funkcja do pobierania kampera na podstawie jego ID
    const getCamperById = (camperId) => {
        const allCampers = JSON.parse(localStorage.getItem('campers')) || [];
        return allCampers.find(camper => camper.id === camperId) || null;
    };

    return (
        <div>
            <h1>Rezerwacje</h1>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Użytkownik</th>
                        <th>Kamper</th>
                        <th>Okres rezerwacji</th>
                        <th>Status</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length === 0 ? (
                        <tr>
                            <td colSpan="6">Brak rezerwacji</td>
                        </tr>
                    ) : (
                        reservations.map(reservation => {
                            const user = users.find(user => user.id === reservation.userId);
                            const camper = getCamperById(reservation.camperId);

                            return (
                                <tr key={reservation.id}>
                                    <td>{reservation.id}</td>
                                    <td>{user ? user.email : 'Nieznany użytkownik'}</td>
                                    <td>
                                        {camper ? (
                                            <>
                                                <strong>{camper.name}</strong><br />
                                                <small>{camper.category} - {camper.description}</small>
                                            </>
                                        ) : 'Nieznany kamper'}
                                    </td>
                                    <td>{reservation.startDate && reservation.endDate ? `Od: ${reservation.startDate} Do: ${reservation.endDate}` : 'Brak daty'}</td>
                                    <td>{reservation.status || 'Oczekująca'}</td>
                                    <td>
                                        {currentUser && currentUser.role === 'admin' && reservation.status !== 'Zaakceptowana' && (
                                            <Button variant="success" onClick={() => handleAccept(reservation.id)}>
                                                Zaakceptuj
                                            </Button>
                                        )}
                                        {currentUser && currentUser.role === 'admin' && reservation.status !== 'Anulowana' && (
                                            <Button variant="danger" onClick={() => handleCancel(reservation.id)}>
                                                Anuluj
                                            </Button>
                                        )}
                                        <Button variant="danger" onClick={() => handleRemove(reservation.id)}>
                                            Usuń
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminReservations;
