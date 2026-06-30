import 'react-native-gesture-handler';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
// Removed duplicate nativewind import
import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans';
import { SplashScreen } from 'expo-router';
import { ToastProvider } from '../components/ui/ToastProvider';
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
import { useLocationStore } from '../store/location-store';
import { usePushNotifications } from '../hooks/usePushNotifications';

function RouteGuard() {
  useProtectedRoute();
  return null;
}

function PushNotificationGuard() {
  usePushNotifications();
  return null;
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
      // Fallback: If index.tsx doesn't mount (e.g. deep link), hide the splash screen after 3 seconds to prevent freezing.
      // Otherwise, index.tsx will immediately hide it exactly when the React Native screen paints.
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loaded, error]);

  // Check location permission on app start and fetch GPS if already granted
  useEffect(() => {
    useLocationStore.getState().checkPermission();
  }, []);

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
        <ToastProvider>
          <RouteGuard />
          <PushNotificationGuard />
          <ThemeProvider value={osColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ThemeWrapper>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
            </ThemeWrapper>
          </ThemeProvider>
        </ToastProvider>
      </AppProviders>
    </GestureHandlerRootView>
  );
}
