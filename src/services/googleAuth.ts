import { getAuth, GoogleAuthProvider, signInWithCredential, signOut } from '@react-native-firebase/auth';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, USE_MOCK_AUTH } from '../config/appConfig';
import type { AuthUser } from '../types/user';
import { ensureUserProfile } from './userService';

let configured = false;
function configure() {
  if (configured) return;
  GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
  configured = true;
}

const MOCK_USER: AuthUser = {
  uid: 'mock-user',
  userId: '482913',
  name: 'Aarav Sharma',
  email: 'demo@desivox.app',
  photoURL: null,
  country: 'India',
  bio: 'Voice lover • Music • Late night talks',
  level: 12,
  followers: 1280,
  following: 245,
  coins: 2500,
  vip: true,
  status: 'active',
  hostStatus: 'none',
  agencyId: null,
  agencyRole: 'none',
};

const log = (...a: unknown[]) => console.log('[GoogleAuth]', ...a);

// Returns the signed-in user, or null if the person cancelled. Throws on real errors.
export async function signInWithGoogle(): Promise<AuthUser | null> {
  log('start. USE_MOCK_AUTH =', USE_MOCK_AUTH, '| webClientId =', GOOGLE_WEB_CLIENT_ID.slice(0, 12) + '...');
  if (USE_MOCK_AUTH) {
    await new Promise((r) => setTimeout(r, 600));
    return MOCK_USER;
  }
  configure();
  try {
    log('1. checking Play Services');
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    log('2. opening Google account picker');
    const res = await GoogleSignin.signIn();
    log('3. picker result type =', (res as any)?.type);
    if (!isSuccessResponse(res)) return null; // cancelled
    const idToken = res.data.idToken;
    if (!idToken) throw new Error('Google did not return an ID token.');
    log('4. signing in to Firebase');
    const { user } = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(idToken));
    log('5. Firebase ok, uid =', user.uid, '- loading profile');
    const profile = await ensureUserProfile(user);
    log('6. profile ready, userId =', profile.userId);
    return profile;
  } catch (e: any) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_CANCELLED) {
      log('cancelled by user');
      return null;
    }
    log('ERROR code =', e?.code, '| message =', e?.message);
    throw e;
  }
}

export async function signOutUser(): Promise<void> {
  if (USE_MOCK_AUTH) return;
  try {
    await GoogleSignin.signOut();
  } catch {}
  try {
    await signOut(getAuth());
  } catch {}
}
