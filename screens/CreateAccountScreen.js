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
import { useNavigation } from '@react-navigation/native';

export default function CreateAccountScreen() {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [mail, setMail] = useState('');
  const [nombreEnfants, setNombreEnfants] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!nom.trim()) {
      setError('Veuillez entrer votre nom.');
      return;
    }
    if (!dateNaissance.trim()) {
      setError('Veuillez entrer votre date de naissance.');
      return;
    }
    if (!mail.trim()) {
      setError('Veuillez entrer votre email.');
      return;
    }
    if (!username.trim()) {
      setError("Veuillez choisir un nom d'utilisateur.");
      return;
    }
    if (!password) {
      setError('Veuillez saisir un mot de passe.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    const n = parseInt(nombreEnfants, 10);
    if (nombreEnfants === '' || isNaN(n) || n < 0) {
      setError('Veuillez entrer le nombre d\'enfants (0 ou plus).');
      return;
    }
    navigation.navigate('CreateAccountStep2', {
      nom: nom.trim(),
      dateNaissance: dateNaissance.trim(),
      mail: mail.trim(),
      nombreEnfants: n,
      username: username.trim(),
      password,
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
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Étape 1 – Vos informations</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.form}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                placeholderTextColor="#9B8AC4"
                value={nom}
                onChangeText={setNom}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#9B8AC4"
                value={dateNaissance}
                onChangeText={setDateNaissance}
                keyboardType="numbers-and-punctuation"
              />

              <Text style={styles.label}>Mail</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor="#9B8AC4"
                value={mail}
                onChangeText={setMail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Nom d'utilisateur</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#9B8AC4"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#9B8AC4"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Text style={styles.label}>Nombre d'enfants</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9B8AC4"
                value={nombreEnfants}
                onChangeText={setNombreEnfants}
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Suivant</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Retour</Text>
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
});
