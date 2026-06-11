import { Stack } from 'expo-router';
// Removed duplicate nativewind import
import { useEffect } from 'react';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';
import { AppProviders } from '../api/providers';

import { useTheme } from '../hooks/useTheme';

// Prevent auto hide until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useTheme();

  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff' } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="business" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
