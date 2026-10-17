import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
import BottomNav from './BottomNav';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <View style={s.screen}>
      <View style={s.c}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>Coming soon</Text>
      </View>
      <BottomNav />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  c: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.textSecondary, marginTop: 6 },
});
