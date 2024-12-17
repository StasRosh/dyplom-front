import React, { useState, useEffect,useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import './Prices.css';

const AdminPrices = () => {
    const { getAllPrices,addPrice } = useContext(AuthContext);
    const [prices, setPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newPrice, setNewPrice] = useState({
        weekendPrice: '',
        startDate: '',
        endDate: '',
    });
    const [refresh,setRefresh] = useState(false)

    const Categories = ["","alkowa","integra","kampervan","polintegra"]



    // Załadowanie kamperów z localStorage lub utworzenie przykładowych danych
    useEffect(() => {
        async function getPrices() {
            setPrices(await getAllPrices())
        }
        getPrices();
    }, [refresh]);

    // Wybór kategorii kampera
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        const selectedCamper = prices.find((camper) => camper.vehicleType.name === category);
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
        const priceData = {
            price: newPrice.weekendPrice,
            start: newPrice.startDate,
            end: newPrice.endDate,
            vehicleTypeId: Categories.indexOf(selectedCategory)
          }

        addPrice(priceData);
           
        alert('Ceny zapisane!');
        setRefresh(!refresh)
    };

    // Filtrowanie listy kamperów
    const filteredPrices = selectedCategory
        ? prices.filter((camper) => camper.vehicleType.name === selectedCategory)
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
                        <label>Cena:</label>
                        <input
                            type="number"
                            value={newPrice.weekendPrice}
                            onChange={(e) => handleInputChange('weekendPrice', e.target.value)}
                            placeholder="Cena"
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
                <h3>Lista cen:</h3>
                {filteredPrices.length > 0 ? (
                    filteredPrices.map((camper,index) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}</h3>
                            <p>Kategoria: {camper.vehicleType.name}</p>
                            {/* Sprawdzamy, czy priceChanges jest tablicą i filtrujemy modyfikacje dla konkretnej daty */}
                                    <div key={index}>
                                        <p>
                                            Ceny od {camper.start} do {camper.end}:
                                        </p>
                                        <p>cena: {camper.price} zł</p>
                                    </div>
                                
                        </div>
                    ))
                ) : (
                    <p>Brak cen dla wybranej kategorii.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPrices;
