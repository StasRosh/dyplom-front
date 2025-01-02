import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import './Reservations.css';
import headerImage from './Image/img1.jpeg';
import axios from 'axios';
import Cookies from 'js-cookie'



const Reservations = () => {
    const { reservations,addReservation, resignReservation, acceptReservation, getReservations } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userReservations, setUserReservations] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Wyświetlenie rezerwacji tylko dla zalogowanego użytkownika
    // const userReservations = reservations.filter(reservation => reservation.userId === currentUser?.id);
    // console.log("Rezerwacje dla użytkownika", currentUser?.id, ":", userReservations);
    

    useEffect(() => {
        getAllReservations()
    },[refresh]);

    // Funkcja do usuwania rezerwacji
    const handleResign = async (id) => {
        var res = await resignReservation(id)
        if(res != 'Success'){
            alert(res)
        }
        setRefresh(!refresh);
    };
    const getAllReservations = () => {
        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };
        if(Cookies.get('user_id') != null){
        axios.get("http://localhost:8080/reservation/"+Cookies.get("user_id"), config)
        .then((res)=>{
            console.log("reservations:")
            setUserReservations(res.data)
            console.log(res.data)
            return res.data;
        }).catch((err)=>{
            console.log(err)
        })        
      }
    }

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

    // Jeśli użytkownik nie jest zalogowany, wyświetlamy komunikat
    if (!Cookies.get("user_id")) {
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
                            <h3>{reservation.vehicle.name}</h3>
                            {reservation.vehicle.imageLink ? (
                                <div className="reservation-image-container">
                                    <img
                                        src={reservation.vehicle.imageLink}
                                        alt={`Zdjęcie kampera: ${reservation.vehicle.name}`}
                                        className="reservation-image"
                                    />
                                </div>
                            ) : (
                                <p>Brak zdjęcia</p>
                            )}
                            <p>
                                Termin: <strong>{reservation.start} - {reservation.end}</strong>
                            </p>
                            <p>Lokalizacja: {reservation.location.city? reservation.location.address+" "+reservation.location.city : reservation.location}</p>
                            <p>Status: {reservation.order.orderStatus}</p>
                            <p>Koszt: {reservation.order.totalCost}</p>
                            <Button
                                onClick={() => handleOpenModal(reservation)}
                                className="btn btn-secondary"
                            >
                                Zobacz Szczegóły
                            </Button>
                            {reservation.order.orderStatus == "PENDING" ? 
                            <Button
                            onClick={() => handleResign(reservation.id)}
                            className="btn btn-danger"
                        >
                            Zrezygnuj z rezerwacji
                        </Button> :
                        ""}
                            
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
                        <p><strong>Data rozpoczęcia:</strong> {selectedReservation.start}</p>
                        <p><strong>Data zakończenia:</strong> {selectedReservation.end}</p>
                        <p><strong>Lokalizacja:</strong> {selectedReservation.location.address+" "+selectedReservation.location.city}</p>
                        <p><strong>Status:</strong> {selectedReservation.order.orderStatus}</p>
                        <p><strong>Koszt:</strong> {selectedReservation.order.totalCost}</p>

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
