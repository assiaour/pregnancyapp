import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ToolsScreen() {
  const navigation = useNavigation();

  const tools = [
    { id: 'WeekDetails', title: 'Taille des fœtus', subtitle: 'Carousel semaine par semaine', icon: '👶' },
    { id: 'BabySize', title: 'Comparaison des tailles', subtitle: 'Comparaison avec des fruits', icon: '📏' },
    { id: 'Calculator', title: 'Calculatrice de grossesse', subtitle: 'Semaine, terme, trimestre', icon: '🧮' },
    { id: 'SymptomChecker', title: 'Vérificateur de symptômes', subtitle: 'Obtenez des recommandations', icon: '🩺' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Outils</Text>
          <Text style={styles.subtitle}>Outils pratiques et calculatrices pour votre grossesse</Text>
        </View>

        {tools.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.card}
            onPress={() => navigation.navigate(t.id)}
            activeOpacity={0.8}
          >
            <View style={styles.iconBox}>
              <Text style={styles.cardIcon}>{t.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
    lineHeight: 22,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: { fontSize: 28 },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1824',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8A8696',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#9A75F0',
    fontWeight: '700',
    marginLeft: 8,
  },
});
