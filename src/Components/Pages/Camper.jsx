import React, { useContext, useState, useEffect, useMountEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; 
import './Camper.css';
import kamper1 from './Image/image1.webp';
import kamper2 from './Image/image2.webp';
import kamper3 from './Image/image3.webp';
import kamper4 from './Campers/Image/Camper4/camper4.webp';
import headerImage from './Image/image6.jpeg';
import alkowa from './Campers/Image/Wybor/alkowa.svg'; 
import integra from './Campers/Image/Wybor/integra.svg';
import kampervan from './Campers/Image/Wybor/kampervan.svg';
import polintegra from './Campers/Image/Wybor/polintegra.svg';
import axios from 'axios';



const Camper = ({ setReservations }) => {
    const { isAuthenticated, currentUser } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        location: '',
        guests: ''
    });
    const [selectedCategory, setSelectedCategory] = useState('');

    const navigate = useNavigate();

    const [campersData, setCampersData] = useState([])

    useEffect(() => {
        axios.get("http://localhost:8080/vehicle/all")
        .then((res)=>{
            console.log(res)
            setCampersData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
      },[]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleSearch = (e) =>{
        e.preventDefault();
        // console.log(searchParams)
        axios.get('http://localhost:8080/reservation/find?begining='+searchParams.startDate+'&end='+searchParams.endDate)
        .then((res)=>{
            console.log(res)
            setCampersData(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

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
                price: getPrice(camper) // Dodaj dynamiczną cenę do rezerwacji
            };
            setReservations((prevReservations) => [...prevReservations, reservation]);
            navigate('/reservations');
        }
    };

    const filteredCampers = campersData.filter(camper => 
        (!selectedCategory || camper.vehicleType.name === selectedCategory) &&
        (!searchParams.guests || camper.capacity >= Number(searchParams.guests)) &&
        (!searchParams.location || camper.description.toLowerCase().includes(searchParams.location.toLowerCase()))
    );

    return (
        <div className="camper-container">
            <div className="camper-header-container">
                <img src={headerImage} alt="Nagłówek" className="camper-header-image" />
            </div>
            <hr className="divider" />

            <form onSubmit={handleSearch} className="camper-search-form">
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

            <div className="camper-category-container">
                <h3>Przegląd wszystkich kamperów</h3>
                <div className="camper-category-icons">
                    <div className="category-item" onClick={() => handleCategoryClick('alkowa')}>
                        <img src={alkowa} alt="Alkowa" className="category-icon" />
                        <span>Alkowa</span>
                    </div>
                    <div className="category-item" onClick={() => handleCategoryClick('integra')}>
                        <img src={integra} alt="Integra" className="category-icon" />
                        <span>Integra</span>
                    </div>
                    <div className="category-item" onClick={() => handleCategoryClick('kampervan')}>
                        <img src={kampervan} alt="Kampervan" className="category-icon" />
                        <span>Kampervan</span>
                    </div>
                    <div className="category-item" onClick={() => handleCategoryClick('polintegra')}>
                        <img src={polintegra} alt="Polintegra" className="category-icon" />
                        <span>Polintegra</span>
                    </div>
                </div>
            </div>

            <div className="camper-list">
                {filteredCampers.length === 0 ? (
                    <p>Brak dostępnych kamperów.</p>
                ) : (
                    <div className="camper-grid">
                        {filteredCampers.map(camper => (
                            <div key={camper.id} className="camper-card">
                                <img src={camper.imageLink} alt={camper.name} className="camper-image" />
                                <h3>{camper.name}</h3>
                                <p>{camper.description}</p>
                                <p>
                                    Cena: {getPrice(camper)} zł/dzień 
                                    ({isWeekend() ? 'Weekend' : 'Dzień tygodnia'})
                                </p>
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
