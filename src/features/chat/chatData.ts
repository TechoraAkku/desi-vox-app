export type ChatUser = { id: string; name: string; color: string; online: boolean };
export type Message = { id: string; text: string; mine: boolean; time: number };

// Same ids are used by the Top Hosts on Home. Replace with API data later.
export const USERS: Record<string, ChatUser> = {
  maya: { id: 'maya', name: 'Maya', color: '#E9B8A0', online: true },
  arjun: { id: 'arjun', name: 'Arjun', color: '#C9A47B', online: true },
  rahul: { id: 'rahul', name: 'Rahul', color: '#B88D70', online: false },
  sara: { id: 'sara', name: 'Sara', color: '#B6A4D9', online: true },
};

// Lets other screens add a user (for example a host loaded from Firestore) before opening the chat.
export const registerChatUser = (u: ChatUser) => {
  USERS[u.id] = u;
};

export const getUser = (id?: string): ChatUser =>
  (id && USERS[id]) || { id: id ?? 'unknown', name: 'User', color: '#B6A4D9', online: false };

const ago = (minutes: number) => Date.now() - minutes * 60_000;

// Demo history: Maya, Arjun, Rahul have chats. Sara has none (opens an empty chat).
export const SEED_THREADS: Record<string, Message[]> = {
  maya: [
    { id: 'm1', text: 'Hey! Are you joining the Music Lounge tonight?', mine: false, time: ago(55) },
    { id: 'm2', text: 'Yes, will be there at 9 😊', mine: true, time: ago(50) },
    { id: 'm3', text: 'Great, I will save you a seat!', mine: false, time: ago(12) },
  ],
  arjun: [
    { id: 'a1', text: 'Loved your song in the room yesterday', mine: false, time: ago(60 * 26) },
    { id: 'a2', text: 'Thank you! Join again soon 🎤', mine: true, time: ago(60 * 25) },
  ],
  rahul: [
    { id: 'r1', text: 'Bro, send me the room link', mine: false, time: ago(60 * 24 * 3) },
    { id: 'r2', text: 'Check the Late Night Talks room', mine: true, time: ago(60 * 24 * 3 - 5) },
  ],
};
export const SEED_UNREAD: Record<string, number> = { maya: 1, rahul: 2 };

export function formatTime(ts: number) {
  const d = new Date(ts);
  const h = d.getHours();
  return `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export function formatListTime(ts: number) {
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(new Date()) - day(new Date(ts))) / 86_400_000);
  if (diff <= 0) return formatTime(ts);
  if (diff === 1) return 'Yesterday';
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}