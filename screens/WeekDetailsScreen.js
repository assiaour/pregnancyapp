import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { getAllWeeks } from '../api';
import { parseDate, weeksAndDaysFromDDR } from '../utils/pregnancy';

const { width } = Dimensions.get('window');

export default function WeekDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const initialWeek = route.params?.week ?? 1;
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  const ddrDate = user?.ddr ? parseDate(user.ddr) : null;
  const wd = weeksAndDaysFromDDR(ddrDate);
  const currentWeek = wd?.week ?? 18;

  useEffect(() => {
    getAllWeeks()
      .then(setWeeks)
      .catch(() => setWeeks([]))
      .finally(() => setLoading(false));
  }, []);

  const data = weeks.length > 0 ? weeks : Array.from({ length: 40 }, (_, i) => ({
    week: i + 1,
    fruit: ['Poppy seed', 'Sesame', 'Blueberry', 'Raspberry', 'Lime', 'Prune', 'Strawberry', 'Lemon', 'Cherry', 'Strawberry',
      'Fig', 'Lime', 'Peach', 'Lemon', 'Apple', 'Avocado', 'Pear', 'Sweet potato', 'Mango', 'Banana',
      'Carrot', 'Papaya', 'Grapefruit', 'Cantaloupe', 'Cauliflower', 'Lettuce', 'Cabbage', 'Coconut', 'Butternut squash', 'Cabbage'][i] || 'Baby',
    size_cm: Math.min(2 + i * 1.2, 52),
    weight_g: Math.min(14 + i * 50, 3500),
    development: `Week ${i + 1}: Baby development milestones. Organs forming, growth continues.`,
  }));

  const getItemLayout = (_, index) => ({
    length: width,
    offset: width * index,
    index,
  });

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Week by Week</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.week)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={Math.min(initialWeek - 1, data.length - 1)}
        getItemLayout={getItemLayout}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.slideImage}>
              <Text style={styles.slideEmoji}>👶</Text>
            </View>
            <Text style={styles.slideWeek}>Week {item.week}</Text>
            <Text style={styles.slideFruit}>Size: {item.fruit}</Text>
            <Text style={styles.slideSize}>{item.size_cm} cm · {item.weight_g} g</Text>
            <Text style={styles.slideDev}>{item.development}</Text>
            {item.week === currentWeek && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Your week</Text>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#D4C8E8' },
  backBtn: { padding: 8 },
  backBtnText: { fontSize: 16, color: '#7B68B8', fontWeight: '600' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#4A3F6B' },
  slide: { padding: 24, alignItems: 'center' },
  slideImage: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#E8E0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  slideEmoji: { fontSize: 64 },
  slideWeek: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 8 },
  slideFruit: { fontSize: 18, color: '#5A4A7B', marginBottom: 4 },
  slideSize: { fontSize: 16, color: '#7B68B8', marginBottom: 16 },
  slideDev: { fontSize: 15, color: '#5A4A7B', textAlign: 'center', lineHeight: 22 },
  currentBadge: { marginTop: 16, backgroundColor: '#7B68B8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  currentBadgeText: { color: '#fff', fontWeight: '600' },
});
