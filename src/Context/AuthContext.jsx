import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Pobieramy użytkownika z localStorage
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }

        // Pobieramy użytkowników z localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = storedUsers.map(user => {
            if (!user.registeredAt) {
                user.registeredAt = new Date().toISOString();
            }
            return user;
        });

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Jeśli użytkownik jest zalogowany, wczytujemy jego rezerwacje
        if (storedUser) {
            const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const userReservations = storedReservations.filter(reservation => reservation.userId === storedUser.id);
            setReservations(userReservations);
        }
    }, []);

    const login = (email, password) => {
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            if (user.isBlocked) {
                alert('Twoje konto zostało zablokowane. Skontaktuj się z administratorem.');
                return;
            }

            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));

            const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const userReservations = storedReservations.filter(reservation => reservation.userId === user.id);
            setReservations(userReservations);
        } else {
            alert('Nieprawidłowy email lub hasło');
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setReservations([]);
        localStorage.removeItem('currentUser');
    };

    const register = (newUser) => {
        const isUserExist = users.some(user => user.email === newUser.email);

        if (isUserExist) {
            alert("Użytkownik z tym emailem już istnieje.");
            return;
        }

        newUser.role = newUser.email === "admin@admin.com" ? "admin" : "user";
        newUser.isBlocked = false;
        newUser.registeredAt = new Date().toISOString();

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers)); // Zapisywanie zaktualizowanych użytkowników
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        alert("Rejestracja zakończona sukcesem!");
    };

    const addReservation = (newReservation) => {
        const updatedReservations = [...reservations, newReservation];
        setReservations(updatedReservations);

        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        allReservations.push(newReservation);
        localStorage.setItem('reservations', JSON.stringify(allReservations));
    };

    const removeReservation = (id) => {
        const updatedReservations = reservations.filter(reservation => reservation.id !== id);
        setReservations(updatedReservations);

        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservationsInStorage = allReservations.filter(reservation => reservation.id !== id);
        localStorage.setItem('reservations', JSON.stringify(updatedReservationsInStorage));

        alert("Rezerwacja została usunięta.");
    };

    // Nowa funkcja do anulowania rezerwacji (zmienia status na "Anulowana")
    const cancelReservation = (reservationId) => {
        setReservations(prevReservations =>
            prevReservations.map(reservation =>
                reservation.id === reservationId
                    ? { ...reservation, status: 'Anulowana' }  // Zmiana statusu na 'Anulowana'
                    : reservation
            )
        );

        // Aktualizujemy rezerwacje w localStorage
        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const updatedReservationsInStorage = allReservations.map(reservation =>
            reservation.id === reservationId
                ? { ...reservation, status: 'Anulowana' }
                : reservation
        );
        localStorage.setItem('reservations', JSON.stringify(updatedReservationsInStorage));

        alert("Rezerwacja została anulowana.");
    };

    const getReservationsByUserId = (userId) => {
        const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        if (currentUser && currentUser.role === 'admin') {
            // Dla administratora zwróć wszystkie rezerwacje
            return allReservations;
        } else if (currentUser && currentUser.id === userId) {
            // Dla zwykłego użytkownika zwróć tylko jego rezerwacje
            return allReservations.filter(reservation => reservation.userId === userId);
        } else {
            return [];
        }
    };

    const getAllUsers = () => {
        return users;
    };

    const updateUserRole = (userId, newRole) => {
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const toggleBlockUser = (userId, isBlocked) => {
        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, isBlocked } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    const deleteUser = (userId) => {
        if (currentUser && currentUser.role === 'admin') {
            // Usuń użytkownika z listy użytkowników
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Usuń rezerwacje związane z tym użytkownikiem
            const updatedReservations = reservations.filter(reservation => reservation.userId !== userId);
            setReservations(updatedReservations);
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));

            // Usuń rezerwacje użytkownika z globalnej listy rezerwacji
            const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const updatedReservationsInStorage = allReservations.filter(reservation => reservation.userId !== userId);
            localStorage.setItem('reservations', JSON.stringify(updatedReservationsInStorage));

            alert("Użytkownik i jego rezerwacje zostały usunięte.");
        } else {
            alert("Tylko administrator może usuwać użytkowników.");
        }
    };

    const acceptReservation = (reservationId) => {
        if (currentUser && currentUser.role === 'admin') {
            const allReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            const updatedReservations = allReservations.map(reservation =>
                reservation.id === reservationId ? { ...reservation, status: 'Zaakceptowana' } : reservation
            );
    
            setReservations(updatedReservations);
            localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    
            const acceptedReservation = updatedReservations.find(reservation => reservation.id === reservationId);
            const user = users.find(user => user.id === acceptedReservation.userId);
            if (user) {
                const newNotification = `Rezerwacja nr ${reservationId} została zaakceptowana. Dziękujemy za cierpliwość!`;
                setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    
                alert(`Rezerwacja użytkownika ${user.firstName} ${user.lastName} została zaakceptowana.`);
            }
        } else {
            alert("Tylko administrator może zatwierdzić rezerwacje.");
        }
    };
    // Funkcja do pobierania kampera na podstawie jego ID
const getCamperById = (camperId) => {
    // Pobieramy dane kamperów z localStorage (jeśli istnieją)
    const allCampers = JSON.parse(localStorage.getItem('campers')) || [];
    
    // Znajdujemy kampera o podanym ID
    const camper = allCampers.find(camper => camper.id === camperId);

    // Zwracamy kampera, jeśli istnieje, lub null, jeśli nie znaleziono
    return camper || null;
};

    
    
    
    return (
        <AuthContext.Provider value={{
            currentUser,
            users,
            reservations,
            notifications,
            login,
            logout,
            register,
            getAllUsers,
            updateUserRole,
            toggleBlockUser,
            addReservation,
            getReservationsByUserId,
            acceptReservation,
            deleteUser,
            removeReservation,
            cancelReservation, // Dodajemy funkcję cancelReservation
            getCamperById,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
