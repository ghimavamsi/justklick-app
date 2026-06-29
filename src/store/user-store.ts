import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface UserState {
  profile: UserProfile | null;
  isProfileComplete: boolean;
  setProfile: (profile: UserProfile) => void;
  setProfileComplete: (isComplete: boolean) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isProfileComplete: false,
      setProfile: (profile) => set({ profile }),
      setProfileComplete: (isComplete) => set({ isProfileComplete: isComplete }),
      clearProfile: () => set({ profile: null, isProfileComplete: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
