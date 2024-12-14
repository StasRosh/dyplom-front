import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import './AdminUsers.css';

const AdminUsers = () => {
    const { getAllUsers, deleteUser, toggleBlockUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await getAllUsers();
            console.log("users:")
            console.log(userList);
            setUsers(userList);
        };

        fetchUsers();
    }, [getAllUsers]);

    const handleDelete = (userId) => {
        deleteUser(userId);
    };

    const handleBlockToggle = (userId, isBlocked) => {
        toggleBlockUser(userId, !isBlocked);
        setUsers(users.map(user => 
            user.id === userId ? { ...user, isBlocked: !isBlocked } : user
        ));
    };

    return (
        <div className="admin-users-container">
            <h1>Użytkownicy</h1>
            <Table striped bordered responsive className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Imię</th>
                        <th>Email</th>
                        <th>Blokada</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isBlocked ? 'Zablokowany' : 'Aktywny'}</td>
                            <td>
                                <Button 
                                    variant="danger" 
                                    onClick={() => handleDelete(user.id)}
                                    className="action-button"
                                >
                                    Usuń
                                </Button>{' '}
                                <Button 
                                    variant={user.isBlocked ? "secondary" : "outline-secondary"} 
                                    onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                                    className="action-button"
                                >
                                    {user.isBlocked ? 'Odblokuj' : 'Zablokuj'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminUsers;
