import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatStore } from '../features/chat/chatStore';
import colors from '../theme/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type Tab = { name: string; label: string; on: IconName; off: IconName };

const LEFT: Tab[] = [
  { name: 'home', label: 'Home', on: 'home', off: 'home-outline' },
  { name: 'rooms', label: 'Room', on: 'grid', off: 'grid-outline' },
];
const RIGHT: Tab[] = [
  { name: 'chat', label: 'Chat', on: 'chatbubbles', off: 'chatbubbles-outline' },
  { name: 'profile', label: 'Profile', on: 'person', off: 'person-outline' },
];
const GOLD = colors.gradient.gold as unknown as readonly [string, string, ...string[]];

// state / navigation come from the Tabs navigator
export default function AppTabBar({ state, navigation }: { state: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  const [keyboard, setKeyboard] = useState(false);
  const unread = useChatStore((s) => Object.values(s.unread).reduce((a, b) => a + b, 0));
  const activeName: string = state.routes[state.index]?.name;

  useEffect(() => {
    const a = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const b = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => { a.remove(); b.remove(); };
  }, []);

  if (keyboard) return null;

  const renderTab = (t: Tab) => {
    const active = activeName === t.name;
    return (
      <TouchableOpacity key={t.name} style={s.item} activeOpacity={0.7} onPress={() => navigation.navigate(t.name)}>
        <View>
          <Ionicons name={active ? t.on : t.off} size={21} color={active ? colors.primary : colors.textMuted} />
          {t.name === 'chat' && unread > 0 && (
            <View style={s.badge}><Text style={s.badgeText}>{unread > 9 ? '9+' : unread}</Text></View>
          )}
        </View>
        <Text style={[s.label, active && s.labelActive]}>{t.label}</Text>
        {active && <View style={s.indicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.bar, { height: 66 + insets.bottom, paddingBottom: insets.bottom }]}>
      {LEFT.map(renderTab)}
      <TouchableOpacity
        activeOpacity={0.85}
        style={s.center}
        onPress={() => router.push('/create-room' as any)}
        accessibilityLabel="Create a room"
      >
        <LinearGradient colors={GOLD} style={s.centerInner}>
          <Ionicons name="mic" size={27} color={colors.textOnGold} />
        </LinearGradient>
      </TouchableOpacity>
      {RIGHT.map(renderTab)}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 7,
    backgroundColor: colors.backgroundSecondary, borderTopWidth: 1, borderTopColor: colors.border,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, height: 54 },
  label: { color: colors.textMuted, fontSize: 9, fontWeight: '600' },
  labelActive: { color: colors.primary, fontWeight: '800' },
  indicator: { width: 13, height: 2, borderRadius: 2, backgroundColor: colors.primary },
  center: { width: 54, height: 54, borderRadius: 27, marginTop: -27, borderWidth: 4, borderColor: colors.background, overflow: 'hidden' },
  centerInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: -5, right: -9, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3,
    backgroundColor: colors.live, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: '800' },
});
