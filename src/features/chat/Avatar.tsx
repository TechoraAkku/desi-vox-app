import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { ChatUser } from './chatData';

export default function Avatar({ user, size = 48 }: { user: ChatUser; size?: number }) {
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: user.color }]}>
      <Ionicons name="person" size={size * 0.52} color="#2B1733" />
      {user.online && <View style={[s.dot, { width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />}
    </View>
  );
}

const s = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary },
  dot: { position: 'absolute', right: -1, bottom: 0, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.background },
});
