import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import './Locations.css';
import { AuthContext } from '../../../Context/AuthContext';

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({ city: '', address: '' });
    const [refresh, setRefresh] = useState(false);
    const [editLocation, setEditLocation] = useState({});
    const [show, setShow] = useState(false);
    const { getAllLocations, addLocation, deleteLocation, updateLocation } = useContext(AuthContext);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        async function fetchLocations() {
            const locationsData = await getAllLocations();
            setLocations(locationsData);
        }
        fetchLocations();
    }, [refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLocation({ ...newLocation, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditLocation({ ...editLocation, [name]: value });
    };

    const handleAddLocation = async () => {
        if (!newLocation.city || !newLocation.address) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        await addLocation(newLocation);
        setRefresh(!refresh);
        setNewLocation({ city: '', address: '' });
    };

    const handleDeleteLocation = async (id) => {
        await deleteLocation(id);
        setRefresh(!refresh);
    };

    const saveEditedLocation = async () => {
        if (!editLocation.city || !editLocation.address) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }
        await updateLocation(editLocation.id,editLocation);
        handleClose();
        setRefresh(!refresh);
    };

    const handleEditLocation = (location) => {
        setEditLocation(location);
        handleShow();
    };

    return (
        <div className="locations-container">
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>Edytuj Lokalizację</Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        name="city"
                        value={editLocation.city}
                        onChange={handleEditInputChange}
                        placeholder="Miasto"
                    />
                    <input
                        type="text"
                        name="address"
                        value={editLocation.address}
                        onChange={handleEditInputChange}
                        placeholder="Adres"
                    />
                    <Button onClick={saveEditedLocation}>Zapisz</Button>
                </Modal.Body>
            </Modal>

            <h2 className="title">Zarządzanie Lokalizacjami</h2>
            <div className="locations-form-container">
                <input
                    type="text"
                    name="city"
                    value={newLocation.city}
                    onChange={handleInputChange}
                    placeholder="Miasto"
                />
                <input
                    type="text"
                    name="address"
                    value={newLocation.address}
                    onChange={handleInputChange}
                    placeholder="Adres"
                />
                <button onClick={handleAddLocation}>Dodaj Lokalizację</button>
            </div>

            <Table className="locations-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Miasto</th>
                        <th>Adres</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => (
                        <tr key={location.id}>
                            <td>{location.id}</td>
                            <td>{location.city}</td>
                            <td>{location.address}</td>
                            <td>
                                <Button
                                    onClick={() => handleDeleteLocation(location.id)}
                                >Usuń</Button>
                                <Button
                                    onClick={() => handleEditLocation(location)}
                                >Edytuj</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminLocations;
