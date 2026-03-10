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
    { role: 'assistant', content: "Hi! I'm your Pregnancy Assistant. Ask me anything about pregnancy, symptoms, nutrition, or baby development." },
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
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply || res.message || 'Sorry, I could not respond.' }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting. Please check your internet connection and try again. (Chatbot requires OPENAI_API_KEY on server)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pregnancy Assistant</Text>
            <Text style={styles.headerSubtitle}>Ask anything about pregnancy</Text>
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
          placeholder="Ask anything..."
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
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendText}>Send</Text>}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0FA' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#D4C8E8' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#4A3F6B' },
  headerSubtitle: { fontSize: 14, color: '#7B68B8', marginTop: 4 },
  list: { padding: 16 },
  bubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#7B68B8' },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 2, borderColor: '#D4C8E8' },
  userText: { color: '#fff', fontSize: 15 },
  assistantText: { color: '#5A4A7B', fontSize: 15 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#D4C8E8',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F0FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    marginRight: 12,
  },
  sendBtn: {
    backgroundColor: '#7B68B8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendText: { color: '#fff', fontWeight: '600' },
});
