import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import type { BannerTheme, HomeBanner } from '../../types/home';

const GOLD = '#F8C744';
type Gradient = readonly [string, string, ...string[]];

const THEMES: Record<BannerTheme, { colors: Gradient; border: string }> = {
  purple: { colors: ['#591C78', '#35104E', '#170821'], border: '#723D91' },
  gold: { colors: ['#8A6410', '#4A3306', '#1E1403'], border: '#B8892A' },
  blue: { colors: ['#1E3A8A', '#172554', '#0B1130'], border: '#3D5BB5' },
  pink: { colors: ['#9D2463', '#5A1238', '#240718'], border: '#C2548C' },
};

const FALLBACK: HomeBanner = {
  id: 'fallback', eyebrow: 'LIVE VOICE COMMUNITY', title: 'Your voice, your world.',
  subtitle: 'Sing · Chat · Play · Connect', buttonText: 'Explore Rooms', theme: 'purple', order: 0,
};

// Horizontal banner slider. If admin has not added any banner, a default one is shown.
export default function HomeBanners({ banners, onPressAction }: { banners: HomeBanner[]; onPressAction: () => void }) {
  const { width } = useWindowDimensions();
  const cardW = width - 32; // the screen has 16 padding on each side
  const data = banners.length ? banners : [FALLBACK];
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: cardW }}
        keyExtractor={(b) => b.id}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / cardW))}
        renderItem={({ item }) => {
          const t = THEMES[item.theme] ?? THEMES.purple;
          return (
            <LinearGradient colors={t.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.banner, { width: cardW, borderColor: t.border }]}>
              <View style={s.glow} />
              <View style={s.copy}>
                {!!item.eyebrow && <Text style={s.eyebrow}>{item.eyebrow}</Text>}
                <Text style={s.title} numberOfLines={2}>{item.title}</Text>
                {!!item.subtitle && <Text style={s.sub} numberOfLines={2}>{item.subtitle}</Text>}
                {!!item.buttonText && (
                  <TouchableOpacity style={s.btn} activeOpacity={0.8} onPress={onPressAction}>
                    <Text style={s.btnText}>{item.buttonText}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2B1236" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={s.mic}>
                <LinearGradient colors={['#FFE98A', GOLD, '#D88C20']} style={s.micCircle}>
                  <Ionicons name="mic" size={34} color="#35123D" />
                </LinearGradient>
                <View style={s.wave}>
                  {[15, 25, 35, 22, 12].map((h, i) => (
                    <View key={i} style={[s.bar, { height: h }]} />
                  ))}
                </View>
              </View>
            </LinearGradient>
          );
        }}
      />
      {data.length > 1 && (
        <View style={s.dots}>
          {data.map((b, i) => (
            <View key={b.id} style={[s.dot, i === index && s.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  banner: { minHeight: 155, borderRadius: 19, padding: 17, overflow: 'hidden', borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },
  glow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#783BA0', opacity: 0.22, right: -20, top: -25 },
  copy: { flex: 1, zIndex: 1 },
  eyebrow: { color: '#F6D7FF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 9 },
  title: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', lineHeight: 25 },
  sub: { color: '#E5C4F5', fontSize: 11, marginTop: 7 },
  btn: { marginTop: 11, alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 18, backgroundColor: GOLD, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnText: { color: '#2B1236', fontSize: 10, fontWeight: '800' },
  mic: { width: 77, alignItems: 'center', justifyContent: 'center', marginLeft: 3 },
  micCircle: { width: 55, height: 55, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFEBA0' },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 7 },
  bar: { width: 3, borderRadius: 3, backgroundColor: GOLD },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4A385A' },
  dotActive: { backgroundColor: GOLD, width: 16 },
});