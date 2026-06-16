import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/home';
import { HomeData, Category, Banner, Business } from '../types/home.types';
import { useLocationStore } from '../store/location-store';

export const HOME_QUERY_KEY = ['homeData'];

export function useHomeData() {
  const { currentLocation, manualLocation } = useLocationStore();
  const activeLocation = manualLocation || currentLocation;

  return useQuery<HomeData, Error>({
    queryKey: [...HOME_QUERY_KEY, activeLocation?.latitude, activeLocation?.longitude],
    queryFn: async () => {
      // Fetch all required data concurrently
      const [apiBanners, apiCategories, apiBusinesses] = await Promise.all([
        homeApi.fetchAdvertisements(),
        homeApi.fetchCategories(),
        homeApi.fetchBusinesses(activeLocation?.latitude, activeLocation?.longitude)
      ]);

      // Helper to handle both flat arrays and paginated responses { results: [...] }
      const extractArray = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.results)) return data.results;
        return [];
      };

      // Helper to fix relative URLs and force HTTPS
      const getImageUrl = (url: string | null | undefined, fallback: string) => {
        if (!url) return fallback;
        if (url.startsWith('/')) return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${url}`;
        if (url.startsWith('http:')) return url.replace('http:', 'https:');
        return url;
      };

      // Map Advertisements to Banners
      const banners: Banner[] = extractArray(apiBanners).map((b: any, index: number) => ({
        id: String(b?.id || index),
        title: b?.title || `Promo ${index + 1}`,
        subtitle: 'Check out this offer!',
        imageUrl: getImageUrl(b?.image_url || b?.image, 'https://via.placeholder.com/800x400'),
        actionUrl: b?.action_url || b?.link || b?.url || '',
      }));

      // Map Categories
      const categories: Category[] = extractArray(apiCategories).map((c: any, index: number) => ({
        id: String(c?.id || c?.slug || index),
        name: c?.name || c?.category_name || `Category ${index + 1}`,
        iconName: getImageUrl(c?.image || c?.icon, 'grid-outline'), 
        iconLibrary: 'Ionicons',
        color: '#1C398E',
        bgColor: 'rgba(28, 57, 142, 0.1)',
      }));

      // Map Businesses
      const businesses: Business[] = extractArray(apiBusinesses).map((b: any, index: number) => {
        // Extract the first image from the images array if available
        let firstImageUrl = null;
        if (Array.isArray(b?.images) && b.images.length > 0) {
          firstImageUrl = b.images[0].image || b.images[0].image_url;
        }

        return {
          id: String(b?.id || index),
          name: b?.company_name || b?.business_name || b?.name || `Business ${index + 1}`,
          category: b?.category || 'General',
          rating: Number(b?.rating) || 4.5,
          reviewsCount: b?.reviews_count || Math.floor(Math.random() * 500) + 10,
          isVerified: b?.status === 'verified' || !!b?.is_verified,
          coverImage: getImageUrl(firstImageUrl || b?.cover_image || b?.image_url, 'https://via.placeholder.com/400x300'),
          isPremium: !!b?.is_premium,
          isTrending: !!b?.is_trending,
          tags: Array.isArray(b?.tags) ? b.tags : [],
          isOpenNow: b?.is_open_now !== undefined ? !!b.is_open_now : true,
          fullAddress: b?.location || b?.full_address || 'Location not specified',
          distanceStr: b?.distance || '2.5 km',
        };
      });

      // Construct the aggregated HomeData expected by the UI
      return {
        categories: categories,
        trendingCategories: categories.slice(0, 4), // Fallback: use first 4 categories
        banners: banners,
        featuredBusinesses: businesses.filter(b => b.isVerified).slice(0, 5),
        premiumBusinesses: businesses.filter(b => b.isPremium).slice(0, 5),
        nearbyBusinesses: businesses.slice(0, 5),
        recommendedBusinesses: businesses.slice(0, 5),
      };
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });
}
