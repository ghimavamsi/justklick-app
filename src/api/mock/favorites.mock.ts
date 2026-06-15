import { Business } from '../../types/home.types';
import { useFavoriteStore } from '../../store/favorite-store';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const favoritesService = {
  getFavorites: async (): Promise<Business[]> => {
    await delay(800); // Simulate network delay for premium loading experience
    const state = useFavoriteStore.getState();
    
    // Convert the dictionary to an array and reverse it so newest is first
    return Object.values(state.favoriteBusinesses).reverse();
  },

  addFavorite: async (business: Business): Promise<boolean> => {
    await delay(300);
    useFavoriteStore.getState().addFavorite(business);
    return true;
  },

  removeFavorite: async (id: string): Promise<boolean> => {
    await delay(300);
    useFavoriteStore.getState().removeFavorite(id);
    return true;
  },

  searchFavorites: async (query: string): Promise<Business[]> => {
    await delay(500);
    const state = useFavoriteStore.getState();
    const allFavs = Object.values(state.favoriteBusinesses);
    
    if (!query) return allFavs;
    
    const lowerQuery = query.toLowerCase();
    return allFavs.filter(
      (b) =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(lowerQuery)))
    );
  },
};
