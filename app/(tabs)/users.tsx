import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import UserManagement from '../../components/UserManagement';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'worker';
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Иван Петров',
      role: 'admin',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      status: 'active',
      lastLogin: '2024-02-20 15:30',
    },
    {
      id: '2',
      name: 'Анна Сидорова',
      role: 'manager',
      email: 'anna@example.com',
      phone: '+7 (999) 234-56-78',
      status: 'active',
      lastLogin: '2024-02-20 14:15',
    },
    {
      id: '3',
      name: 'Михаил Иванов',
      role: 'supervisor',
      email: 'mikhail@example.com',
      phone: '+7 (999) 345-67-89',
      status: 'active',
      lastLogin: '2024-02-20 13:45',
    },
    {
      id: '4',
      name: 'Елена Смирнова',
      role: 'worker',
      email: 'elena@example.com',
      phone: '+7 (999) 456-78-90',
      status: 'inactive',
    },
  ]);

  const handleAddUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
    };
    setUsers([...users, user]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserManagement
        users={users}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 