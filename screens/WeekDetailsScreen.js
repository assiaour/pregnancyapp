import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getAllWeeks } from '../api';
import { parseDate, weeksAndDaysFromDDR } from '../utils/pregnancy';

const { width } = Dimensions.get('window');

// Static fetal images that never change (week → asset).
// Uses actual filenames from assets/ (mix of all-skintones and E-deeptan).
const FETAL_IMAGES = {
  1: require('../assets/02-fetaldev-all-skintones_4x3.jpg'), // week 1 uses week 2 image (no 01 in assets)
  2: require('../assets/02-fetaldev-all-skintones_4x3.jpg'),
  3: require('../assets/03-fetaldev-all-skintones_4x3.jpg'),
  4: require('../assets/04-fetaldev-all-skintones_4x3.jpg'),
  5: require('../assets/05-fetaldev-all-skintones_4x3.jpg'),
  6: require('../assets/06-fetaldev-all-skintones_4x3.jpg'),
  7: require('../assets/07-fetaldev-all-skintones_4x3.jpg'),
  8: require('../assets/08-fetaldev-all-skintones_4x3.jpg'),
  9: require('../assets/09-fetaldev-all-skintones_4x3.jpg'),
  10: require('../assets/10-fetaldev-all-skintones_4x3.jpg'),
  11: require('../assets/11-fetaldev-all-skintones_4x3.jpg'),
  12: require('../assets/12-fetaldev-E-deeptan_4x3.jpg'),
  13: require('../assets/13-fetaldev-E-deeptan_4x3.jpg'),
  14: require('../assets/14-fetaldev-E-deeptan_4x3.jpg'),
  15: require('../assets/15-fetaldev-E-deeptan_4x3.jpg'),
  16: require('../assets/16-fetaldev-E-deeptan_4x3.jpg'),
  17: require('../assets/17-fetaldev-E-deeptan_4x3.jpg'),
  18: require('../assets/18-fetaldev-E-deeptan_4x3.jpg'),
  19: require('../assets/19-fetaldev-E-deeptan_4x3.jpg'),
  20: require('../assets/20-fetaldev-E-deeptan_4x3.jpg'),
  21: require('../assets/21-fetaldev-E-deeptan_4x3.jpg'),
  22: require('../assets/22-fetaldev-E-deeptan_4x3.jpg'),
  23: require('../assets/23-fetaldev-E-deeptan_4x3.jpg'),
  24: require('../assets/24-fetaldev-E-deeptan_4x3.jpg'),
  25: require('../assets/25-fetaldev-E-deeptan_4x3.jpg'),
  26: require('../assets/26-fetaldev-E-deeptan_4x3.jpg'),
  27: require('../assets/27-fetaldev-E-deeptan_4x3.jpg'),
  28: require('../assets/28-fetaldev-E-deeptan_4x3.jpg'),
  29: require('../assets/29-fetaldev-E-deeptan_4x3.jpg'),
  30: require('../assets/30-fetaldev-E-deeptan_4x3.jpg'),
  31: require('../assets/31-fetaldev-E-deeptan_4x3.jpg'),
  32: require('../assets/32-fetaldev-E-deeptan_4x3.jpg'),
  33: require('../assets/33-fetaldev-E-deeptan_4x3.jpg'),
  34: require('../assets/34-fetaldev-E-deeptan_4x3.jpg'),
  35: require('../assets/35-fetaldev-E-deeptan_4x3.jpg'),
  36: require('../assets/36-fetaldev-E-deeptan_4x3.jpg'),
  37: require('../assets/37-fetaldev-E-deeptan_4x3.jpg'),
  38: require('../assets/38-fetaldev-E-deeptan_4x3.jpg'),
  39: require('../assets/39-fetaldev-E-deeptan_4x3.jpg'),
  40: require('../assets/40-fetaldev-E-deeptan_4x3.jpg'),
};

export default function WeekDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatRef = useRef(null);

  const ddrDate = user?.ddr ? parseDate(user.ddr) : null;
  const wd = weeksAndDaysFromDDR(ddrDate);
  const currentWeek = wd?.week ?? 18;

  const initialWeek = route.params?.week ?? currentWeek ?? 1;
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);

  useEffect(() => {
    getAllWeeks()
      .then(setWeeks)
      .catch(() => setWeeks([]))
      .finally(() => setLoading(false));
  }, []);

  const data = weeks.length > 0 ? weeks : Array.from({ length: 40 }, (_, i) => ({
    week: i + 1,
    fruit: ['Graine de pavot', 'Sésame', 'Myrtille', 'Framboise', 'Citron vert', 'Prune', 'Fraise', 'Citron', 'Cerise', 'Fraise',
      'Figue', 'Citron vert', 'Pêche', 'Citron', 'Pomme', 'Avocat', 'Poire', 'Patate douce', 'Mangue', 'Banane',
      'Carotte', 'Papaye', 'Pamplemousse', 'Cantaloup', 'Chou-fleur', 'Laitue', 'Chou', 'Noix de coco', 'Courge musquée', 'Chou'][i] || 'Bébé',
    size_cm: Math.min(2 + i * 1.2, 52),
    weight_g: Math.min(14 + i * 50, 3500),
    development: `Semaine ${i + 1}: Étapes de développement du bébé. Formation des organes, la croissance continue.`,
  }));

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  const scrollToWeek = (weekNumber) => {
    const index = Math.max(0, Math.min(data.length - 1, weekNumber - 1));
    flatRef.current?.scrollToIndex({ index, animated: true });
    setSelectedWeek(weekNumber);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9A75F0" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guide des tailles</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Week selector bar */}
      <View style={styles.weekBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekBar}
        >
          {data.map((item) => (
            <TouchableOpacity
              key={item.week}
              onPress={() => scrollToWeek(item.week)}
              style={[
                styles.weekPill,
                selectedWeek === item.week && styles.weekPillActive,
              ]}
            >
              <Text
                style={[
                  styles.weekPillText,
                  selectedWeek === item.week && styles.weekPillTextActive,
                ]}
              >
                {item.week}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        ref={flatRef}
        data={data}
        keyExtractor={(item) => String(item.week)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={Math.min(initialWeek - 1, data.length - 1)}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          const w = data[page]?.week ?? 1;
          setSelectedWeek(w);
        }}
        renderItem={({ item }) => (
          <ScrollView
            style={{ width }}
            contentContainerStyle={styles.slide}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.slideImage}>
                {FETAL_IMAGES[item.week] ? (
                  <ScrollView
                    maximumZoomScale={4}
                    minimumZoomScale={1}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Image
                      source={FETAL_IMAGES[item.week]}
                      style={styles.fruitImage}
                      resizeMode="cover"
                    />
                  </ScrollView>
                ) : (
                  <Text style={styles.slideEmoji}>👶</Text>
                )}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.slideWeek}>Semaine {item.week}</Text>
                <Text style={styles.slideFruit}>{item.fruit}</Text>

                <View style={styles.sizePill}>
                  <Text style={styles.slideSize}>
                    {item.size_cm} cm · {item.weight_g} g
                  </Text>
                </View>

                <Text style={styles.slideDev}>{item.development}</Text>

                {item.week === currentWeek && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Votre semaine</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  backBtnText: { fontSize: 14, color: '#1A1824', fontWeight: '700' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#1A1824' },
  weekBarContainer: {
    marginBottom: 8,
  },
  weekBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weekPill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
    minWidth: 48,
    alignItems: 'center',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  weekPillActive: {
    backgroundColor: '#9A75F0',
  },
  weekPillText: {
    fontSize: 14,
    color: '#1A1824',
    fontWeight: '700',
  },
  weekPillTextActive: {
    color: '#FFFFFF',
  },
  slide: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  slideImage: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: 24,
    backgroundColor: '#F7F6FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  fruitImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  slideEmoji: { fontSize: 80 },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  slideWeek: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 4
  },
  slideFruit: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20
  },
  sizePill: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  slideSize: {
    fontSize: 16,
    color: '#9A75F0',
    fontWeight: '700',
  },
  slideDev: {
    fontSize: 16,
    color: '#4A4656',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500'
  },
  currentBadge: {
    marginTop: 24,
    backgroundColor: '#1D1929',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#1D1929',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
