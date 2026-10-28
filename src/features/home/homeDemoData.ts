import type { HomeBanner, HomeHost, HomeRoom } from '../../types/home';

// Shown in the client demo APK and for the demo (phone / OTP) login, where Firestore is not available.
export const DEMO_BANNERS: HomeBanner[] = [
  {
    id: 'demo1', eyebrow: 'LIVE VOICE COMMUNITY', title: 'Your voice, your world.',
    subtitle: 'Sing · Chat · Play · Connect', buttonText: 'Explore Rooms', theme: 'purple', order: 1,
  },
];

const names = ['Music Lounge', 'Late Night Talks', 'Friends Zone', 'Singing Room', 'Chill & Chat'];
const themes = ['violet', 'plum', 'violet', 'plum', 'violet'] as const;
export const DEMO_ROOMS: HomeRoom[] = names.map((title, i) => ({
  id: `demo-room-${i + 1}`, title, subtitle: 'Join the conversation', hostName: 'Host', category: i % 2 ? 'talk' : 'music',
  listeners: (i + 1) * 12 + 8, theme: themes[i], createdAtMs: 1000 - i,
}));

export const DEMO_HOSTS: HomeHost[] = [
  { uid: 'maya', name: 'Maya', photoURL: 'avatar:a1', followers: 4 },
  { uid: 'arjun', name: 'Arjun', photoURL: 'avatar:a5', followers: 3 },
  { uid: 'rahul', name: 'Rahul', photoURL: 'avatar:a2', followers: 2 },
  { uid: 'sara', name: 'Sara', photoURL: 'avatar:a3', followers: 1 },
];
