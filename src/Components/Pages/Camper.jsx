import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; 
import './Camper.css';
import kamper1 from './Image/image1.webp';
import kamper2 from './Image/image2.webp';
import kamper3 from './Image/image3.webp';
import headerImage from './Image/image6.jpeg';
import alkowa from './Campers/Image/Wybor/alkowa.svg';  // Dodajemy nowe ikony
import integra from './Campers/Image/Wybor/integra.svg';
import kampervan from './Campers/Image/Wybor/kampervan.svg';
import polintegra from './Campers/Image/Wybor/polintegra.svg';

// Przykładowe dane kamperów z kategoriami
const campersData = [
    { id: 1, name: 'Kamper A', description: 'Przestronny i komfortowy kamper.', price: 200, capacity: 4, category: 'alkowa', image: kamper1 },
    { id: 2, name: 'Kamper B', description: 'Idealny na rodzinne wakacje.', price: 250, capacity: 6, category: 'integra', image: kamper2 },
    { id: 3, name: 'Kamper C', description: 'Kompaktowy i łatwy w prowadzeniu.', price: 150, capacity: 2, category: 'kampervan', image: kamper3 },
];

const Camper = ({ setReservations }) => {
    const { isAuthenticated, currentUser } = useContext(AuthContext); 
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        location: '',
        guests: ''
    });
    const [selectedCategory, setSelectedCategory] = useState(''); // Dodajemy stan do wyboru kategorii
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // Ustawiamy wybraną kategorię
    };

    const handleReservation = (camper) => {
        if (!isAuthenticated) {
            navigate(`/camper/${camper.id}`);
        } else {
            const reservation = {
                id: new Date().getTime(),
                camper: camper.name,
                startDate: searchParams.startDate,
                endDate: searchParams.endDate,
                location: searchParams.location,
                guests: searchParams.guests,
                image: camper.image,
                userId: currentUser.id,
            };
            setReservations((prevReservations) => [...prevReservations, reservation]);
            navigate('/reservations');
        }
    };

    // Filtrujemy kampery według wybranej kategorii oraz innych parametrów
    const filteredCampers = campersData.filter(camper => 
        (!selectedCategory || camper.category === selectedCategory) &&
        (!searchParams.guests || camper.capacity >= Number(searchParams.guests)) &&
        (!searchParams.location || camper.description.toLowerCase().includes(searchParams.location.toLowerCase()))
    );

    return (
        <div className="camper-container">
            <div className="camper-header-container">
                <img src={headerImage} alt="Nagłówek" className="camper-header-image" />
            </div>
            <hr className="divider" />

            <form onSubmit={(e) => e.preventDefault()} className="camper-search-form">
                <div className="camper-search-bar">
                    <input
                        type="date"
                        name="startDate"
                        value={searchParams.startDate}
                        onChange={handleSearchChange}
                        className="camper-search-input"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={searchParams.endDate}
                        onChange={handleSearchChange}
                        className="camper-search-input"
                    />
                    <input
                        type="text"
                        name="location"
                        value={searchParams.location}
                        onChange={handleSearchChange}
                        placeholder="Lokalizacja"
                        className="camper-search-input"
                    />
                    <input
                        type="number"
                        name="guests"
                        value={searchParams.guests}
                        onChange={handleSearchChange}
                        placeholder="Ilość osób"
                        min="1"
                        className="camper-search-input"
                    />
                    <button type="submit" className="camper-search-button">Szukaj</button>
                </div>
                <hr className="divider" />
            </form>
            {/* Sekcja Przegląd wszystkich kamperów */}
            <div className="camper-category-container">
                <h3>Przegląd wszystkich kamperów</h3>
                <div className="camper-category-icons">
                    <img src={alkowa} alt="Alkowa" onClick={() => handleCategoryClick('alkowa')} className="category-icon" />
                    <img src={integra} alt="Integra" onClick={() => handleCategoryClick('integra')} className="category-icon" />
                    <img src={kampervan} alt="Kampervan" onClick={() => handleCategoryClick('kampervan')} className="category-icon" />
                    <img src={polintegra} alt="Polintegra" onClick={() => handleCategoryClick('polintegra')} className="category-icon" />
                </div>
            </div>

            <div className="camper-list">
                {filteredCampers.length === 0 ? (
                    <p>Brak dostępnych kamperów.</p>
                ) : (
                    <div className="camper-grid">
                        {filteredCampers.map(camper => (
                            <div key={camper.id} className="camper-card">
                                <img src={camper.image} alt={camper.name} className="camper-image" />
                                <h3>{camper.name}</h3>
                                <p>{camper.description}</p>
                                <p>Cena: {camper.price} zł/dzień</p>
                                <p>Ilość osób: {camper.capacity}</p>
                                <button
                                    onClick={() => handleReservation(camper)}
                                    className="camper-btn btn-primary">
                                    Zarezerwuj
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Camper;
