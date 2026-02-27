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

const ACTIVITE_OPTIONS = [
  { id: 'jamais', label: 'Jamais' },
  { id: 'occasionnel', label: 'Occasionnel' },
  { id: 'regulier', label: 'Régulier' },
];

const REGIME_OPTIONS = [
  { id: 'normal', label: 'Normal' },
  { id: 'sucre', label: 'Sucré' },
  { id: 'sale', label: 'Salé' },
  { id: 'vegetarien', label: 'Végétarien' },
  { id: 'autre', label: 'Autre' },
];

const SOUTIEN_OPTIONS = [
  { id: 'faible', label: 'Faible' },
  { id: 'moyen', label: 'Moyen' },
  { id: 'fort', label: 'Fort' },
];

const SUIVI_OPTIONS = [
  { id: 'application', label: 'Application' },
  { id: 'medecin', label: 'Médecin' },
  { id: 'sage_femme', label: 'Sage-femme' },
  { id: 'mixte', label: 'Mixte' },
];

function OptionRow({ options, value, onSelect, style }) {
  return (
    <View style={[styles.optionsRow, style]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[styles.optionChip, value === opt.id && styles.optionChipSelected]}
          onPress={() => onSelect(opt.id)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionChipText,
              value === opt.id && styles.optionChipTextSelected,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function CreateAccountStep7Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [tabacChicha, setTabacChicha] = useState('');
  const [alcool, setAlcool] = useState('');
  const [activitePhysique, setActivitePhysique] = useState('');
  const [regimeAlimentaire, setRegimeAlimentaire] = useState('');
  const [soutienFamilial, setSoutienFamilial] = useState('');
  const [preferenceSuivi, setPreferenceSuivi] = useState('');
  const [error, setError] = useState('');

  const handleFinish = () => {
    setError('');
    if (!tabacChicha) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!alcool) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!activitePhysique) {
      setError('Veuillez indiquer l\'activité physique.');
      return;
    }
    if (!regimeAlimentaire) {
      setError('Veuillez indiquer le régime alimentaire.');
      return;
    }
    if (!soutienFamilial) {
      setError('Veuillez indiquer le soutien familial et conjugal.');
      return;
    }
    if (!preferenceSuivi) {
      setError('Veuillez indiquer les préférences de suivi.');
      return;
    }
    navigation.navigate('CreateAccountStep8', {
      ...(route.params || {}),
      tabacChicha,
      alcool,
      activitePhysique,
      regimeAlimentaire,
      soutienFamilial,
      preferenceSuivi,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Habitudes et culture</Text>
          <Text style={styles.subtitle}>
            Pour s'adapter à la vie quotidienne des femmes en Algérie
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            <Text style={styles.label}>Consommation de tabac ou chicha :</Text>
            <OptionRow
              options={[{ id: 'oui', label: 'Oui' }, { id: 'non', label: 'Non' }]}
              value={tabacChicha}
              onSelect={setTabacChicha}
            />

            <Text style={styles.label}>Consommation d'alcool :</Text>
            <OptionRow
              options={[{ id: 'oui', label: 'Oui' }, { id: 'non', label: 'Non' }]}
              value={alcool}
              onSelect={setAlcool}
            />

            <Text style={styles.label}>Activité physique (marche, exercices doux) :</Text>
            <OptionRow
              options={ACTIVITE_OPTIONS}
              value={activitePhysique}
              onSelect={setActivitePhysique}
            />

            <Text style={styles.label}>Régime alimentaire :</Text>
            <OptionRow
              options={REGIME_OPTIONS}
              value={regimeAlimentaire}
              onSelect={setRegimeAlimentaire}
            />

            <Text style={styles.label}>Soutien familial et conjugal :</Text>
            <OptionRow
              options={SOUTIEN_OPTIONS}
              value={soutienFamilial}
              onSelect={setSoutienFamilial}
            />

            <Text style={styles.label}>Préférences de suivi :</Text>
            <OptionRow
              options={SUIVI_OPTIONS}
              value={preferenceSuivi}
              onSelect={setPreferenceSuivi}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleFinish}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Terminer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  errorText: { color: '#B84A4A', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#5A4A7B', marginBottom: 8 },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
  },
  optionChipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  optionChipText: { fontSize: 14, color: '#5A4A7B', fontWeight: '600' },
  optionChipTextSelected: { color: '#fff' },
  primaryButton: {
    backgroundColor: '#7B68B8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#7B68B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  backButtonText: { fontSize: 16, color: '#7B68B8', fontWeight: '600' },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#5A4A7B',
    textAlign: 'center',
    marginBottom: 32,
  },
});
