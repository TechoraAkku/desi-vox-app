
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const BG = '#080410';
const CARD = '#140B20';
const GOLD = '#F8C744';
const MUTED = '#A79AB8';

const categories = ['Music', 'Chat', 'Gaming', 'Love', 'Fun', 'Other'];
const roomTypes = ['Public', 'Private'];
const voiceModes = ['Open Mic', 'Stage Mode'];

export default function CreateRoomScreen() {
  const [roomName, setRoomName] = useState('');
  const [category, setCategory] = useState('Music');
  const [roomType, setRoomType] = useState('Public');
  const [voiceMode, setVoiceMode] = useState('Open Mic');

  const [allowGifts, setAllowGifts] = useState(true);
  const [allowChats, setAllowChats] = useState(true);
  const [allowContent, setAllowContent] = useState(true);

  const renderOptions = (
    title: string,
    options: string[],
    selected: string,
    onSelect: (value: string) => void,
  ) => (
    <View style={styles.section}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text
                style={[
                  styles.optionText,
                  active && styles.optionTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderSwitch = (
    title: string,
    description: string,
    value: boolean,
    onChange: (value: boolean) => void,
    icon: keyof typeof Ionicons.glyphMap,
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={GOLD} />
      </View>

      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#45364F', true: '#80611C' }}
        thumbColor={value ? GOLD : '#B8AFC0'}
      />
    </View>
  );

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      return;
    }

    // UI is ready. Connect the create-room API here later.
    console.log({
      roomName: roomName.trim(),
      category,
      roomType,
      voiceMode,
      allowGifts,
      allowChats,
      allowContent,
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Create Room</Text>
          <Text style={styles.headerSubtitle}>Build your own vibe</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="mic" size={23} color={GOLD} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#4A1B64', '#281035', '#16091F']}
          style={styles.hero}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="radio" size={28} color={GOLD} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Your room, your rules</Text>
            <Text style={styles.heroSubtitle}>
              Set the vibe and invite people to join.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.label}>Room Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="chatbox-ellipses-outline" size={20} color={MUTED} />
            <TextInput
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Give your room a name"
              placeholderTextColor="#786982"
              maxLength={40}
              style={styles.input}
              returnKeyType="done"
            />
            <Text style={styles.charCount}>{roomName.length}/40</Text>
          </View>
        </View>

        {renderOptions('Room Category', categories, category, setCategory)}

        {renderOptions('Room Type', roomTypes, roomType, setRoomType)}

        {renderOptions('Voice Mode', voiceModes, voiceMode, setVoiceMode)}

        <View style={styles.section}>
          <Text style={styles.label}>Room Preferences</Text>

          <View style={styles.settingsCard}>
            {renderSwitch(
              'Allow Gifts',
              'Let listeners send virtual gifts',
              allowGifts,
              setAllowGifts,
              'gift-outline',
            )}

            <View style={styles.separator} />

            {renderSwitch(
              'Allow Chats',
              'Allow messages in your room',
              allowChats,
              setAllowChats,
              'chatbubbles-outline',
            )}

            <View style={styles.separator} />

            {renderSwitch(
              'Allow Content',
              'Allow room content sharing',
              allowContent,
              setAllowContent,
              'images-outline',
            )}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleCreateRoom}
          disabled={!roomName.trim()}
          style={styles.createButtonWrap}
        >
          <LinearGradient
            colors={
              roomName.trim()
                ? ['#FFE98A', GOLD, '#E5A520']
                : ['#65583C', '#55451F']
            }
            style={styles.createButton}
          >
            <Ionicons name="mic" size={21} color="#291132" />
            <Text style={styles.createButtonText}>Create Room</Text>
            <Ionicons name="arrow-forward" size={18} color="#291132" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          You can manage your room after creating it.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#24152F',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { flex: 1, marginLeft: 13 },
  headerTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  headerSubtitle: { color: MUTED, fontSize: 11, marginTop: 3 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#281534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 18, paddingBottom: 35 },
  hero: {
    minHeight: 100,
    borderRadius: 19,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5B3471',
    marginBottom: 24,
  },
  heroIcon: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: '#3B204A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1, marginLeft: 13 },
  heroTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  heroSubtitle: { color: '#D0B8DF', fontSize: 11, marginTop: 5, lineHeight: 17 },
  section: { marginBottom: 23 },
  label: {
    color: '#F4EAFB',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 11,
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3A2749',
    backgroundColor: CARD,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 13, paddingVertical: 14 },
  charCount: { color: '#86758F', fontSize: 10 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  option: {
    minHeight: 40,
    paddingHorizontal: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#392746',
  },
  optionActive: {
    backgroundColor: '#392344',
    borderColor: GOLD,
  },
  optionText: { color: '#C6B7D0', fontSize: 12, fontWeight: '600' },
  optionTextActive: { color: GOLD, fontWeight: '800' },
  settingsCard: {
    backgroundColor: CARD,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#32213E',
    paddingHorizontal: 13,
  },
  settingRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  settingIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#30203C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: { flex: 1 },
  settingTitle: { color: '#F7F0FC', fontSize: 13, fontWeight: '700' },
  settingDescription: { color: MUTED, fontSize: 10, marginTop: 5 },
  separator: { height: 1, backgroundColor: '#30213A' },
  createButtonWrap: { borderRadius: 16, overflow: 'hidden', marginTop: 1 },
  createButton: {
    minHeight: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 11,
    borderRadius: 16,
  },
  createButtonText: { color: '#291132', fontSize: 15, fontWeight: '900', flex: 1 },
  footerNote: {
    color: '#85738F',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 13,
  },
});
