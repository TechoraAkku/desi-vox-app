import { doc, getDoc, getFirestore, onSnapshot, runTransaction, serverTimestamp } from '@react-native-firebase/firestore';
import type { AccountStatus, AgencyRole, AuthUser, HostStatus } from '../types/user';

// Only the fields we need. Firebase's real user object fits this shape.
type FirebaseUserLike = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

const MAX_TRIES = 15;
const randomSixDigit = () => String(Math.floor(100000 + Math.random() * 900000));
// exists() is a method in the modular API; this also works if it is a property
const exists = (snap: any): boolean => (typeof snap.exists === 'function' ? snap.exists() : !!snap.exists);

function toAuthUser(uid: string, d: any, email: string | null): AuthUser {
  return {
    uid,
    userId: String(d?.userId ?? ''),
    name: d?.name ?? 'User',
    email,
    photoURL: d?.photoURL ?? null,
    country: d?.country ?? 'India',
    bio: d?.bio ?? '',
    level: Number(d?.level ?? 1),
    followers: Number(d?.followers ?? 0),
    following: Number(d?.following ?? 0),
    coins: Number(d?.coins ?? 0),
    vip: !!d?.vip,
    status: (d?.status ?? 'active') as AccountStatus,
    hostStatus: (d?.hostStatus ?? 'none') as HostStatus,
    agencyId: d?.agencyId ?? null,
    agencyRole: (d?.agencyRole ?? 'none') as AgencyRole,
  };
}

// Used when the profile could not be loaded (e.g. offline): keep the person logged in
export function fallbackUser(fb: FirebaseUserLike): AuthUser {
  return toAuthUser(fb.uid, { name: fb.displayName ?? 'User', photoURL: fb.photoURL }, fb.email);
}

// Returns the user's profile. Creates it (with a UNIQUE 6-digit ID) on first login.
// users/{uid}  -> profile
// userIds/{id} -> { uid }  (reservation: a document can only exist once, so an ID is never reused)
export async function ensureUserProfile(fb: FirebaseUserLike): Promise<AuthUser> {
  const db = getFirestore();
  const userRef = doc(db, 'users', fb.uid);
  const email = fb.email ?? null;

  const quick = await getDoc(userRef);
  if (exists(quick)) return toAuthUser(fb.uid, quick.data(), email);

  const stored = await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    if (exists(snap)) return snap.data();

    for (let i = 0; i < MAX_TRIES; i++) {
      const candidate = randomSixDigit();
      const idRef = doc(db, 'userIds', candidate);
      const idSnap = await tx.get(idRef);
      if (exists(idSnap)) continue; // taken -> try another number

      // Must match the "create" rule in firestore.rules exactly
      const profile = {
        userId: candidate,
        name: fb.displayName ?? 'New User',
        photoURL: fb.photoURL ?? null,
        country: 'India',
        bio: '',
        level: 1,
        followers: 0,
        following: 0,
        vip: false,
        coins: 0, // placeholder; the real wallet will be server-side
        status: 'active',
        hostStatus: 'none',
        agencyId: null,
        agencyRole: 'none',
        createdAt: serverTimestamp(),
      };
      tx.set(idRef, { uid: fb.uid });
      tx.set(userRef, profile);
      return profile;
    }
    throw new Error('Could not create a unique User ID. Please try again.');
  });

  return toAuthUser(fb.uid, stored, email);
}

// Live updates of the user's own document (ban / suspend / profile edits show up instantly).
// Returns a function that stops listening.
export function watchUserProfile(fb: FirebaseUserLike, onChange: (u: AuthUser) => void): () => void {
  const ref = doc(getFirestore(), 'users', fb.uid);
  return onSnapshot(
    ref,
    (snap: any) => {
      if (exists(snap)) onChange(toAuthUser(fb.uid, snap.data(), fb.email ?? null));
    },
    (e: unknown) => console.warn('Profile listener error:', e),
  );
}
