import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/auth-store';
import { useAppStore } from '../store/app-store';

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { hasSeenOnboarding, hasSeenPermissions } = useAppStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingOrPermissions = segments[0] === 'onboarding' || segments[0] === 'permissions';
    const isSplashScreen = !segments[0]; // index.tsx

    if (
      // If the user is not authenticated and they are NOT on a public screen
      !isAuthenticated &&
      !inAuthGroup &&
      !inOnboardingOrPermissions &&
      !isSplashScreen
    ) {
      // Flow 1: Must see onboarding first
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } 
      // Flow 2: Must complete permissions second
      else if (!hasSeenPermissions) {
        router.replace('/permissions/location');
      } 
      // Flow 3: Must login third
      else {
        router.replace('/(auth)/login');
      }
    } else if (isAuthenticated && (inAuthGroup || inOnboardingOrPermissions)) {
      // If the user is authenticated, they shouldn't see the auth, onboarding, or permission screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasSeenOnboarding, hasSeenPermissions, segments]);
}
