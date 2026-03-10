import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getWeek, getTipOfDay, getArticleOfDay } from '../api';
import { parseDate, weeksAndDaysFromDDR } from '../utils/pregnancy';

export default function MainHomeScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [weekData, setWeekData] = useState(null);
  const [tip, setTip] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ddrDate = user?.ddr ? parseDate(user.ddr) : null;
  const wd = weeksAndDaysFromDDR(ddrDate);
  const currentWeek = wd?.week ?? 18;
  const currentDay = wd?.day ?? 3;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [w, t, a] = await Promise.all([
          getWeek(currentWeek).catch(() => null),
          getTipOfDay().catch(() => null),
          getArticleOfDay().catch(() => null),
        ]);
        if (!cancelled) {
          setWeekData(w);
          setTip(t);
          setArticle(a);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentWeek]);

  if (loading && !weekData && !tip && !article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7B68B8" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const weekInfo = weekData || {
    fruit: 'Avocado',
    size_cm: 14.2,
    weight_g: 190,
    development: "Baby is growing rapidly. You may feel movements soon.",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Baby of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baby of the Day</Text>
          <View style={styles.babyCard}>
            <View style={styles.babyImagePlaceholder}>
              <Text style={styles.babyEmoji}>👶</Text>
            </View>
            <Text style={styles.weekLabel}>Week {currentWeek} – Day {currentDay}</Text>
            <Text style={styles.babySize}>Size: {weekInfo.fruit}</Text>
            <Text style={styles.babyLength}>Length: {weekInfo.size_cm} cm</Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('WeekDetails', { week: currentWeek })}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>See Full Week</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Baby Size Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baby Size Comparison</Text>
          <View style={styles.sizeCard}>
            <Text style={styles.sizeFruit}>🍎 Size: {weekInfo.fruit}</Text>
            <Text style={styles.sizeDetail}>Length: {weekInfo.size_cm} cm</Text>
            <Text style={styles.sizeDetail}>Weight: {weekInfo.weight_g} g</Text>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'BabySize' })}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>More sizes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Tip of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tip of the Day</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              {tip?.text || 'Drink plenty of water today. Hydration helps prevent headaches during pregnancy.'}
            </Text>
          </View>
        </View>

        {/* 4. Article of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article of the Day</Text>
          <View style={styles.articleCard}>
            <Text style={styles.articleTitle}>
              {article?.title || 'Foods to Avoid During Pregnancy'}
            </Text>
            <Text style={styles.articlePreview} numberOfLines={2}>
              {article?.content?.substring(0, 100) || 'Learn which foods to avoid for a healthy pregnancy...'}
            </Text>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.getParent()?.navigate('Articles')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Read More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Ask the Pregnancy Assistant */}
        <View style={styles.section}>
          <View style={styles.chatCard}>
            <Text style={styles.chatIcon}>🤖</Text>
            <Text style={styles.chatTitle}>Ask the Pregnancy Assistant</Text>
            <Text style={styles.chatSubtitle}>Ask anything about pregnancy.</Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.getParent()?.navigate('Chat')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#7B68B8' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3F6B',
    marginBottom: 12,
  },
  babyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  babyImagePlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  babyEmoji: { fontSize: 48 },
  weekLabel: { fontSize: 18, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  babySize: { fontSize: 16, color: '#5A4A7B', marginBottom: 4 },
  babyLength: { fontSize: 16, color: '#5A4A7B', marginBottom: 16 },
  sizeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  sizeFruit: { fontSize: 18, fontWeight: '600', color: '#4A3F6B', marginBottom: 8 },
  sizeDetail: { fontSize: 15, color: '#5A4A7B', marginBottom: 4 },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 28, marginRight: 12 },
  tipText: { flex: 1, fontSize: 15, color: '#5A4A7B', lineHeight: 22 },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  articleTitle: { fontSize: 17, fontWeight: '600', color: '#4A3F6B', marginBottom: 8 },
  articlePreview: { fontSize: 14, color: '#7B68B8', marginBottom: 16 },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  chatIcon: { fontSize: 32, marginBottom: 8 },
  chatTitle: { fontSize: 17, fontWeight: '600', color: '#4A3F6B', marginBottom: 4 },
  chatSubtitle: { fontSize: 14, color: '#7B68B8', marginBottom: 16 },
  primaryBtn: {
    backgroundColor: '#7B68B8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryBtn: {
    backgroundColor: '#E8E0F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryBtnText: { color: '#7B68B8', fontSize: 15, fontWeight: '600' },
});
