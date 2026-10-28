import { useCallback, useEffect, useState } from 'react';
import { fetchBanners, fetchRooms, fetchTopHosts } from '../../services/homeService';
import type { HomeBanner, HomeHost, HomeRoom } from '../../types/home';

export function useHomeData() {
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [rooms, setRooms] = useState<HomeRoom[]>([]);
  const [hosts, setHosts] = useState<HomeHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    // each section loads on its own, so one failure does not blank the whole screen
    const [b, r, h] = await Promise.allSettled([fetchBanners(), fetchRooms(), fetchTopHosts()]);
    if (b.status === 'fulfilled') setBanners(b.value);
    if (r.status === 'fulfilled') setRooms(r.value);
    if (h.status === 'fulfilled') setHosts(h.value);
    const failed = [b, r, h].filter((x) => x.status === 'rejected') as PromiseRejectedResult[];
    if (failed.length) {
      console.warn('Home data error:', failed[0].reason);
      setError('Could not load some content. Pull down to try again.');
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  return { banners, rooms, hosts, loading, refreshing, error, reload: () => load(true) };
}
