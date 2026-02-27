import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const VACCINS_LIST = [
  { id: 'grippe', label: 'Grippe' },
  { id: 'coqueluche', label: 'Coqueluche (DTP)' },
  { id: 'covid', label: 'COVID-19' },
  { id: 'rro', label: 'Rougeole-Rubéole-Oreillons (RRO)' },
  { id: 'hepatite_b', label: 'Hépatite B' },
  { id: 'autres', label: 'Autres' },
];

const OUI_NON_QUESTIONS = [
  { id: 'diabeteAvant', label: 'Diabète avant grossesse' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'thyroide', label: 'Thyroïde ou autres maladies endocriniennes' },
  { id: 'cardiaques', label: 'Maladies cardiaques' },
  { id: 'antecedentsFamiliaux', label: 'Antécédents familiaux de complications (fausses couches, prééclampsie, malformations)' },
];

export default function CreateAccountStep6Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [diabeteAvant, setDiabeteAvant] = useState('');
  const [hypertension, setHypertension] = useState('');
  const [thyroide, setThyroide] = useState('');
  const [cardiaques, setCardiaques] = useState('');
  const [antecedentsFamiliaux, setAntecedentsFamiliaux] = useState('');
  const [vaccins, setVaccins] = useState({});
  const [error, setError] = useState('');

  const answers = { diabeteAvant, hypertension, thyroide, cardiaques, antecedentsFamiliaux };
  const setters = {
    diabeteAvant: setDiabeteAvant,
    hypertension: setHypertension,
    thyroide: setThyroide,
    cardiaques: setCardiaques,
    antecedentsFamiliaux: setAntecedentsFamiliaux,
  };

  const toggleVaccin = (id) => {
    setVaccins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFinish = () => {
    setError('');
    for (const q of OUI_NON_QUESTIONS) {
      if (!answers[q.id]) {
        setError('Veuillez répondre à toutes les questions.');
        return;
      }
    }
    navigation.navigate('CreateAccountStep7', {
      ...(route.params || {}),
      diabeteAvant,
      hypertension,
      thyroide,
      cardiaques,
      antecedentsFamiliaux,
      vaccins: vaccins,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Maladies / risques spécifiques</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            {OUI_NON_QUESTIONS.map((q) => (
              <View key={q.id} style={styles.questionBlock}>
                <Text style={styles.label}>{q.label} :</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[styles.optionChip, answers[q.id] === 'oui' && styles.optionChipSelected]}
                    onPress={() => setters[q.id]('oui')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionChipText, answers[q.id] === 'oui' && styles.optionChipTextSelected]}>Oui</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionChip, answers[q.id] === 'non' && styles.optionChipSelected]}
                    onPress={() => setters[q.id]('non')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optionChipText, answers[q.id] === 'non' && styles.optionChipTextSelected]}>Non</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <Text style={styles.label}>Vaccinations faites avant et pendant grossesse :</Text>
            <View style={styles.checkboxList}>
              {VACCINS_LIST.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.checkboxRow}
                  onPress={() => toggleVaccin(v.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, vaccins[v.id] && styles.checkboxChecked]}>
                    {vaccins[v.id] ? <Text style={styles.checkmark}>✓</Text> : null}
                  </View>
                  <Text style={styles.checkboxLabel}>{v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleFinish} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Terminer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Étape précédente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  scrollContent: { flexGrow: 1, paddingVertical: 40 },
  content: { paddingHorizontal: 30, alignItems: 'stretch' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4A3F6B', marginBottom: 24, textAlign: 'center' },
  errorText: { color: '#B84A4A', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  form: { marginBottom: 24 },
  questionBlock: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#5A4A7B', marginBottom: 8 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionChip: {
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2,
    borderColor: '#D4C8E8', backgroundColor: '#fff',
  },
  optionChipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  optionChipText: { fontSize: 15, color: '#5A4A7B', fontWeight: '600' },
  optionChipTextSelected: { color: '#fff' },
  checkboxList: { marginBottom: 24 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D4C8E8',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  checkboxChecked: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 15, color: '#5A4A7B', flex: 1 },
  primaryButton: {
    backgroundColor: '#7B68B8', paddingVertical: 18, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: '#7B68B8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  backButtonText: { fontSize: 16, color: '#7B68B8', fontWeight: '600' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  successTitle: { fontSize: 26, fontWeight: 'bold', color: '#4A3F6B', marginBottom: 16, textAlign: 'center' },
  successText: { fontSize: 16, color: '#5A4A7B', textAlign: 'center', marginBottom: 32 },
});
