import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import colors from '../theme/colors';

const logo = require('../assets/logo.png');

type Gradient = readonly [string, string, ...string[]];
const BG: Gradient = [colors.purple, colors.backgroundSecondary, colors.background, colors.black];
const BG_STOPS = [0, 0.3, 0.65, 1] as const;

export default function Login() {
  const { width, height } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const valid = /^[6-9]\d{9}$/.test(phone);
  const formW = width * 0.76;

  const getOtp = () => {
    if (!valid) return;
    // next screen: /otp (we build it after this one)
    router.push({ pathname: '/otp', params: { phone } } as any);
  };

  return (
    <LinearGradient colors={BG} locations={BG_STOPS} style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: height, alignItems: 'center', paddingTop: height * 0.075, paddingBottom: 40 }}
      >
        <Image source={logo} contentFit="contain" style={{ width: width * 0.45, height: width * 0.45 }} />
        <Text style={s.welcome}>Welcome Back</Text>

        {/* phone input */}
        <View style={[s.inputRow, { width: formW, marginTop: height * 0.065 }]}>
          <TouchableOpacity style={s.country} activeOpacity={0.7}>
            <Text style={{ fontSize: 16 }}>🇮🇳</Text>
            <Text style={s.code}>91</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="number-pad"
            maxLength={10}
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

        <TouchableOpacity activeOpacity={0.8} style={s.google}>
          <AntDesign name="google" size={18} color={colors.white} />
          <Text style={s.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>
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
});