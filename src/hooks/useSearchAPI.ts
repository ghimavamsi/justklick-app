import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/home';
import { Business } from '../types/home.types';
import { useLocationStore } from '../store/location-store';

export const SEARCH_BUSINESSES_KEY = (query: string, category: string | null) => ['searchBusinesses', query, category];

export function useSearchAPI(query: string, category: string | null) {
  const { currentLocation, manualLocation } = useLocationStore();
  const activeLocation = manualLocation || currentLocation;

  return useQuery<Business[]>({
    queryKey: [...SEARCH_BUSINESSES_KEY(query, category), activeLocation?.latitude, activeLocation?.longitude],
    queryFn: async () => {
      // 1. Fetch businesses with location, query, and category filters
      const businessData = await homeApi.fetchBusinesses(
        activeLocation?.latitude,
        activeLocation?.longitude,
        query,
        category || undefined
      );

      // Helper to fix relative URLs and force HTTPS
      const getImageUrl = (url: string | null | undefined, fallback: string) => {
        if (!url) return fallback;
        if (url.startsWith('http:')) return url.replace('http:', 'https:');
        if (url.startsWith('https:')) return url;
        
        const relativePath = url.startsWith('/') ? url : `/${url}`;
        return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${relativePath}`;
      };

      // 2. Map API schema to Business UI schema
      const businesses: Business[] = (businessData || []).map((b: any, index: number) => {
        let firstImageUrl = null;
        if (Array.isArray(b?.images) && b.images.length > 0) {
          firstImageUrl = b.images[0].image || b.images[0].image_url;
        }

        return {
          id: String(b?.id || index),
          name: b?.company_name || b?.business_name || b?.name || `Business ${index + 1}`,
          slug: b?.slug || String(b?.id || index),
          category: b?.category || 'General',
          rating: Number(b?.rating) || 0, // Using real data
          reviewsCount: b?.reviews_count || 0, // Using real data
          isVerified: b?.status === 'verified' || !!b?.is_verified,
          coverImage: getImageUrl(firstImageUrl || b?.cover_image || b?.image || b?.image_url, 'https://via.placeholder.com/400x300'),
          isPremium: !!b?.is_premium,
          isTrending: !!b?.is_trending,
          isOpenNow: b?.is_open_now !== undefined ? !!b?.is_open_now : true,
          distanceStr: b?.distance || '',
          location: b?.location || b?.address || b?.full_address || '',
          tags: Array.isArray(b?.services) ? b.services : [], // Map services to tags for UI
        };
      });

      return businesses;
    },
    // Don't execute if we don't have query or category
    enabled: (!!query || !!category) && !!activeLocation,
  });
}
