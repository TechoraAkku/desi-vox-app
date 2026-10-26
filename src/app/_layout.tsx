import { Stack, router, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { startSessionListener } from '../services/session';
import { useAuthStore } from '../store/authStore';
import colors from '../theme/colors';

export default function RootLayout() {
  useEffect(() => startSessionListener(), []);

  // Banned or suspended accounts are sent to the blocked screen (and back when unbanned)
  const status = useAuthStore((s) => s.user?.status);
  const navReady = !!useRootNavigationState()?.key;
  const onBlocked = (useSegments() as string[])[0] === 'blocked';

  useEffect(() => {
    if (!navReady) return;
    if (status && status !== 'active' && !onBlocked) router.replace('/blocked' as any);
    else if (status === 'active' && onBlocked) router.replace('/home' as any);
  }, [status, onBlocked, navReady]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="blocked" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
