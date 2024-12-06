import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';

const AdminReservations = () => {
    const { getReservationsByUserId, users, currentUser, acceptReservation, cancelReservation, removeReservation } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // if (currentUser && currentUser.role === 'admin') {
        async function getReservations(userid) {
            const fetchedReservations = await getReservationsByUserId(); // Wszystkie rezerwacje dla administratora
            setReservations(fetchedReservations);
        }
        getReservations();
        console.log("reservation")
        console.log(reservations)
        // } else if (currentUser) {
        //     const fetchedReservations = getReservationsByUserId(currentUser.id); // Rezerwacje tylko dla zalogowanego użytkownika
        //     setReservations(fetchedReservations);
        // }
    }, [currentUser, getReservationsByUserId]
    );

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
                                        {reservation.vehicle ? (
                                            <>
                                                <strong>{reservation.vehicle.name}</strong><br />
                                                <small>{reservation.vehicle.vehicleType.name} - {reservation.vehicle.description}</small>
                                            </>
                                        ) : 'Nieznany kamper'}
                                    </td>
                                    <td>{reservation.start && reservation.end ? `Od: ${reservation.start} Do: ${reservation.end}` : 'Brak daty'}</td>
                                    <td>{reservation.order.orderStatus}</td>
                                    <td>
                                        {/* Sprawdzenie czy jest adminem */}


                                        {reservation.order.orderStatus == "PAID" ?
                                            <Button variant="danger" onClick={() => handleCancel(reservation.id)}>
                                                Anuluj
                                            </Button>
                                            :
                                            <Button variant="success" onClick={() => handleAccept(reservation.id)}>
                                                Zaakceptuj
                                            </Button>
                                        }

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
