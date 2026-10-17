import { Tabs } from 'expo-router';

// The bottom bar is drawn inside each screen with <BottomNav />,
// so the navigator's own tab bar is hidden.
export default function TabsLayout() {
  return (
    <Tabs tabBar={() => null} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="rooms" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
