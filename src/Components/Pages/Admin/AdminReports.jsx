import React, { useState } from 'react';

const Reports = () => {
    const [reports, setReports] = useState([
        { id: 1, user: 'John Doe', camper: 'Camper 1', issueDate: '2023-11-01', returnDate: '2023-11-10', conditionOut: 'Good', conditionIn: 'Good' },
        { id: 2, user: 'Jane Smith', camper: 'Camper 2', issueDate: '2023-11-05', returnDate: '2023-11-12', conditionOut: 'Fair', conditionIn: 'Excellent' },
    ]);

    return (
        <div>
            <h1>Raporty Wydania i Zwrotu</h1>
            <table>
                <thead>
                    <tr>
                        <th>Użytkownik</th>
                        <th>Kamper</th>
                        <th>Data Wydania</th>
                        <th>Data Zwrotu</th>
                        <th>Stan (Wydanie)</th>
                        <th>Stan (Zwrot)</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id}>
                            <td>{report.user}</td>
                            <td>{report.camper}</td>
                            <td>{report.issueDate}</td>
                            <td>{report.returnDate}</td>
                            <td>{report.conditionOut}</td>
                            <td>{report.conditionIn}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
