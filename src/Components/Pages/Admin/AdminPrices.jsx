import React, { useState, useEffect } from 'react';
import './Prices.css';

const AdminPrices = () => {
    const [prices, setPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newPrice, setNewPrice] = useState({
        weekendPrice: '',
        startDate: '',
        endDate: '',
    });

    // Załadowanie kamperów z localStorage lub utworzenie przykładowych danych
    useEffect(() => {
        const storedPrices = JSON.parse(localStorage.getItem('campers'));
        if (storedPrices && storedPrices.length > 0) {
            setPrices(storedPrices);
        } else {
            console.log('Brak kamperów w localStorage. Tworzenie przykładowych danych...');
            const exampleCampers = [
                {
                    id: 1,
                    name: 'Kamper Alkowa',
                    category: 'alkowa',
                    weekdayPrice: 200,
                    weekendPrice: 250,
                    priceChanges: [],
                },
                {
                    id: 2,
                    name: 'Kamper Integra',
                    category: 'integra',
                    weekdayPrice: 300,
                    weekendPrice: 350,
                    priceChanges: [],
                },
            ];
            localStorage.setItem('campers', JSON.stringify(exampleCampers));
            setPrices(exampleCampers);
        }
    }, []);

    // Wybór kategorii kampera
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        const selectedCamper = prices.find((camper) => camper.category === category);
        if (selectedCamper) {
            setNewPrice({
                weekendPrice: selectedCamper.weekendPrice,
                startDate: '',
                endDate: '',
            });
        } else {
            setNewPrice({
                weekendPrice: '',
                startDate: '',
                endDate: '',
            });
        }
    };

    // Obsługa zmian w formularzu
    const handleInputChange = (type, value) => {
        setNewPrice((prevPrice) => ({
            ...prevPrice,
            [type]: type.includes('Price') ? parseFloat(value) : value,
        }));
    };

    // Zapisanie nowych cen
    const handleSavePrices = () => {
        if (!newPrice.startDate || !newPrice.endDate) {
            alert('Proszę wypełnić zakres dat!');
            return;
        }

        const updatedPrices = prices.map((camper) =>
            camper.category === selectedCategory
                ? {
                      ...camper,
                      priceChanges: [
                          ...(Array.isArray(camper.priceChanges) ? camper.priceChanges : []),
                          {
                              weekendPrice: newPrice.weekendPrice,
                              startDate: newPrice.startDate,
                              endDate: newPrice.endDate,
                          },
                      ],
                  }
                : camper
        );

        setPrices(updatedPrices);
        localStorage.setItem('campers', JSON.stringify(updatedPrices));
        alert('Ceny zapisane!');
    };

    // Filtrowanie listy kamperów
    const filteredPrices = selectedCategory
        ? prices.filter((camper) => camper.category === selectedCategory)
        : prices;

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
                    <option value="">Wszystkie kategorie</option>
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
                        <label>Cena (weekend):</label>
                        <input
                            type="number"
                            value={newPrice.weekendPrice}
                            onChange={(e) => handleInputChange('weekendPrice', e.target.value)}
                            placeholder="Cena (weekend)"
                            min="1"
                        />
                    </div>
                    <div>
                        <label>Data początkowa:</label>
                        <input
                            type="date"
                            value={newPrice.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Data końcowa:</label>
                        <input
                            type="date"
                            value={newPrice.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                        />
                    </div>
                    <button onClick={handleSavePrices}>Zapisz zmiany</button>
                </div>
            )}

            {/* Lista kamperów */}
            <div className="camper-list">
                <h3>Lista kamperów</h3>
                {filteredPrices.length > 0 ? (
                    filteredPrices.map((camper) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}</h3>
                            <p>Kategoria: {camper.category}</p>
                            {/* Sprawdzamy, czy priceChanges jest tablicą i filtrujemy modyfikacje dla konkretnej daty */}
                            {Array.isArray(camper.priceChanges) && camper.priceChanges.length > 0 ? (
                                camper.priceChanges.map((change, index) => (
                                    <div key={index}>
                                        <p>
                                            Ceny od {change.startDate} do {change.endDate}:
                                        </p>
                                        <p>- Weekend: {change.weekendPrice} zł</p>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <p>Cena (weekend): {camper.weekendPrice} zł</p>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Brak kamperów dla wybranej kategorii.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPrices;
