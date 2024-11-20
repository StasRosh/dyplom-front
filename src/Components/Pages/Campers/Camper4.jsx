import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthContext';
import './Camper1.css';
import kamper1Image from './Image/Camper4/camper4.webp';
import kamper2Image from './Image/Camper4/camper4-1.webp';
import kamper3Image from './Image/Camper4/camper4-2.webp';
import kamper4Image from './Image/Camper4/camper4-3.webp';
import Calendar from 'react-calendar';  // Importujemy react-calendar
import 'react-calendar/dist/Calendar.css';  // Importujemy stylowanie kalendarza

const Camper4 = () => {
    const { currentUser, addReservation, reservations, removeReservation } = useContext(AuthContext);
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState(1);
    const [reservationStatus, setReservationStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Funkcja pomocnicza do formatowania daty na string
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString();  // Zwraca datę w formacie dd/mm/yyyy
    };

    // Funkcja rezerwacji
    const handleReserve = () => {
        if (!currentUser) return navigate('/login');  // Sprawdzenie, czy użytkownik jest zalogowany
        if (!startDate || !endDate || !location || guests < 1) return setErrorMessage('Proszę wypełnić wszystkie pola.');
        if (new Date(startDate) < new Date() || new Date(endDate) < new Date() || new Date(startDate) >= new Date(endDate)) {
            return setErrorMessage('Kamper jest niedostępny w wybranym terminie.');
        }

        // Dodanie rezerwacji
        const newReservation = {
            id: Date.now(),
            userId: currentUser.id,
            image: kamper4Image, // Zdjęcie kampera
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            location,
            guests,
            camper: 'Kamper A'  // Nazwa kampera
        };

        addReservation(newReservation);  // Dodaj rezerwację do kontekstu
        setReservationStatus('Zarezerwowano!');
        setTimeout(() => setReservationStatus(''), 3000);  // Status rezerwacji na 3 sekundy
        navigate('/reservations');  // Przekierowanie na stronę rezerwacji
    };

    return (
        <div className="camper1-details">
            <h2>Kamper A</h2>
            <img src={kamper4Image} alt="Kamper A" className="camper1-detail-image" />
            <div className="camper1-gallery">
                <img src={kamper2Image} alt="Kamper A - 1" />
                <img src={kamper3Image} alt="Kamper A - 2" />
                <img src={kamper1Image} alt="Kamper A - 3" />
            </div>

            <div className="camper1-reservation-container">
                <div className="camper1-reservation-form-container">
                    <h3>Rezerwacja Kampera</h3>
                    <div className="form-control">
                        <label htmlFor="location">Lokalizacja:</label>
                        <input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Wpisz lokalizację"
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="guests">Liczba gości:</label>
                        <input
                            id="guests"
                            type="number"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            min="1"
                        />
                    </div>

                    {errorMessage && <p className="camper1-error-message">{errorMessage}</p>}
                </div>

                <div className="camper1-calendar-container">
                    <Calendar
                        onChange={([start, end]) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        value={[startDate, endDate]}
                        selectRange={true}
                        minDate={new Date()}
                    />
                </div>
            </div>

            <button onClick={handleReserve} className="camper1-btn-primary" disabled={!startDate || !endDate || !location || guests < 1}>
                Zarezerwuj
            </button>

            {reservationStatus && <p className="camper1-reservation-status">{reservationStatus}</p>}
        </div>
    );
};

export default Camper4;
