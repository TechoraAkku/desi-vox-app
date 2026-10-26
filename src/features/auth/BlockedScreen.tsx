import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import colors from '../../theme/colors';

type Gradient = readonly [string, string, ...string[]];
const BG = colors.gradient.background as unknown as Gradient;

export default function BlockedScreen() {
  const status = useAuthStore((s) => s.user?.status);
  const logout = useAuthStore((s) => s.logout);
  const banned = status === 'banned';

  const onLogout = () => {
    logout();
    router.replace('/login' as any);
  };

  return (
    <LinearGradient colors={BG} style={s.c}>
      <Ionicons name={banned ? 'ban' : 'pause-circle'} size={84} color={colors.error} />
      <Text style={s.title}>{banned ? 'Account banned' : 'Account suspended'}</Text>
      <Text style={s.body}>
        {banned
          ? 'Your account has been banned by the HyperLive team because it broke our rules.'
          : 'Your account is suspended for now. You can use the app again once the team lifts the suspension.'}
      </Text>
      <Text style={s.hint}>If you think this is a mistake, please contact support.</Text>
      <TouchableOpacity style={s.btn} activeOpacity={0.85} onPress={onLogout}>
        <Text style={s.btnText}>Log out</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 20 },
  body: { color: colors.textSecondary, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
  hint: { color: colors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 14 },
  btn: { marginTop: 32, height: 46, paddingHorizontal: 36, borderRadius: 23, backgroundColor: colors.primary, justifyContent: 'center' },
  btnText: { color: colors.textOnGold, fontWeight: '800', fontSize: 14 },
});
