import React from 'react';
import './Footer.css'; 

const Footer = () => {
    return (
        <div className="contact-info">
            <div className="column">
            <h2>Wynajem kamperów</h2>
                <p>Anastazja: 792 632 632</p>
                <p>Dawid 794 400 210</p>
                <p>Maria 792 306 306</p>
            </div>
            <div className="separator"></div>

            <div className="column">
                <h2>Oddział Lublin</h2>
                <p>ul. Nadbystrzycka 36A</p>
            </div>
        </div>
    );
};

export default Footer;
