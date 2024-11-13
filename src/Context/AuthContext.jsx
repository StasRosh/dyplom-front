import React, { createContext, useState, useEffect } from 'react';

// Tworzymy kontekst dla użytkowników
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);  // Stan dla aktualnego użytkownika
    const [users, setUsers] = useState([]);  // Stan dla wszystkich użytkowników
    const [reservations, setReservations] = useState([]); // Stan dla rezerwacji

    // Ładowanie danych z localStorage przy pierwszym renderze
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        setUsers(storedUsers);

        // Ładowanie rezerwacji tylko dla zalogowanego użytkownika
        if (storedUser) {
            const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const userReservations = storedReservations.filter(reservation => reservation.userId === storedUser.id);
            setReservations(userReservations);
        }
    }, []);

    // Funkcja do logowania użytkownika
    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user)); // Zapisz użytkownika w localStorage

        // Ładowanie rezerwacji tylko dla zalogowanego użytkownika
        const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const userReservations = storedReservations.filter(reservation => reservation.userId === user.id);
        setReservations(userReservations);
    };

    // Funkcja do wylogowania użytkownika
    const logout = () => {
        setCurrentUser(null);
        setReservations([]);
        localStorage.removeItem('currentUser'); // Usuwamy użytkownika z localStorage
        localStorage.removeItem('reservations'); // Usuwamy rezerwacje z localStorage
    };

    // Funkcja do rejestracji nowego użytkownika
    const register = (newUser) => {
        const isUserExist = users.some(user => user.email === newUser.email);
        if (isUserExist) {
            alert("Użytkownik z tym emailem już istnieje.");
            return;
        }

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        login(newUser);
    };

    // Funkcja do dodawania rezerwacji
    const addReservation = (newReservation) => {
        if (!currentUser) {
            alert("Musisz być zalogowany, aby dodać rezerwację.");
            return;
        }

        newReservation.userId = currentUser.id; // Przypisujemy rezerwację do użytkownika

        setReservations((prevReservations) => {
            const updatedReservations = [...prevReservations, newReservation];
            const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            allReservations.push(newReservation); // Dodajemy rezerwację do globalnego zbioru
            localStorage.setItem('reservations', JSON.stringify(allReservations)); // Zapisujemy do localStorage
            return updatedReservations;
        });
    };

    // Funkcja do usuwania rezerwacji
    const removeReservation = (reservationId) => {
        setReservations((prevReservations) => {
            const updatedReservations = prevReservations.filter(reservation => reservation.id !== reservationId);
            const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const filteredReservations = allReservations.filter(reservation => reservation.id !== reservationId); // Usuwamy rezerwację globalnie
            localStorage.setItem('reservations', JSON.stringify(filteredReservations));
            return updatedReservations;
        });
    };

    return (
        <AuthContext.Provider value={{
            currentUser, 
            users, 
            reservations, 
            addReservation, 
            removeReservation, 
            login, 
            logout, 
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};
