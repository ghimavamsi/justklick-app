import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

export type SearchPhase = 'idle' | 'typing' | 'results';

interface SearchState {
  query: string;
  phase: SearchPhase;
  isFocused: boolean;
  activeSubcategory: string | null;
  recentSearches: string[];
  activeFilters: Record<string, string | boolean | string[]>;
  
  setQuery: (query: string) => void;
  setPhase: (phase: SearchPhase) => void;
  setIsFocused: (isFocused: boolean) => void;
  setActiveSubcategory: (subcat: string | null) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setFilter: (key: string, value: string | boolean | string[]) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: '',
      phase: 'idle',
      isFocused: false,
      activeSubcategory: null,
      recentSearches: [],
      activeFilters: {},
      
      setQuery: (query) => set((state) => {
        // Automatically determine phase based on query if not explicitly searching
        const newPhase = query.length > 0 ? 'typing' : 'idle';
        return { 
          query, 
          phase: state.phase === 'results' ? 'results' : newPhase,
          activeSubcategory: null, // reset subcategory on new query
        };
      }),
      setPhase: (phase) => set({ phase }),
      setIsFocused: (isFocused) => set({ isFocused }),
      setActiveSubcategory: (activeSubcategory) => set({ activeSubcategory }),
      
      addRecentSearch: (query) =>
        set((state) => {
          if (!query.trim()) return state;
          const filteredSearches = state.recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
          return {
            recentSearches: [query, ...filteredSearches].slice(0, 10), // Keep top 10
          };
        }),
      removeRecentSearch: (query) => 
        set((state) => ({
          recentSearches: state.recentSearches.filter(s => s !== query)
        })),
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
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        activeFilters: state.activeFilters,
      }), // Only persist searches and filters, NOT the active query or focus state
    }
  )
);
