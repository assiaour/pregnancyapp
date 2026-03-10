import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

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
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Symptom Checker</Text>
        <Text style={styles.subtitle}>Select your symptoms for recommendations</Text>

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
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7B68B8', marginBottom: 24 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
  },
  chipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  chipText: { fontSize: 15, color: '#5A4A7B', fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  recommendations: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 2, borderColor: '#D4C8E8' },
  recTitle: { fontSize: 18, fontWeight: '700', color: '#4A3F6B', marginBottom: 16 },
  recItem: { marginBottom: 16 },
  recSymptom: { fontSize: 16, fontWeight: '600', color: '#5A4A7B', marginBottom: 4 },
  recText: { fontSize: 14, color: '#7B68B8', lineHeight: 20 },
  disclaimer: { fontSize: 12, color: '#9B8AC4', marginTop: 12, fontStyle: 'italic' },
});
