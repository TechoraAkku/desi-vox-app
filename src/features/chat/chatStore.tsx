import { create } from 'zustand';
import { Message, SEED_THREADS, SEED_UNREAD } from './chatData';

type ChatState = {
  threads: Record<string, Message[]>; // userId -> messages (oldest first)
  unread: Record<string, number>;
  send: (userId: string, text: string) => void;
  markRead: (userId: string) => void;
};

// UI-only store. When the API is ready: load threads from the server and send() via the API.
export const useChatStore = create<ChatState>((set) => ({
  threads: SEED_THREADS,
  unread: SEED_UNREAD,
  send: (userId, text) =>
    set((s) => ({
      threads: {
        ...s.threads,
        [userId]: [...(s.threads[userId] ?? []), { id: String(Date.now()), text, mine: true, time: Date.now() }],
      },
    })),
  markRead: (userId) => set((s) => (s.unread[userId] ? { unread: { ...s.unread, [userId]: 0 } } : s)),
}));
