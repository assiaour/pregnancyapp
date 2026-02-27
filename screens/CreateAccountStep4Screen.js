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

const OUI_NON_QUESTIONS = [
  { id: 'gonflement', label: 'Gonflement des jambes / mains ?' },
  { id: 'douleursDorsales', label: 'Douleurs dorsales ou lombaires ?' },
  { id: 'mouvementFoetus', label: 'Mouvement du fœtus perçu ?' },
  { id: 'testDiabete', label: 'Test de diabète gestationnel fait ?' },
  { id: 'pressionArterielle', label: 'Pression artérielle mesurée régulièrement ?' },
];

export default function CreateAccountStep4Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [gonflement, setGonflement] = useState('');
  const [douleursDorsales, setDouleursDorsales] = useState('');
  const [mouvementFoetus, setMouvementFoetus] = useState('');
  const [testDiabete, setTestDiabete] = useState('');
  const [pressionArterielle, setPressionArterielle] = useState('');
  const [error, setError] = useState('');

  const answers = {
    gonflement,
    douleursDorsales,
    mouvementFoetus,
    testDiabete,
    pressionArterielle,
  };

  const setAnswer = {
    gonflement: setGonflement,
    douleursDorsales: setDouleursDorsales,
    mouvementFoetus: setMouvementFoetus,
    testDiabete: setTestDiabete,
    pressionArterielle: setPressionArterielle,
  };

  const handleFinish = () => {
    setError('');
    if (!gonflement) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!douleursDorsales) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!mouvementFoetus) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!testDiabete) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    if (!pressionArterielle) {
      setError('Veuillez répondre à toutes les questions.');
      return;
    }
    navigation.navigate('CreateAccountStep5', {
      ...(route.params || {}),
      gonflement,
      douleursDorsales,
      mouvementFoetus,
      testDiabete,
      pressionArterielle,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Deuxième trimestre</Text>
          <Text style={styles.subtitle}>14–27 semaines</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.form}>
            {OUI_NON_QUESTIONS.map((q) => (
              <View key={q.id} style={styles.questionBlock}>
                <Text style={styles.label}>{q.label}</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionChip,
                      answers[q.id] === 'oui' && styles.optionChipSelected,
                    ]}
                    onPress={() => setAnswer[q.id]('oui')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        answers[q.id] === 'oui' && styles.optionChipTextSelected,
                      ]}
                    >
                      Oui
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionChip,
                      answers[q.id] === 'non' && styles.optionChipSelected,
                    ]}
                    onPress={() => setAnswer[q.id]('non')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        answers[q.id] === 'non' && styles.optionChipTextSelected,
                      ]}
                    >
                      Non
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

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
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
  },
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
  questionBlock: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A4A7B',
    marginBottom: 8,
  },
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
    marginTop: 12,
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
