import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { parseDate, weeksAndDaysFromDDR, dueDateFromDDR, trimesterFromWeek } from '../utils/pregnancy';

export default function PregnancyCalculatorScreen() {
  const [ddrInput, setDdrInput] = useState('');

  const ddrDate = useMemo(() => parseDate(ddrInput), [ddrInput]);
  const wd = useMemo(() => weeksAndDaysFromDDR(ddrDate), [ddrDate]);
  const dueDate = useMemo(() => dueDateFromDDR(ddrDate), [ddrDate]);
  const trimester = useMemo(() => trimesterFromWeek(wd?.week), [wd?.week]);

  const formatDate = (d) => {
    if (!d) return '-';
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Pregnancy Calculator</Text>
        <Text style={styles.subtitle}>Enter your last menstrual period (DDR)</Text>

        <Text style={styles.label}>Date (DD/MM/YYYY)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 01/01/2025"
          placeholderTextColor="#9B8AC4"
          value={ddrInput}
          onChangeText={setDdrInput}
          keyboardType="numbers-and-punctuation"
        />

        {wd && (
          <View style={styles.results}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Current week</Text>
              <Text style={styles.resultValue}>Week {wd.week} – Day {wd.day}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Due date</Text>
              <Text style={styles.resultValue}>{formatDate(dueDate)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Trimester</Text>
              <Text style={styles.resultValue}>Trimester {trimester}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7B68B8', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#5A4A7B', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D4C8E8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  results: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#D4C8E8' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E8E0F0' },
  resultLabel: { fontSize: 16, color: '#5A4A7B' },
  resultValue: { fontSize: 16, fontWeight: '600', color: '#4A3F6B' },
});
