import React from 'react';
import './AboutUs.css';
import teamImage from './Image/img3.jpeg';
import camperInterior from './Image/kamper12.jpeg';
import camperOnRoad from './Image/model6-2.jpeg';

const AboutUs = () => {
    return (
        <div className="about-container">
            <img src={camperInterior} alt="Wnętrze kampera" className="service-image" />
            <section className="intro-section">
                <h1>O Nas</h1>
                <p>
                    Nasza firma to lider w branży wypożyczania kamperów, oferujący szeroki wybór pojazdów dopasowanych do różnych potrzeb podróżnych. Z miłości do podróży i wolności stworzyliśmy flotę kamperów, która pozwala klientom cieszyć się pełnią przygody na otwartych drogach.
                </p>
                <p>
                    Nasza misja to zapewnić każdemu możliwość swobodnego podróżowania i odkrywania świata w komfortowych warunkach. Niezależnie, czy planujesz weekendowy wyjazd za miasto, czy wielotygodniową wyprawę po Europie, mamy kamper, który spełni Twoje oczekiwania.
                </p>
            </section>

            <section className="services-section">
                <h2>Nasze Usługi</h2>
                <p>Oferujemy kompleksowe usługi, które zapewnią komfort i bezpieczeństwo podczas podróży:</p>
                <ul>
                    <li>Wypożyczalnia kamperów klasy premium i ekonomicznej</li>
                    <li>Wyposażenie: kuchnia, łazienka, sypialnia, multimedia</li>
                    <li>Opcje personalizacji – dostosowanie wyposażenia do potrzeb klienta</li>
                    <li>Asysta 24/7 na trasie i doradztwo techniczne</li>
                    <li>Planowanie tras i rekomendacje turystyczne</li>
                </ul>
                <p>
                    Nasze kampery są wyposażone w nowoczesne systemy bezpieczeństwa oraz komfortowe przestrzenie mieszkalne. Znajdziesz w nich w pełni wyposażoną kuchnię, wygodne łóżka, a także systemy multimedialne dla rozrywki w trasie. Dbamy o to, aby każdy klient mógł poczuć się jak w domu, nawet będąc setki kilometrów od niego.
                </p>
            </section>

            <section className="benefits-section">
                <h2>Dlaczego Wybrać Nas?</h2>
                <p>Oto, co wyróżnia nas na tle konkurencji:</p>
                <ul>
                    <li>Doświadczony i pomocny zespół, który zawsze jest do Twojej dyspozycji</li>
                    <li>Nowoczesna flota pojazdów utrzymana w idealnym stanie technicznym</li>
                    <li>Elastyczne warunki wynajmu – od jednego dnia po kilkutygodniowe wyprawy</li>
                    <li>Gwarancja czystości i dezynfekcji każdego pojazdu przed wynajmem</li>
                </ul>
                <img src={camperOnRoad} alt="Kamper w trasie" className="benefit-image" />
            </section>

            <section className="team-section">
                <h2>Nasz Zespół</h2>
                <img src={teamImage} alt="Nasz zespół" className="team-image" />
                <p>
                    Nasz zespół to eksperci z pasją do podróży i szeroką wiedzą o kamperach. Każdy z nas rozumie, co znaczy komfortowa podróż, dlatego do każdego wynajmu podchodzimy indywidualnie. Pomożemy Ci wybrać kamper i wyposażenie dopasowane do Twoich potrzeb.
                </p>
                <p>
                    Nasi doradcy chętnie podzielą się wskazówkami dotyczącymi tras, miejsc do odwiedzenia i najlepszych praktyk podczas podróży kamperem. Zawsze jesteśmy tu, by uczynić Twoje wakacje niezapomnianymi!
                </p>
            </section>
        </div>
    );
};

export default AboutUs;
