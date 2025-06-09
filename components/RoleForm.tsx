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

interface RoleFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (role: Omit<Role, 'id'>) => void;
  permissions: Permission[];
  initialData?: Role;
}

export default function RoleForm({
  visible,
  onClose,
  onSubmit,
  permissions,
  initialData,
}: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        permissions: initialData.permissions,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название роли');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const getCategoryName = (category: Permission['category']) => {
    switch (category) {
      case 'work':
        return 'Работы';
      case 'schedule':
        return 'График';
      case 'notifications':
        return 'Уведомления';
      case 'users':
        return 'Пользователи';
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
              {initialData ? 'Редактировать роль' : 'Новая роль'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название роли</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Введите название роли"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Описание</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Введите описание роли"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Разрешения</Text>
              {(['work', 'schedule', 'notifications', 'users'] as const).map((category) => (
                <View key={category} style={styles.permissionCategory}>
                  <Text style={styles.categoryTitle}>{getCategoryName(category)}</Text>
                  {permissions
                    .filter((permission) => permission.category === category)
                    .map((permission) => (
                      <View key={permission.id} style={styles.permissionItem}>
                        <View style={styles.permissionInfo}>
                          <Text style={styles.permissionName}>{permission.name}</Text>
                          <Text style={styles.permissionDescription}>
                            {permission.description}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.permissionToggle,
                            formData.permissions.includes(permission.id) &&
                              styles.permissionToggleActive,
                          ]}
                          onPress={() => handlePermissionToggle(permission.id)}
                        >
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={formData.permissions.includes(permission.id) ? '#fff' : 'transparent'}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              ))}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  permissionCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
  },
  permissionToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionToggleActive: {
    backgroundColor: '#2196F3',
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