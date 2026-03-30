import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getArticles } from '../api';

const CATEGORIES = ['Tous', 'Nutrition', 'Symptômes', 'Développement du bébé', 'Santé', 'Exercice', 'Santé mentale'];

export default function ArticlesScreen() {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const cat = category === 'Tous' ? null : category;
    getArticles(cat)
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Articles</Text>
      </View>
      <View style={{ height: 60 }}>
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
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9A75F0" />
        </View>
      ) : articles.length > 0 ? (
        <FlatList
          data={articles}
          keyExtractor={(item) => item._id || item.id || String(Math.random())}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ArticleDetail', { id: item._id || item.id })}
              activeOpacity={0.8}
            >
              <View style={styles.cardCategoryBadge}>
                <Text style={styles.cardCategory}>{item.category || 'Information'}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>Aucun article trouvé pour le moment.</Text>
          <Text style={styles.emptySubtext}>Revenez plus tard pour de nouveaux conseils !</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -0.5,
  },
  categories: { maxHeight: 50, marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 24, gap: 12 },
  catChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center',
  },
  catChipSelected: { backgroundColor: '#9A75F0' },
  catChipText: { fontSize: 14, color: '#4A4656', fontWeight: '700' },
  catChipTextSelected: { color: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingHorizontal: 24, paddingBottom: 60 },
  card: {
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
  cardCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardCategory: {
    fontSize: 12,
    color: '#9A75F0',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1824',
    marginBottom: 8,
  },
  cardPreview: {
    fontSize: 14,
    color: '#8A8696',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1824',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A8696',
    textAlign: 'center',
  },
});
