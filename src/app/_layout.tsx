import 'react-native-gesture-handler';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
// Removed duplicate nativewind import
import { useEffect } from 'react';
import { View } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';
import { AppProviders } from '../api/providers';

import { useColorScheme as useReactNavigationColorScheme } from 'react-native';
import { useColorScheme } from 'nativewind';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent auto hide until fonts are loaded
SplashScreen.preventAutoHideAsync();

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  return (
    <View className={colorScheme === 'dark' ? 'dark flex-1' : 'flex-1'} style={{ flex: 1 }}>
      {children}
    </View>
  );
}

export default function RootLayout() {
  const osColorScheme = useReactNavigationColorScheme();

  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <ThemeProvider value={osColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <ThemeWrapper>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="business" options={{ headerShown: false }} />
            </Stack>
          </ThemeWrapper>
        </ThemeProvider>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
