import { create } from 'zustand';

type AuthState = {
  phone: string | null;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  logout: () => void;
};

// Later: add token / user profile here and persist it (e.g. expo-secure-store)
export const useAuthStore = create<AuthState>((set) => ({
  phone: null,
  isLoggedIn: false,
  login: (phone) => set({ phone, isLoggedIn: true }),
  logout: () => set({ phone: null, isLoggedIn: false }),
}));
