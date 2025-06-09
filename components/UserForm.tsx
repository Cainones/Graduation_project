import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
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

interface UserFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'>) => void;
  initialData?: User;
}

export default function UserForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'worker' as User['role'],
    email: '',
    phone: '',
    status: 'active' as User['status'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        role: initialData.role,
        email: initialData.email,
        phone: initialData.phone,
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        role: 'worker',
        email: '',
        phone: '',
        status: 'active',
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите имя пользователя');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите email');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите номер телефона');
      return;
    }

    onSubmit(formData);
    onClose();
  };

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialData ? 'Редактировать пользователя' : 'Новый пользователь'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя пользователя</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Введите имя пользователя"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Введите email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Телефон</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Введите номер телефона"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Роль</Text>
              <View style={styles.roleButtons}>
                {(['admin', 'manager', 'supervisor', 'worker'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      formData.role === role && {
                        backgroundColor: getRoleColor(role),
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, role })}
                  >
                    <Text
                      style={[
                        styles.roleButtonText,
                        formData.role === role && styles.roleButtonTextActive,
                      ]}
                    >
                      {getRoleText(role)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Статус</Text>
              <View style={styles.statusButtons}>
                {(['active', 'inactive'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && {
                        backgroundColor: status === 'active' ? '#4CAF50' : '#FF5252',
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === status && styles.statusButtonTextActive,
                      ]}
                    >
                      {status === 'active' ? 'Активен' : 'Неактивен'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 