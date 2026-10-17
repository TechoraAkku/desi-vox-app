import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { verifyOtp } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import colors from '../../theme/colors';

const logo = require('../../assets/logo.png');

const OTP_LENGTH = 4;
type Gradient = readonly [string, string, ...string[]];
const BG: Gradient = [colors.purple, colors.backgroundSecondary, colors.background, colors.black];
const BG_STOPS = [0, 0.3, 0.65, 1] as const;

export default function OtpScreen() {
  const { width, height } = useWindowDimensions();
  const { phone = '' } = useLocalSearchParams<{ phone?: string; code?: string }>();
  const login = useAuthStore((s) => s.login);

  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState('');
  const [focused, setFocused] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formW = width * 0.76;
  const ready = otp.length === OTP_LENGTH && !loading;

  const onChange = (t: string) => {
    setOtp(t.replace(/\D/g, '').slice(0, OTP_LENGTH));
    if (error) setError('');
  };

  const verify = async () => {
    if (!ready) return;
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (!res.ok) {
        setError(res.message ?? 'Invalid OTP');
        setOtp('');
        inputRef.current?.focus();
        return;
      }
      login(phone);
      if (router.canDismiss()) router.dismissAll(); // back button should not return to login
      router.replace('/home' as any);
    } catch {
      setError('Something went wrong. Check your internet and try again.');
    } finally {
      setLoading(false);
    }
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

        {/* 4 OTP boxes; one invisible TextInput on top receives the typing */}
        <View style={[s.boxes, { width: formW, marginTop: height * 0.065 }, !!error && { borderColor: colors.error }]}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const active = focused && i === Math.min(otp.length, OTP_LENGTH - 1);
            return (
              <View key={i} style={[s.cell, i > 0 && s.cellDivider, active && s.cellActive]}>
                <Text style={s.digit}>{otp[i] ?? ''}</Text>
              </View>
            );
          })}
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoFocus
            caretHidden
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            style={s.hiddenInput}
          />
        </View>
        <Text style={s.error}>{error}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!ready}
          onPress={verify}
          style={[s.btn, { width: formW }, !ready && { opacity: 0.6 }]}
        >
          <Text style={s.btnText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
        </TouchableOpacity>

        <Text style={s.terms}>
          By continuing you agree to our{'\n'}
          <Text style={s.termsBold}>Terms & Privacy Policy</Text>
        </Text>

        {__DEV__ && <Text style={s.demo}>Demo OTP: 1111</Text>}
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  welcome: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 4 },
  boxes: {
    height: 46, flexDirection: 'row', borderRadius: 6, overflow: 'hidden',
    backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border,
  },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cellDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  cellActive: { backgroundColor: 'rgba(139,157,255,0.14)' },
  digit: { color: colors.text, fontSize: 20, fontWeight: '700' },
  hiddenInput: { ...StyleSheet.absoluteFill, opacity: 0.02, color: colors.transparent },
  error: { color: colors.error, fontSize: 12, minHeight: 18, marginTop: 6, textAlign: 'center', paddingHorizontal: 24 },
  btn: { height: 44, marginTop: 6, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.textOnGold, fontSize: 14, fontWeight: '700' },
  terms: { color: colors.text, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 36, fontWeight: '600' },
  termsBold: { fontWeight: '800' },
  demo: { color: colors.textMuted, fontSize: 12, marginTop: 24 },
});
