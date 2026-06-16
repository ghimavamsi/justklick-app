import 'react-native-gesture-handler';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, usePathname } from 'expo-router';
// Removed duplicate nativewind import
import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen } from 'expo-router';
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
    <View 
      className={colorScheme === 'dark' ? 'dark flex-1' : 'flex-1'} 
      style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#09090b' : '#FFFFFF' }}
    >
      {children}
    </View>
  );
}

import { useProtectedRoute } from '../hooks/useProtectedRoute';

export default function RootLayout() {
  const osColorScheme = useReactNavigationColorScheme();
  
  // Initialize the global route guard
  useProtectedRoute();

  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const pathname = usePathname();

  useEffect(() => {
    if (loaded || error) {
      // Fallback: If index.tsx doesn't mount (e.g. deep link), hide the splash screen after 3 seconds to prevent freezing.
      // Otherwise, index.tsx will immediately hide it exactly when the React Native screen paints.
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    // Return a solid white background WITH the logo instead of null while fonts load.
    // This flawlessly mimics the native splash screen, completely hiding the 4-second Android 12 black screen glitch.
    return (
      <View style={{ flex: 1, backgroundColor: osColorScheme === 'dark' ? '#09090b' : '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={{ width: 200, height: 200 }} 
          resizeMode="contain" 
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: osColorScheme === 'dark' ? '#09090b' : '#FFFFFF' }}>
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
