import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { DEFAULT_AVATAR, parsePreset } from '../constants/avatars';

// Shows a real photo (Google), a preset avatar, or the default avatar.
export default function UserAvatar({ photoURL, size = 48 }: { photoURL: string | null; size?: number }) {
  const preset = parsePreset(photoURL);
  if (photoURL && !preset) {
    return <Image source={{ uri: photoURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const a = preset ?? DEFAULT_AVATAR;
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: a.bg,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Ionicons name={a.icon} size={size * 0.5} color={a.fg} />
    </View>
  );
}
