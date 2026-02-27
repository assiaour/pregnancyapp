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

const CONTRACTIONS_OPTIONS = [
  { id: 'jamais', label: 'Jamais' },
  { id: 'parfois', label: 'Parfois' },
  { id: 'souvent', label: 'Souvent' },
];

export default function CreateAccountStep5Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [frequenceContractions, setFrequenceContractions] = useState('');
  const [perteLiquide, setPerteLiquide] = useState('');
  const [saignementVaginal, setSaignementVaginal] = useState('');
  const [preparationAccouchement, setPreparationAccouchement] = useState('');
  const [sommeilAnxiete, setSommeilAnxiete] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!frequenceContractions) {
      setError('Veuillez indiquer la fréquence des contractions.');
      return;
    }
    if (!perteLiquide) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!saignementVaginal) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!preparationAccouchement) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!sommeilAnxiete) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    navigation.navigate('CreateAccountStep6', {
      ...(route.params || {}),
      frequenceContractions,
      perteLiquide,
      saignementVaginal,
      preparationAccouchement,
      sommeilAnxiete,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Troisième trimestre</Text>
          <Text style={styles.subtitle}>28–40 semaines</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            <Text style={styles.label}>Fréquence des contractions ?</Text>
            <View style={styles.optionsRow}>
              {CONTRACTIONS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.smallChip,
                    frequenceContractions === opt.id && styles.optionChipSelected,
                  ]}
                  onPress={() => setFrequenceContractions(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.smallChipText,
                      frequenceContractions === opt.id && styles.optionChipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Perte de liquide amniotique ?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionChip, perteLiquide === 'oui' && styles.optionChipSelected]}
                onPress={() => setPerteLiquide('oui')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, perteLiquide === 'oui' && styles.optionChipTextSelected]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionChip, perteLiquide === 'non' && styles.optionChipSelected]}
                onPress={() => setPerteLiquide('non')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, perteLiquide === 'non' && styles.optionChipTextSelected]}>Non</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Présence de saignement vaginal ?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionChip, saignementVaginal === 'oui' && styles.optionChipSelected]}
                onPress={() => setSaignementVaginal('oui')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, saignementVaginal === 'oui' && styles.optionChipTextSelected]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionChip, saignementVaginal === 'non' && styles.optionChipSelected]}
                onPress={() => setSaignementVaginal('non')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, saignementVaginal === 'non' && styles.optionChipTextSelected]}>Non</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Préparation à l'accouchement (cours / plan) ?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionChip, preparationAccouchement === 'oui' && styles.optionChipSelected]}
                onPress={() => setPreparationAccouchement('oui')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, preparationAccouchement === 'oui' && styles.optionChipTextSelected]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionChip, preparationAccouchement === 'non' && styles.optionChipSelected]}
                onPress={() => setPreparationAccouchement('non')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, preparationAccouchement === 'non' && styles.optionChipTextSelected]}>Non</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Soucis de sommeil ou anxiété ?</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionChip, sommeilAnxiete === 'oui' && styles.optionChipSelected]}
                onPress={() => setSommeilAnxiete('oui')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, sommeilAnxiete === 'oui' && styles.optionChipTextSelected]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionChip, sommeilAnxiete === 'non' && styles.optionChipSelected]}
                onPress={() => setSommeilAnxiete('non')}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionChipText, sommeilAnxiete === 'non' && styles.optionChipTextSelected]}>Non</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Suivant</Text>
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
  title: { fontSize: 26, fontWeight: 'bold', color: '#4A3F6B', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#7B68B8', textAlign: 'center', marginBottom: 24 },
  errorText: { color: '#B84A4A', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#5A4A7B', marginBottom: 8 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  optionChip: {
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2,
    borderColor: '#D4C8E8', backgroundColor: '#fff',
  },
  smallChip: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 2,
    borderColor: '#D4C8E8', backgroundColor: '#fff',
  },
  smallChipText: { fontSize: 14, color: '#5A4A7B', fontWeight: '600' },
  optionChipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  optionChipText: { fontSize: 15, color: '#5A4A7B', fontWeight: '600' },
  optionChipTextSelected: { color: '#fff' },
  primaryButton: {
    backgroundColor: '#7B68B8', paddingVertical: 18, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
    shadowColor: '#7B68B8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: { alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  backButtonText: { fontSize: 16, color: '#7B68B8', fontWeight: '600' },
});
