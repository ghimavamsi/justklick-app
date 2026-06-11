import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface AppState {
  hasSeenOnboarding: boolean;
  locationPermissionStatus: 'undetermined' | 'granted' | 'denied';
  notificationPermissionStatus: 'undetermined' | 'granted' | 'denied';
  completeOnboarding: () => void;
  setLocationPermission: (status: 'undetermined' | 'granted' | 'denied') => void;
  setNotificationPermission: (status: 'undetermined' | 'granted' | 'denied') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      locationPermissionStatus: 'undetermined',
      notificationPermissionStatus: 'undetermined',
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      setLocationPermission: (status) => set({ locationPermissionStatus: status }),
      setNotificationPermission: (status) => set({ notificationPermissionStatus: status }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
