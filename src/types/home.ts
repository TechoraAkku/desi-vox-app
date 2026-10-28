export type BannerTheme = 'purple' | 'gold' | 'blue' | 'pink';
export type RoomTheme = 'violet' | 'plum' | 'indigo' | 'wine';

export type HomeBanner = {
  id: string; eyebrow: string; title: string; subtitle: string; buttonText: string; theme: BannerTheme; order: number;
};
export type HomeRoom = {
  id: string; title: string; subtitle: string; hostName: string; category: string; listeners: number;
  theme: RoomTheme; createdAtMs: number;
};
export type HomeHost = { uid: string; name: string; photoURL: string | null; followers: number };
