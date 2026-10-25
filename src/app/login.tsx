import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions,
} from 'react-native';
import { signInWithGoogle } from '../services/googleAuth';
import colors from '../theme/colors';

// Transparent logo made with remove_logo_bg.py (or exported from Figma)
const logo = require('../assets/logo.png');

type Gradient = readonly [string, string, ...string[]];
const BG: Gradient = [colors.purple, colors.backgroundSecondary, colors.background, colors.black];
const BG_STOPS = [0, 0.3, 0.65, 1] as const;

type Country = { name: string; flag: string; code: string; length: number; startsWith?: RegExp };
// Add more countries here later
const COUNTRIES: Country[] = [
  { name: 'India', flag: '🇮🇳', code: '91', length: 10, startsWith: /^[6-9]/ },
  { name: 'Nepal', flag: '🇳🇵', code: '977', length: 10, startsWith: /^9/ },
  { name: 'Bangladesh', flag: '🇧🇩', code: '880', length: 10, startsWith: /^1/ },
  { name: 'United Arab Emirates', flag: '🇦🇪', code: '971', length: 9, startsWith: /^5/ },
];

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const formW = width * 0.76;

  const valid = phone.length === country.length && (!country.startsWith || country.startsWith.test(phone));

  const pick = (c: Country) => {
    setCountry(c);
    setPhone((p) => p.slice(0, c.length));
    setPickerOpen(false);
  };

  const onGoogle = async () => {
    // Alert.alert('Debug', 'Google button pressed'); // temporary
    // console.log('Google sign-in...');
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user) return; // cancelled
      if (router.canDismiss()) router.dismissAll();
      router.replace('/home' as any);
    } catch (e: any) {
      console.log('[Login] Google failed:', e?.code, e?.message);
      Alert.alert('Sign-in failed', `${e?.code ?? ''} ${e?.message ?? 'Please try again.'}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const getOtp = () => {
    if (!valid) return;
    router.push({ pathname: '/otp', params: { phone, code: country.code } } as any);
  };

  return (
    <LinearGradient colors={BG} locations={BG_STOPS} style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: height, alignItems: 'center', paddingTop: height * 0.075, paddingBottom: 40 }}
      >
        <Image source={logo} contentFit="contain" style={{ width: width * 0.45, height: width * 0.45 }} />
        <Text style={s.welcome}>Welcome Back </Text>

        <View style={[s.inputRow, { width: formW, marginTop: height * 0.065 }]}>
          <TouchableOpacity style={s.country} activeOpacity={0.7} onPress={() => setPickerOpen(true)}>
            <Text style={{ fontSize: 16 }}>{country.flag}</Text>
            <Text style={s.code}>{country.code}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, country.length))}
            keyboardType="number-pad"
            maxLength={country.length}
            placeholder="Enter mobile number"
            placeholderTextColor={colors.placeholder}
            style={s.input}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!valid}
          onPress={getOtp}
          style={[s.btn, { width: formW }, !valid && { opacity: 0.6 }]}
        >
          <Text style={s.btnText}>Get OTP</Text>
        </TouchableOpacity>

        <Text style={s.terms}>
          By continuing you agree to our{'\n'}
          <Text style={s.termsBold}>Terms & Privacy Policy</Text>
        </Text>

        <Text style={s.phoneLabel}>Login with your phone number</Text>
        <View style={[s.orRow, { width: formW }]}>
          <View style={s.line} />
          <Text style={s.or}>or</Text>
          <View style={s.line} />
        </View>

        <TouchableOpacity activeOpacity={0.8} style={s.google} onPress={onGoogle} disabled={googleLoading}>
          {googleLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <AntDesign name="google" size={18} color={colors.white} />
          )}
          <Text style={s.googleText}>{googleLoading ? 'Signing in...' : 'Continue with Google'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* country picker */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setPickerOpen(false)}>
          <Pressable style={s.sheet} onPress={() => { }}>
            <View style={s.handle} />
            <Text style={s.sheetTitle}>Select country</Text>
            {COUNTRIES.map((c) => {
              const active = c.code === country.code;
              return (
                <TouchableOpacity key={c.code} style={s.row} activeOpacity={0.7} onPress={() => pick(c)}>
                  <Text style={{ fontSize: 22 }}>{c.flag}</Text>
                  <Text style={s.rowName}>{c.name}</Text>
                  <Text style={s.rowCode}>+{c.code}</Text>
                  {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  welcome: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 },
  inputRow: {
    height: 46, flexDirection: 'row', alignItems: 'center', borderRadius: 6,
    backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border,
  },
  country: {
    flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, height: '100%',
    borderRightWidth: 1, borderRightColor: colors.border,
  },
  code: { color: colors.text, fontSize: 14, fontWeight: '600' },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingHorizontal: 12, height: '100%' },
  btn: { height: 44, marginTop: 16, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.textOnGold, fontSize: 14, fontWeight: '700' },
  terms: { color: colors.text, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 36, fontWeight: '600' },
  termsBold: { fontWeight: '800' },
  phoneLabel: { color: colors.textSecondary, fontSize: 14, marginTop: 64 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  line: { flex: 1, height: 1, backgroundColor: colors.textMuted },
  or: { color: colors.textSecondary, fontSize: 11 },
  google: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22, height: 48, paddingHorizontal: 22,
    borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  googleText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.cardElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingBottom: 32, paddingTop: 10, borderTopWidth: 1, borderColor: colors.borderGold,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 14 },
  sheetTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowName: { flex: 1, color: colors.text, fontSize: 15 },
  rowCode: { color: colors.textSecondary, fontSize: 14, marginRight: 6 },
});
