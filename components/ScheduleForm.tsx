import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

interface ScheduleFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  onDelete?: () => void;
}

export default function ScheduleForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  onDelete,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    progress: '0',
    status: 'in-progress',
    responsible: '',
    dependencies: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите название задачи');
      return;
    }

    if (formData.startDate > formData.endDate) {
      Alert.alert('Ошибка', 'Дата начала не может быть позже даты окончания');
      return;
    }

    onSubmit({
      ...formData,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите удалить эту задачу?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
              {initialData ? 'Редактировать задачу' : 'Новая задача'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название задачи</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData({ ...formData, title: text })
                }
                placeholder="Например: Установка фундамента"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата начала</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>{formatDate(formData.startDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={formData.startDate}
                  mode="date"
                  display="default"
                  onChange={(event: DateTimePickerEvent, date?: Date) => {
                    setShowStartDatePicker(false);
                    if (date) {
                      setFormData({ ...formData, startDate: date });
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата окончания</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>{formatDate(formData.endDate)}</Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={formData.endDate}
                  mode="date"
                  display="default"
                  onChange={(event: DateTimePickerEvent, date?: Date) => {
                    setShowEndDatePicker(false);
                    if (date) {
                      setFormData({ ...formData, endDate: date });
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Прогресс (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.progress}
                onChangeText={(text) =>
                  setFormData({ ...formData, progress: text })
                }
                keyboardType="numeric"
                placeholder="Например: 75"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Статус</Text>
              <View style={styles.statusContainer}>
                {['in-progress', 'on-track', 'at-risk', 'delayed'].map(
                  (status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        formData.status === status && styles.statusButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, status: status })
                      }
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          formData.status === status &&
                            styles.statusButtonTextActive,
                        ]}
                      >
                        {getStatusText(status)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ответственный</Text>
              <TextInput
                style={styles.input}
                value={formData.responsible}
                onChangeText={(text) =>
                  setFormData({ ...formData, responsible: text })
                }
                placeholder="Например: Иванов И.И."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Зависимости</Text>
              <TextInput
                style={styles.input}
                value={formData.dependencies}
                onChangeText={(text) =>
                  setFormData({ ...formData, dependencies: text })
                }
                placeholder="Например: ID-123, ID-456"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {initialData && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#FF5252" />
                <Text style={styles.deleteButtonText}>Удалить</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {initialData ? 'Сохранить' : 'Создать'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'В процессе';
    case 'on-track':
      return 'По графику';
    case 'at-risk':
      return 'Под угрозой';
    case 'delayed':
      return 'Отстает';
    default:
      return status;
  }
};

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
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  statusButtonActive: {
    backgroundColor: '#2196F3',
  },
  statusButtonText: {
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  deleteButtonText: {
    color: '#FF5252',
    marginLeft: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 