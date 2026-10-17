import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatStore } from '../features/chat/chatStore';

const GOLD = '#F8C744';
const BG = '#080410';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  home: { active: 'home', inactive: 'home-outline' },
  grid: { active: 'grid', inactive: 'grid-outline' },
  chatbubbles: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  person: { active: 'person', inactive: 'person-outline' },
};

// Put <BottomNav /> at the bottom of any main screen.
// The active item comes from the current URL, so it is always correct.
export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [keyboard, setKeyboard] = useState(false);
  const unread = useChatStore((s) => Object.values(s.unread).reduce((a, b) => a + b, 0));

  useEffect(() => {
    const a = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const b = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);

  if (keyboard) return null;

  const go = (path: string) => {
    if (!pathname.startsWith(path)) router.navigate(path as any);
  };
  const is = (path: string) => pathname.startsWith(path);

  return (
    <View style={[styles.bottomNav, { height: 66 + insets.bottom, paddingBottom: insets.bottom }]}>
      <NavItem label="Home" icon="home" active={is('/home')} onPress={() => go('/home')} />
      <NavItem label="Room" icon="grid" active={is('/rooms')} onPress={() => go('/rooms')} />

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.centerMicButton}
        onPress={() => router.push('/create-room' as any)}
        accessibilityLabel="Create a room"
      >
        <LinearGradient colors={['#FFE98A', GOLD, '#E5A520']} style={styles.centerMicGradient}>
          <Ionicons name="mic" size={27} color="#32133F" />
        </LinearGradient>
      </TouchableOpacity>

      <NavItem label="Chat" icon="chatbubbles" active={is('/chat')} badge={unread} onPress={() => go('/chat')} />
      <NavItem label="Profile" icon="person" active={is('/profile')} onPress={() => go('/profile')} />
    </View>
  );
}

function NavItem({
  label, icon, active, badge = 0, onPress,
}: { label: string; icon: string; active: boolean; badge?: number; onPress: () => void }) {
  const selected = ICONS[icon];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.navItem}>
      <View>
        <Ionicons name={active ? selected.active : selected.inactive} size={21} color={active ? GOLD : '#9486A8'} />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
      {active && <View style={styles.navIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#0D0715', borderTopWidth: 1, borderTopColor: '#291936', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 7,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, height: 54 },
  navLabel: { color: '#9586A7', fontSize: 9, fontWeight: '600' },
  navLabelActive: { color: GOLD, fontWeight: '800' },
  navIndicator: { width: 13, height: 2, borderRadius: 2, backgroundColor: GOLD, marginTop: 1 },
  centerMicButton: { width: 54, height: 54, borderRadius: 27, marginTop: -27, borderWidth: 4, borderColor: BG, overflow: 'hidden' },
  centerMicGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: -5, right: -10, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3,
    backgroundColor: '#FF3F68', alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
});
