import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import colors from '../../theme/colors';
import Avatar from './Avatar';
import { formatListTime, getUser } from './chatData';
import { useChatStore } from './chatStore';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const threads = useChatStore((s) => s.threads);
  const unread = useChatStore((s) => s.unread);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  // only people you have actually chatted with, newest first
  const chats = useMemo(
    () =>
      Object.keys(threads)
        .filter((id) => threads[id].length > 0)
        .map((id) => ({ user: getUser(id), last: threads[id][threads[id].length - 1], unread: unread[id] ?? 0 }))
        .sort((a, b) => b.last.time - a.last.time),
    [threads, unread],
  );

  const q = query.trim().toLowerCase();
  const data = q ? chats.filter((c) => c.user.name.toLowerCase().includes(q)) : chats;

  const closeSearch = () => {
    setSearching(false);
    setQuery('');
  };

  return (
    <View style={[s.screen, { paddingTop: insets.top + 8 }]}>
      <View style={s.header}>
        {searching ? (
          <View style={s.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search chats"
              placeholderTextColor={colors.placeholder}
              style={s.searchInput}
            />
            <TouchableOpacity onPress={closeSearch} hitSlop={10} accessibilityLabel="Close search">
              <Ionicons name="close" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={s.title}>Chats</Text>
            <TouchableOpacity style={s.iconBtn} onPress={() => setSearching(true)} accessibilityLabel="Search">
              <Ionicons name="search-outline" size={22} color={colors.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {data.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.textMuted} />
          <Text style={s.emptyTitle}>{chats.length === 0 ? 'No chat history' : 'No results found'}</Text>
          <Text style={s.emptySub}>
            {chats.length === 0 ? 'Start a conversation from a host profile.' : `Nothing matches "${query}".`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(c) => c.user.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.row}
              activeOpacity={0.75}
              onPress={() => router.push(`/chat/${item.user.id}` as any)}
            >
              <Avatar user={item.user} />
              <View style={s.mid}>
                <Text style={s.name}>{item.user.name}</Text>
                <Text style={[s.preview, item.unread > 0 && s.previewUnread]} numberOfLines={1}>
                  {item.last.mine ? 'You: ' : ''}{item.last.text}
                </Text>
              </View>
              <View style={s.right}>
                <Text style={[s.time, item.unread > 0 && { color: colors.primary }]}>{formatListTime(item.last.time)}</Text>
                {item.unread > 0 && (
                  <View style={s.badge}><Text style={s.badgeText}>{item.unread}</Text></View>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <BottomNav />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 48, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  searchBox: {
    flex: 1, height: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12,
    borderRadius: 21, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, height: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 12 },
  mid: { flex: 1, gap: 4 },
  name: { color: colors.text, fontSize: 15, fontWeight: '700' },
  preview: { color: colors.textMuted, fontSize: 12 },
  previewUnread: { color: colors.textSecondary, fontWeight: '600' },
  right: { alignItems: 'flex-end', gap: 6 },
  time: { color: colors.textMuted, fontSize: 11 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: colors.textOnGold, fontSize: 11, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 80 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 14 },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 6, textAlign: 'center' },
});
