import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface SearchState {
  recentSearches: string[];
  activeFilters: Record<string, string | boolean | string[]>;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setFilter: (key: string, value: string | boolean | string[]) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],
      activeFilters: {},
      addRecentSearch: (query) =>
        set((state) => {
          const filteredSearches = state.recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
          return {
            recentSearches: [query, ...filteredSearches].slice(0, 10), // Keep top 10
          };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setFilter: (key, value) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, [key]: value },
        })),
      clearFilters: () => set({ activeFilters: {} }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
