import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ProgressChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  onProgressChange: (newProgress: number) => void;
}

export default function ProgressChart({ data, onProgressChange }: ProgressChartProps) {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = (value: number) => {
    setProgress(value);
    onProgressChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>График прогресса</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Прогресс: {progress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressControls}>
            <TouchableOpacity
              style={styles.progressButton}
              onPress={() => handleProgressChange(Math.max(0, progress - 10))}
            >
              <Ionicons name="remove" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.progressButton}
              onPress={() => handleProgressChange(Math.min(100, progress + 10))}
            >
              <Ionicons name="add" size={24} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  progressButton: {
    padding: 8,
    marginHorizontal: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
}); 