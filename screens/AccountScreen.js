import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function AccountScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, logout } = useUser();
  const email = user?.email || route.params?.email || '';

  const handleLogout = () => {
    logout();
    const root = navigation.getParent();
    if (root) {
      root.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Your pregnancy journey
        </Text>
        {email ? (
          <Text style={styles.info}>Email: {email}</Text>
        ) : null}
        {user?.ddr ? (
          <Text style={styles.info}>Due date (DDR): {user.ddr}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogout}
        >
          <Text style={styles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3F6B',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#7B68B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  info: {
    fontSize: 16,
    color: '#5A4A7B',
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#7B68B8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

