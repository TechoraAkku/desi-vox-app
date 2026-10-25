import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../theme/colors';

// Transparent PNG (not the old .jpeg with the white box)
const logo = require('../../assets/logo.png');

const SPLASH_MS = 4000; // splash stays at least 4 seconds

type Gradient = readonly [string, string, ...string[]];
const LOADING = colors.gradient.loading as unknown as Gradient;
const BG: Gradient = [colors.purple, colors.backgroundSecondary, colors.background, colors.black];
const BG_STOPS = [0, 0.3, 0.65, 1] as const;

export default function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const fade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const logoSize = width * 0.74;
  const barWidth = width * 0.44;

  // loading bar runs for SPLASH_MS, then go to onboarding
  useEffect(() => {
    const barAnim = Animated.timing(progress, { toValue: 1, duration: SPLASH_MS, useNativeDriver: false });
    barAnim.start(({ finished }) => {
      if (!finished) return;
      // already signed in (session restored)? go straight to Home
      const loggedIn = useAuthStore.getState().isLoggedIn;
      router.replace((loggedIn ? '/home' : '/onboarding') as any);
    });
    return () => barAnim.stop();
  }, [progress]);

  // fade the logo in only once the image is really decoded (no empty/jumpy frame)
  const onLogoLoad = () => Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();

  return (
    <LinearGradient colors={BG} locations={BG_STOPS} style={s.container}>
      <Animated.View style={[s.logoWrap, { top: height * 0.35 - logoSize / 2, opacity: fade }]}>
        <Image
          source={logo}
          contentFit="contain"
          priority="high"
          transition={0}
          onLoad={onLogoLoad}
          style={{ width: logoSize, height: logoSize }}
        />
      </Animated.View>

      <View style={[s.loaderWrap, { top: height * 0.74 }]}>
        <Text style={s.loadingText}>Loading......</Text>
        <View style={[s.track, { width: barWidth }]}>
          <Animated.View
            style={{ height: 2, width: progress.interpolate({ inputRange: [0, 1], outputRange: [0, barWidth] }) }}
          >
            <LinearGradient colors={LOADING} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          </Animated.View>
        </View>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  logoWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  loaderWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  loadingText: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  track: { height: 2, backgroundColor: colors.border, overflow: 'hidden' },
});
