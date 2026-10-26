import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];
export type PresetAvatar = { id: string; icon: IconName; bg: string; fg: string };

// Preset avatars (used until photo upload / Cloud Storage is available).
// A preset is stored in the user's photoURL as "avatar:<id>".
export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'a1', icon: 'person', bg: '#E9B8A0', fg: '#2B1733' },
  { id: 'a2', icon: 'mic', bg: '#F4C542', fg: '#2B1733' },
  { id: 'a3', icon: 'musical-notes', bg: '#B6A4D9', fg: '#2B1733' },
  { id: 'a4', icon: 'headset', bg: '#8B35C9', fg: '#FFFFFF' },
  { id: 'a5', icon: 'star', bg: '#C9A47B', fg: '#2B1733' },
  { id: 'a6', icon: 'heart', bg: '#FF5263', fg: '#FFFFFF' },
  { id: 'a7', icon: 'flame', bg: '#43C98B', fg: '#2B1733' },
  { id: 'a8', icon: 'planet', bg: '#8B9DFF', fg: '#2B1733' },
];

export const DEFAULT_AVATAR = PRESET_AVATARS[0];
export const presetUrl = (id: string) => `avatar:${id}`;

export function parsePreset(photoURL: string | null | undefined): PresetAvatar | null {
  if (!photoURL || !photoURL.startsWith('avatar:')) return null;
  return PRESET_AVATARS.find((a) => a.id === photoURL.slice(7)) ?? null;
}
