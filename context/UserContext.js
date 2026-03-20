import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);
const STORAGE_KEY = 'pregnancy_app_user_v1';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) setUser(JSON.parse(raw));
      } catch {
        // ignore
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, ddr, semaineGrossesse, firstName) => {
    const u = { email, ddr, semaineGrossesse, firstName };
    setUser(u);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...newData };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const value = useMemo(() => ({ user, login, logout, updateUser, hydrating }), [user, login, logout, updateUser, hydrating]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
