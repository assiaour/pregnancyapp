import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Parse DD/MM/YYYY or DD-MM-YYYY to Date; returns null if invalid
function parseDate(str) {
  if (!str || !str.trim()) return null;
  const parts = str.trim().split(/[/-]/);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return d;
}

// Gestational weeks from DDR (first day of last period)
function weeksFromDDR(ddrDate) {
  if (!ddrDate || !(ddrDate instanceof Date) || isNaN(ddrDate.getTime())) return null;
  const today = new Date();
  const diff = today.getTime() - ddrDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  return Math.floor(days / 7);
}

const TYPES_ACCOUCHEMENT = [
  { id: 'cesarienne', label: 'Césarienne' },
  { id: 'naturel', label: 'Naturel' },
  { id: 'autre', label: 'Autre' },
];

export default function CreateAccountStep2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { nom, dateNaissance, mail, nombreEnfants, username, password } = route.params || {};

  const [ddr, setDdr] = useState('');
  const [nombreGrossessesPrecedentes, setNombreGrossessesPrecedentes] = useState('');
  const [nombreAccouchements, setNombreAccouchements] = useState('');
  const [typeAccouchement, setTypeAccouchement] = useState('');
  const [complicationsOuiNon, setComplicationsOuiNon] = useState('');
  const [complicationsDetails, setComplicationsDetails] = useState('');
  const [error, setError] = useState('');

  const ddrDate = useMemo(() => parseDate(ddr), [ddr]);
  const semaineGrossesse = useMemo(() => weeksFromDDR(ddrDate), [ddrDate]);

  const handleFinish = () => {
    setError('');
    if (!ddr.trim()) {
      setError('Veuillez entrer la date des dernières règles (DDR).');
      return;
    }
    if (!ddrDate) {
      setError('Format de date invalide. Utilisez JJ/MM/AAAA.');
      return;
    }
    const nGross = parseInt(nombreGrossessesPrecedentes, 10);
    if (nombreGrossessesPrecedentes === '' || isNaN(nGross) || nGross < 0) {
      setError('Veuillez entrer le nombre de grossesses précédentes (0 ou plus).');
      return;
    }
    const nAcc = parseInt(nombreAccouchements, 10);
    if (nombreAccouchements === '' || isNaN(nAcc) || nAcc < 0) {
      setError('Veuillez entrer le nombre d\'accouchements (0 ou plus).');
      return;
    }
    if (!typeAccouchement) {
      setError('Veuillez sélectionner le type d\'accouchement.');
      return;
    }
    if (!complicationsOuiNon) {
      setError('Veuillez indiquer la présence de complications précédentes.');
      return;
    }
    if (complicationsOuiNon === 'oui' && !complicationsDetails.trim()) {
      setError('Veuillez préciser les complications.');
      return;
    }
    navigation.navigate('CreateAccountStep3', {
      nom,
      dateNaissance,
      mail,
      nombreEnfants,
      username,
      password,
      ddr,
      nombreGrossessesPrecedentes,
      nombreAccouchements,
      typeAccouchement,
      complicationsOuiNon,
      complicationsDetails,
      semaineGrossesse: semaineGrossesse != null ? semaineGrossesse : null,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Grossesse</Text>
            <Text style={styles.subtitle}>Étape 2 – Informations de grossesse</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.form}>
              <Text style={styles.label}>DDR – Date des dernières règles</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#9B8AC4"
                value={ddr}
                onChangeText={setDdr}
                keyboardType="numbers-and-punctuation"
              />

              <Text style={styles.label}>Semaine de grossesse (calculée)</Text>
              <View style={styles.autoValueBox}>
                <Text style={styles.autoValueText}>
                  {semaineGrossesse != null ? `${semaineGrossesse} SA` : 'Saisissez la DDR'}
                </Text>
              </View>

              <Text style={styles.label}>Nombre de grossesses précédentes</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9B8AC4"
                value={nombreGrossessesPrecedentes}
                onChangeText={setNombreGrossessesPrecedentes}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Nombre d'accouchements</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9B8AC4"
                value={nombreAccouchements}
                onChangeText={setNombreAccouchements}
                keyboardType="number-pad"
              />

              <Text style={styles.label}>Type d'accouchement</Text>
              <View style={styles.optionsRow}>
                {TYPES_ACCOUCHEMENT.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.optionChip,
                      typeAccouchement === t.id && styles.optionChipSelected,
                    ]}
                    onPress={() => setTypeAccouchement(t.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        typeAccouchement === t.id && styles.optionChipTextSelected,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Présence de complications précédentes</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    complicationsOuiNon === 'oui' && styles.optionChipSelected,
                  ]}
                  onPress={() => setComplicationsOuiNon('oui')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      complicationsOuiNon === 'oui' && styles.optionChipTextSelected,
                    ]}
                  >
                    Oui
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    complicationsOuiNon === 'non' && styles.optionChipSelected,
                  ]}
                  onPress={() => setComplicationsOuiNon('non')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      complicationsOuiNon === 'non' && styles.optionChipTextSelected,
                    ]}
                  >
                    Non
                  </Text>
                </TouchableOpacity>
              </View>

              {complicationsOuiNon === 'oui' ? (
                <>
                  <Text style={styles.label}>Précisez les complications</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Décrivez les complications..."
                    placeholderTextColor="#9B8AC4"
                    value={complicationsDetails}
                    onChangeText={setComplicationsDetails}
                    multiline
                    numberOfLines={3}
                  />
                </>
              ) : null}

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  content: {
    paddingHorizontal: 30,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#B84A4A',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  form: { marginBottom: 24 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A4A7B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D4C8E8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  autoValueBox: {
    backgroundColor: '#E8E0F0',
    borderWidth: 2,
    borderColor: '#D4C8E8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  autoValueText: {
    fontSize: 16,
    color: '#4A3F6B',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
  },
  optionChipSelected: {
    borderColor: '#7B68B8',
    backgroundColor: '#7B68B8',
  },
  optionChipText: {
    fontSize: 15,
    color: '#5A4A7B',
    fontWeight: '600',
  },
  optionChipTextSelected: {
    color: '#fff',
  },
  primaryButton: {
    backgroundColor: '#7B68B8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#7B68B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#7B68B8',
    fontWeight: '600',
  },
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
    marginBottom: 8,
  },
  successHint: {
    fontSize: 14,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 32,
  },
});
