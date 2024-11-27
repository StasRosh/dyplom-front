import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';

const AdminUsers = () => {
    const { getAllUsers, deleteUser, toggleBlockUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await getAllUsers();
            setUsers(userList);
        };

        fetchUsers();
    }, [getAllUsers]);

    const handleDelete = (userId) => {
        deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleBlockToggle = (userId, isBlocked) => {
        toggleBlockUser(userId, !isBlocked);
        setUsers(users.map(user => 
            user.id === userId ? { ...user, isBlocked: !isBlocked } : user
        ));
    };

    return (
        <div>
            <h1>Użytkownicy</h1>
            <Table striped bordered>
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
                                >
                                    Usuń
                                </Button>{' '}
                                <Button 
                                    variant={user.isBlocked ? "secondary" : "outline-secondary"} 
                                    onClick={() => handleBlockToggle(user.id, user.isBlocked)}
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
