import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/BottomNav';
import { useAuthStore } from '../../store/authStore';
import colors from '../../theme/colors';
import { DEMO_PROFILE } from './profileData';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type Gradient = readonly [string, string, ...string[]];
const HEADER_BG: Gradient = [colors.purpleLight, colors.purple, colors.background];
const GOLD: Gradient = colors.gradient.gold as unknown as Gradient;

const MENU: { icon: IconName; label: string }[] = [
  { icon: 'create-outline', label: 'Edit Profile' },
  { icon: 'wallet-outline', label: 'My Wallet' },
  { icon: 'diamond-outline', label: 'VIP Membership' },
  { icon: 'gift-outline', label: 'Gifts' },
  { icon: 'mic-outline', label: 'Host Center' },
  { icon: 'settings-outline', label: 'Settings' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
  { icon: 'document-text-outline', label: 'Terms & Privacy' },
];

const soon = (title: string) => Alert.alert(title, 'This screen is coming soon.');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const phone = useAuthStore((s) => s.phone);
  const user = useAuthStore((s) => s.user);
  const P = user ?? DEMO_PROFILE; // real user if logged in with Google, demo data otherwise
  const logout = useAuthStore((s) => s.logout);

  const name = user?.name ?? P.name;
  const userId = user?.userId || P.userId;
  const maskedPhone = phone && phone.length >= 4 ? `${phone.slice(0, 2)}••••••${phone.slice(-2)}` : null;

  const onLogout = () => {
    Alert.alert('Logout', 'Do you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login' as any);
        },
      },
    ]);
  };

  return (
    <View style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* header */}
        <LinearGradient colors={HEADER_BG} style={[s.header, { paddingTop: insets.top + 16 }]}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={{ width: 90, height: 90, borderRadius: 45 }} />
              ) : (
                <Ionicons name="person" size={46} color="#2B1733" />
              )}
            </View>
            <TouchableOpacity style={s.camera} onPress={() => soon('Change photo')} accessibilityLabel="Change photo">
              <Ionicons name="camera" size={14} color={colors.textOnGold} />
            </TouchableOpacity>
          </View>

          <View style={s.nameRow}>
            <Text style={s.name}>{name}</Text>
            {P.vip && (
              <LinearGradient colors={GOLD} style={s.vip}>
                <Ionicons name="diamond" size={10} color={colors.textOnGold} />
                <Text style={s.vipText}>VIP</Text>
              </LinearGradient>
            )}
          </View>
          <Text style={s.meta}>ID: {userId}  •  {P.country}{maskedPhone ? `  •  ${maskedPhone}` : ''}</Text>
          <Text style={s.bio}>{P.bio}</Text>

          <View style={s.stats}>
            <Stat value={P.followers.toLocaleString('en-IN')} label="Followers" />
            <View style={s.statDivider} />
            <Stat value={String(P.following)} label="Following" />
            <View style={s.statDivider} />
            <Stat value={`Lv ${P.level}`} label="Level" />
          </View>
        </LinearGradient>

        <View style={s.body}>
          {/* wallet */}
          <View style={s.wallet}>
            <View style={s.coinCircle}>
              <Ionicons name="logo-bitcoin" size={22} color={colors.textOnGold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.walletLabel}>Coin balance</Text>
              <Text style={s.walletValue}>{P.coins.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity style={s.recharge} activeOpacity={0.85} onPress={() => soon('Recharge')}>
              <Text style={s.rechargeText}>Recharge</Text>
            </TouchableOpacity>
          </View>

          {/* menu */}
          <View style={s.menu}>
            {MENU.map((m, i) => (
              <TouchableOpacity
                key={m.label}
                style={[s.row, i > 0 && s.rowDivider]}
                activeOpacity={0.7}
                onPress={() => soon(m.label)}
              >
                <View style={s.rowIcon}>
                  <Ionicons name={m.icon} size={19} color={colors.primary} />
                </View>
                <Text style={s.rowLabel}>{m.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.logout} activeOpacity={0.8} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={19} color={colors.error} />
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingBottom: 22, paddingHorizontal: 20 },
  avatarWrap: { width: 96, height: 96 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#E9B8A0', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: colors.primary,
  },
  camera: {
    position: 'absolute', right: 0, bottom: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  name: { color: colors.text, fontSize: 21, fontWeight: '800' },
  vip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  vipText: { color: colors.textOnGold, fontSize: 10, fontWeight: '900' },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 6 },
  bio: { color: colors.textMuted, fontSize: 12, marginTop: 6, textAlign: 'center' },
  stats: {
    flexDirection: 'row', alignItems: 'center', marginTop: 18, width: '100%', paddingVertical: 14, borderRadius: 16,
    backgroundColor: 'rgba(8,4,16,0.55)', borderWidth: 1, borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 17, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
  body: { paddingHorizontal: 16, marginTop: 8 },
  wallet: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.borderGold,
  },
  coinCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.coin, alignItems: 'center', justifyContent: 'center' },
  walletLabel: { color: colors.textMuted, fontSize: 11 },
  walletValue: { color: colors.coin, fontSize: 22, fontWeight: '900', marginTop: 2 },
  recharge: { paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center' },
  rechargeText: { color: colors.textOnGold, fontSize: 12, fontWeight: '800' },
  menu: { marginTop: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, height: 54 },
  rowDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.backgroundTertiary, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' },
  logout: {
    marginTop: 16, height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontSize: 14, fontWeight: '700' },
});
