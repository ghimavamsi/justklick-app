import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '../api/mock/favorites.mock';
import { Business } from '../types/home.types';

export const FAVORITES_QUERY_KEY = ['favorites'];

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesService.getFavorites,
  });
}

export function useSearchFavorites(query: string) {
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, 'search', query],
    queryFn: () => favoritesService.searchFavorites(query),
    enabled: true,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ business, isCurrentlyFavorite }: { business: Business; isCurrentlyFavorite: boolean }) => {
      if (isCurrentlyFavorite) {
        return favoritesService.removeFavorite(business.id);
      } else {
        return favoritesService.addFavorite(business);
      }
    },
    onMutate: async ({ business, isCurrentlyFavorite }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData<Business[]>(FAVORITES_QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData<Business[]>(FAVORITES_QUERY_KEY, (old) => {
        if (!old) return isCurrentlyFavorite ? [] : [business];
        if (isCurrentlyFavorite) {
          return old.filter((f) => f.id !== business.id);
        } else {
          return [business, ...old];
        }
      });

      // Return a context with the previous favorites to roll back if needed
      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      // Sync with server in background
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
