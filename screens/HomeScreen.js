import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { login } = useUser();

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleContinueToApp = () => {
    login('demo@test.com', '01/09/2024', 27);
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/download.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Message */}
        <Text style={styles.message}>
          Welcome to Your Pregnancy Journey
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.loginButtonText]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.demoButton]}
            onPress={handleContinueToApp}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.demoButtonText]}>Continue to App (Demo)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDECF9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginBottom: 48,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  message: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButton: {
    backgroundColor: '#9A75F0',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#1A1824',
  },
  demoButton: {
    backgroundColor: '#EDECF9',
    marginTop: 16,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  demoButtonText: {
    color: '#8A8696',
    fontWeight: '600',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
