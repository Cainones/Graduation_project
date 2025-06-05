import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
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

interface RolePermissionsProps {
  roles: Role[];
  permissions: Permission[];
  onUpdateRole: (role: Role) => void;
  onAddRole: (role: Omit<Role, 'id'>) => void;
  onDeleteRole: (roleId: string) => void;
}

export default function RolePermissions({
  roles,
  permissions,
  onUpdateRole,
  onAddRole,
  onDeleteRole,
}: RolePermissionsProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Permission['category']>('work');

  const getCategoryIcon = (category: Permission['category']) => {
    switch (category) {
      case 'work':
        return 'construct-outline';
      case 'schedule':
        return 'calendar-outline';
      case 'notifications':
        return 'notifications-outline';
      case 'users':
        return 'people-outline';
    }
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

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.includes(permissionId)
      ? selectedRole.permissions.filter((id) => id !== permissionId)
      : [...selectedRole.permissions, permissionId];

    const updatedRole = {
      ...selectedRole,
      permissions: updatedPermissions,
    };

    onUpdateRole(updatedRole);
    setSelectedRole(updatedRole);
  };

  const handleDeleteRole = (role: Role) => {
    onDeleteRole(role.id);
    if (selectedRole?.id === role.id) {
      setSelectedRole(null);
    }
  };

  const filteredPermissions = permissions.filter(
    (permission) => permission.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <View style={styles.rolesContainer}>
        <Text style={styles.sectionTitle}>Роли</Text>
        <ScrollView style={styles.rolesList}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleItem,
                selectedRole?.id === role.id && styles.roleItemSelected,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <View style={styles.roleInfo}>
                <Text style={styles.roleName}>{role.name}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRole(role)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.permissionsContainer}>
        <Text style={styles.sectionTitle}>Разрешения</Text>
        <View style={styles.categoryTabs}>
          {(['work', 'schedule', 'notifications', 'users'] as const).map(
            (category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  selectedCategory === category && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={20}
                  color={selectedCategory === category ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.categoryTabText,
                    selectedCategory === category && styles.categoryTabTextActive,
                  ]}
                >
                  {getCategoryName(category)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <ScrollView style={styles.permissionsList}>
          {filteredPermissions.map((permission) => (
            <View key={permission.id} style={styles.permissionItem}>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionName}>{permission.name}</Text>
                <Text style={styles.permissionDescription}>
                  {permission.description}
                </Text>
              </View>
              <Switch
                value={selectedRole?.permissions.includes(permission.id) || false}
                onValueChange={() => handlePermissionToggle(permission.id)}
                disabled={!selectedRole}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  rolesContainer: {
    height: 200,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rolesList: {
    flex: 1,
  },
  roleItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  permissionsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  categoryTabText: {
    marginLeft: 8,
    color: '#666',
  },
  categoryTabTextActive: {
    color: '#2196F3',
    fontWeight: '500',
  },
  permissionsList: {
    flex: 1,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionInfo: {
    flex: 1,
    marginRight: 16,
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
}); 