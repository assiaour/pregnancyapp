import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllWeeks } from '../api';

const FRUIT_MAP = {
  4: 'Poppy seed', 5: 'Sesame', 6: 'Lentil', 7: 'Blueberry', 8: 'Raspberry', 9: 'Cherry',
  10: 'Strawberry', 11: 'Lime', 12: 'Plum', 13: 'Peach', 14: 'Lemon', 15: 'Apple',
  16: 'Avocado', 17: 'Pear', 18: 'Sweet potato', 19: 'Mango', 20: 'Banana',
  21: 'Carrot', 22: 'Papaya', 23: 'Grapefruit', 24: 'Cantaloupe', 25: 'Cauliflower',
  26: 'Lettuce', 27: 'Cabbage', 28: 'Coconut', 29: 'Butternut squash', 30: 'Cabbage',
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
    fruit: FRUIT_MAP[i + 1] || `Week ${i + 1}`,
    size_cm: Math.min(2 + i * 1.2, 52),
    weight_g: Math.min(14 + i * 50, 3500),
  }));

  const displayWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
  const items = displayWeeks.map((w) => data.find((d) => d.week === w) || { week: w, fruit: FRUIT_MAP[w] || '-', size_cm: '-', weight_g: '-' });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7B68B8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Baby Size Comparison</Text>
        <Text style={styles.subtitle}>Fruit & seed comparison by week</Text>
        {items.map((item) => (
          <View key={item.week} style={styles.row}>
            <Text style={styles.week}>Week {item.week}</Text>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.fruit}>{item.fruit}</Text>
            <Text style={styles.size}>{item.size_cm} cm · {item.weight_g} g</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7B68B8', marginBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  week: { fontSize: 16, fontWeight: '600', color: '#4A3F6B', width: 70 },
  arrow: { fontSize: 16, color: '#7B68B8', marginHorizontal: 8 },
  fruit: { flex: 1, fontSize: 16, color: '#5A4A7B' },
  size: { fontSize: 14, color: '#7B68B8' },
});
