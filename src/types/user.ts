export type AccountStatus = 'active' | 'suspended' | 'banned';
export type HostStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'suspended';
export type AgencyRole = 'none' | 'owner';

export type AuthUser = {
  uid: string; // Firebase uid
  userId: string; // unique 6-digit public ID
  name: string;
  email: string | null; // comes from Firebase Auth, not stored in the public user document
  photoURL: string | null;
  country: string;
  bio: string;
  level: number;
  followers: number;
  following: number;
  coins: number;
  vip: boolean;
  // set only by admins / server, never by the app
  status: AccountStatus;
  hostStatus: HostStatus;
  agencyId: string | null;
  agencyRole: AgencyRole;
};
