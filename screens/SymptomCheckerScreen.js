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
  { id: 'nausea', label: 'Nausée' },
  { id: 'back_pain', label: 'Mal de dos' },
  { id: 'headache', label: 'Maux de tête' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'heartburn', label: 'Brûlures d\'estomac' },
  { id: 'swelling', label: 'Gonflement' },
  { id: 'constipation', label: 'Constipation' },
  { id: 'braxton_hicks', label: 'Contractions de Braxton Hicks' },
];

const RECOMMENDATIONS = {
  nausea: 'Mangez de petits repas fréquents. Évitez les odeurs fortes. Le thé au gingembre peut aider. Restez hydratée.',
  back_pain: 'Adoptez une bonne posture. Essayez le yoga prénatal ou des étirements doux. Envisagez un coussin de soutien.',
  headache: 'Reposez-vous dans une pièce sombre. Restez hydratée. Consultez votre médecin avant de prendre tout médicament.',
  fatigue: 'Reposez-vous dès que possible. De l\'exercice léger peut aider. Veillez à un apport adéquat en fer et en sommeil.',
  heartburn: 'Mangez de plus petits repas. Évitez les aliments épicés ou gras. Dormez en position légèrement surélevée.',
  swelling: 'Surelevez vos pieds dès que possible. Restez hydratée. Évitez de rester debout pendant de longues périodes.',
  constipation: 'Augmentez votre apport en fibres. Buvez beaucoup d\'eau. La marche légère peut aider.',
  braxton_hicks: 'Changez de position. Reposez-vous. Restez hydratée. Si elles sont fréquentes ou douloureuses, contactez votre médecin.',
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
          <Text style={styles.backBtnText}>&lt; Retour</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Vérificateur de symptômes</Text>
          <Text style={styles.subtitle}>Sélectionnez vos symptômes pour obtenir des recommandations</Text>
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
            <Text style={styles.recTitle}>Recommandations</Text>
            {selected.map((id) => (
              <View key={id} style={styles.recItem}>
                <Text style={styles.recSymptom}>{SYMPTOMS.find((x) => x.id === id)?.label}</Text>
                <Text style={styles.recText}>{RECOMMENDATIONS[id]}</Text>
              </View>
            ))}
            <Text style={styles.disclaimer}>Consultez toujours votre professionnel de santé pour un avis médical.</Text>
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
