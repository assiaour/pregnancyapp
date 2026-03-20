import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getWeek, getTipOfDay, getArticleOfDay } from '../api';
import { parseDate, weeksAndDaysFromDDR } from '../utils/pregnancy';

// Fruit images
const FRUIT_IMAGES = {
  1: require('../assets/4-weeks-poppy-seeds_4x3.jpg'),
  2: require('../assets/4-weeks-poppy-seeds_4x3.jpg'),
  3: require('../assets/4-weeks-poppy-seeds_4x3.jpg'),
  4: require('../assets/4-weeks-poppy-seeds_4x3.jpg'),
  5: require('../assets/5-weeks-sesame-seeds_4x3.jpg'),
  6: require('../assets/6-weeks-lentils_4x3.jpg'),
  7: require('../assets/7-weeks-blueberry_4x3.jpg'),
  8: require('../assets/8-weeks-raspberry_4x3.jpg'),
  9: require('../assets/9-weeks-grape_4x3.jpg'),
  10: require('../assets/10-weeks-strawberry_4x3.jpg'),
  11: require('../assets/11-weeks-fig_4x3.jpg'),
  12: require('../assets/12-weeks-lime_4x3.jpg'),
  13: require('../assets/13-weeks-plum_4x3.jpg'),
  14: require('../assets/15-weeks-lemon_4x3.jpg'),
  15: require('../assets/15-weeks-lemon_4x3.jpg'),
  16: require('../assets/16-weeks-apple_4x3.jpg'),
  17: require('../assets/17-weeks-avocado_4x3.jpg'),
  18: require('../assets/18-weeks-bellpepper_4x3.jpg'),
  19: require('../assets/19-weeks-pomegranate_4x3.jpg'),
  20: require('../assets/20-weeks-banana_4x3.jpg'),
  21: require('../assets/21-weeks-mango_4x3.jpg'),
  22: require('../assets/22-weeks-sweet-potato_4x3.jpg'),
  23: require('../assets/23-weeks-grapefruit_4x3.jpg'),
  24: require('../assets/24-weeks-corn_4x3.jpg'),
  25: require('../assets/25-weeks-acorn-squash_4x3.jpg'),
  26: require('../assets/26-weeks-spaghetti-squash_4x3.jpg'),
  27: require('../assets/27-weeks-cauliflower_4x3.jpg'),
  28: require('../assets/28-weeks-eggplant_4x3.jpg'),
  29: require('../assets/29-weeks-butternut-squash_4x3.jpg'),
  30: require('../assets/30-weeks-cabbage_4x3.jpg'),
  31: require('../assets/31-weeks-coconut_4x3.jpg'),
  32: require('../assets/32-weeks-papaya_4x3.jpg'),
  33: require('../assets/33-weeks-pineapple_4x3.jpg'),
  34: require('../assets/34-weeks-cantaloupe_4x3.jpg'),
  35: require('../assets/35-weeks-honeydew-melon_4x3.jpg'),
  36: require('../assets/36-weeks-lettuce_4x3.jpg'),
  37: require('../assets/37-weeks-swiss-chard_4x3.jpg'),
  38: require('../assets/38-weeks-mini-watermelon_4x3.jpg'),
  39: require('../assets/39-weeks-pumpkin_4x3.jpg'),
  40: require('../assets/40-weeks-watermelon_4x3.jpg'),
};

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
          <Text style={styles.loadingText}>Chargement...</Text>
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
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileCircle} activeOpacity={0.8}>
            <Text style={styles.profileInitials}>{user?.firstName?.[0] || 'D'}</Text>
          </TouchableOpacity>
            <Text style={styles.helloText}>Bonjour, {user?.firstName || 'Utilisateur'}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Balance Area (Using Week Info) */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Semaine Actuelle</Text>
          <Text style={styles.balanceValue}>Semaine {currentWeek}</Text>
        </View>

        {/* Horizontal Cards (Simulating the Bank Cards) */}
        <View style={styles.cardsHeader}>
          <Text style={styles.sectionTitle}>Détails</Text>
          <TouchableOpacity>
            <Text style={styles.addText}>Voir tout &gt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScrollContent}
        >
          {/* Main Card */}
          <TouchableOpacity
            style={[styles.hCard, styles.cardPurple]}
            onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'BabySize' })}
            activeOpacity={0.9}
          >
            <View style={[styles.cardTopRow, { overflow: 'hidden', borderRadius: 16 }]}>
              {FRUIT_IMAGES[currentWeek] ? (
                 <Image source={FRUIT_IMAGES[currentWeek]} style={{ width: 64, height: 64, borderRadius: 16 }} />
              ) : (
                 <Text style={styles.cardBadge}>👶</Text>
              )}
            </View>
            <View>
              <Text style={styles.cardTitle}>Taille du bébé</Text>
              <Text style={styles.cardValue}>{weekInfo.size_cm} cm</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>{weekInfo.fruit}</Text>
                <Text style={styles.cardFooterText}>Jour {currentDay}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={[styles.hCard, styles.cardDark]}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardBadge}>⚖️</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Poids</Text>
              <Text style={styles.cardValue}>{weekInfo.weight_g} g</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Moyenne</Text>
              </View>
            </View>
          </View>

          <View style={[styles.hCard, styles.cardPink]}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardBadge}>📅</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Chronologie</Text>
              <Text style={styles.cardValue}>S {currentWeek}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Trimestre 2</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Finance/Tools Grid */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Outils</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.navigate('WeekDetails', { week: currentWeek })}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>⭐</Text>
              </View>
              <Text style={styles.toolTitle}>Détails de{'\n'}la semaine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'BabySize' })}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>📊</Text>
              </View>
              <Text style={styles.toolTitle}>Guide des{'\n'}tailles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.getParent()?.navigate('Chat')}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>💬</Text>
              </View>
              <Text style={styles.toolTitle}>Assistant{'\n'}IA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.getParent()?.navigate('Articles')}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>📈</Text>
              </View>
              <Text style={styles.toolTitle}>Conseils &{'\n'}Astuces</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'Calculator' })}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>🧮</Text>
              </View>
              <Text style={styles.toolTitle}>Calculatrice{'\n'}grossesse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolSquare}
              onPress={() => navigation.getParent()?.navigate('Tools', { screen: 'SymptomChecker' })}
              activeOpacity={0.8}
            >
              <View style={styles.toolIconWrapper}>
                <Text style={styles.toolIcon}>🩺</Text>
              </View>
              <Text style={styles.toolTitle}>Vérificateur{'\n'}symptômes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.circleDeco} />
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Le conseil du jour</Text>
          </View>
          <Text style={styles.premiumTitle}>Conseil quotidien</Text>
          <Text style={styles.premiumSubtitle}>
            {tip?.text || 'Buvez beaucoup d\'eau aujourd\'hui. L\'hydratation aide à prévenir les maux de tête...'}
          </Text>
        </View>

        {/* Recent Articles List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>À lire</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Articles')}>
              <Text style={styles.seeAllText}>Voir tout &gt;</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.getParent()?.navigate('Articles')}
          >
            <View style={styles.listLeft}>
              <View style={styles.listIconBox}>
                <Text style={styles.listIcon}>🥑</Text>
              </View>
              <View>
                <Text style={styles.listTitle} numberOfLines={1}>
                  {article?.title || 'Guide de nutrition'}
                </Text>
                <Text style={styles.listDesc}>Article</Text>
              </View>
            </View>
            <Text style={styles.listRightText}>&gt;</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#9A75F0', fontWeight: 'bold' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },

  // Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCD8F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1824',
  },
  helloText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1824',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconText: {
    fontSize: 16,
  },

  // Main Balance Area (Current Week)
  balanceContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#4A4656',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -1,
  },

  // Horizontal Cards
  cardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A8696',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9A75F0',
  },
  cardsScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  hCard: {
    width: 180,
    height: 220,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardPurple: {
    backgroundColor: '#9A75F0',
  },
  cardDark: {
    backgroundColor: '#1D1929',
  },
  cardPink: {
    backgroundColor: '#F47CBD',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBadge: {
    fontSize: 24,
    opacity: 0.9,
  },
  cardTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.8,
    marginTop: 'auto',
  },
  cardValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cardFooterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },

  // Finance / Tools Grid
  toolsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  toolSquare: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  toolIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  toolIcon: {
    fontSize: 24,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1824',
    lineHeight: 20,
  },

  // Premium Banner
  premiumBanner: {
    marginHorizontal: 24,
    backgroundColor: '#D1E3FD',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  premiumBadge: {
    backgroundColor: '#1A1824',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#4A4656',
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: '80%',
  },
  circleDeco: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F47CBD',
    opacity: 0.2,
  },

  // Recent articles / info list
  listSection: {
    paddingHorizontal: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9A75F0',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#1D1929',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listIcon: {
    fontSize: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1824',
    marginBottom: 4,
  },
  listDesc: {
    fontSize: 13,
    color: '#8A8696',
    fontWeight: '500',
  },
  listRightText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1824',
  },
});
