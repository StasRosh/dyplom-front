import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminInsurances.css';

const AdminInsurances = () => {
    const { addInsurance, getAllInsurances, getAllCampers } = useContext(AuthContext);
    const [selectedCamper, setSelectedCamper] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceName, setInsuranceName] = useState('');
    const [campersData, setCampersData] = useState([]);
    const [insurancesData, setInsurancesData] = useState([]);

    async function getInsurancesData() {
        setInsurancesData(await getAllInsurances())
    }
    async function getCamperData() {
        setCampersData(await getAllCampers())
    }

    useEffect(() => {
        if (campersData.length === 0) {
            getCamperData();

        }
        if (insurancesData.length === 0) {
            getInsurancesData()
        }
    }, []
    );

    const handleAddInsurance = () => {
        if (!selectedCamper || !dateRange[0] || !dateRange[1] || !insuranceType || !insuranceName) {
            alert('Wszystkie pola muszą być wypełnione!');
            return;
        }

        const newInsurance = {
            vehicleId: selectedCamper,
            startDate: dateRange[0].toISOString().split('T')[0],
            endDate: dateRange[1].toISOString().split('T')[0],
            validUntil: dateRange[1].toISOString().split('T')[0],
            inspectionType: insuranceType,
            name: insuranceName,
        };

        addInsurance(newInsurance);
        setSelectedCamper('');
        setDateRange([null, null]);
        setInsuranceType('');
        setInsuranceName('');
        window.location.reload();
    };

    console.log("here")
    console.log(insurancesData)
    console.log(campersData)

    return (
        <div className="admin-insurances-container">
            <h2 className="title">Zarządzanie Ubezpieczeniami/Przeglądami Kamperów</h2>
            <div className="form-container">
                <h3>Dodaj Ubezpieczenie/Przegląd</h3>
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

                <label htmlFor="insurance-name">Nazwa Ubezpieczenia/Przeglądu:</label>
                <input
                    id="insurance-name"
                    type="text"
                    value={insuranceName}
                    onChange={(e) => setInsuranceName(e.target.value)}
                    placeholder="Wprowadź nazwę ubezpieczenia/Przeglądu"
                />

                <label htmlFor="insurance-type">Typ Ubezpieczenia/Przeglądu:</label>
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
                    <option value="INSPECTION">Przegląd</option>
                    <option value="OIL">Wymiana oleju</option>
                    <option value="OTHER">Inne</option>
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
                    Dodaj Ubezpieczenie/Przegląd
                </button>
            </div>

            <div className="insurance-list">
                <h3>Lista Ubezpieczeń/Przeglądów według Kamperów</h3>
                {campersData.map((camper) => (
                    <div key={camper.id} className="camper-insurances">
                        <h4>{camper.name}</h4>
                        <div className="insurance-list">
                            {insurancesData.map((insurance, index) =>
                                insurance.vehicle.id == camper.id ? (
                                    <div key={index} className={"insurance-card " + (Date.parse(insurance.validUntil) < Date.now() ? "warning": "")}>
                                        <p>
                                            <strong>Nazwa:</strong> {insurance.name}
                                        </p>
                                        <p>
                                            <strong>Typ:</strong> {insurance.inspectionType}
                                        </p>
                                        <p>
                                            <strong>Od:</strong> {insurance.startDate}
                                        </p>
                                        <p>
                                            <strong>Do:</strong> {insurance.validUntil}
                                        </p>
                                    </div>
                                ) : (
                                    ""
                                )
                            )}


                            {/* {insurancesData ? (
                                insurancesData.map((insurance, index) => (
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
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminInsurances;
