import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/auth-store';
import { useAppStore } from '../store/app-store';
import { useUserStore } from '../store/user-store';

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isProfileComplete } = useUserStore();
  const { hasSeenOnboarding, hasSeenPermissions } = useAppStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingOrPermissions = segments[0] === 'onboarding' || segments[0] === 'permissions';
    const isSplashScreen = !segments[0]; // index.tsx
    const isLegalScreen = segments[0] === 'privacy-policy' || segments[0] === 'terms-of-use';

    if (
      !isAuthenticated &&
      !isSplashScreen &&
      !isLegalScreen &&
      !(segments[0] === '(auth)' && segments[1] === 'login') &&
      !(segments[0] === '(auth)' && segments[1] === 'register') &&
      !(segments[0] === '(auth)' && segments[1] === 'verify-otp')
    ) {
      // Flow 1: Must see onboarding first
      if (!hasSeenOnboarding) {
        if (segments[0] !== 'onboarding') {
          router.replace('/onboarding');
        }
      } 
      // Flow 2: Must complete permissions second
      else if (!hasSeenPermissions) {
        // Prevent infinite loop if they are already anywhere inside the permissions flow
        if (segments[0] !== 'permissions') {
          router.replace('/permissions/location');
        }
      } 
      // Flow 3: Must login third
      else {
        router.replace('/(auth)/login');
      }
    } else if (isAuthenticated) {
      const isStudentOnboarding = segments[0] === '(auth)' && segments[1] === 'student-onboarding';
      
      if (!isProfileComplete && !isStudentOnboarding) {
        // Enforce onboarding if profile isn't complete
        router.replace('/(auth)/student-onboarding');
      } else if (isProfileComplete && (segments[0] === '(auth)' || segments[0] === 'onboarding' || segments[0] === 'permissions')) {
        // If the user is authenticated and profile is complete, they shouldn't see auth/onboarding/permission screens
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isProfileComplete, hasSeenOnboarding, hasSeenPermissions, segments]);
}
