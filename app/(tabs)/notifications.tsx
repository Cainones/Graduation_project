import NotificationsList from '@/components/NotificationsList';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'inspection',
      title: 'Плановый осмотр фундамента',
      description: 'Необходимо провести плановый осмотр состояния фундамента и проверить гидроизоляцию.',
      date: '2025-03-25',
      status: 'new',
      priority: 'medium',
      location: 'Секция А, Уровень -1',
      responsible: 'Иванов И.И.',
    },
    {
      id: '2',
      type: 'discrepancy',
      title: 'Несоответствие в маркировке материалов',
      description: 'Обнаружено несоответствие в маркировке строительных материалов на складе.',
      date: '2025-03-24',
      status: 'in-progress',
      priority: 'high',
      location: 'Склад №2',
      responsible: 'Петров П.П.',
    },
    {
      id: '3',
      type: 'violation',
      title: 'Нарушение техники безопасности',
      description: 'Зафиксировано нарушение техники безопасности при работе на высоте.',
      date: '2025-03-23',
      status: 'resolved',
      priority: 'high',
      location: 'Секция Б, 3 этаж',
      responsible: 'Сидоров С.С.',
    },
  ]);

  const handleNotificationPress = (notification: Notification) => {
    // Здесь будет логика открытия детальной информации об уведомлении
    console.log('Notification pressed:', notification);
  };

  const handleStatusChange = (id: string, newStatus: Notification['status']) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: newStatus }
          : notification
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NotificationsList
        notifications={notifications}
        onNotificationPress={handleNotificationPress}
        onStatusChange={handleStatusChange}
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