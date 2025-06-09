import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import PhotoViewer from './PhotoViewer';

interface Work {
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

interface WorkFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (work: Work) => void;
  initialData?: Work;
}

type WorkStatus = 'pending' | 'in-progress' | 'completed';
type WorkPriority = 'low' | 'medium' | 'high';

export default function WorkForm({ visible, onClose, onSubmit, initialData }: WorkFormProps) {
  const [formData, setFormData] = useState<Omit<Work, 'id'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    photos: [],
  });

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        photos: initialData.photos,
      });
    }
  }, [initialData]);

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходим доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    onSubmit({
      ...formData,
      id: initialData?.id || Date.now().toString(),
    });
    onClose();
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? 'Редактировать работу' : 'Новая работа'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Название *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
                placeholder="Введите название работы"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Описание *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Введите описание работы"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Статус</Text>
              <View style={styles.statusContainer}>
                {(['pending', 'in-progress', 'completed'] as WorkStatus[]).map(
                  (status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        formData.status === status && styles.statusButtonActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, status }))
                      }
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          formData.status === status && styles.statusButtonTextActive,
                        ]}
                      >
                        {status === 'pending'
                          ? 'Ожидает'
                          : status === 'in-progress'
                          ? 'В процессе'
                          : 'Завершено'}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Приоритет</Text>
              <View style={styles.priorityContainer}>
                {(['low', 'medium', 'high'] as WorkPriority[]).map(
                  (priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority && styles.priorityButtonActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, priority }))
                      }
                    >
                      <Text
                        style={[
                          styles.priorityButtonText,
                          formData.priority === priority && styles.priorityButtonTextActive,
                        ]}
                      >
                        {priority === 'low'
                          ? 'Низкий'
                          : priority === 'medium'
                          ? 'Средний'
                          : 'Высокий'}
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
                value={formData.assignedTo}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, assignedTo: text }))
                }
                placeholder="Введите имя ответственного"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата начала</Text>
              <TextInput
                style={styles.input}
                value={formData.startDate}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, startDate: text }))
                }
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Дата окончания</Text>
              <TextInput
                style={styles.input}
                value={formData.endDate}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, endDate: text }))
                }
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.photoSection}>
              <Text style={styles.sectionTitle}>Фотографии</Text>
              <View style={styles.photoGrid}>
                {formData.photos.map((uri, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <TouchableOpacity
                      style={styles.photoWrapper}
                      onPress={() => setSelectedPhoto(uri)}
                    >
                      <Image source={{ uri }} style={styles.photo} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF5252" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                >
                  <Ionicons name="add" size={32} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {initialData ? 'Сохранить' : 'Добавить'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Отмена
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <PhotoViewer
        visible={!!selectedPhoto}
        photoUri={selectedPhoto || ''}
        onClose={() => setSelectedPhoto(null)}
      />
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
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
    fontSize: 16,
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
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
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
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#2196F3',
  },
  priorityButtonText: {
    color: '#666',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  photoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    position: 'relative',
    width: '33.33%',
    height: 100,
  },
  photoWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: '33.33%',
    height: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginLeft: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#666',
  },
}); 