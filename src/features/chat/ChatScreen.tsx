import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import Avatar from './Avatar';
import { formatTime, getUser, Message } from './chatData';
import { useChatStore } from './chatStore';

const EMPTY: Message[] = []; // stable reference for the store selector

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const user = getUser(id);

  const messages = useChatStore((s) => s.threads[user.id] ?? EMPTY);
  const send = useChatStore((s) => s.send);
  const markRead = useChatStore((s) => s.markRead);
  const [text, setText] = useState('');

  useEffect(() => {
    markRead(user.id);
  }, [user.id, messages.length, markRead]);

  const newestFirst = useMemo(() => [...messages].reverse(), [messages]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/home' as any));
  const onSend = () => {
    const t = text.trim();
    if (!t) return;
    send(user.id, t);
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={s.screen}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={goBack} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Avatar user={user} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{user.name}</Text>
          <Text style={[s.status, user.online && { color: colors.success }]}>{user.online ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      {messages.length === 0 ? (
        <View style={s.empty}>
          <Avatar user={user} size={72} />
          <Text style={s.emptyTitle}>Say hi to {user.name} 👋</Text>
          <Text style={s.emptySub}>No messages yet. Start the conversation.</Text>
        </View>
      ) : (
        <FlatList
          data={newestFirst}
          inverted
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[s.bubble, item.mine ? s.mine : s.theirs]}>
              <Text style={[s.msg, item.mine && { color: colors.textOnGold }]}>{item.text}</Text>
              <Text style={[s.time, item.mine && { color: 'rgba(22,13,5,0.6)' }]}>{formatTime(item.time)}</Text>
            </View>
          )}
        />
      )}

      <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          placeholderTextColor={colors.placeholder}
          multiline
          maxLength={500}
          style={s.input}
        />
        <TouchableOpacity
          onPress={onSend}
          disabled={!text.trim()}
          style={[s.sendBtn, !text.trim() && { opacity: 0.5 }]}
          accessibilityLabel="Send"
        >
          <Ionicons name="send" size={18} color={colors.textOnGold} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.backgroundSecondary,
  },
  name: { color: colors.text, fontSize: 16, fontWeight: '700' },
  status: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 6, textAlign: 'center' },
  bubble: { maxWidth: '78%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.cardElevated, borderBottomLeftRadius: 4 },
  msg: { color: colors.text, fontSize: 14, lineHeight: 20 },
  time: { color: colors.textMuted, fontSize: 10, marginTop: 3, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.backgroundSecondary,
  },
  input: {
    flex: 1, maxHeight: 110, minHeight: 42, paddingHorizontal: 14, paddingTop: 11, paddingBottom: 11,
    borderRadius: 21, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border,
    color: colors.text, fontSize: 14,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
