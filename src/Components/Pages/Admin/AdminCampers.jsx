import React, { useState, useEffect } from 'react';
import './AdminCampers.css';

const AdminCampers = ({ campersData = [], setCampersData }) => {
    const [newCamper, setNewCamper] = useState({
        name: '',
        description: '',
        weekdayPrice: '',
        weekendPrice: '',
        capacity: '',
        category: '',
        image: ''
    });

    const [editingCamper, setEditingCamper] = useState(null);

    useEffect(() => {
        const savedCampers = JSON.parse(localStorage.getItem('campers')) || [];
        setCampersData(savedCampers);
    }, [setCampersData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCamper((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCamper((prev) => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCamper = () => {
        if (!newCamper.name || !newCamper.description || !newCamper.weekdayPrice || !newCamper.weekendPrice || !newCamper.capacity || !newCamper.category || !newCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const newCamperData = {
            ...newCamper,
            id: new Date().getTime(),
        };
        const updatedCampers = [...campersData, newCamperData];
        setCampersData(updatedCampers);
        localStorage.setItem('campers', JSON.stringify(updatedCampers));
        setNewCamper({ name: '', description: '', weekdayPrice: '', weekendPrice: '', capacity: '', category: '', image: '' });
    };

    const handleEditCamper = (camper) => {
        setEditingCamper(camper);
    };

    const handleSaveEdit = () => {
        if (!editingCamper.name || !editingCamper.description || !editingCamper.weekdayPrice || !editingCamper.weekendPrice || !editingCamper.capacity || !editingCamper.category || !editingCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const updatedCampers = campersData.map((camper) =>
            camper.id === editingCamper.id ? editingCamper : camper
        );
        setCampersData(updatedCampers);
        localStorage.setItem('campers', JSON.stringify(updatedCampers));
        setEditingCamper(null);
    };

    const handleDeleteCamper = (camperId) => {
        const updatedCampers = campersData.filter((camper) => camper.id !== camperId);
        setCampersData(updatedCampers);
        localStorage.setItem('campers', JSON.stringify(updatedCampers));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingCamper((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingCamper((prev) => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-camper-container">
            <h2>Zarządzanie Kamperami</h2>

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
                    name="weekdayPrice"
                    value={newCamper.weekdayPrice}
                    onChange={handleInputChange}
                    placeholder="Cena (dzień tygodnia)"
                    min="1"
                />
                <input
                    type="number"
                    name="weekendPrice"
                    value={newCamper.weekendPrice}
                    onChange={handleInputChange}
                    placeholder="Cena (weekend)"
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
                    <option value="alkowa">Alkowa</option>
                    <option value="integra">Integra</option>
                    <option value="kampervan">Kampervan</option>
                    <option value="polintegra">Polintegra</option>
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
                        name="weekdayPrice"
                        value={editingCamper.weekdayPrice}
                        onChange={handleEditChange}
                        placeholder="Cena (dzień tygodnia)"
                        min="1"
                    />
                    <input
                        type="number"
                        name="weekendPrice"
                        value={editingCamper.weekendPrice}
                        onChange={handleEditChange}
                        placeholder="Cena (weekend)"
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
                        <option value="alkowa">Alkowa</option>
                        <option value="integra">Integra</option>
                        <option value="kampervan">Kampervan</option>
                        <option value="polintegra">Polintegra</option>
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

            <div className="camper-list">
                <h3>Lista kamperów</h3>
                {Array.isArray(campersData) && campersData.length > 0 ? (
                    campersData.map((camper) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}</h3>
                            <p>{camper.description}</p>
                            <p>Cena (dzień tygodnia): {camper.weekdayPrice} zł</p>
                            <p>Cena (weekend): {camper.weekendPrice} zł</p>
                            <p>Ilość osób: {camper.capacity}</p>
                            <p>Kategoria: {camper.category}</p>
                            {camper.image && (
                                <img src={camper.image} alt="Zdjęcie kampera" style={{ maxWidth: '100px' }} />
                            )}
                            <button onClick={() => handleEditCamper(camper)}>Edytuj</button>
                            <button onClick={() => handleDeleteCamper(camper.id)}>Usuń</button>
                        </div>
                    ))
                ) : (
                    <p>Brak kamperów.</p>
                )}
            </div>
        </div>
    );
};

export default AdminCampers;
