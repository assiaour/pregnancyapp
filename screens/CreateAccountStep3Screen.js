import React, { useState } from 'react';
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

const NAUSEES_OPTIONS = [
  { id: 'jamais', label: 'Jamais' },
  { id: 'parfois', label: 'Parfois' },
  { id: 'souvent', label: 'Souvent' },
];

export default function CreateAccountStep3Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [nauseesVomissements, setNauseesVomissements] = useState('');
  const [fatigueExcessive, setFatigueExcessive] = useState('');
  const [douleursAbdominales, setDouleursAbdominales] = useState('');
  const [priseMedicaments, setPriseMedicaments] = useState('');
  const [medicamentsDetails, setMedicamentsDetails] = useState('');
  const [antecedentsFaussesCouches, setAntecedentsFaussesCouches] = useState('');
  const [error, setError] = useState('');

  const handleFinish = () => {
    setError('');
    if (!nauseesVomissements) {
      setError('Veuillez indiquer nausées/vomissements.');
      return;
    }
    if (!fatigueExcessive) {
      setError('Veuillez indiquer si fatigue excessive.');
      return;
    }
    if (!douleursAbdominales) {
      setError('Veuillez indiquer douleurs abdominales inhabituelles.');
      return;
    }
    if (!priseMedicaments) {
      setError('Veuillez indiquer la prise de médicaments.');
      return;
    }
    if (priseMedicaments === 'oui' && !medicamentsDetails.trim()) {
      setError('Veuillez préciser les médicaments.');
      return;
    }
    navigation.navigate('CreateAccountStep4', {
      ...(route.params || {}),
      nauseesVomissements,
      fatigueExcessive,
      douleursAbdominales,
      priseMedicaments,
      medicamentsDetails,
      antecedentsFaussesCouches,
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
            <Text style={styles.title}>Premier trimestre</Text>
            <Text style={styles.subtitle}>5–13 semaines</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.form}>
              <Text style={styles.label}>Avez-vous des nausées ou vomissements ?</Text>
              <View style={styles.optionsRow}>
                {NAUSEES_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.smallChip,
                      nauseesVomissements === opt.id && styles.optionChipSelected,
                    ]}
                    onPress={() => setNauseesVomissements(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.smallChipText,
                        nauseesVomissements === opt.id && styles.optionChipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Fatigue excessive</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    fatigueExcessive === 'oui' && styles.optionChipSelected,
                  ]}
                  onPress={() => setFatigueExcessive('oui')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      fatigueExcessive === 'oui' && styles.optionChipTextSelected,
                    ]}
                  >
                    Oui
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    fatigueExcessive === 'non' && styles.optionChipSelected,
                  ]}
                  onPress={() => setFatigueExcessive('non')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      fatigueExcessive === 'non' && styles.optionChipTextSelected,
                    ]}
                  >
                    Non
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Douleurs abdominales inhabituelles</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    douleursAbdominales === 'oui' && styles.optionChipSelected,
                  ]}
                  onPress={() => setDouleursAbdominales('oui')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      douleursAbdominales === 'oui' && styles.optionChipTextSelected,
                    ]}
                  >
                    Oui
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    douleursAbdominales === 'non' && styles.optionChipSelected,
                  ]}
                  onPress={() => setDouleursAbdominales('non')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      douleursAbdominales === 'non' && styles.optionChipTextSelected,
                    ]}
                  >
                    Non
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Prise de médicaments</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    priseMedicaments === 'oui' && styles.optionChipSelected,
                  ]}
                  onPress={() => setPriseMedicaments('oui')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      priseMedicaments === 'oui' && styles.optionChipTextSelected,
                    ]}
                  >
                    Oui
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    priseMedicaments === 'non' && styles.optionChipSelected,
                  ]}
                  onPress={() => setPriseMedicaments('non')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      priseMedicaments === 'non' && styles.optionChipTextSelected,
                    ]}
                  >
                    Non
                  </Text>
                </TouchableOpacity>
              </View>

              {priseMedicaments === 'oui' ? (
                <>
                  <Text style={styles.label}>Précisez les médicaments</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Liste ou description des médicaments..."
                    placeholderTextColor="#9B8AC4"
                    value={medicamentsDetails}
                    onChangeText={setMedicamentsDetails}
                    multiline
                    numberOfLines={3}
                  />
                </>
              ) : null}

              <Text style={styles.label}>Antécédents de fausses couches</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez si applicable..."
                placeholderTextColor="#9B8AC4"
                value={antecedentsFaussesCouches}
                onChangeText={setAntecedentsFaussesCouches}
                multiline
                numberOfLines={3}
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 4,
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
  smallChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
  },
  smallChipText: {
    fontSize: 14,
    color: '#5A4A7B',
    fontWeight: '600',
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
    marginBottom: 32,
  },
});
