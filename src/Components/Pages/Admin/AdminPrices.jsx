import React, { useState, useEffect } from 'react';
import './Prices.css'; // Dodaj plik CSS dla stylów

const AdminPrices = () => {
    const [prices, setPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newPrice, setNewPrice] = useState({
        weekdayPrice: '',
        weekendPrice: '',
    });

    // Załadowanie kamperów z localStorage
    useEffect(() => {
        const storedPrices = JSON.parse(localStorage.getItem('campers'));
        if (storedPrices && storedPrices.length > 0) {
            setPrices(storedPrices);
        } else {
            console.log('Brak kamperów w localStorage');
        }
    }, []);

    // Wybór kategorii kampera
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        const selectedCamper = prices.find((camper) => camper.category === category);
        if (selectedCamper) {
            setNewPrice({
                weekdayPrice: selectedCamper.weekdayPrice,
                weekendPrice: selectedCamper.weekendPrice,
            });
        } else {
            setNewPrice({
                weekdayPrice: '',
                weekendPrice: '',
            });
        }
    };

    // Zmiana ceny kampera
    const handlePriceChange = (type, value) => {
        setNewPrice((prevPrice) => ({
            ...prevPrice,
            [type]: parseFloat(value),
        }));
    };

    // Zapisanie nowych cen
    const handleSavePrices = () => {
        setPrices((prevPrices) =>
            prevPrices.map((camper) =>
                camper.category === selectedCategory
                    ? {
                          ...camper,
                          weekdayPrice: newPrice.weekdayPrice,
                          weekendPrice: newPrice.weekendPrice,
                      }
                    : camper
            )
        );
        localStorage.setItem('campers', JSON.stringify(prices));
    };

    return (
        <div className="prices-container">
            <h1>Ceny Kamperów</h1>

            {/* Wybór kategorii */}
            <div className="category-selection">
                <h3>Wybierz kategorię kampera</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => handleSelectCategory(e.target.value)}
                >
                    <option value="">Wybierz kategorię</option>
                    <option value="alkowa">Alkowa</option>
                    <option value="integra">Integra</option>
                    <option value="kampervan">Kampervan</option>
                    <option value="polintegra">Polintegra</option>
                </select>
            </div>

            {/* Edycja ceny kampera */}
            {selectedCategory && (
                <div className="price-edit">
                    <h3>Edytuj ceny dla kategorii: {selectedCategory}</h3>
                    <div>
                        <label>Cena (dzień tygodnia):</label>
                        <input
                            type="number"
                            value={newPrice.weekdayPrice}
                            onChange={(e) => handlePriceChange('weekdayPrice', e.target.value)}
                            placeholder="Cena (dzień tygodnia)"
                            min="1"
                        />
                    </div>
                    <div>
                        <label>Cena (weekend):</label>
                        <input
                            type="number"
                            value={newPrice.weekendPrice}
                            onChange={(e) => handlePriceChange('weekendPrice', e.target.value)}
                            placeholder="Cena (weekend)"
                            min="1"
                        />
                    </div>
                    <button onClick={handleSavePrices}>Zapisz zmiany</button>
                </div>
            )}

            {/* Lista kamperów */}
            <div className="camper-list">
                <h3>Lista kamperów</h3>
                {prices.length > 0 ? (
                    prices.map((camper) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}</h3>
                            <p>Kategoria: {camper.category}</p>
                            <p>Cena (dzień tygodnia): {camper.weekdayPrice} zł</p>
                            <p>Cena (weekend): {camper.weekendPrice} zł</p>
                        </div>
                    ))
                ) : (
                    <p>Brak kamperów w localStorage.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPrices;
