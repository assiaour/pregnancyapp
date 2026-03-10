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
      setArticle({ title: 'Article', content: 'Content not found.', category: '-' });
      return;
    }
    getArticle(id)
      .then(setArticle)
      .catch(() => setArticle({ title: 'Error', content: 'Could not load article.', category: '-' }))
      .finally(() => setLoading(false));
  }, [id]);

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
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.category}>{article?.category}</Text>
        <Text style={styles.title}>{article?.title}</Text>
        <Text style={styles.content}>{article?.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#D4C8E8' },
  backBtn: { padding: 8 },
  backBtnText: { fontSize: 16, color: '#7B68B8', fontWeight: '600' },
  scroll: { padding: 20 },
  category: { fontSize: 14, color: '#7B68B8', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#4A3F6B', marginBottom: 16 },
  content: { fontSize: 16, color: '#5A4A7B', lineHeight: 24 },
});
