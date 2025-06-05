import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DeadlineNotification {
  id: string;
  title: string;
  deadline: string;
  status: string;
  isRead: boolean;
}

interface DeadlineNotificationsProps {
  items: any[];
  onItemPress: (item: any) => void;
}

export default function DeadlineNotifications({
  items,
  onItemPress,
}: DeadlineNotificationsProps) {
  const [notifications, setNotifications] = useState<DeadlineNotification[]>([]);

  useEffect(() => {
    setupNotifications();
    processItems();
  }, [items]);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Уведомления',
        'Для получения уведомлений о сроках необходимо разрешить доступ к уведомлениям в настройках приложения.'
      );
    }
  };

  const processItems = () => {
    const today = new Date();
    const newNotifications: DeadlineNotification[] = items
      .filter((item) => {
        const deadline = new Date(item.endDate);
        const daysUntilDeadline = Math.ceil(
          (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
      })
      .map((item) => ({
        id: item.id,
        title: item.title,
        deadline: item.endDate,
        status: item.status,
        isRead: false,
      }));

    setNotifications(newNotifications);
    scheduleNotifications(newNotifications);
  };

  const scheduleNotifications = async (notifications: DeadlineNotification[]) => {
    for (const notification of notifications) {
      const deadline = new Date(notification.deadline);
      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDeadline <= 7) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Приближается срок',
            body: `Задача "${notification.title}" должна быть завершена через ${daysUntilDeadline} дней`,
            data: { id: notification.id },
          },
          trigger: {
            seconds: 60 * 60 * 24, // Ежедневно
            repeats: true,
          },
        });
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const renderNotification = ({ item }: { item: DeadlineNotification }) => {
    const deadline = new Date(item.deadline);
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => {
          markAsRead(item.id);
          onItemPress(items.find((i) => i.id === item.id));
        }}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationDeadline}>
            Срок: {item.deadline} ({daysUntilDeadline} дней)
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        {!item.isRead && (
          <View style={styles.unreadIndicator}>
            <Ionicons name="ellipse" size={8} color="#2196F3" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return '#4CAF50';
      case 'at-risk':
        return '#FFC107';
      case 'delayed':
        return '#FF5252';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'По графику';
      case 'at-risk':
        return 'Под угрозой';
      case 'delayed':
        return 'Отстает';
      default:
        return 'В процессе';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Уведомления о сроках</Text>
        <Text style={styles.subtitle}>
          {notifications.length} активных уведомлений
        </Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  unreadNotification: {
    backgroundColor: '#f5f9ff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationDeadline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  unreadIndicator: {
    justifyContent: 'center',
    marginLeft: 8,
  },
}); 