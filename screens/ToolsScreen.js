import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ToolsScreen() {
  const navigation = useNavigation();

  const tools = [
    { id: 'BabyDev', title: 'Baby Development', subtitle: 'Week by week carousel', icon: '👶' },
    { id: 'BabySize', title: 'Baby Size Comparison', subtitle: 'Fruit/seed comparison', icon: '📏' },
    { id: 'Calculator', title: 'Pregnancy Calculator', subtitle: 'Week, due date, trimester', icon: '🧮' },
    { id: 'SymptomChecker', title: 'Symptom Checker', subtitle: 'Get recommendations', icon: '🩺' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Tools</Text>
        <Text style={styles.subtitle}>Functional tools for your pregnancy</Text>

        {tools.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => navigation.navigate(t.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>{t.icon}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7B68B8', marginBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#4A3F6B' },
  cardSubtitle: { fontSize: 14, color: '#7B68B8', marginTop: 4 },
  arrow: { fontSize: 18, color: '#7B68B8' },
});
