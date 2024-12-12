import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import './Reports.css';

const AdminReports = () => {
    const { getReservationsByUserId, currentUser } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [pickUpReports, setPickUpReports] = useState([]);
    const [returnReports, setReturnReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const fetchedReservations = getReservationsByUserId();

            // Odczytujemy zapisany stan z localStorage
            const storedReservationStates = JSON.parse(localStorage.getItem('reservationStates')) || {};

            setReservations(
                fetchedReservations.map(reservation => ({
                    ...reservation,
                    pickUpDate: reservation.pickUpDate || '',
                    pickUpCamperCondition: reservation.pickUpCamperCondition || '',
                    returnDate: reservation.returnDate || '',
                    returnCamperCondition: reservation.returnCamperCondition || '',
                    isPickUpSaved: storedReservationStates[reservation.id]?.isPickUpSaved || false,
                    isReturnSaved: storedReservationStates[reservation.id]?.isReturnSaved || false,
                }))
            );
        }

        const storedPickUpReports = JSON.parse(localStorage.getItem('pickUpReports')) || [];
        const storedReturnReports = JSON.parse(localStorage.getItem('returnReports')) || [];
        setPickUpReports(storedPickUpReports);
        setReturnReports(storedReturnReports);
    }, [currentUser, getReservationsByUserId]);

    const updateReservationState = (reservationId, updates) => {
        // Aktualizujemy lokalny stan komponentu
        setReservations(prevReservations =>
            prevReservations.map(reservation =>
                reservation.id === reservationId
                    ? { ...reservation, ...updates }
                    : reservation
            )
        );

        // Synchronizujemy stan w localStorage
        const currentStates = JSON.parse(localStorage.getItem('reservationStates')) || {};
        localStorage.setItem(
            'reservationStates',
            JSON.stringify({
                ...currentStates,
                [reservationId]: {
                    ...currentStates[reservationId],
                    ...updates,
                },
            })
        );
    };

    const handleChange = (reservationId, field, value) => {
        setReservations(prevReservations =>
            prevReservations.map(reservation =>
                reservation.id === reservationId
                    ? { ...reservation, [field]: value }
                    : reservation
            )
        );
    };

    const handleSavePickUpReport = (reservation) => {
        const newReport = {
            reservationId: reservation.id,
            pickUpDate: reservation.pickUpDate,
            pickUpCamperCondition: reservation.pickUpCamperCondition,
        };

        const updatedPickUpReports = [...pickUpReports, newReport];
        setPickUpReports(updatedPickUpReports);
        localStorage.setItem('pickUpReports', JSON.stringify(updatedPickUpReports));

        updateReservationState(reservation.id, { isPickUpSaved: true });

        alert('Raport odbioru zapisany!');
    };

    const handleSaveReturnReport = (reservation) => {
        const newReport = {
            reservationId: reservation.id,
            returnDate: reservation.returnDate,
            returnCamperCondition: reservation.returnCamperCondition,
        };

        const updatedReturnReports = [...returnReports, newReport];
        setReturnReports(updatedReturnReports);
        localStorage.setItem('returnReports', JSON.stringify(updatedReturnReports));

        // Usuwamy rezerwację, ale zapisujemy jej stan w localStorage
        const remainingReservations = reservations.filter(r => r.id !== reservation.id);
        setReservations(remainingReservations);

        const currentStates = JSON.parse(localStorage.getItem('reservationStates')) || {};
        delete currentStates[reservation.id];
        localStorage.setItem('reservationStates', JSON.stringify(currentStates));

        alert('Raport zwrotu zapisany!');
    };

    const handleAdminRepairs = () => {
        navigate('/admin/repairs');
    };

    return (
        <Container className="reports-container">
            <h2 className="admin-reservation-title">Zarządzanie Raportami Kamperów</h2>
            <div className="reports-form-wrapper">
                <ListGroup>
                    {reservations.length === 0 ? (
                        <ListGroup.Item className="text-center">Brak zaakceptowanych rezerwacji</ListGroup.Item>
                    ) : (
                        reservations.map(reservation => {
                            if (reservation.status !== 'Zaakceptowana') {
                                return null;
                            }

                            return (
                                <ListGroup.Item
                                    key={reservation.id}
                                    className={`reservation-item ${reservation.isPickUpSaved && reservation.isReturnSaved ? 'saved' : ''}`}
                                >
                                    <Row>
                                        <Col xs={12} md={8} className="reservation-details">
                                            <p><strong>ID:</strong> {reservation.id}</p>
                                            <p><strong>Kamper:</strong> {reservation.camper || 'Nieznany kamper'}</p>
                                            <p><strong>Data Odbioru:</strong> {reservation.startDate || 'Brak daty'}</p>

                                            {!reservation.isPickUpSaved && (
                                                <>
                                                    <Form.Group controlId={`pickUpDate-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Data Oddania</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={reservation.pickUpDate}
                                                            onChange={(e) => handleChange(reservation.id, 'pickUpDate', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId={`pickUpCamperCondition-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Stan przy Oddaniu</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={reservation.pickUpCamperCondition}
                                                            onChange={(e) => handleChange(reservation.id, 'pickUpCamperCondition', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Button
                                                        variant="success"
                                                        onClick={() => handleSavePickUpReport(reservation)}
                                                        className="save-button mb-3"
                                                    >
                                                        Zapisz Odbiór
                                                    </Button>
                                                </>
                                            )}

                                            {!reservation.isReturnSaved && (
                                                <>
                                                    <Form.Group controlId={`returnDate-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Data Zwrotu</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={reservation.returnDate}
                                                            onChange={(e) => handleChange(reservation.id, 'returnDate', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId={`returnCamperCondition-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Stan przy Zwrocie</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            value={reservation.returnCamperCondition}
                                                            onChange={(e) => handleChange(reservation.id, 'returnCamperCondition', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleSaveReturnReport(reservation)}
                                                        className="save-button"
                                                    >
                                                        Zapisz Zwrot
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={handleAdminRepairs}
                                                        className="ml-3"
                                                    >
                                                        Dodaj Naprawę
                                                    </Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            );
                        })
                    )}
                </ListGroup>
            </div>
            <div className="reports-lists">
                <h2 className="text-primary mt-5">Raporty Odbioru</h2>
                <ListGroup>
                    {pickUpReports.map(report => (
                        <ListGroup.Item key={report.reservationId}>
                            <p><strong>ID:</strong> {report.reservationId}</p>
                            <p><strong>Data Oddania:</strong> {report.pickUpDate}</p>
                            <p><strong>Stan przy Oddaniu:</strong> {report.pickUpCamperCondition}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <h2 className="text-primary mt-5">Raporty Zwrotu</h2>
                <ListGroup>
                    {returnReports.map(report => (
                        <ListGroup.Item key={report.reservationId}>
                            <p><strong>ID:</strong> {report.reservationId}</p>
                            <p><strong>Data Zwrotu:</strong> {report.returnDate}</p>
                            <p><strong>Stan przy Zwrocie:</strong> {report.returnCamperCondition}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </Container>
    );
};

export default AdminReports;
