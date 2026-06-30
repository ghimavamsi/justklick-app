import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessesApi } from '../api/businesses';
import { homeApi } from '../api/home';
import { Business } from '../types/home.types';
import { useAuthStore } from '../store/auth-store';

export const FAVORITES_QUERY_KEY = ['favorites'];

export function useFavorites() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const response = await businessesApi.getSavedBusinesses();
        if (!Array.isArray(response) || response.length === 0) return [];

        const BASE_URL = 'https://api.justklick.co.in';

        const getImageUrl = (url: string | null | undefined, fallback: string) => {
          if (!url) return fallback;
          let fixed = url;
          if (fixed.startsWith('http:')) fixed = fixed.replace('http:', 'https:');
          if (fixed.startsWith('https://') || fixed.startsWith('http://')) return fixed;
          const relativePath = fixed.startsWith('/') ? fixed : `/${fixed}`;
          return `${BASE_URL}${relativePath}`;
        };

        const results = await Promise.all(
          response.map(async (fav: any) => {
            const slug = fav?.slug || fav?.business?.slug;
            const savedId = fav?.id || fav?.saved_id;
            const businessId = fav?.business_id;

            let detail: any = null;
            if (slug) {
              try {
                detail = await homeApi.fetchBusinessDetails(slug);
              } catch (e) {
                console.warn('[FAVORITES] Failed to fetch details for slug:', slug, e);
              }
            }

            const b = detail || fav?.business || fav;

            let firstImageUrl: string | null = null;
            if (Array.isArray(b?.images) && b.images.length > 0) {
              const img = b.images[0];
              firstImageUrl = typeof img === 'string' ? img : (img?.image || img?.image_url || img?.url || img?.src || null);
            }

            const coverImage = getImageUrl(
              firstImageUrl || b?.image || b?.cover_image || b?.logo || b?.thumbnail || b?.profile_image || b?.photo,
              'https://via.placeholder.com/400x300'
            );

            return {
              id: String(businessId || b?.id),
              name: b?.company_name || b?.business_name || b?.name || fav?.company_name || 'Unknown',
              slug: slug || String(b?.id),
              category: typeof b?.category === 'object' ? b?.category?.name : (b?.category || 'General'),
              rating: Number(b?.rating) || 0,
              reviewsCount: b?.reviews_count || b?.review_count || 0,
              isVerified: b?.status === 'verified' || b?.is_verified === true,
              coverImage,
              isPremium: b?.is_premium || false,
              isTrending: b?.is_trending || false,
              tags: Array.isArray(b?.services) ? b.services.map((s: any) => typeof s === 'string' ? s : s?.name || '') : [],
              isOpenNow: b?.is_open_now ?? true,
              fullAddress: b?.location || b?.address || b?.full_address || fav?.location || '',
              distanceStr: b?.distance ? `${Number(b.distance).toFixed(1)} km` : '',
              saved_id: savedId
            };
          })
        );

        return results;
      } catch (err) {
        console.error('Failed to fetch favorites', err);
        return [];
      }
    },
  });
}

export function useSearchFavorites(query: string) {
  const { data: favorites } = useFavorites();
  
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEY, 'search', query],
    queryFn: async () => {
      if (!favorites) return [];
      if (!query) return favorites;
      
      const lowerQuery = query.toLowerCase();
      return favorites.filter((b) => 
        b.name.toLowerCase().includes(lowerQuery) || 
        b.category.toLowerCase().includes(lowerQuery)
      );
    },
    enabled: !!favorites, // Only run this when we have favorites loaded
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ business, isCurrentlyFavorite }: { business: Business & { saved_id?: number }; isCurrentlyFavorite: boolean }) => {
      if (isCurrentlyFavorite) {
        // If we have a specific saved_id from the backend, use it
        let idToRemove = business.saved_id;
        
        // If not found (e.g. clicked from Home Screen), look it up in the favorites cache
        if (!idToRemove) {
          const favorites = queryClient.getQueryData<any[]>(FAVORITES_QUERY_KEY) || [];
          const matched = favorites.find(f => String(f.id) === String(business.id));
          
          if (matched && matched.saved_id) {
            idToRemove = matched.saved_id;
          } else {
            // If cache is empty or we just favorited it and don't have the saved_id yet, fetch from API
            try {
              console.log('Fetching fresh favorites to find saved_id...');
              const rawFavs = await businessesApi.getSavedBusinesses();
              const apiMatched = rawFavs.find((f: any) => String(f.business_id) === String(business.id));
              if (apiMatched && (apiMatched.id || apiMatched.saved_id)) {
                idToRemove = apiMatched.id || apiMatched.saved_id;
              }
            } catch (e) {
              console.warn('Failed to fetch fresh favorites list for unsave', e);
            }
          }
        }

        // Fallback to business id if everything fails, though it might throw a 404
        if (!idToRemove) {
          idToRemove = Number(business.id);
        }

        return businessesApi.unsaveBusiness(idToRemove);
      } else {
        return businessesApi.saveBusiness(Number(business.id));
      }
    },
    onMutate: async ({ business, isCurrentlyFavorite }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData<Business[]>(FAVORITES_QUERY_KEY);

      queryClient.setQueryData<Business[]>(FAVORITES_QUERY_KEY, (old) => {
        if (!old) return isCurrentlyFavorite ? [] : [business];
        if (isCurrentlyFavorite) {
          return old.filter((f) => f.id !== business.id);
        } else {
          return [business, ...old];
        }
      });

      return { previousFavorites };
    },
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
