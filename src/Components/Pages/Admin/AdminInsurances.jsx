import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminInsurances.css';

const AdminInsurances = ({ campersData = [] }) => {
    const { addInsurance, getInsurancesByCamperId } = useContext(AuthContext);
    const [selectedCamper, setSelectedCamper] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceName, setInsuranceName] = useState('');

    const handleAddInsurance = () => {
        if (!selectedCamper || !dateRange[0] || !dateRange[1] || !insuranceType || !insuranceName) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const newInsurance = {
            camperId: selectedCamper,
            startDate: dateRange[0].toISOString().split('T')[0],
            endDate: dateRange[1].toISOString().split('T')[0],
            type: insuranceType,
            name: insuranceName,
        };

        addInsurance(newInsurance);
        setSelectedCamper('');
        setDateRange([null, null]);
        setInsuranceType('');
        setInsuranceName('');
    };

    return (
        <div className="admin-insurances-container">
            <h2 className="title">Zarządzanie Ubezpieczeniami Kamperów</h2>

            <div className="form-container">
                <h3>Dodaj Ubezpieczenie</h3>
                <label htmlFor="camper-select">Wybierz Kampera:</label>
                <select
                    id="camper-select"
                    value={selectedCamper}
                    onChange={(e) => setSelectedCamper(e.target.value)}
                >
                    <option value="">Wybierz...</option>
                    {campersData.map((camper) => (
                        <option key={camper.id} value={camper.id}>
                            {camper.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="insurance-name">Nazwa Ubezpieczenia:</label>
                <input
                    id="insurance-name"
                    type="text"
                    value={insuranceName}
                    onChange={(e) => setInsuranceName(e.target.value)}
                    placeholder="Wprowadź nazwę ubezpieczenia"
                />

                <label htmlFor="insurance-type">Typ Ubezpieczenia:</label>
                <select
                    id="insurance-type"
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                >
                    <option value="">Wybierz typ...</option>
                    <option value="OC">OC</option>
                    <option value="AC">AC</option>
                    <option value="NNW">NNW</option>
                    <option value="Assistance">Assistance</option>
                </select>

                <div className="calendar-container">
                    <h4>Wybierz Zakres Dat:</h4>
                    <Calendar
                        onChange={(range) => setDateRange(range)}
                        selectRange={true}
                        value={dateRange}
                    />
                    {dateRange[0] && dateRange[1] && (
                        <div className="selected-dates">
                            <p>
                                <strong>Od:</strong> {dateRange[0].toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Do:</strong> {dateRange[1].toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>

                <button className="add-button" onClick={handleAddInsurance}>
                    Dodaj Ubezpieczenie
                </button>
            </div>

            <div className="insurance-list">
                <h3>Lista Ubezpieczeń według Kamperów</h3>
                {campersData.map((camper) => (
                    <div key={camper.id} className="camper-insurances">
                        <h4>{camper.name}</h4>
                        <div className="insurance-list">
                            {getInsurancesByCamperId(camper.id).length > 0 ? (
                                getInsurancesByCamperId(camper.id).map((insurance, index) => (
                                    <div key={index} className="insurance-card">
                                        <p>
                                            <strong>Nazwa:</strong> {insurance.name}
                                        </p>
                                        <p>
                                            <strong>Typ:</strong> {insurance.type}
                                        </p>
                                        <p>
                                            <strong>Od:</strong> {insurance.startDate}
                                        </p>
                                        <p>
                                            <strong>Do:</strong> {insurance.endDate}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-insurances">Brak ubezpieczeń dla tego kampera.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminInsurances;
