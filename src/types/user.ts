export type AuthUser = {
  uid: string; // Firebase uid
  userId: string; // unique 6-digit public ID
  name: string;
  email: string | null;
  photoURL: string | null;
  country: string;
  bio: string;
  level: number;
  followers: number;
  following: number;
  coins: number;
  vip: boolean;
};