import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { Business } from '../types/home.types';

interface FavoriteState {
  favoriteIds: string[];
  favoriteBusinesses: Record<string, Business>;
  addFavorite: (business: Business) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (business: Business) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      favoriteBusinesses: {},
      
      addFavorite: (business) => set((state) => {
        if (state.favoriteIds.includes(business.id)) return state;
        return {
          favoriteIds: [...state.favoriteIds, business.id],
          favoriteBusinesses: { ...state.favoriteBusinesses, [business.id]: business },
        };
      }),

      removeFavorite: (id) => set((state) => {
        const newIds = state.favoriteIds.filter((favId) => favId !== id);
        const newBusinesses = { ...state.favoriteBusinesses };
        delete newBusinesses[id];
        return {
          favoriteIds: newIds,
          favoriteBusinesses: newBusinesses,
        };
      }),

      toggleFavorite: (business) => {
        const state = get();
        if (state.favoriteIds.includes(business.id)) {
          state.removeFavorite(business.id);
        } else {
          state.addFavorite(business);
        }
      },

      isFavorite: (id) => get().favoriteIds.includes(id),

      clearFavorites: () => set({ favoriteIds: [], favoriteBusinesses: {} }),
    }),
    {
      name: 'favorite-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
