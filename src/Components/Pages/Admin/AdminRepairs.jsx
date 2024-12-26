import React, { useContext, useEffect, useState } from 'react';
import './Repairs.css';
import { AuthContext } from '../../../Context/AuthContext';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const [newRepair, setNewRepair] = useState({ camper: '', date: '', description: '' });
    const [campers, setCampers] = useState([]);
    const {getAllCampers, getAllRepairs, addRepair} = useContext(AuthContext)
    const [refresh, setRefresh] = useState(false);

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

    const handleAddRepair = () => {
        console.log(newRepair)
        addRepair(newRepair)

        // setRepairs([...repairs, { ...newRepair, id: repairs.length + 1 }]);
        setRefresh(!refresh)
        setNewRepair({ camper: '', date: '', description: '' });
    };
    

    return (
        <div className="repairs-container">
            <h2 className="title">Zarządzanie Naprawami Kamperów</h2>
            <div className="repairs-form-container">
                <select 
                name='camperid'
                value={newRepair.camperId}
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
                    name="description"
                    placeholder="Opis Naprawy"
                    value={newRepair.description}
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Repairs;
