import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  updateTokens: (access: string, refresh?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (access: string, refresh: string) => set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),
      logout: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
      updateTokens: (access: string, refresh?: string) => set((state) => ({ 
        accessToken: access, 
        refreshToken: refresh || state.refreshToken 
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
