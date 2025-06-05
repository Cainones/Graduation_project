import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Notification {
  id: string;
  type: 'inspection' | 'discrepancy' | 'violation';
  title: string;
  description: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  location: string;
  responsible: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
  onStatusChange: (id: string, status: Notification['status']) => void;
}

export default function NotificationsList({
  notifications,
  onNotificationPress,
  onStatusChange,
}: NotificationsListProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | Notification['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Notification['status']>('all');

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'inspection':
        return 'clipboard-outline';
      case 'discrepancy':
        return 'alert-circle-outline';
      case 'violation':
        return 'warning-outline';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'inspection':
        return '#2196F3';
      case 'discrepancy':
        return '#FFC107';
      case 'violation':
        return '#FF5252';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#FF5252';
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'new':
        return '#2196F3';
      case 'in-progress':
        return '#FFC107';
      case 'resolved':
        return '#4CAF50';
    }
  };

  const getTypeText = (type: Notification['type']) => {
    switch (type) {
      case 'inspection':
        return 'Проверка';
      case 'discrepancy':
        return 'Несоответствие';
      case 'violation':
        return 'Нарушение';
    }
  };

  const getStatusText = (status: Notification['status']) => {
    switch (status) {
      case 'new':
        return 'Новое';
      case 'in-progress':
        return 'В работе';
      case 'resolved':
        return 'Решено';
    }
  };

  const getPriorityText = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) =>
      (selectedFilter === 'all' || notification.type === selectedFilter) &&
      (statusFilter === 'all' || notification.status === statusFilter)
  );

  const handleStatusChange = (id: string, currentStatus: Notification['status']) => {
    let newStatus: Notification['status'];
    switch (currentStatus) {
      case 'new':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'resolved';
        break;
      default:
        return;
    }

    Alert.alert(
      'Изменение статуса',
      `Изменить статус на "${getStatusText(newStatus)}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Изменить',
          onPress: () => onStatusChange(id, newStatus),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'inspection', 'discrepancy', 'violation'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter as 'all' | Notification['type'])}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'inspection'
                  ? 'Проверки'
                  : filter === 'discrepancy'
                  ? 'Несоответствия'
                  : 'Нарушения'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statusFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'new', 'in-progress', 'resolved'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.statusFilterButton,
                statusFilter === filter && styles.statusFilterButtonActive,
              ]}
              onPress={() => setStatusFilter(filter as 'all' | Notification['status'])}
            >
              <Text
                style={[
                  styles.statusFilterButtonText,
                  statusFilter === filter && styles.statusFilterButtonTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'Все статусы'
                  : filter === 'new'
                  ? 'Новые'
                  : filter === 'in-progress'
                  ? 'В работе'
                  : 'Решенные'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationItem}
            onPress={() => onNotificationPress(notification)}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.typeContainer}>
                <Ionicons
                  name={getTypeIcon(notification.type)}
                  size={20}
                  color={getTypeColor(notification.type)}
                />
                <Text style={[styles.typeText, { color: getTypeColor(notification.type) }]}>
                  {getTypeText(notification.type)}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  { backgroundColor: getStatusColor(notification.status) },
                ]}
                onPress={() => handleStatusChange(notification.id, notification.status)}
              >
                <Text style={styles.statusButtonText}>
                  {getStatusText(notification.status)}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.description}>{notification.description}</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{notification.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{notification.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{notification.responsible}</Text>
              </View>
            </View>

            <View style={styles.priorityContainer}>
              <View
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: getPriorityColor(notification.priority) },
                ]}
              />
              <Text style={styles.priorityText}>
                Приоритет: {getPriorityText(notification.priority)}
              </Text>
            </View>
          </TouchableOpacity>
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
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
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
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    color: '#666',
  },
}); 