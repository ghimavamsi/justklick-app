import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/auth-store';
import { useAppStore } from '../store/app-store';

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { hasSeenOnboarding } = useAppStore();

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
      // Redirect unauthenticated users to login (or onboarding if they haven't seen it)
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(auth)/login');
      }
    } else if (isAuthenticated && (inAuthGroup || inOnboardingOrPermissions)) {
      // If the user is authenticated, they shouldn't see the auth or onboarding screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasSeenOnboarding, segments]);
}
