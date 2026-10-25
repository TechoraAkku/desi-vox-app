import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { startSessionListener } from '../services/session';
import colors from '../theme/colors';

export default function RootLayout() {
  useEffect(() => startSessionListener(), []);

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
      </Stack>
    </>
  );
}
