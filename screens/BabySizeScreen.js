import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllWeeks } from '../api';

const FRUIT_MAP = {
  4: 'Graine de pavot', 5: 'Graine de sésame', 6: 'Lentille', 7: 'Myrtille', 8: 'Framboise', 9: 'Raisin',
  10: 'Fraise', 11: 'Figue', 12: 'Citron vert', 13: 'Prune', 14: 'Citron', 15: 'Citron',
  16: 'Pomme', 17: 'Avocat', 18: 'Poivron', 19: 'Grenade', 20: 'Banane',
  21: 'Mangue', 22: 'Patate douce', 23: 'Pamplemousse', 24: 'Épi de maïs', 25: 'Courge poivrée',
  26: 'Courge spaghetti', 27: 'Chou-fleur', 28: 'Aubergine', 29: 'Courge musquée', 30: 'Chou',
  31: 'Noix de coco', 32: 'Papaye', 33: 'Ananas', 34: 'Cantaloup', 35: 'Melon miel', 36: 'Laitue',
  37: 'Blette', 38: 'Mini pastèque', 39: 'Citrouille', 40: 'Pastèque',
};

// Fruit dev images mapping aligned with assets
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

export default function BabySizeScreen() {
  const navigation = useNavigation();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllWeeks()
      .then(setWeeks)
      .catch(() => setWeeks([]))
      .finally(() => setLoading(false));
  }, []);

  const data = weeks.length > 0 ? weeks : Array.from({ length: 40 }, (_, i) => ({
    week: i + 1,
    fruit: FRUIT_MAP[i + 1] || `Semaine ${i + 1}`,
    size_cm: Math.min(2 + i * 1.2, 52),
    weight_g: Math.min(14 + i * 50, 3500),
  }));

  const items = data;

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>&lt; Retour</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Comparaison des tailles</Text>
          <Text style={styles.subtitle}>Comparaison semaine par semaine</Text>
        </View>

        {items.map((item) => (
          <View key={item.week} style={styles.card}>
            <View style={styles.thumbWrapper}>
              {FRUIT_IMAGES[item.week] && (
                <Image
                  source={FRUIT_IMAGES[item.week]}
                  style={styles.thumb}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.textCol}>
              <Text style={styles.week}>Semaine {item.week}</Text>
              <Text style={styles.fruit}>{item.fruit}</Text>
              <View style={styles.sizePill}>
                <Text style={styles.size}>{item.size_cm} cm · {item.weight_g} g</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtnText: {
    fontSize: 15,
    color: '#1A1824',
    fontWeight: '700',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 60 },
  headerContainer: {
    marginBottom: 32,
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 32,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  thumbWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F7F6FB',
    marginBottom: 24,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  textCol: {
    width: '100%',
    alignItems: 'center',
  },
  week: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 8,
  },
  fruit: {
    fontSize: 18,
    color: '#8A8696',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  sizePill: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  size: {
    fontSize: 16,
    color: '#9A75F0',
    fontWeight: '800',
  },
});
