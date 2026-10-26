import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { USE_MOCK_AUTH } from '../config/appConfig';
import { useAuthStore } from '../store/authStore';
import { ensureUserProfile, fallbackUser, watchUserProfile } from './userService';

let stopWatching: (() => void) | null = null;
const stopProfile = () => {
  stopWatching?.();
  stopWatching = null;
};

// Restores the login when the app is opened again and keeps the profile live.
// Call once from the root layout.
export function startSessionListener(): () => void {
  if (USE_MOCK_AUTH) {
    useAuthStore.getState().setInitialized();
    return () => {};
  }
  const stopAuth = onAuthStateChanged(getAuth(), async (fb) => {
    const store = useAuthStore.getState();
    stopProfile();
    if (!fb) {
      if (store.user) store.logout(); // signed out elsewhere
      store.setInitialized();
      return;
    }
    try {
      store.setUser(await ensureUserProfile(fb));
    } catch (e) {
      console.warn('Could not load profile:', e);
      // keep the person logged in even if the profile could not be loaded (e.g. offline)
      store.setUser(fallbackUser(fb));
    }
    store.setInitialized();
    stopWatching = watchUserProfile(fb, (u) => useAuthStore.getState().setUser(u));
  });
  return () => {
    stopProfile();
    stopAuth();
  };
}
