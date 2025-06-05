import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GanttChartProps {
  items: any[];
  onItemPress: (item: any) => void;
}

export default function GanttChart({ items, onItemPress }: GanttChartProps) {
  const [scale, setScale] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;
  const dayWidth = 50 * scale;
  const chartStartDate = new Date(Math.min(...items.map(item => new Date(item.startDate).getTime())));
  const chartEndDate = new Date(Math.max(...items.map(item => new Date(item.endDate).getTime())));
  const totalDays = Math.ceil((chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24));

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

  const getDaysFromStart = (date: string) => {
    const itemDate = new Date(date);
    return Math.ceil((itemDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const renderTimeline = () => {
    const days = [];
    const currentDate = new Date(chartStartDate);

    for (let i = 0; i <= totalDays; i++) {
      days.push(
        <View key={i} style={[styles.timelineDay, { width: dayWidth }]}>
          <Text style={styles.timelineDayText}>
            {currentDate.getDate()}/{currentDate.getMonth() + 1}
          </Text>
          <Text style={styles.timelineDayNumber}>{currentDate.getDate()}</Text>
          {currentDate.setDate(currentDate.getDate() + 1)}
        </View>
      );
    }

    return days;
  };

  const renderTasks = () => {
    return items.map((item, index) => {
      const startOffset = getDaysFromStart(item.startDate);
      const duration = getDuration(item.startDate, item.endDate);

      return (
        <TouchableOpacity
          key={item.id}
          style={styles.taskRow}
          onPress={() => onItemPress(item)}
        >
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.taskDates}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
          <View style={styles.taskBarContainer}>
            <View
              style={[
                styles.taskBar,
                {
                  width: duration * dayWidth,
                  marginLeft: startOffset * dayWidth,
                  backgroundColor: getStatusColor(item.status),
                },
              ]}
            >
              <Text style={styles.taskBarText}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Диаграмма Ганта</Text>
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setScale(Math.max(0.5, scale - 0.1))}
          >
            <Ionicons name="remove" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setScale(Math.min(2, scale + 0.1))}
          >
            <Ionicons name="add" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timelineContainer}
      >
        <View style={styles.timeline}>
          {renderTimeline()}
        </View>
      </ScrollView>

      <ScrollView style={styles.tasksContainer}>
        {renderTasks()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  zoomControls: {
    flexDirection: 'row',
  },
  zoomButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  timelineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeline: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  timelineDay: {
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    padding: 4,
  },
  timelineDayText: {
    fontSize: 10,
    color: '#666',
  },
  timelineDayNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  taskInfo: {
    width: 150,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  taskBarContainer: {
    flex: 1,
    position: 'relative',
  },
  taskBar: {
    position: 'absolute',
    height: 30,
    top: 15,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  taskBarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
}); 