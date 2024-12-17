import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import './AdminReservations.css';

const AdminReservations = () => {
    const { getReservationsByUserId, users, currentUser, acceptReservation, cancelReservation, removeReservation } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [reload, setReload] = useState(true);

    async function getReservations(userid) {
        const fetchedReservations = await getReservationsByUserId(); // Wszystkie rezerwacje dla administratora
        setReservations(fetchedReservations);
    }
    useEffect(() => {
        // if (currentUser && currentUser.role === 'admin') {
        
        getReservations();
        console.log("reservation")
        console.log(reservations)
        // } else if (currentUser) {
        //     const fetchedReservations = getReservationsByUserId(currentUser.id); // Rezerwacje tylko dla zalogowanego użytkownika
        //     setReservations(fetchedReservations);
        // }
    }, [currentUser, getReservationsByUserId, reload]
    );

    const handleAccept = async (reservationId) => {
        await acceptReservation(reservationId);
        setReload(!reload); 
    };

    const handleCancel = async (reservationId) => {
        await cancelReservation(reservationId);
        setReload(!reload);
        
    };

    const handleRemove = (reservationId) => {
        removeReservation(reservationId);
        window.location.reload()
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
                                        {reservation.vehicle ? `${reservation.vehicle.name} (${reservation.vehicle.vehicleType.name})` : 'Nieznany'}
                                    </p>
                                    <p>
                                        <strong>Okres:</strong>{' '}
                                        {reservation.start && reservation.end
                                            ? `${reservation.start} - ${reservation.end}`
                                            : 'Brak dat'}
                                    </p>
                                    <p><strong>Status:</strong> {reservation.order.orderStatus || 'Nieznany'}</p>
                                </div>
                                <div className="admin-reservation-actions">
                                    { reservation.order.orderStatus !== 'PAID' && (
                                        <Button className="btn-success" onClick={() => handleAccept(reservation.id)}>
                                            Zaakceptuj
                                        </Button>
                                    )}
                                    { reservation.order.orderStatus !== 'CANCELED' && (
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
