import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessesApi } from '../api/businesses';
import { Business } from '../types/home.types';

export const FAVORITES_QUERY_KEY = ['favorites'];

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await businessesApi.getSavedBusinesses();
        if (Array.isArray(response)) {
          // Helper to fix relative URLs and force HTTPS
          const getImageUrl = (url: string | null | undefined, fallback: string) => {
            if (!url) return fallback;
            if (url.startsWith('http:')) return url.replace('http:', 'https:');
            if (url.startsWith('https:')) return url;
            
            const relativePath = url.startsWith('/') ? url : `/${url}`;
            return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${relativePath}`;
          };

          return response.map((b: any) => {
            const businessData = b?.business || b;
            
            let firstImageUrl = null;
            if (Array.isArray(businessData?.images) && businessData.images.length > 0) {
              firstImageUrl = businessData.images[0].image || businessData.images[0].image_url;
            }
            
            return {
              id: String(businessData?.id),
              name: businessData?.company_name || businessData?.business_name || businessData?.name || 'Unknown',
              slug: businessData?.slug || String(businessData?.id),
              category: businessData?.category || 'General',
              rating: Number(businessData?.rating) || 0,
              reviewsCount: businessData?.reviews_count || 0,
              isVerified: businessData?.status === 'verified',
              coverImage: getImageUrl(firstImageUrl || businessData?.image || businessData?.cover_image, 'https://via.placeholder.com/400x300'),
              isPremium: false,
              isTrending: false,
              tags: Array.isArray(businessData?.services) ? businessData.services : [],
              isOpenNow: true,
              fullAddress: businessData?.location || businessData?.address || '',
              distanceStr: businessData?.distance ? `${Number(businessData.distance).toFixed(1)} km` : '',
              saved_id: b?.saved_id || b?.id // Ensure we have the saved_id to unsave later if backend requires
            };
          });
        }
        return [];
      } catch (err) {
        console.error('Failed to fetch real favorites', err);
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
        // If we have a specific saved_id from the backend, use it, otherwise use the business id
        const idToRemove = business.saved_id || Number(business.id);
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
