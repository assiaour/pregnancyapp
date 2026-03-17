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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Paramètres de votre parcours de grossesse</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.firstName?.[0] || email?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.firstName || 'Utilisateur'} {user?.lastName || ''}</Text>
          {email ? <Text style={styles.info}>{email}</Text> : null}
          {user?.ddr ? <Text style={styles.info}>Date d'accouchement : {user.ddr}</Text> : null}
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem} onPress={() => { }}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Paramètres</Text>
            <Text style={styles.actionArrow}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 0 }]} onPress={() => { }}>
            <Text style={styles.actionIcon}>❓</Text>
            <Text style={styles.actionText}>Aide et support</Text>
            <Text style={styles.actionArrow}>&gt;</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 24,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#9A75F0',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1824',
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: '#8A8696',
    fontWeight: '500',
    marginBottom: 4,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F6FB',
  },
  actionIcon: {
    fontSize: 20,
    width: 32,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1824',
    flex: 1,
  },
  actionArrow: {
    fontSize: 16,
    color: '#9A75F0',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#FFEBF0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '700',
  },
});

