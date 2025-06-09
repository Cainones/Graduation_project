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
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  startDate: string;
  endDate: string;
  photos: string[];
}

export default function ConstructionProgressScreen() {
  const [works, setWorks] = useState<ConstructionWork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedWork, setSelectedWork] = useState<ConstructionWork | null>(null);

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
    setIsFormVisible(false);
    setSelectedWork(null);
  };

  const handleDeleteWork = (workId: string) => {
    setWorks(works.filter((w) => w.id !== workId));
  };

  const getStatusColor = (status: ConstructionWork['status']) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'in-progress':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
    }
  };

  const getStatusText = (status: ConstructionWork['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'in-progress':
        return 'В процессе';
      case 'completed':
        return 'Завершено';
    }
  };

  const getPriorityColor = (priority: ConstructionWork['priority']) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#FF5252';
    }
  };

  const getPriorityText = (priority: ConstructionWork['priority']) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
    }
  };

  const filteredWorks = works.filter((work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || work.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Прогресс строительства</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddWork}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск работ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'pending' && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter('pending')}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === 'pending' && styles.filterButtonTextActive,
              ]}
            >
              Ожидает
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'in-progress' && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter('in-progress')}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === 'in-progress' && styles.filterButtonTextActive,
              ]}
            >
              В процессе
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === 'completed' && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter('completed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === 'completed' && styles.filterButtonTextActive,
              ]}
            >
              Завершено
            </Text>
          </TouchableOpacity>
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
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{work.assignedTo}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {work.startDate} - {work.endDate}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="flag-outline" size={16} color="#666" />
                <Text style={[styles.detailText, { color: getPriorityColor(work.priority) }]}>
                  {getPriorityText(work.priority)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <WorkForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedWork(null);
        }}
        onSubmit={handleSaveWork}
        initialData={selectedWork || undefined}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
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
    marginTop: 16,
    paddingHorizontal: 16,
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
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  workItemDescription: {
    color: '#666',
    marginBottom: 12,
  },
  workItemDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    color: '#666',
  },
}); 