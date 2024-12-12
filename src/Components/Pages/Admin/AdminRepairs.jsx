import React, { useState } from 'react';
import './Repairs.css';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const [newRepair, setNewRepair] = useState({ camper: '', date: '', description: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRepair({ ...newRepair, [name]: value });
    };

    const addRepair = () => {
        setRepairs([...repairs, { ...newRepair, id: repairs.length + 1 }]);
        setNewRepair({ camper: '', date: '', description: '' });
    };

    return (
        <div className="repairs-container">
            <h2 className="title">Zarządzanie Naprawami Kamperów</h2>
            <div className="repairs-form-container">
                <input
                    type="text"
                    name="camper"
                    placeholder="Kamper"
                    value={newRepair.camper}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="date"
                    value={newRepair.date}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Opis Naprawy"
                    value={newRepair.description}
                    onChange={handleInputChange}
                />
                <button onClick={addRepair}>Dodaj Naprawę</button>
            </div>
            <table className="repair-table">
                <thead>
                    <tr>
                        <th>Kamper</th>
                        <th>Data</th>
                        <th>Opis</th>
                    </tr>
                </thead>
                <tbody>
                    {repairs.map(repair => (
                        <tr key={repair.id}>
                            <td>{repair.camper}</td>
                            <td>{repair.date}</td>
                            <td>{repair.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Repairs;
