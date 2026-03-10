import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getArticles } from '../api';

const CATEGORIES = ['All', 'Nutrition', 'Symptoms', 'Baby Development', 'Health', 'Exercise', 'Mental health'];

export default function ArticlesScreen() {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const cat = category === 'All' ? null : category;
    getArticles(cat)
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [category]);

  const data = articles.length > 0 ? articles : [
    { _id: '1', title: 'Foods to Avoid During Pregnancy', content: 'Learn which foods to avoid...', category: 'Nutrition' },
    { _id: '2', title: 'Managing Morning Sickness', content: 'Tips for managing nausea...', category: 'Symptoms' },
    { _id: '3', title: 'First Trimester Development', content: 'What happens in weeks 1-12...', category: 'Baby Development' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Articles</Text>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, category === item && styles.catChipSelected]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.catChipText, category === item && styles.catChipTextSelected]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7B68B8" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id || item.id || String(Math.random())}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ArticleDetail', { id: item._id || item.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
              <Text style={styles.cardCategory}>{item.category}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', margin: 20, marginBottom: 8 },
  categories: { maxHeight: 50, marginBottom: 8 },
  categoriesContent: { paddingHorizontal: 20, gap: 10 },
  catChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  catChipSelected: { borderColor: '#7B68B8', backgroundColor: '#7B68B8' },
  catChipText: { fontSize: 14, color: '#5A4A7B', fontWeight: '600' },
  catChipTextSelected: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingTop: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#D4C8E8',
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#4A3F6B' },
  cardPreview: { fontSize: 14, color: '#7B68B8', marginTop: 8 },
  cardCategory: { fontSize: 12, color: '#9B8AC4', marginTop: 8 },
});
