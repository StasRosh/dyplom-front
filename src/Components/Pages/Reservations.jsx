import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import './Reservations.css';
import headerImage from './Image/img1.jpeg';

const Reservations = () => {
    const { currentUser, reservations, removeReservation, acceptReservation } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    // Wyświetlenie rezerwacji tylko dla zalogowanego użytkownika
    const userReservations = reservations.filter(reservation => reservation.userId === currentUser?.id);
    console.log("Rezerwacje dla użytkownika", currentUser?.id, ":", userReservations);

    // Funkcja do usuwania rezerwacji
    const handleDelete = (id) => {
        removeReservation(id);
    };

    // Funkcja do otwierania modalu
    const handleOpenModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    // Funkcja do zamykania modalu
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReservation(null);
    };

    // Monitorowanie zmian w statusie rezerwacji
    useEffect(() => {
        // Za każdym razem, gdy rezerwacje się zmieniają, zapisujemy je w localStorage
        localStorage.setItem('reservations', JSON.stringify(reservations));
    }, [reservations]);

    // Jeśli użytkownik nie jest zalogowany, wyświetlamy komunikat
    if (!currentUser) {
        return (
            <div className="reservations-container" style={{ marginTop: '80px' }}>
                <h2>Musisz być zalogowany, aby zobaczyć swoje rezerwacje.</h2>
            </div>
        );
    }

    return (
        <div className="reservations-container" style={{ marginTop: '80px' }}>
            <div className="reservations-header">
                <img src={headerImage} alt="Nagłówek" className="header-image" />
                <h2>Moje Rezerwacje</h2>
                <p>Znajdź szczegóły swoich rezerwacji poniżej.</p>
                <hr className="divider" />
            </div>

            {userReservations.length === 0 ? (
                <p>Brak rezerwacji. Spróbuj dodać rezerwację!</p>
            ) : (
                userReservations.map((reservation) => (
                    <div key={reservation.id} className="reservation-card">
                        <div className="reservation-details">
                            <h3>{reservation.camper}</h3>
                            {reservation.image ? (
                                <div className="reservation-image-container">
                                    <img
                                        src={reservation.image}
                                        alt={`Zdjęcie kampera: ${reservation.camper}`}
                                        className="reservation-image"
                                    />
                                </div>
                            ) : (
                                <p>Brak zdjęcia</p>
                            )}
                            <p>
                                Termin: <strong>{reservation.startDate} - {reservation.endDate}</strong>
                            </p>
                            <p>Lokalizacja: {reservation.location}</p>
                            <p>Ilość osób: {reservation.guests}</p>

                            {/* Wyświetlanie statusu rezerwacji */}
                            <p>Status: <strong>{reservation.status || 'Oczekujące'}</strong></p>

                            {/* Przycisk do zmiany statusu */}
                            {reservation.status === 'Oczekująca' && (
                                <Button
                                    onClick={() => acceptReservation(reservation.id)} // Akceptacja rezerwacji
                                    className="btn btn-success"
                                >
                                    Zaakceptuj Rezerwację
                                </Button>
                            )}

                            <Button
                                onClick={() => handleOpenModal(reservation)}
                                className="btn btn-secondary"
                            >
                                Zobacz Szczegóły
                            </Button>
                            <Button
                                onClick={() => handleDelete(reservation.id)}
                                className="btn btn-danger"
                            >
                                Usuń Rezerwację
                            </Button>
                        </div>
                    </div>
                ))
            )}

            {/* Modal z potwierdzeniem szczegółów rezerwacji */}
            {selectedReservation && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Szczegóły rezerwacji: {selectedReservation.camper}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>{selectedReservation.camper}</h5>
                        <p><strong>Data rozpoczęcia:</strong> {selectedReservation.startDate}</p>
                        <p><strong>Data zakończenia:</strong> {selectedReservation.endDate}</p>
                        <p><strong>Lokalizacja:</strong> {selectedReservation.location}</p>
                        <p><strong>Ilość osób:</strong> {selectedReservation.guests}</p>
                        <p><strong>Status:</strong> {selectedReservation.status}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Zamknij
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Reservations;
