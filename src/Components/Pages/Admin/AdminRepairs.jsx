import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import './Repairs.css';
import { AuthContext } from '../../../Context/AuthContext';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const [newRepair, setNewRepair] = useState({});
    const [campers, setCampers] = useState([]);
    const {getAllCampers, getAllRepairs, addRepair, deleteRepair, updateRepair} = useContext(AuthContext)
    const [refresh, setRefresh] = useState(false);
    const [editRepair, setEditRepair] = useState({});
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    useEffect(()=>{
        async function getCampers() {
            setCampers(await getAllCampers());
        }
        async function getRepairs() {
            setRepairs(await getAllRepairs())
        }
        getRepairs()
        getCampers()

    },[refresh])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRepair({ ...newRepair, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditRepair({ ...editRepair, [name]: value });
    };


    const handleAddRepair = async() => {
        console.log("add repair:")
        console.log(newRepair)
        await addRepair(newRepair)

        // setRepairs([...repairs, { ...newRepair, id: repairs.length + 1 }]);
        setRefresh(!refresh)
        setNewRepair({});
    };

    const handleDeleteRepair = async(id) =>{
        console.log(id)
        await deleteRepair(id)
        setRefresh(!refresh)

    }
    
    const saveEditedRepair = async(data) =>{
        console.log("save edited repair:")
        console.log(data)
        await updateRepair(data)
        handleClose()
        setRefresh(!refresh)

    }

    const handleEditRepair = (id,data) =>{
        console.log(id)
        setEditRepair(data)
        handleShow();
    }
    

    return (
        <div className="repairs-container">
            <Modal
            show={show}
            onHide={handleClose}
            >
                <Modal.Header closeButton>Edytuj naprawe {editRepair.vehicleName}</Modal.Header>
                <Modal.Body>

                <input
                    type="text"
                    hidden
                    disabled
                    name="vehicleId"
                    onChange={handleEditInputChange}
                    value={editRepair.vehicleId}
                />
                
                <input
                    type="date"
                    name="startDate"
                    onChange={handleEditInputChange}
                    value={editRepair.startDate}
                />
                <input
                    type="date"
                    name="endDate"
                    onChange={handleEditInputChange}
                    value={editRepair.endDate}
                />
                <input
                    type="text"
                    name="name"
                    onChange={handleEditInputChange}
                    placeholder="Opis Naprawy"
                    value={editRepair.name}
                />
                <Button onClick={() => {saveEditedRepair(editRepair)}}>
                    Zapisz
                </Button>
                </Modal.Body>

            </Modal>
            <h2 className="title">Zarządzanie Naprawami Kamperów</h2>
            <div className="repairs-form-container">
                <select 
                name='vehicleId'
                value={newRepair.vehicleId}
                onChange={handleInputChange}
                placeholder="Kamper"
                >
                    {
                        campers.map((camper)=>{
                            return <option value={camper.id}>{camper.name}</option>
                        })
                    }
                </select>
                
                <input
                    type="date"
                    name="startDate"
                    value={newRepair.startDate}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={newRepair.endDate}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Opis Naprawy"
                    value={newRepair.name}
                    onChange={handleInputChange}
                />
                <button onClick={handleAddRepair}>Dodaj Naprawę</button>
            </div>
            <table className="repair-table">
                <thead>
                    <tr>
                        <th>Kamper</th>
                        <th>Data początkowa</th>
                        <th>Data końcowa</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>
                    {repairs.map(repair => (
                        <tr key={repair.id}>
                            <td>{repair.vehicle.name}</td>
                            <td>{repair.startDate}</td>
                            <td>{repair.endDate}</td>
                            <td>{repair.name}</td>
                            <td><Button
                                onClick={() => handleDeleteRepair(repair.id)}
                            >Usuń</Button>
                                <Button
                                onClick={() => handleEditRepair(repair.id,{
                                    id: repair.id,
                                    vehicleId: repair.vehicle.id,
                                    vehicleName: repair.vehicle.name,
                                    startDate: repair.startDate,
                                    endDate: repair.endDate,
                                    name: repair.name
                                })}
                                >
                                    Edytuj
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Repairs;
