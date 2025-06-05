import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import RolePermissions from '../../components/RolePermissions';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'work' | 'schedule' | 'notifications' | 'users';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolesScreen() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Администратор',
      description: 'Полный доступ ко всем функциям системы',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    },
    {
      id: '2',
      name: 'Менеджер',
      description: 'Управление работами и графиком',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
    {
      id: '3',
      name: 'Прораб',
      description: 'Управление работами и уведомлениями',
      permissions: ['1', '2', '3', '4', '9', '10'],
    },
    {
      id: '4',
      name: 'Рабочий',
      description: 'Просмотр работ и уведомлений',
      permissions: ['1', '9'],
    },
  ]);

  const [permissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'Просмотр работ',
      description: 'Возможность просматривать список работ',
      category: 'work',
    },
    {
      id: '2',
      name: 'Создание работ',
      description: 'Возможность создавать новые работы',
      category: 'work',
    },
    {
      id: '3',
      name: 'Редактирование работ',
      description: 'Возможность редактировать существующие работы',
      category: 'work',
    },
    {
      id: '4',
      name: 'Удаление работ',
      description: 'Возможность удалять работы',
      category: 'work',
    },
    {
      id: '5',
      name: 'Просмотр графика',
      description: 'Возможность просматривать график работ',
      category: 'schedule',
    },
    {
      id: '6',
      name: 'Создание задач',
      description: 'Возможность создавать новые задачи в графике',
      category: 'schedule',
    },
    {
      id: '7',
      name: 'Редактирование задач',
      description: 'Возможность редактировать существующие задачи',
      category: 'schedule',
    },
    {
      id: '8',
      name: 'Удаление задач',
      description: 'Возможность удалять задачи из графика',
      category: 'schedule',
    },
    {
      id: '9',
      name: 'Просмотр уведомлений',
      description: 'Возможность просматривать уведомления',
      category: 'notifications',
    },
    {
      id: '10',
      name: 'Управление уведомлениями',
      description: 'Возможность управлять уведомлениями',
      category: 'notifications',
    },
    {
      id: '11',
      name: 'Просмотр пользователей',
      description: 'Возможность просматривать список пользователей',
      category: 'users',
    },
    {
      id: '12',
      name: 'Управление пользователями',
      description: 'Возможность управлять пользователями',
      category: 'users',
    },
  ]);

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
  };

  const handleAddRole = (newRole: Omit<Role, 'id'>) => {
    const role: Role = {
      ...newRole,
      id: Date.now().toString(),
    };
    setRoles([...roles, role]);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <RolePermissions
        roles={roles}
        permissions={permissions}
        onUpdateRole={handleUpdateRole}
        onAddRole={handleAddRole}
        onDeleteRole={handleDeleteRole}
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