import { create } from 'zustand';
import { signOutUser } from '../services/googleAuth';
import type { AuthUser } from '../types/user';

type AuthState = {
  phone: string | null; // demo phone/OTP login
  user: AuthUser | null; // real Firebase (Google) login
  isLoggedIn: boolean;
  initialized: boolean;
  login: (phone: string) => void;
  setUser: (user: AuthUser | null) => void;
  setInitialized: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  phone: null,
  user: null,
  isLoggedIn: false,
  initialized: false,
  login: (phone) => set({ phone, isLoggedIn: true }),
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  setInitialized: () => set({ initialized: true }),
  logout: () => {
    set({ phone: null, user: null, isLoggedIn: false });
    void signOutUser();
  },
}));
