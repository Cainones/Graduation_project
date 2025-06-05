import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'supervisor' | 'worker';
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagement({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: UserManagementProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | User['role']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return '#FF5252';
      case 'manager':
        return '#2196F3';
      case 'supervisor':
        return '#4CAF50';
      case 'worker':
        return '#FFC107';
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'manager':
        return 'Менеджер';
      case 'supervisor':
        return 'Прораб';
      case 'worker':
        return 'Рабочий';
    }
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'active' ? '#4CAF50' : '#FF5252';
  };

  const getStatusText = (status: User['status']) => {
    return status === 'active' ? 'Активен' : 'Неактивен';
  };

  const filteredUsers = users.filter(
    (user) =>
      (selectedFilter === 'all' || user.role === selectedFilter) &&
      (statusFilter === 'all' || user.status === statusFilter) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    onUpdateUser({ ...user, status: newStatus });
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Удаление пользователя',
      `Вы уверены, что хотите удалить пользователя ${user.name}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => onDeleteUser(user.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по имени или email"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'admin', 'manager', 'supervisor', 'worker'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter as 'all' | User['role'])}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'admin'
                  ? 'Администраторы'
                  : filter === 'manager'
                  ? 'Менеджеры'
                  : filter === 'supervisor'
                  ? 'Прорабы'
                  : 'Рабочие'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statusFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'active', 'inactive'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.statusFilterButton,
                statusFilter === filter && styles.statusFilterButtonActive,
              ]}
              onPress={() => setStatusFilter(filter as 'all' | User['status'])}
            >
              <Text
                style={[
                  styles.statusFilterButtonText,
                  statusFilter === filter && styles.statusFilterButtonTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'Все статусы'
                  : filter === 'active'
                  ? 'Активные'
                  : 'Неактивные'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.usersList}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(user.role) },
                  ]}
                >
                  <Text style={styles.roleText}>{getRoleText(user.role)}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    { backgroundColor: getStatusColor(user.status) },
                  ]}
                  onPress={() => handleStatusChange(user)}
                >
                  <Text style={styles.statusButtonText}>
                    {getStatusText(user.status)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{user.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
              {user.lastLogin && (
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    Последний вход: {user.lastLogin}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  statusFilterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusFilterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  statusFilterButtonText: {
    color: '#666',
  },
  statusFilterButtonTextActive: {
    color: '#fff',
  },
  usersList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 