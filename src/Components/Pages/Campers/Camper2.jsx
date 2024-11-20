import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';  // Dodaj ten import na początku pliku
import LogIn from '../LogIn';  // Correct the path
import { AuthContext } from '../../../Context/AuthContext';
import './Camper1.css';
import kamper1Image from './Image/Camper2/model6-3.jpeg';
import kamper2Image from './Image/Camper2/model6-1.jpeg';
import kamper3Image from './Image/Camper2/model6-2.jpeg';
import kamper4Image from './Image/Camper2/kamper12.jpeg';
import camper12Image from './Image/Camper1/camper1-wn.webp';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importujemy stylowanie kalendarza

// Import ikon
import lozkoIcon from './Image/Dane techniczne/lozko2.svg';
import ludzikIcon from './Image/Dane techniczne/ludzik2.svg';
import snowIcon from './Image/Dane techniczne/snow.svg';
import truckIcon from './Image/Dane techniczne/truck.svg';
import waterIcon from './Image/Dane techniczne/water.svg';
import wysokoscIcon from './Image/Dane techniczne/wysokosc.svg';

const Camper2 = () => {
    const { currentUser, addReservation } = useContext(AuthContext);
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState('');
    const [guests, setGuests] = useState(1);
    const [reservationStatus, setReservationStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false); // Stan do pokazania modala logowania

    // Funkcja pomocnicza do formatowania daty na string
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString();  // Zwraca datę w formacie dd/mm/yyyy
    };

    // Funkcja rezerwacji
    const handleReserve = () => {
        // Sprawdzenie, czy użytkownik jest zalogowany
        if (!currentUser) {
            setShowLoginModal(true);  // Otwórz modal logowania, jeśli użytkownik nie jest zalogowany
            return;
        }

        // Sprawdzenie, czy wszystkie pola są wypełnione
        if (!startDate || !endDate || !location || guests < 1) {
            return setErrorMessage('Proszę wypełnić wszystkie pola.');
        }

        // Sprawdzenie, czy daty są poprawne (czy nie są w przeszłości oraz czy data końcowa jest po początkowej)
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
            {/* Modal logowania na górze ekranu */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Logowanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LogIn handleClose={() => setShowLoginModal(false)} />
                </Modal.Body>
            </Modal>

            <h2>Kamper A</h2>
            
            {/* Główne zdjęcie kampera */}
            <img src={kamper4Image} alt="" className="camper1-detail-image" />

            {/* Galeria zdjęć kampera */}
            <div className="camper1-gallery">
                <img src={kamper2Image} alt="Kamper A - 1" />
                <img src={kamper3Image} alt="Kamper A - 2" />
                <img src={kamper1Image} alt="Kamper A - 3" />
            </div>
            <hr className="divider" />

            {/* Sekcja tekstowa z opisem kampera */}
            <div className="camper1-text-section">
                {/* Pierwszy blok tekstowy z obrazkiem */}
                <div className="camper1-text-image">
                    <img src={kamper1Image} alt="Kamper 1" className="camper1-image" />
                    <div className="camper1-text">
                        <h3>Atrakcyjne wzornictwo i bezpieczna jazda</h3>
                        <p>
                        Kompleksowo wyposażony samochód kempingowy to nieograniczona swoboda podróżowania – zarówno w znane miejsca, 
                        jak też w odległe zakątki. Zwrotne kampervany Ecovip świetnie odnajdują się w mieście, jak również podczas dłuższych tras, 
                        w bardziej wymagającym terenie. Uniwersalny charakter tych nowoczesnych pojazdów powoduje, że modele proponowane przez włoską markę doskonale sprawdzają się jako kampery rodzinne. 
                        Wystarczy wyznaczyć miejsce na mapie – krajowe i zagraniczne atrakcje turystyczne są na wyciągnięcie ręki!
                        </p>
                        <p>
                        Praktyczna i komfortowa przestrzeń mieszkalna powstała z myślą o aktywnym spędzaniu wolnego czasu – po pracy, 
                        w weekendy, w okresie przeznaczonym na urlop i wakacyjne wyjazdy. W kampervanie Ecovip można poczuć się jak w domu – efektowne materiały meblowe, stylowa tapicerka i nastrojowe oświetlenie uprzyjemniają każdy etap podróży.
                        </p>
                    </div>
                </div>

                {/* Drugi blok tekstowy z obrazkiem (odwrócony układ) */}
                <div className="camper1-text-image reverse">
                    <div className="camper1-text">
                        <h3>Stylowe i praktyczne wyposażenie</h3>
                        <ul className="camper1-list">
                            <li><span className="arrow">→</span> ABS, ESC, ESR, asystent bocznego wiatru, system hamowania po kolizji</li>
                            <li><span className="arrow">→</span> Okna z ramą, roletą i moskitierą</li>
                            <li><span className="arrow">→</span> Ściany izolowane/tapicerowane</li>
                            <li><span className="arrow">→</span> Okna z podwójnymi szybami, roletami i moskitierami</li>
                            <li><span className="arrow">→</span> Podłoga i dach z wytrzymałego materiału XPS</li>
                            <li><span className="arrow">→</span> Ogrzewanie gazowe, rozprowadzające ciepło w całym wnętrzu (łącznie z kabiną kierowcy i garażem), z cyfrowym panelem sterowania</li>
                            <li><span className="arrow">→</span> Wewnętrzny zbiornik na wodę, z elektryczną pompą zanurzeniową</li>
                            <li><span className="arrow">→</span> Energooszczędne oświetlenie LED, w tym oświetlenie pośrednie pod blatem oraz w części przeznaczonej na szafki, regulowane lampki z gniazdami USB</li>
                            <li><span className="arrow">→</span> Liczne schowki do przechowywania w części dziennej i sypialnej</li>
                            <li><span className="arrow">→</span> Podwójna podłoga z dyskretnym światłem w strefie dziennej</li>
                            <li><span className="arrow">→</span> Salon wyposażony w ergonomiczne siedziska z zagłówkami oraz rozkładany stół</li>
                            <li><span className="arrow">→</span> Część kuchenna uwzgledniająca zlewozmywak ze stali nierdzewnej oraz kuchenkę 2 palnikową, lodówka kompresorowa</li>
                            <li><span className="arrow">→</span> łóżka wyposażone w antyroztoczowe materace z elastycznym pokrowcem (pokrowiec można zdjąć i wyprać)</li>
                            <li><span className="arrow">→</span> Aneks kuchenny z lodówką i 2-palnikową kuchenką</li>
                        </ul>
                    </div>
                    <img src={kamper2Image} alt="Kamper 2" className="camper1-image" />
                </div>
            </div>
            <hr className="divider" />

            {/* Sekcja cech kampera z ikonami */}
            <div className="camper1-features-container">
                <div className="camper1-features">
                    <div className="feature-item">
                    <img src={lozkoIcon} alt="Łóżko" className="feature-icon" />
                        <p>Wygodne łóżko</p>
                    </div>
                    <div className="feature-item">
                    <img src={ludzikIcon} alt="Liczba gości" className="feature-icon" />
                        <p>Dla 4 osób</p>
                    </div>
                    <div className="feature-item">
                    <img src={snowIcon} alt="Klimatyzacja" className="feature-icon" />
                        <p>Wbudowana klimatyzacja</p>
                    </div>
                    <div className="feature-item">
                    <img src={truckIcon} alt="Silnik" className="feature-icon" />
                        <p>Silnik 2.0 TDI</p>
                    </div>
                    <div className="feature-item">
                    <img src={waterIcon} alt="Woda" className="feature-icon" />
                        <p>Woda 122l</p>
                    </div>
                    <div className="feature-item">
                    <img src={wysokoscIcon} alt="Wysokość" className="feature-icon" />
                        <p>Wysokość 3,5m</p>
                    </div>
                </div>
                <div className="camper12-image-container">
                    <img src={camper12Image}alt="Kamper" className="camper12-image" />
                </div>
            </div>
            <hr className="divider" />
            {/* Sekcja rezerwacji */}
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

                    {/* Wyświetlanie błędów */}
                    {errorMessage && <p className="camper1-error-message">{errorMessage}</p>}
                </div>

                <div className="camper1-calendar-container">
                    <Calendar
                        onChange={(date) => {
                            setStartDate(date[0]);
                            setEndDate(date[1]);
                        }}
                        selectRange={true}
                    />
                </div>
            </div>

            {/* Przycisk do rezerwacji */}
            <button onClick={handleReserve} className="camper1-reserve-button">Rezerwuj</button>

            {/* Status rezerwacji */}
            {reservationStatus && <p className="camper1-reservation-status">{reservationStatus}</p>}
        </div>
    );
};

export default Camper2;
