import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);  // Stan dla aktualnego użytkownika
    const [errorMessage, setErrorMessage] = useState("")
    const [users, setUsers] = useState([]);  // Stan dla wszystkich użytkowników
    const [reservations, setReservations] = useState([]); // Stan dla rezerwacji
    const [notifications, setNotifications] = useState([]);
    const [insurances, setInsurances] = useState([]);

    // Pobieranie danych z localStorage przy uruchomieniu
    useEffect(() => {
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

        if (storedUser) {
            // const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            // const userReservations = storedReservations.filter(reservation => reservation.userId === storedUser.id);
            // setReservations(userReservations);
            
        }

        const storedInsurances = JSON.parse(localStorage.getItem('insurances')) || [];
        setInsurances(storedInsurances);
    }, []);

    // Funkcja do logowania użytkownika
    const login = (user, password) => {
        var data = { email: user, password: password }
        // console.log("login: " + JSON.stringify(data))
        axios.post("http://localhost:8080/auth/login", data
        ).then((res) => {
            // console.log((res.data));
            document.cookie = 'user_key=' + res.data.token + ';expires=' + new Date(new Date().getTime() + 3600000).toGMTString() + ';'
            Cookies.set("user_id",res.data.id)
            setErrorMessage('')
            return true;
        }).catch(function (error) {
            console.log(error);
            setErrorMessage("Nieprawidłowe dane logowania")
            console.log(errorMessage)
            return false;
        });



        // document.cookie = 'user_key=' + user + ";";
        // setCurrentUser(user);
        // localStorage.setItem('currentUser', JSON.stringify(user)); // Zapisz użytkownika w localStorage

        // // Ładowanie rezerwacji tylko dla zalogowanego użytkownika
        // const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        // const userReservations = storedReservations.filter(reservation => reservation.userId === user.id);
        // setReservations(userReservations);
    };

    const logout = () => {
        setReservations([]);
        document.cookie = 'user_key=; Max-Age=0';
        Cookies.remove("user_id")

        // localStorage.removeItem('currentUser'); // Usuwamy użytkownika z localStorage
        // localStorage.removeItem('reservations'); // Usuwamy rezerwacje z localStorage
    };

    const register = (newUser) => {

        var data = {
            email: newUser.email,
            username: newUser.firstName + " " + newUser.lastName,
            password: newUser.password,
            address: newUser.address,
            phone: newUser.phoneNumber
        }

        console.log(data)
        axios.post("http://localhost:8080/auth/register", data)
            .then((res) => {
                console.log(res)
                login(data.email, data.password);
            }).catch((err) => {
                console.log(err)
            })



        // const isUserExist = users.some(user => user.email === newUser.email);
        // if (isUserExist) {
        //     alert("Użytkownik z tym emailem już istnieje.");
        //     return;
        // }

        // const updatedUsers = [...users, newUser];
        // setUsers(updatedUsers);
        // localStorage.setItem('users', JSON.stringify(updatedUsers));
        // login(newUser);
    };

    const addReservation = (newReservation) => {
        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };
        var data = {

            vehicleId: newReservation.vehicleId,
            reservationStartDate: (newReservation.reservationStartDate),
            reservationEndDate: (newReservation.reservationEndDate),
            comments: "string",
            location: newReservation.location

        }
        console.log("auth:")
        console.log(newReservation)
        console.log(data)
        axios.post("http://localhost:8080/reservation", data, config)
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })

        if (!Cookies.get("user_key")) {
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
            cancelReservation,
            getCamperById,
            addInsurance,
            getInsurancesByCamperId,
            errorMessage,
            addReservation,
            removeReservation,
            getReservations,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};
