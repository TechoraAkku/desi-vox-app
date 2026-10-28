import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import UserAvatar from '../../components/UserAvatar';
import { useAuthStore } from '../../store/authStore';
import type { HomeHost, HomeRoom, RoomTheme } from '../../types/home';
import { registerChatUser } from '../chat/chatData';
import HomeBanners from './HomeBanners';
import { useHomeData } from './useHomeData';

const GOLD = '#F8C744';
const BG = '#080410';
const MUTED = '#A79AB8';

const categories = ['Popular', 'Following', 'New', 'Music'] as const;
type Category = (typeof categories)[number];

const ROOM_COVERS: Record<RoomTheme, readonly [string, string]> = {
  violet: ['#432054', '#20102E'],
  plum: ['#30204E', '#180D25'],
  indigo: ['#1E2A5A', '#0F1530'],
  wine: ['#5A1F3A', '#2A0F1C'],
};

function filterRooms(rooms: HomeRoom[], c: Category): HomeRoom[] {
  const byListeners = (a: HomeRoom, b: HomeRoom) => b.listeners - a.listeners;
  if (c === 'New') return [...rooms].sort((a, b) => b.createdAtMs - a.createdAtMs);
  if (c === 'Music') return rooms.filter((r) => r.category === 'music').sort(byListeners);
  if (c === 'Following') return []; // needs the follow feature (later)
  return [...rooms].sort(byListeners);
}

const EMPTY_TEXT: Record<Category, string> = {
  Popular: 'No live rooms right now.',
  Following: 'Follow hosts to see their rooms here.',
  New: 'No new rooms yet.',
  Music: 'No music rooms are live.',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const myUid = useAuthStore((s) => s.user?.uid);
  const { banners, rooms, hosts, loading, refreshing, error, reload } = useHomeData();
  const [category, setCategory] = useState<Category>('Popular');
  const visibleRooms = useMemo(() => filterRooms(rooms, category), [rooms, category]);

  const openCreateRoom = () => router.push('/create-room' as any);
  const openChat = (h: HomeHost) => {
    if (h.uid === myUid) return router.navigate('/profile' as any);
    // makes the host's name available to the chat screen (real chat data comes in the chat step)
    registerChatUser({ id: h.uid, name: h.name, color: '#B6A4D9', online: false });
    router.push(`/chat/${h.uid}` as any);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.brand}>
          <LinearGradient colors={['#FFE98A', GOLD, '#B77713']} style={styles.logo}>
            <Ionicons name="mic" size={23} color="#32133F" />
          </LinearGradient>
          <View>
            <Text style={styles.brandName}>DesiVox</Text>
            <Text style={styles.brandTag}>VOICE • CHAT • CONNECT</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} accessibilityLabel="Search">
            <Ionicons name="search-outline" size={22} color="#D8CCE9" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={22} color="#D8CCE9" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={GOLD} colors={[GOLD]} />}
      >
        <HomeBanners banners={banners} onPressAction={openCreateRoom} />

        {!!error && (
          <TouchableOpacity style={styles.errorBox} onPress={reload}>
            <Ionicons name="alert-circle-outline" size={16} color="#FF8EA8" />
            <Text style={styles.errorText}>{error}</Text>
          </TouchableOpacity>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((c) => {
            const selected = category === c;
            return (
              <TouchableOpacity key={c} onPress={() => setCategory(c)} style={[styles.category, selected && styles.categoryActive]}>
                <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recommended Rooms</Text>
            <Text style={styles.sectionSubtitle}>Find your people, join the vibe</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={GOLD} style={{ marginVertical: 24 }} />
        ) : visibleRooms.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="mic-off-outline" size={28} color={MUTED} />
            <Text style={styles.emptyText}>{EMPTY_TEXT[category]}</Text>
          </View>
        ) : (
          visibleRooms.map((r) => (
            <TouchableOpacity key={r.id} activeOpacity={0.8} style={styles.roomCard} onPress={openCreateRoom}>
              <View style={styles.roomCover}>
                <LinearGradient colors={ROOM_COVERS[r.theme] ?? ROOM_COVERS.violet} style={StyleSheet.absoluteFill} />
                <View style={styles.roomAvatar}>
                  <Ionicons name="people" size={22} color={GOLD} />
                </View>
              </View>
              <View style={styles.roomInfo}>
                <View style={styles.roomTitleRow}>
                  <Text style={styles.roomTitle} numberOfLines={1}>{r.title}</Text>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <Text style={styles.roomSubtitle} numberOfLines={1}>{r.subtitle || (r.hostName ? `Hosted by ${r.hostName}` : '')}</Text>
                <View style={styles.roomBottom}>
                  <Ionicons name="people-outline" size={13} color={MUTED} />
                  <Text style={styles.roomCount}>{r.listeners} listening</Text>
                  <Ionicons name="headset-outline" size={13} color={GOLD} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top Hosts</Text>
            <Text style={styles.sectionSubtitle}>Voices worth discovering</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={GOLD} style={{ marginVertical: 24 }} />
        ) : hosts.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="person-outline" size={28} color={MUTED} />
            <Text style={styles.emptyText}>No hosts yet.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hostList}>
            {hosts.map((h, i) => (
              <TouchableOpacity key={h.uid} style={styles.hostItem} activeOpacity={0.8} onPress={() => openChat(h)} accessibilityLabel={`Open ${h.name}`}>
                <View style={styles.hostAvatar}>
                  <UserAvatar photoURL={h.photoURL} size={48} />
                </View>
                <Text style={styles.hostName} numberOfLines={1}>{h.name}</Text>
                <Text style={styles.hostRank}>#{i + 1} Host</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={{ height: 12 }} />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 18, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logo: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 20, fontWeight: '900', color: GOLD, letterSpacing: -0.5 },
  brandTag: { fontSize: 7, color: '#BDA6D1', letterSpacing: 1, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 5 },
  iconButton: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 14 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2A0F18', borderRadius: 10, padding: 10, marginTop: 12 },
  errorText: { color: '#FF8EA8', fontSize: 12, flex: 1 },
  categories: { gap: 8, paddingVertical: 17 },
  category: { paddingHorizontal: 19, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4A385A', backgroundColor: '#120B1C' },
  categoryActive: { borderColor: GOLD, backgroundColor: GOLD },
  categoryText: { color: '#C8B9D6', fontSize: 11, fontWeight: '600' },
  categoryTextActive: { color: '#2B1236', fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 3 },
  sectionTitle: { color: '#F8F2FF', fontSize: 15, fontWeight: '800' },
  sectionSubtitle: { color: '#82728F', fontSize: 10, marginTop: 3 },
  emptyBox: { alignItems: 'center', gap: 8, paddingVertical: 26, borderRadius: 15, borderWidth: 1, borderColor: '#2A1B39', backgroundColor: '#110B1A', marginBottom: 14 },
  emptyText: { color: MUTED, fontSize: 12 },
  roomCard: { minHeight: 83, backgroundColor: '#110B1A', borderWidth: 1, borderColor: '#2A1B39', borderRadius: 15, marginBottom: 9, padding: 9, flexDirection: 'row', gap: 11, alignItems: 'center' },
  roomCover: { width: 64, height: 64, borderRadius: 11, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  roomAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#47275D', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#8054A0' },
  roomInfo: { flex: 1, gap: 8 },
  roomTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  roomTitle: { color: '#F5EDFF', fontSize: 12, fontWeight: '800', flex: 1 },
  roomSubtitle: { color: '#9586A7', fontSize: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#321329', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FF557C' },
  liveText: { color: '#FF8EA8', fontSize: 8, fontWeight: '900' },
  roomBottom: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  roomCount: { color: MUTED, fontSize: 10, flex: 1 },
  hostList: { gap: 18, paddingVertical: 4 },
  hostItem: { alignItems: 'center', width: 64 },
  hostAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GOLD, overflow: 'hidden' },
  hostName: { color: '#F2E9FA', fontSize: 10, fontWeight: '700', marginTop: 7 },
  hostRank: { color: '#9584A5', fontSize: 8, marginTop: 3 },
});