import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { doc, getFirestore, updateDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserAvatar from '../../components/UserAvatar';
import { USE_MOCK_AUTH } from '../../config/appConfig';
import { PRESET_AVATARS, presetUrl } from '../../constants/avatars';
import { useAuthStore } from '../../store/authStore';
import colors from '../../theme/colors';

const COUNTRIES = ['India', 'Nepal', 'Bangladesh', 'United Arab Emirates'];
const NAME_MAX = 40;
const BIO_MAX = 150;

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const googlePhoto = USE_MOCK_AUTH ? null : getAuth().currentUser?.photoURL ?? null;

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [country, setCountry] = useState(user?.country ?? 'India');
  const [photo, setPhoto] = useState<string | null>(user?.photoURL ?? null);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <View style={[s.screen, s.centered]}>
        <Text style={s.muted}>Please log in with Google to edit your profile.</Text>
        <TouchableOpacity style={s.saveBtn} onPress={() => router.back()}>
          <Text style={s.saveText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const changed =
    name.trim() !== user.name || bio.trim() !== user.bio || country !== user.country || photo !== user.photoURL;

  const save = async () => {
    const n = name.trim();
    if (n.length < 1 || n.length > NAME_MAX) return Alert.alert('Check your name', `Name must be 1 to ${NAME_MAX} characters.`);
    if (bio.trim().length > BIO_MAX) return Alert.alert('Check your bio', `Bio can be up to ${BIO_MAX} characters.`);
    setSaving(true);
    try {
      const changes = { name: n, bio: bio.trim(), country, photoURL: photo };
      if (!USE_MOCK_AUTH) await updateDoc(doc(getFirestore(), 'users', user.uid), changes);
      setUser({ ...user, ...changes });
      router.back();
    } catch (e: any) {
      Alert.alert(
        'Could not save',
        e?.code === 'firestore/permission-denied'
          ? 'You do not have permission to change this profile.'
          : 'Please check your internet connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const options: (string | null)[] = [...(googlePhoto ? [googlePhoto] : []), ...PRESET_AVATARS.map((a) => presetUrl(a.id))];

  return (
    <KeyboardAvoidingView behavior="padding" style={s.screen}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.title}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.center}>
          <UserAvatar photoURL={photo} size={96} />
          <Text style={s.idText}>User ID: {user.userId || '-'}</Text>
        </View>

        <Text style={s.label}>Choose a photo</Text>
        <View style={s.grid}>
          {options.map((o) => {
            const active = photo === o;
            return (
              <TouchableOpacity key={String(o)} onPress={() => setPhoto(o)} style={[s.opt, active && s.optActive]} accessibilityLabel="Select photo">
                <UserAvatar photoURL={o} size={52} />
                {active && <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={s.tick} />}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={s.hint}>Uploading your own photo will be added later.</Text>

        <Text style={s.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} maxLength={NAME_MAX} placeholder="Your name" placeholderTextColor={colors.placeholder} style={s.input} />
        <Text style={s.count}>{name.trim().length}/{NAME_MAX}</Text>

        <Text style={s.label}>Bio</Text>
        <TextInput
          value={bio} onChangeText={setBio} maxLength={BIO_MAX} multiline placeholder="Tell people about yourself"
          placeholderTextColor={colors.placeholder} style={[s.input, s.bioInput]}
        />
        <Text style={s.count}>{bio.length}/{BIO_MAX}</Text>

        <Text style={s.label}>Country</Text>
        <View style={s.chips}>
          {COUNTRIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCountry(c)} style={[s.chip, country === c && s.chipActive]}>
              <Text style={[s.chipText, country === c && s.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={[s.saveBtn, (!changed || saving) && { opacity: 0.5 }]} disabled={!changed || saving} onPress={save} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color={colors.textOnGold} /> : <Text style={s.saveText}>Save changes</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  muted: { color: colors.textSecondary, textAlign: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.backgroundSecondary,
  },
  title: { color: colors.text, fontSize: 17, fontWeight: '700' },
  body: { padding: 18, paddingBottom: 30 },
  center: { alignItems: 'center', marginBottom: 6 },
  idText: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  label: { color: colors.textSecondary, fontSize: 13, fontWeight: '700', marginTop: 20, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  opt: { padding: 4, borderRadius: 34, borderWidth: 2, borderColor: 'transparent' },
  optActive: { borderColor: colors.primary },
  tick: { position: 'absolute', right: -2, bottom: -2, backgroundColor: colors.background, borderRadius: 9 },
  hint: { color: colors.textMuted, fontSize: 11, marginTop: 8 },
  input: {
    backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 12,
  },
  bioInput: { minHeight: 90, textAlignVertical: 'top' },
  count: { color: colors.textMuted, fontSize: 11, alignSelf: 'flex-end', marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: colors.textOnGold, fontWeight: '800' },
  footer: { paddingHorizontal: 18, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.backgroundSecondary },
  saveBtn: { height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  saveText: { color: colors.textOnGold, fontSize: 15, fontWeight: '800' },
});
