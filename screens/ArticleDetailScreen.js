import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getArticle } from '../api';

export default function ArticleDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setArticle({ title: 'Article', content: 'Contenu introuvable.', category: '-' });
      return;
    }
    getArticle(id)
      .then(setArticle)
      .catch(() => setArticle({ title: 'Erreur', content: 'Impossible de charger l\'article.', category: '-' }))
      .finally(() => setLoading(false));
  }, [id]);

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
        <View style={styles.card}>
          <View style={styles.categoryBadge}>
            <Text style={styles.category}>{article?.category}</Text>
          </View>
          <Text style={styles.title}>{article?.title}</Text>
          <Text style={styles.content}>{article?.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
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
  scroll: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    minHeight: 500,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  category: {
    fontSize: 13,
    color: '#9A75F0',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  content: {
    fontSize: 16,
    color: '#4A4656',
    lineHeight: 28,
    fontWeight: '500',
  },
});
