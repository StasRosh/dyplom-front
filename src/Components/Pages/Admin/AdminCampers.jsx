import React, { useState, useEffect } from 'react';
import './AdminCampers.css';

const AdminCampers = ({ campersData = [], setCampersData }) => {
    const [newCamper, setNewCamper] = useState({
        name: '',
        description: '',
        price: 0,
        capacity: 0,
        category: '',
        image: ''  // Dodanie pola na zdjęcie
    });

    const [editingCamper, setEditingCamper] = useState(null);

    // Załaduj kampery z localStorage, jeśli nie zostały przekazane przez props
    useEffect(() => {
        if (campersData.length === 0) {
            const savedCampers = JSON.parse(localStorage.getItem('campers')) || [];
            setCampersData(savedCampers);
        }
    }, [campersData, setCampersData]);

    // Obsługuje zmiany w formularzu dodawania nowego kampera
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCamper((prev) => ({ ...prev, [name]: value }));
    };

    // Obsługuje zmianę obrazu
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCamper((prev) => ({
                    ...prev,
                    image: reader.result // Zapisujemy obraz w base64
                }));
            };
            reader.readAsDataURL(file); // Czytanie obrazu jako base64
        }
    };

    // Dodawanie nowego kampera
    const handleAddCamper = () => {
        if (!newCamper.name || !newCamper.description || !newCamper.price || !newCamper.capacity || !newCamper.category || !newCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const newCamperData = {
            ...newCamper,
            id: new Date().getTime(),
        };
        setCampersData((prevData) => {
            const updatedCampers = [...prevData, newCamperData];
            localStorage.setItem('campers', JSON.stringify(updatedCampers));  // Zapisz w localStorage
            return updatedCampers;
        });
        setNewCamper({ name: '', description: '', price: 0, capacity: 0, category: '', image: '' }); // Resetujemy formularz
    };

    // Edytowanie kampera
    const handleEditCamper = (camper) => {
        setEditingCamper(camper);
    };

    // Zapisanie edytowanego kampera
    const handleSaveEdit = () => {
        if (!editingCamper.name || !editingCamper.description || !editingCamper.price || !editingCamper.capacity || !editingCamper.category || !editingCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const updatedCampers = campersData.map((camper) =>
            camper.id === editingCamper.id ? editingCamper : camper
        );
        setCampersData(updatedCampers);
        localStorage.setItem('campers', JSON.stringify(updatedCampers));  // Zapisz w localStorage
        setEditingCamper(null);
    };

    // Usuwanie kampera
    const handleDeleteCamper = (camperId) => {
        const updatedCampers = campersData.filter((camper) => camper.id !== camperId);
        setCampersData(updatedCampers);
        localStorage.setItem('campers', JSON.stringify(updatedCampers));  // Zapisz w localStorage
    };

    // Obsługuje zmiany w formularzu edycji kampera
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingCamper((prev) => ({ ...prev, [name]: value }));
    };

    // Obsługuje zmianę obrazu podczas edycji kampera
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingCamper((prev) => ({
                    ...prev,
                    image: reader.result // Zapisujemy obraz w base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-camper-container">
            <h2>Admin Panel: Zarządzanie Kamperami</h2>

            {/* Formularz dodawania nowego kampera */}
            <div className="admin-form">
                <h3>Dodaj nowego kampera</h3>
                <input
                    type="text"
                    name="name"
                    value={newCamper.name}
                    onChange={handleInputChange}
                    placeholder="Nazwa"
                />
                <input
                    type="text"
                    name="description"
                    value={newCamper.description}
                    onChange={handleInputChange}
                    placeholder="Opis"
                />
                <input
                    type="number"
                    name="price"
                    value={newCamper.price}
                    onChange={handleInputChange}
                    placeholder="Cena"
                    min="1"
                />
                <input
                    type="number"
                    name="capacity"
                    value={newCamper.capacity}
                    onChange={handleInputChange}
                    placeholder="Ilość osób"
                    min="1"
                />
                <select
                    name="category"
                    value={newCamper.category}
                    onChange={handleInputChange}
                >
                    <option value="">Wybierz kategorię</option>
                    <option value="Alkowa">Alkowa</option>
                    <option value="Integra">Integra</option>
                    <option value="Kampervan">Kampervan</option>
                    <option value="Polintegra">Polintegra</option>
                </select>
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                {newCamper.image && (
                    <img src={newCamper.image} alt="Podgląd zdjęcia" style={{ maxWidth: '200px', marginTop: '10px' }} />
                )}
                <button onClick={handleAddCamper}>Dodaj kampera</button>
            </div>

            <hr />

            {/* Formularz edycji kampera */}
            {editingCamper && (
                <div className="admin-form">
                    <h3>Edytuj kampera</h3>
                    <input
                        type="text"
                        name="name"
                        value={editingCamper.name}
                        onChange={handleEditChange}
                        placeholder="Nazwa"
                    />
                    <input
                        type="text"
                        name="description"
                        value={editingCamper.description}
                        onChange={handleEditChange}
                        placeholder="Opis"
                    />
                    <input
                        type="number"
                        name="price"
                        value={editingCamper.price}
                        onChange={handleEditChange}
                        placeholder="Cena"
                        min="1"
                    />
                    <input
                        type="number"
                        name="capacity"
                        value={editingCamper.capacity}
                        onChange={handleEditChange}
                        placeholder="Ilość osób"
                        min="1"
                    />
                    <select
                        name="category"
                        value={editingCamper.category}
                        onChange={handleEditChange}
                    >
                        <option value="Alkowa">Alkowa</option>
                        <option value="Integra">Integra</option>
                        <option value="Kampervan">Kampervan</option>
                        <option value="Polintegra">Polintegra</option>
                    </select>
                    <input
                        type="file"
                        onChange={handleEditImageChange}
                        accept="image/*"
                    />
                    {editingCamper.image && (
                        <img src={editingCamper.image} alt="Podgląd zdjęcia" style={{ maxWidth: '200px', marginTop: '10px' }} />
                    )}
                    <button onClick={handleSaveEdit}>Zapisz zmiany</button>
                    <button onClick={() => setEditingCamper(null)}>Anuluj</button>
                </div>
            )}

            {/* Lista kamperów */}
            <div className="camper-list">
                <h3>Lista kamperów</h3>
                {Array.isArray(campersData) && campersData.length > 0 ? (
                    campersData.map((camper) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}</h3>
                            <p>{camper.description}</p>
                            <p>Cena: {camper.price} zł/dzień</p>
                            <p>Ilość osób: {camper.capacity}</p>
                            <p>Kategoria: {camper.category}</p>
                            {camper.image && (
                                <img src={camper.image} alt="Zdjęcie kampera" style={{ maxWidth: '200px', marginTop: '10px' }} />
                            )}
                            <button onClick={() => handleEditCamper(camper)}>Edytuj</button>
                            <button onClick={() => handleDeleteCamper(camper.id)}>Usuń</button>
                        </div>
                    ))
                ) : (
                    <p>Brak dostępnych kamperów</p>
                )}
            </div>
        </div>
    );
};

export default AdminCampers;
