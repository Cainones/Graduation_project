import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CalendarViewProps {
  items: any[];
  onItemPress: (item: any) => void;
}

export default function CalendarView({ items, onItemPress }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const screenWidth = Dimensions.get('window').width;
  const dayWidth = screenWidth / 7;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
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

  const renderMonthHeader = () => {
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    return (
      <View style={styles.monthHeader}>
        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentMonth(newDate);
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentMonth(newDate);
          }}
        >
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDays = () => {
    const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return (
      <View style={styles.weekDays}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={[styles.day, { width: dayWidth }]} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayItems = items.filter((item) => {
        const itemStart = new Date(item.startDate);
        const itemEnd = new Date(item.endDate);
        return date >= itemStart && date <= itemEnd;
      });

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.day, { width: dayWidth }]}
          onPress={() => {
            if (dayItems.length > 0) {
              onItemPress(dayItems[0]);
            }
          }}
        >
          <Text style={styles.dayNumber}>{day}</Text>
          {dayItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.eventIndicator,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
          ))}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      {renderMonthHeader()}
      {renderWeekDays()}
      <ScrollView>
        <View style={styles.daysContainer}>{renderDays()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    color: '#666',
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    height: 60,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    padding: 4,
  },
  dayNumber: {
    fontSize: 12,
    color: '#666',
  },
  eventIndicator: {
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
}); 