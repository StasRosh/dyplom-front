import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import './Contact.css';
import image1 from './Image/img2.jpeg';

// Ustawienie ikony markera
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Contact = () => {
    const position = [51.246418, 22.563740];

    return (
        <div className="contact-container">
            <img src={image1} alt="Contact" className="contact-image" />
            <h1>KONTAKT</h1>
            <p>
                Specjalizujemy się w sprzedaży kamperów oraz przyczep kempingowych z grupy Hymer.
                Proponujemy profesjonalne doradztwo w zakupie na każdym etapie. Od wyboru modelu,
                przez skonfigurowanie akcesoriów i doposażenia, po finansowanie i serwisowanie.
            </p>
            <hr className="divider" />
            <h2>Skontaktuj się z nami</h2>
            <form className="form-container">
                <div className="form-group">
                    <label htmlFor="name">Imię:</label>
                    <input type="text" id="name" className="form-control" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" className="form-control" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Wiadomość:</label>
                    <textarea id="message" className="form-control" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Wyślij wiadomość</button>
            </form>
            <div className="social-icons">
                <a href="mailto:your-email@example.com" aria-label="Email" className="social-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
            </div>
            <div className="map-container">
                <MapContainer center={position} zoom={15} style={{ height: "50vh", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                        <Popup>
                            Nadbystrzycka 38A, Lublin
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <hr className="divider" />
        </div>
    );
};

export default Contact;
