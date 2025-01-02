import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Container, ListGroup, Row, Col, Accordion, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import './Reports.css';

const AdminReports = () => {
    const { getReservationsByUserId, currentUser, createPickupReport, createReturnReport, getAllReports } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [pickUpReports, setPickUpReports] = useState([]);
    const [returnReports, setReturnReports] = useState([]);
    const [fetchedReservations, setFetchedReservations] = useState([]);
    const [reports,setReports] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate();

    async function getReservations(userid) {
        const fetchedReservations = await getReservationsByUserId(); // Wszystkie rezerwacje dla administratora
        setReservations(fetchedReservations);
    }
    async function getReports() {
        const fetchedReports = await getAllReports();
         
        setPickUpReports(fetchedReports.filter((x)=>
            x.reportType === 'PICKUP'
        ))
        setReturnReports(fetchedReports.filter((x)=>
            x.reportType === 'RETURN'
        ))
        
    }

    useEffect(() => {
            getReservations();

            // Odczytujemy zapisany stan z localStorage
            setReservations(
                fetchedReservations.map(reservation => ({
                    ...reservation,
                    pickUpDate: reservation.start || '',
                    pickUpCamperCondition: reservation.pickUpCamperCondition || '',
                    returnDate: reservation.end || '',
                    returnCamperCondition: reservation.returnCamperCondition || '',
                    // isPickUpSaved: storedReservationStates[reservation.id]?.isPickUpSaved || false,
                    // isReturnSaved: storedReservationStates[reservation.id]?.isReturnSaved || false,
                }))
            );

            getReports();
        

        const storedPickUpReports = JSON.parse(localStorage.getItem('pickUpReports')) || [];
        const storedReturnReports = JSON.parse(localStorage.getItem('returnReports')) || [];
        setPickUpReports(storedPickUpReports);
        setReturnReports(storedReturnReports);
    }, [refresh]);

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
            reservationid: reservation.id,
            reportDate: reservation.pickUpDate,
            comment: reservation.pickUpCamperCondition,
            technicalCondition: reservation.pickUpTechnicalCondition,
            visualCondition: reservation.pickUpVisualCondition,
            interiorCondition: reservation.pickUpInteriorCondition
        };

        console.log(newReport);

        if(!reservation.id || !reservation.pickUpDate || !reservation.pickUpCamperCondition || !reservation.pickUpInteriorCondition || !reservation.pickUpTechnicalCondition || !reservation.pickUpVisualCondition){
            alert("wypełnij wszystkie dane!")
            return;
        }

        createPickupReport(newReport)

        alert('Raport odbioru zapisany!');
        setRefresh(!refresh)
    };

    const handleSaveReturnReport = (reservation) => {
        const newReport = {
            reservationid: reservation.id,
            reportDate: reservation.returnDate,
            comment: reservation.returnCamperCondition,
            technicalCondition: reservation.returnTechnicalCondition,
            visualCondition: reservation.returnVisualCondition,
            interiorCondition: reservation.returnInteriorCondition
        };

        console.log(newReport)
        
        if(!reservation.id || !reservation.returnDate || !reservation.returnCamperCondition || !reservation.returnInteriorCondition || !reservation.returnTechnicalCondition || !reservation.returnVisualCondition){
            alert("wypełnij wszystkie dane!")
            return;
        }
        
        createReturnReport(newReport)

        alert('Raport zwrotu zapisany!');
        setRefresh(!refresh)
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
                            if (reservation.order == null){
                                return null;
                            }
                            if (reservation.order.orderStatus === 'FINISHED') {
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
                                            <p><strong>Kamper:</strong> {reservation.vehicle.name || 'Nieznany kamper'}</p>
                                            <p><strong>Status: </strong>{reservation.order.orderStatus}</p>
                                            <p><strong>Data Odbioru:</strong> {reservation.start || 'Brak daty'}</p>
                                            <p><strong>Data Zwrotu:</strong> {reservation.end || 'Brak daty'}</p>
                                            <p><strong>Klient: </strong>{reservation.order.user.name} </p>
                                            <p><strong>Koszt: </strong> {reservation.order.totalCost}</p>

                                            <Accordion>
{reservation.order.orderStatus !== 'IN_USE' ? (
    <Accordion.Item eventKey={reservation.id+"pickup"}>
        <Accordion.Header>Raport wydania</Accordion.Header>
        <Accordion.Body>
                                                    <Form.Group controlId={`pickUpDate-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Data wydania</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={reservation.pickUpDate}
                                                            onChange={(e) => handleChange(reservation.id, 'pickUpDate', e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group controlId={`pickUpVisualCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Wizualny</Form.Label>
        <Form.Select
            value={reservation.pickUpVisualCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'pickUpVisualCondition', e.target.value)}
        >
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
    </Form.Group>

    <Form.Group controlId={`pickUpTechnicalCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Techniczny</Form.Label>
        <Form.Select
            value={reservation.pickUpTechnicalCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'pickUpTechnicalCondition', e.target.value)}
        >
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
    </Form.Group>

    <Form.Group controlId={`pickUpInteriorCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Wewnętrzny</Form.Label>
        <Form.Select
            value={reservation.pickUpInteriorCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'pickUpInteriorCondition', e.target.value)}
        >
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
    </Form.Group>

                                                  
                                                    <Form.Group controlId={`pickUpCamperCondition-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Stan przy wydaniu pojazdu</Form.Label>  
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
                                                        Zapisz raport wydania
                                                    </Button> 
                                                    </Accordion.Body>
    </Accordion.Item>

) : (
                                                                                           

                                                <Accordion.Item eventKey={reservation.id+"return"}>
        <Accordion.Header>Raport zwrotu</Accordion.Header>
        <Accordion.Body>
                                                    <Form.Group controlId={`returnDate-${reservation.id}`} className="mb-3">
                                                        <Form.Label>Data Zwrotu</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={reservation.returnDate}
                                                            onChange={(e) => handleChange(reservation.id, 'returnDate', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId={`returnVisualCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Wizualny</Form.Label>
        <Form.Select
            value={reservation.returnVisualCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'returnVisualCondition', e.target.value)}
        >
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
    </Form.Group>

    <Form.Group controlId={`returnTechnicalCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Techniczny</Form.Label>
        <Form.Select
            value={reservation.returnTechnicalCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'returnTechnicalCondition', e.target.value)}
        >            
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
    </Form.Group>

    <Form.Group controlId={`returnInteriorCondition-${reservation.id}`} className="mb-3">
        <Form.Label>Stan Wewnętrzny</Form.Label>
        <Form.Select
            value={reservation.returnInteriorCondition || 'wybierz status'}
            onChange={(e) => handleChange(reservation.id, 'returnInteriorCondition', e.target.value)}
        >
            <option value=""></option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="POOR">POOR</option>
            <option value="UNUSABLE">UNUSABLE</option>
        </Form.Select>
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
                                                    </Accordion.Body>
    </Accordion.Item>
    )}
                                            
                                            </Accordion>
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
                        <ListGroup.Item key={report.reservation.id}>
                            <p><strong>ID:</strong> {report.reservation.id}</p>
                            <p><strong>Kamper:</strong> {report.reservation.vehicle.name}</p>
                            <p><strong>Data Oddania:</strong> {report.reportDate}</p>
                            <p><strong>Lokalizacja:</strong> {report.reservation.location}</p>
                            <p><strong>Stan przy Oddaniu:</strong> {report.pickUpCamperCondition}</p>
                            <Table hover>
                                <tbody>
                                    <tr>
                                        <td>Stan techniczny</td>
                                        <td>{report.technicalCondition}</td>
                                    </tr>
                                    <tr>
                                        <td>Stan wnętrza</td>
                                        <td>{report.interiorCondition}</td>
                                    </tr>
                                    <tr>
                                        <td>Stan wizulany</td>
                                        <td>{report.visualCondition}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <p><strong>Opis:</strong> {report.comment}</p>

                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <h2 className="text-primary mt-5">Raporty Zwrotu</h2>
                <ListGroup>
                    {returnReports.map(report => (
                        <ListGroup.Item key={report.reservation.id}>
                            <p><strong>ID:</strong> {report.reservation.id}</p>
                            <p><strong>Kamper:</strong> {report.reservation.vehicle.name}</p>
                            <p><strong>Data Oddania:</strong> {report.reportDate}</p>
                            <p><strong>Lokalizacja:</strong> {report.reservation.location}</p>
                            <p><strong>Stan przy Oddaniu:</strong> {report.pickUpCamperCondition}</p>
                            <Table hover>
                                <tbody>
                                    <tr>
                                        <td>Stan techniczny</td>
                                        <td>{report.technicalCondition}</td>
                                    </tr>
                                    <tr>
                                        <td>Stan wnętrza</td>
                                        <td>{report.interiorCondition}</td>
                                    </tr>
                                    <tr>
                                        <td>Stan wizulany</td>
                                        <td>{report.visualCondition}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <p><strong>Opis:</strong> {report.comment}</p>

                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </Container>
    );
};

export default AdminReports;
