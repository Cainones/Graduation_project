import ScheduleForm from '@/components/ScheduleForm';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScheduleItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  dependencies: string[];
  responsible: string;
}

export default function ScheduleScreen() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Фундаментные работы',
      startDate: '2025-03-20',
      endDate: '2025-04-10',
      status: 'on-track',
      progress: 45,
      dependencies: [],
      responsible: 'Иванов И.И.',
    },
    {
      id: '2',
      title: 'Кирпичная кладка',
      startDate: '2025-04-11',
      endDate: '2025-05-20',
      status: 'at-risk',
      progress: 0,
      dependencies: ['1'],
      responsible: 'Петров П.П.',
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'on-track' | 'at-risk' | 'delayed'>('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | undefined>();

  const handleAddItem = (item: any) => {
    if (selectedItem) {
      setScheduleItems(prev => prev.map(i => i.id === selectedItem.id ? { ...item, id: i.id } : i));
    } else {
      setScheduleItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
    }
    setIsFormVisible(false);
    setSelectedItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
    setIsFormVisible(false);
    setSelectedItem(undefined);
  };

  const handleItemPress = (item: ScheduleItem) => {
    setSelectedItem(item);
    setIsFormVisible(true);
  };

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'on-track':
        return '#4CAF50';
      case 'at-risk':
        return '#FFC107';
      case 'delayed':
        return '#FF5252';
    }
  };

  const getStatusText = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'on-track':
        return 'По графику';
      case 'at-risk':
        return 'Под угрозой';
      case 'delayed':
        return 'Отстает';
    }
  };

  const filteredItems = scheduleItems.filter(
    (item) => selectedFilter === 'all' || item.status === selectedFilter
  );

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Планирование и контроль сроков</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedItem(undefined);
            setIsFormVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'on-track', 'at-risk', 'delayed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter as ScheduleItem['status'] | 'all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter === 'all'
                  ? 'Все'
                  : filter === 'on-track'
                  ? 'По графику'
                  : filter === 'at-risk'
                  ? 'Под угрозой'
                  : 'Отстает'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.scheduleItem}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.scheduleItemHeader}>
              <Text style={styles.scheduleItemTitle}>{item.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${item.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>

            <View style={styles.datesContainer}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.dateText}>
                  Начало: {item.startDate}
                </Text>
              </View>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.dateText}>
                  Окончание: {item.endDate}
                </Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{item.responsible}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Осталось дней: {calculateDaysLeft(item.endDate)}
                </Text>
              </View>
            </View>

            {item.dependencies.length > 0 && (
              <View style={styles.dependenciesContainer}>
                <Text style={styles.dependenciesTitle}>Зависимости:</Text>
                {item.dependencies.map((depId) => {
                  const dep = scheduleItems.find((i) => i.id === depId);
                  return (
                    <Text key={depId} style={styles.dependencyText}>
                      • {dep?.title}
                    </Text>
                  );
                })}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScheduleForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedItem(undefined);
        }}
        onSubmit={handleAddItem}
        initialData={selectedItem}
        onDelete={selectedItem ? () => handleDeleteItem(selectedItem.id) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
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
  content: {
    flex: 1,
    padding: 16,
  },
  scheduleItem: {
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
  scheduleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailsContainer: {
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
  dependenciesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dependenciesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  dependencyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
}); 