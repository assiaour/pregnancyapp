import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SYMPTOMS = [
  { id: 'nausea', label: 'Nausea' },
  { id: 'back_pain', label: 'Back pain' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'heartburn', label: 'Heartburn' },
  { id: 'swelling', label: 'Swelling' },
  { id: 'constipation', label: 'Constipation' },
  { id: 'braxton_hicks', label: 'Braxton Hicks' },
];

const RECOMMENDATIONS = {
  nausea: 'Eat small, frequent meals. Avoid strong smells. Ginger tea may help. Stay hydrated.',
  back_pain: 'Use proper posture. Try prenatal yoga or gentle stretches. Consider a support pillow.',
  headache: 'Rest in a dark room. Stay hydrated. Check with your doctor before taking any medication.',
  fatigue: 'Rest when possible. Light exercise can help. Ensure adequate iron and sleep.',
  heartburn: 'Eat smaller meals. Avoid spicy/fatty foods. Sleep propped up slightly.',
  swelling: 'Elevate feet when possible. Stay hydrated. Avoid standing for long periods.',
  constipation: 'Increase fiber intake. Drink plenty of water. Light walking can help.',
  braxton_hicks: 'Change position. Rest. Stay hydrated. If frequent or painful, contact your doctor.',
};

export default function SymptomCheckerScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
          <Text style={styles.title}>Symptom Checker</Text>
          <Text style={styles.subtitle}>Select your symptoms to get recommendations</Text>
        </View>

        <View style={styles.chips}>
          {SYMPTOMS.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.chip, selected.includes(s.id) && styles.chipSelected]}
              onPress={() => toggle(s.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selected.includes(s.id) && styles.chipTextSelected]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected.length > 0 && (
          <View style={styles.recommendations}>
            <Text style={styles.recTitle}>Recommendations</Text>
            {selected.map((id) => (
              <View key={id} style={styles.recItem}>
                <Text style={styles.recSymptom}>{SYMPTOMS.find((x) => x.id === id)?.label}</Text>
                <Text style={styles.recText}>{RECOMMENDATIONS[id]}</Text>
              </View>
            ))}
            <Text style={styles.disclaimer}>Always consult your healthcare provider for medical advice.</Text>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: '#9A75F0',
  },
  chipText: {
    fontSize: 15,
    color: '#4A4656',
    fontWeight: '700'
  },
  chipTextSelected: {
    color: '#FFFFFF'
  },
  recommendations: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  recTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 20
  },
  recItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F6FB',
  },
  recSymptom: {
    fontSize: 16,
    fontWeight: '800',
    color: '#9A75F0',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recText: {
    fontSize: 15,
    color: '#4A4656',
    lineHeight: 22,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 13,
    color: '#8A8696',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
