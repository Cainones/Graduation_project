import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WorkForm from '../../components/WorkForm';

interface ConstructionWork {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  location: string;
  responsible: string;
}

export default function ConstructionProgressScreen() {
  const [works, setWorks] = useState<ConstructionWork[]>([
    {
      id: '1',
      title: 'Фундаментные работы',
      description: 'Заливка фундамента основного здания',
      status: 'in-progress',
      date: '2024-03-20',
      location: 'Секция А',
      responsible: 'Иванов И.И.',
    },
    {
      id: '2',
      title: 'Кирпичная кладка',
      description: 'Возведение стен первого этажа',
      status: 'pending',
      date: '2024-03-25',
      location: 'Секция Б',
      responsible: 'Петров П.П.',
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState<ConstructionWork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConstructionWork['status'] | 'all'>('all');

  const getStatusColor = (status: ConstructionWork['status']) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'in-progress':
        return '#2196F3';
      case 'pending':
        return '#FFC107';
    }
  };

  const getStatusText = (status: ConstructionWork['status']) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'pending':
        return 'Ожидает';
    }
  };

  const handleAddWork = () => {
    setSelectedWork(null);
    setIsFormVisible(true);
  };

  const handleEditWork = (work: ConstructionWork) => {
    setSelectedWork(work);
    setIsFormVisible(true);
  };

  const handleSaveWork = (work: ConstructionWork) => {
    if (selectedWork) {
      setWorks(works.map((w) => (w.id === work.id ? work : w)));
    } else {
      setWorks([...works, work]);
    }
  };

  const handleDeleteWork = (workId: string) => {
    setWorks(works.filter((w) => w.id !== workId));
  };

  const filteredWorks = works.filter((work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.responsible.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Контроль строительных работ</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddWork}>
          <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск работ..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(status as ConstructionWork['status'] | 'all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === status && styles.filterButtonTextActive,
                ]}
              >
                {status === 'all'
                  ? 'Все'
                  : status === 'pending'
                  ? 'Ожидает'
                  : status === 'in-progress'
                  ? 'В процессе'
                  : 'Завершено'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredWorks.map((work) => (
          <TouchableOpacity
            key={work.id}
            style={styles.workItem}
            onPress={() => handleEditWork(work)}
          >
            <View style={styles.workItemHeader}>
              <Text style={styles.workItemTitle}>{work.title}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(work.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(work.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.workItemDescription}>{work.description}</Text>
            <View style={styles.workItemDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{work.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{work.responsible}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{work.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <WorkForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSave={handleSaveWork}
        onDelete={handleDeleteWork}
        initialData={selectedWork}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
  workItem: {
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
  workItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workItemTitle: {
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
  workItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  workItemDetails: {
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