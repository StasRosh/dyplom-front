import React, { useEffect, useState } from 'react';
import './Home.css';
import image1 from './Image/kamper1.jpeg';
import image2 from './Image/kamper2.jpeg';
import image3 from './Image/kamper5.jpeg';
import image4 from './Image/kamper10.png';

const images = [image1, image2, image3, image4];

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Zmiana co 3 sekundy

        return () => clearInterval(interval); // Czyszczenie interwału przy odmontowywaniu
    }, []);

    return (
        <div className="home-container">
            <header className="hero-section">
                <img
                    src={images[currentImageIndex]}
                    alt={`Kamper ${currentImageIndex + 1}`}
                    className="hero-image"
                />
                <div className="hero-text">
                    <h1>Witamy w GoCamper!</h1>
                    <p>Twoje miejsce na przygody kamperowe.</p>
                </div>
            </header>

            <section className="about-section">
                <h2>O nas</h2>
                <p>
                    Specjalizujemy się w sprzedaży oraz wynajmie kamperów i przyczep kempingowych.
                    Nasza misja to dostarczanie najlepszych doświadczeń podróżniczych.
                </p>
            </section>

            <section className="contact-section">
                <h2>Skontaktuj się z nami</h2>
                <p>
                    Jesteśmy tu, aby odpowiedzieć na Twoje pytania. Skontaktuj się z nami przez formularz na stronie kontaktowej!
                </p>
            </section>
        </div>
    );
};

export default Home;
