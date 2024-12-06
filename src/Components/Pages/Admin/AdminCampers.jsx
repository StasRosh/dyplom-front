import React, { useState, useEffect, useContext } from 'react';
import './AdminCampers.css';
import { AuthContext } from '../../../Context/AuthContext';

const AdminCampers = () => {
    const [newCamper, setNewCamper] = useState({
        name: '',
        description: '',
        price: 0,
        capacity: 0,
        vehicleTypeId: '',
        image: ''  // Dodanie pola na zdjęcie
    });
    const { getAllCampers,addCamper,deleteCamper,updateCamper } = useContext(AuthContext);

    const [editingCamper, setEditingCamper] = useState(null);
    const [campersData, setCampersData] = useState([]);

    useEffect(() => {
        async function getCamperData() {
            setCampersData(await getAllCampers())
        }
        if (campersData.length === 0) {
            getCamperData();

        }
    }, [campersData, setCampersData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCamper((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {

        setNewCamper((prev) => ({
            ...prev,
            image: e.target.value // Zapisujemy obraz w base64
        }));
        // const file = e.target.files[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         setNewCamper((prev) => ({
        //             ...prev,
        //             image: reader.result // Zapisujemy obraz w base64
        //         }));
        //     };
        //     reader.readAsDataURL(file); // Czytanie obrazu jako base64
        // }
    
    };

    const handleAddCamper = () => {
        if (!newCamper.name || !newCamper.description || !newCamper.price || !newCamper.capacity || !newCamper.vehicleTypeId || !newCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const newCamperData = {
            name: newCamper.name,
            vehicleStatus: "AVAILABLE",
            imageLink: newCamper.image,
            vehicleTypeId: newCamper.vehicleTypeId,
            id: 0,
            comment: "string",
            description: newCamper.description
          }
        addCamper(newCamperData);
        setNewCamper({ name: '', description: '', price: 0, capacity: 0, vehicleTypeId: '', image: '' }); // Resetujemy formularz
    };

    const handleEditCamper = (camper) => {
        setEditingCamper(camper);
    };

    const handleSaveEdit = () => {

        if (!editingCamper.name || !editingCamper.description || !editingCamper.price || !editingCamper.capacity || !editingCamper.vehicleTypeId || !editingCamper.imageLink) {
            alert('Wszystkie pola muszą być wypełnione!');
            console.log(editingCamper)
            return;
        }

        console.log(editingCamper)
        
        updateCamper(editingCamper)

        setEditingCamper(null);
    };

    const handleDeleteCamper = (camperId) => {
        deleteCamper(camperId)
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingCamper((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditImageChange = (e) => {

        setEditingCamper((prev) => ({
            ...prev,
            imageLink: e.target.value // Zapisujemy obraz w base64
        }));

        // const file = e.target.files[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         setEditingCamper((prev) => ({
        //             ...prev,
        //             image: reader.result // Zapisujemy obraz w base64
        //         }));
        //     };
        //     reader.readAsDataURL(file);
        // }
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
                    name="vehicleTypeId"
                    value={newCamper.vehicleTypeId}
                    onChange={handleInputChange}
                >
                    <option value="">Wybierz kategorię</option>
                    <option value="1">Alkowa</option>
                    <option value="2">Integra</option>
                    <option value="3">Kampervan</option>
                    <option value="4">Polintegra</option>
                </select>
                {/* <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                /> */}
                <input type="text" onChange={handleImageChange} />
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
                        name="vehicleTypeId"
                        value={editingCamper.vehicleTypeId}
                        onChange={handleEditChange}
                    >
                        <option value="1">Alkowa</option>
                        <option value="2">Integra</option>
                        <option value="3">Kampervan</option>
                        <option value="4">Polintegra</option>
                    </select>
                    {/* <input
                        type="file"
                        onChange={handleEditImageChange}
                        accept="image/*"
                    /> */}
                    <input type="text" onChange={handleEditImageChange} />
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
                            <h3>{camper.name}  [{camper.id}]</h3>
                            <p>{camper.description}</p>
                            {/* <p>Cena: {camper.price} zł/dzień</p> */}
                            <p>Ilość osób: {camper.capacity}</p>
                            <p>Kategoria: {camper.vehicleType.name}</p>
                            {camper.imageLink && (
                                <img src={camper.imageLink} alt="Zdjęcie kampera" style={{ maxWidth: '200px', marginTop: '10px' }} />
                            )}
                            <br/>
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
