import React, { useState, useEffect, useContext } from 'react';
import './AdminCampers.css';
import { AuthContext } from '../../../Context/AuthContext';
import { Modal } from 'react-bootstrap';

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

    const [editingCamper, setEditingCamper] = useState({ name: '', description: '', comment: '', vehicleTypeId: '', image: '' });
    const [campersData, setCampersData] = useState([]);
    const [editModal, setEditModal] = useState(false);

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

    const handleAddCamper = async() => {
        if (!newCamper.name || !newCamper.description || !newCamper.comment || !newCamper.vehicleTypeId || !newCamper.image) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        const newCamperData = {
            name: newCamper.name,
            vehicleStatus: "AVAILABLE",
            imageLink: newCamper.image,
            vehicleTypeId: newCamper.vehicleTypeId,
            id: 0,
            comment: newCamper.comment,
            description: newCamper.description
          }
        await addCamper(newCamperData);
        setNewCamper({ name: '', description: '', comment: '', vehicleTypeId: '', image: '' }); // Resetujemy formularz
        setCampersData([]);
    };

    const handleEditCamper = (camper) => {
        camper.vehicleTypeId = camper.vehicleType.id
        setEditingCamper(camper);
        setEditModal(true)
    };

    const handleSaveEdit = async() => {

        if (!editingCamper.name || !editingCamper.description ||!editingCamper.comment || !editingCamper.vehicleTypeId || !editingCamper.imageLink) {
            alert('Wszystkie pola muszą być wypełnione!');
            console.log(editingCamper)
            return;
        }

        console.log(editingCamper)
        
        await updateCamper(editingCamper)

        // setEditingCamper(null);
        setEditModal(false)
        setCampersData([]);
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
                    type="text"
                    name="comment"
                    value={newCamper.comment}
                    onChange={handleInputChange}
                    placeholder="Komentarz"
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
                <input type="text" onChange={handleImageChange} placeholder='Link do zdjęcia' />
                {newCamper.image && (
                    <img src={newCamper.image} alt="Podgląd zdjęcia" style={{ maxWidth: '200px', marginTop: '10px' }} />
                )}
                <button onClick={handleAddCamper}>Dodaj kampera</button>
            </div>

            <hr />

            <Modal show={editModal}>
                <Modal.Body>
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
                        type="text"
                        name="comment"
                        value={editingCamper.comment}
                        onChange={handleEditChange}
                        placeholder="Komentarz"
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
                    <input type="text" placeholder='Link do zdjęcia' onChange={handleEditImageChange} />
                    {editingCamper.imageLink && (
                        <img src={editingCamper.imageLink} alt="Podgląd zdjęcia" style={{ maxWidth: '200px', marginTop: '10px' }} />
                    )}
                    <button onClick={handleSaveEdit}>Zapisz zmiany</button>
                    <button onClick={() => setEditModal(false)}>Anuluj</button>
                </div>
            
            </Modal.Body>
            </Modal>

            <div className="camper-list">
                <h3>Lista kamperów</h3>
                {Array.isArray(campersData) && campersData.length > 0 ? (
                    campersData.map((camper) => (
                        <div key={camper.id} className="camper-card">
                            <h3>{camper.name}  [{camper.id}]</h3>
                            <p>{camper.description}</p>
                            {/* <p>Cena: {camper.price} zł/dzień</p> */}
                            <p>Komentarz: {camper.comment}</p>
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
