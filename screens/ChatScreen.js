import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { chat } from '../api';

const BOTTOM_PADDING = 100;

export default function ChatScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis votre assistant de grossesse. Posez-moi vos questions sur la grossesse, les symptômes, la nutrition ou le développement de bébé." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await chat(text, history, user?.email || 'guest');
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply || res.message || 'Désolé, je ne peux pas répondre.' }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: e?.message || "Je rencontre des problèmes de connexion." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistant de Grossesse</Text>
        <Text style={styles.headerSubtitle}>Posez vos questions sur la grossesse</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={[styles.list, { paddingBottom: BOTTOM_PADDING }]}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>{item.content}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputRow}
      >
        <TextInput
          style={styles.input}
          placeholder="Posez votre question..."
          placeholderTextColor="#9B8AC4"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={send}
          disabled={loading || !input.trim()}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendText}>Envoyer</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDECF9' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#EDECF9',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1824',
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A8696',
    fontWeight: '500',
    marginTop: 4
  },
  list: { paddingHorizontal: 20 },
  bubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#9A75F0',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22, fontWeight: '500' },
  assistantText: { color: '#1A1824', fontSize: 15, lineHeight: 22, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F6FB',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1824',
    maxHeight: 120,
    marginRight: 12,
  },
  sendBtn: {
    backgroundColor: '#9A75F0',
    height: 52,
    paddingHorizontal: 24,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8C72FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: { opacity: 0.5, shadowOpacity: 0 },
  sendText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
