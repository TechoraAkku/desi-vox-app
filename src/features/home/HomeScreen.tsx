import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';

const GOLD = '#F8C744';
const BG = '#080410';
const MUTED = '#A79AB8';

const categories = ['Popular', 'Following', 'New', 'Music'];

// ids must match the users in features/chat/chatData.ts
const hosts = [
  { id: 'maya', name: 'Maya', color: '#E9B8A0', icon: 'person' },
  { id: 'arjun', name: 'Arjun', color: '#C9A47B', icon: 'person' },
  { id: 'rahul', name: 'Rahul', color: '#B88D70', icon: 'person' },
  { id: 'sara', name: 'Sara', color: '#B6A4D9', icon: 'person' },
];

const roomNames = ['Music Lounge', 'Late Night Talks', 'Friends Zone', 'Singing Room', 'Chill & Chat'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('Popular');

  const openCreateRoom = () => router.push('/create-room' as any);
  const openChat = (userId: string) => router.push(`/chat/${userId}` as any);

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#591C78', '#35104E', '#170821']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerGlow} />
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerEyebrow}>LIVE VOICE COMMUNITY</Text>
            <Text style={styles.bannerTitle}>Your voice,</Text>
            <Text style={styles.bannerTitle}>your world.</Text>
            <Text style={styles.bannerSub}>Sing · Chat · Play · Connect</Text>
            <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8} onPress={openCreateRoom}>
              <Text style={styles.exploreText}>Explore Rooms</Text>
              <Ionicons name="arrow-forward" size={14} color="#2B1236" />
            </TouchableOpacity>
          </View>

          <View style={styles.bannerMic}>
            <LinearGradient colors={['#FFE98A', GOLD, '#D88C20']} style={styles.micCircle}>
              <Ionicons name="mic" size={34} color="#35123D" />
            </LinearGradient>
            <View style={styles.soundWave}>
              {[15, 25, 35, 22, 12].map((h, i) => (
                <View key={i} style={[styles.wave, { height: h }]} />
              ))}
            </View>
          </View>
          <View style={styles.bannerDot} />
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          {categories.map((category) => {
            const selected = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[styles.category, selected && styles.categoryActive]}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextActive]}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recommended Rooms</Text>
            <Text style={styles.sectionSubtitle}>Find your people, join the vibe</Text>
          </View>
          <TouchableOpacity onPress={openCreateRoom}>
            <Text style={styles.seeAll}>
              See All <Ionicons name="chevron-forward" size={11} />
            </Text>
          </TouchableOpacity>
        </View>

        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity key={item} activeOpacity={0.8} style={styles.roomCard} onPress={openCreateRoom}>
            <View style={styles.roomCover}>
              <LinearGradient
                colors={item % 2 ? ['#432054', '#20102E'] : ['#30204E', '#180D25']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.roomAvatar}>
                <Ionicons name="people" size={22} color={GOLD} />
              </View>
            </View>

            <View style={styles.roomInfo}>
              <View style={styles.roomTitleRow}>
                <Text style={styles.roomTitle}>{roomNames[item - 1]}</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.roomSubtitle}>Join the conversation</Text>
              <View style={styles.roomBottom}>
                <Ionicons name="people-outline" size={13} color={MUTED} />
                <Text style={styles.roomCount}>{item * 12 + 8} listening</Text>
                <Ionicons name="headset-outline" size={13} color={GOLD} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Top Hosts</Text>
            <Text style={styles.sectionSubtitle}>Voices worth discovering</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hostList}>
          {hosts.map((host, index) => (
            <TouchableOpacity
              key={host.id}
              style={styles.hostItem}
              activeOpacity={0.8}
              onPress={() => openChat(host.id)}
              accessibilityLabel={`Chat with ${host.name}`}
            >
              <View style={[styles.hostAvatar, { backgroundColor: host.color }]}>
                <Ionicons name={host.icon as any} size={27} color="#2B1733" />
                <View style={styles.hostOnline} />
              </View>
              <Text style={styles.hostName}>{host.name}</Text>
              <Text style={styles.hostRank}>#{index + 1} Host</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpace} />
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
  banner: {
    minHeight: 155, borderRadius: 19, padding: 17, overflow: 'hidden', borderWidth: 1, borderColor: '#723D91',
    flexDirection: 'row', justifyContent: 'space-between',
  },
  bannerGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#783BA0', opacity: 0.22, right: -20, top: -25 },
  bannerCopy: { flex: 1, zIndex: 1 },
  bannerEyebrow: { color: '#F6D7FF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 9 },
  bannerTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', lineHeight: 23 },
  bannerSub: { color: '#E5C4F5', fontSize: 9, marginTop: 7 },
  exploreButton: {
    marginTop: 11, alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 18,
    backgroundColor: GOLD, flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  exploreText: { color: '#2B1236', fontSize: 10, fontWeight: '800' },
  bannerMic: { width: 77, alignItems: 'center', justifyContent: 'center', marginLeft: 3 },
  micCircle: { width: 55, height: 55, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFEBA0' },
  soundWave: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 7 },
  wave: { width: 3, borderRadius: 3, backgroundColor: GOLD },
  bannerDot: { position: 'absolute', right: 25, top: 18, width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFE98A' },
  categories: { gap: 8, paddingVertical: 17 },
  category: { paddingHorizontal: 19, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#4A385A', backgroundColor: '#120B1C' },
  categoryActive: { borderColor: GOLD, backgroundColor: GOLD },
  categoryText: { color: '#C8B9D6', fontSize: 11, fontWeight: '600' },
  categoryTextActive: { color: '#2B1236', fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 3 },
  sectionTitle: { color: '#F8F2FF', fontSize: 15, fontWeight: '800' },
  sectionSubtitle: { color: '#82728F', fontSize: 10, marginTop: 3 },
  seeAll: { color: GOLD, fontSize: 10, fontWeight: '700' },
  roomCard: {
    minHeight: 83, backgroundColor: '#110B1A', borderWidth: 1, borderColor: '#2A1B39', borderRadius: 15,
    marginBottom: 9, padding: 9, flexDirection: 'row', gap: 11, alignItems: 'center',
  },
  roomCover: { width: 64, height: 64, borderRadius: 11, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  roomAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#47275D', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#8054A0',
  },
  roomInfo: { flex: 1, gap: 8 },
  roomTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  roomTitle: { color: '#F5EDFF', fontSize: 11, fontWeight: '800', flex: 1 },
  roomSubtitle: { color: '#9586A7', fontSize: 9 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#321329', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FF557C' },
  liveText: { color: '#FF8EA8', fontSize: 8, fontWeight: '900' },
  roomBottom: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  roomCount: { color: MUTED, fontSize: 9, flex: 1 },
  hostList: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  hostItem: { alignItems: 'center', width: '23%' },
  hostAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GOLD },
  hostOnline: {
    position: 'absolute', width: 11, height: 11, borderRadius: 6, right: 0, bottom: 1, backgroundColor: '#39D98A',
    borderWidth: 2, borderColor: BG,
  },
  hostName: { color: '#F2E9FA', fontSize: 10, fontWeight: '700', marginTop: 7 },
  hostRank: { color: '#9584A5', fontSize: 8, marginTop: 3 },
  bottomSpace: { height: 12 },
});
