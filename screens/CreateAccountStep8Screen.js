import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://YOUR-RENDER-API-URL.onrender.com';

export default function CreateAccountStep8Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useUser();

  const [suiviPoids, setSuiviPoids] = useState('');
  const [suiviTension, setSuiviTension] = useState('');
  const [suiviMouvementsFoetaux, setSuiviMouvementsFoetaux] = useState('');
  const [notificationsRdv, setNotificationsRdv] = useState('');
  const [infosParTrimestre, setInfosParTrimestre] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const payload = {
    ...(route.params || {}),
    suiviPoids,
    suiviTension,
    suiviMouvementsFoetaux,
    notificationsRdv,
    infosParTrimestre,
  };

  const handleSubmit = async () => {
    setError('');
    if (!suiviPoids || !suiviTension || !suiviMouvementsFoetaux || !notificationsRdv || !infosParTrimestre) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!API_BASE_URL || API_BASE_URL.includes('YOUR-RENDER-API-URL')) {
      setError("Configurez l'URL de l'API (EXPO_PUBLIC_API_BASE_URL) avant d'enregistrer.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(
        `${API_BASE_URL.replace(/\/$/, '')}/api/accounts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur serveur');
      }
      setCreated(true);
    } catch (e) {
      setError(e.message || 'Impossible de créer le compte.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToApp = () => {
    login(payload.mail, payload.ddr, payload.semaineGrossesse);
    navigation.replace('MainTabs');
  };

  if (created) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Compte créé</Text>
          <Text style={styles.successText}>
            Vos informations ont été enregistrées avec succès.
          </Text>
          <View style={styles.successButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={goToApp}
            >
              <Text style={styles.primaryButtonText}>Continuer vers l'app</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, styles.secondaryButton]}
              onPress={() => navigation.navigate('Account', { email: payload.mail })}
            >
              <Text style={styles.secondaryButtonText}>Voir mon compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Objectifs de suivi</Text>
          <Text style={styles.subtitle}>Section 6</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            <QuestionOuiNon
              label="Suivi du poids"
              value={suiviPoids}
              onChange={setSuiviPoids}
            />
            <QuestionOuiNon
              label="Suivi tension artérielle"
              value={suiviTension}
              onChange={setSuiviTension}
            />
            <QuestionOuiNon
              label="Suivi mouvements fœtaux"
              value={suiviMouvementsFoetaux}
              onChange={setSuiviMouvementsFoetaux}
            />
            <QuestionOuiNon
              label="Notifications pour rendez-vous médicaux"
              value={notificationsRdv}
              onChange={setNotificationsRdv}
            />
            <QuestionOuiNon
              label="Informations personnalisées selon trimestre"
              value={infosParTrimestre}
              onChange={setInfosParTrimestre}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Terminer</Text>
              )}
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

function QuestionOuiNon({ label, value, onChange }) {
  return (
    <View style={styles.questionBlock}>
      <Text style={styles.label}>{label} :</Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.optionChip, value === 'oui' && styles.optionChipSelected]}
          onPress={() => onChange('oui')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionChipText,
              value === 'oui' && styles.optionChipTextSelected,
            ]}
          >
            Oui
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionChip, value === 'non' && styles.optionChipSelected]}
          onPress={() => onChange('non')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.optionChipText,
              value === 'non' && styles.optionChipTextSelected,
            ]}
          >
            Non
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 16,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: { color: '#B84A4A', fontSize: 14, marginBottom: 12, textAlign: 'center' },
  form: { marginBottom: 24 },
  questionBlock: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#5A4A7B', marginBottom: 8 },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
  },
  optionChipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  optionChipText: { fontSize: 15, color: '#5A4A7B', fontWeight: '600' },
  optionChipTextSelected: { color: '#fff' },
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
  successButtons: {
    gap: 12,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7B68B8',
  },
  secondaryButtonText: {
    color: '#7B68B8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

