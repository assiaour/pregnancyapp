import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { parseDate, weeksAndDaysFromDDR, dueDateFromDDR, trimesterFromWeek } from '../utils/pregnancy';
import { useNavigation } from '@react-navigation/native';

export default function PregnancyCalculatorScreen() {
  const navigation = useNavigation();
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>&lt; Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Pregnancy Calculator</Text>
          <Text style={styles.subtitle}>Enter your last menstrual period (DDR)</Text>
        </View>

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
              <View style={styles.resultValueBadge}>
                <Text style={styles.resultValue}>Week {wd.week} – Day {wd.day}</Text>
              </View>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Due date</Text>
              <View style={styles.resultValueBadge}>
                <Text style={styles.resultValue}>{formatDate(dueDate)}</Text>
              </View>
            </View>
            <View style={[styles.resultRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.resultLabel}>Trimester</Text>
              <View style={styles.resultValueBadge}>
                <Text style={styles.resultValue}>Trimester {trimester}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtnText: {
    fontSize: 15,
    color: '#1A1824',
    fontWeight: '700',
  },
  scroll: { paddingHorizontal: 24, paddingVertical: 20 },
  headerContainer: {
    marginBottom: 32,
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4656',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1824',
    marginBottom: 32,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  results: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F6FB',
  },
  resultLabel: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
  },
  resultValueBadge: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9A75F0',
  },
});
