import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import colors from '../../theme/colors';

type Gradient = readonly [string, string, ...string[]];
// transparent -> page background (rgba of #080410 so Android has no grey band)
const FADE: Gradient = ['rgba(8,4,16,0)', colors.background];

// Export the girl illustration from Figma and save it as src/assets/onboarding1.png
const IMG1 = require('../../assets/onboarding1.png');

const slides = [
  { title: 'Real Voices\nReal People', desc: 'Join live rooms, make friends,\nshare your passion.', image: IMG1 },
  { title: 'Live Voice\nRooms', desc: 'Talk on stage, request a seat\nanytime.', image: IMG1 },
  { title: 'Send Gifts\nWin Rewards', desc: 'Support your favourite hosts\nwith gifts.', image: IMG1 },
  { title: 'Become a\nStar Host', desc: 'Grow your fans and earn\nwith an agency.', image: IMG1 },
];

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const last = index === slides.length - 1;
  const imgH = height * 0.62;

  const goLogin = () => router.replace('/login' as any);
  const next = () => (last ? goLogin() : listRef.current?.scrollToIndex({ index: index + 1, animated: true }));

  return (
    <View style={s.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image source={item.image} contentFit="cover" contentPosition="top" style={{ width, height: imgH }} />
            {/* fade the lower half of the image into the dark background */}
            <LinearGradient colors={FADE} style={{ position: 'absolute', left: 0, right: 0, top: imgH * 0.5, height: imgH * 0.5 }} />
            <View style={[s.textBlock, { left: width * 0.11, right: width * 0.11, top: height * 0.41 }]}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      <View style={[s.footer, { top: height * 0.695 }]} pointerEvents="box-none">
        <View style={s.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[s.dot, i === index && s.dotActive]} />
          ))}
        </View>
        <TouchableOpacity activeOpacity={0.85} onPress={next} style={[s.btn, { width: width * 0.76 }]}>
          <Text style={s.btnText}>{last ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goLogin} hitSlop={12}>
          <Text style={s.skip}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  textBlock: { position: 'absolute' },
  title: { color: colors.text, fontSize: 36, lineHeight: 42, fontWeight: '800' },
  desc: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 12 },
  footer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 5, marginBottom: 16 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.textSecondary },
  dotActive: { backgroundColor: colors.primary },
  btn: { height: 44, borderRadius: 6, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.textOnGold, fontSize: 14, fontWeight: '700' },
  skip: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 16 },
});
