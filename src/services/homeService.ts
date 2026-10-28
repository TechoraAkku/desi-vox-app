import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, limit, query, where } from '@react-native-firebase/firestore';
import { USE_MOCK_AUTH } from '../config/appConfig';
import { DEMO_BANNERS, DEMO_HOSTS, DEMO_ROOMS } from '../features/home/homeDemoData';
import type { HomeBanner, HomeHost, HomeRoom } from '../types/home';

// Demo APK or demo (phone/OTP) login: there is no Firebase user, so show built-in demo content
const useDemo = () => USE_MOCK_AUTH || !getAuth().currentUser;

export async function fetchBanners(): Promise<HomeBanner[]> {
  if (useDemo()) return DEMO_BANNERS;
  const snap = await getDocs(query(collection(getFirestore(), 'banners'), where('active', '==', true), limit(10)));
  return snap.docs
    .map((d: any) => {
      const x = d.data();
      return {
        id: d.id, eyebrow: x.eyebrow ?? '', title: x.title ?? '', subtitle: x.subtitle ?? '',
        buttonText: x.buttonText ?? '', theme: x.theme ?? 'purple', order: Number(x.order ?? 0),
      } as HomeBanner;
    })
    .sort((a, b) => a.order - b.order);
}

export async function fetchRooms(): Promise<HomeRoom[]> {
  if (useDemo()) return DEMO_ROOMS;
  const snap = await getDocs(query(collection(getFirestore(), 'rooms'), where('isLive', '==', true), limit(30)));
  return snap.docs.map((d: any) => {
    const x = d.data();
    return {
      id: d.id, title: x.title ?? 'Room', subtitle: x.subtitle ?? '', hostName: x.hostName ?? '',
      category: x.category ?? 'popular', listeners: Number(x.listeners ?? 0), theme: x.theme ?? 'violet',
      createdAtMs: x.createdAt?.toMillis?.() ?? 0,
    } as HomeRoom;
  });
}

// Approved hosts. (Real ranking by earnings comes later with the rankings feature.)
export async function fetchTopHosts(): Promise<HomeHost[]> {
  if (useDemo()) return DEMO_HOSTS;
  const snap = await getDocs(query(collection(getFirestore(), 'users'), where('hostStatus', '==', 'approved'), limit(10)));
  return snap.docs
    .map((d: any) => {
      const x = d.data();
      return { uid: d.id, name: x.name ?? 'Host', photoURL: x.photoURL ?? null, followers: Number(x.followers ?? 0) } as HomeHost;
    })
    .sort((a, b) => b.followers - a.followers);
}
