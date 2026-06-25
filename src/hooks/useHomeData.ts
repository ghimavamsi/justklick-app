import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/home';
import { HomeData, Category, Banner, Business } from '../types/home.types';
import { useLocationStore } from '../store/location-store';

import { dynamicApi } from '../api/dynamic';

export const HOME_QUERY_KEY = ['homeData'];

export function useHomeData() {
  const { currentLocation, manualLocation } = useLocationStore();
  const activeLocation = manualLocation || currentLocation;

  return useQuery<HomeData, Error>({
    queryKey: [...HOME_QUERY_KEY, activeLocation?.latitude, activeLocation?.longitude],
    queryFn: async () => {
      // Fetch all required data concurrently
      const results = await Promise.allSettled([
        homeApi.fetchAdvertisements(),
        homeApi.fetchCategories(),
        homeApi.fetchBusinesses(activeLocation?.latitude, activeLocation?.longitude),
        dynamicApi.getPopularSearches(10), // For trending categories
        activeLocation?.latitude && activeLocation?.longitude 
          ? dynamicApi.getPopularNearYou(activeLocation.latitude, activeLocation.longitude, 50, 20)
          : Promise.resolve([]) // Fallback if no location
      ]);

      const apiBanners = results[0].status === 'fulfilled' ? results[0].value : [];
      const apiCategories = results[1].status === 'fulfilled' ? results[1].value : [];
      const apiBusinesses = results[2].status === 'fulfilled' ? results[2].value : [];
      const apiPopularSearches = results[3].status === 'fulfilled' ? results[3].value : [];
      const apiPopularNearYou = results[4].status === 'fulfilled' ? results[4].value : [];

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
        if (url.startsWith('http:')) return url.replace('http:', 'https:');
        if (url.startsWith('https:')) return url;
        
        // It's a relative path. Ensure it has a leading slash
        const relativePath = url.startsWith('/') ? url : `/${url}`;
        return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${relativePath}`;
      };

      // Map Advertisements to Banners
      const fetchedBanners: Banner[] = extractArray(apiBanners).map((b: any, index: number) => ({
        id: String(b?.id || index),
        title: b?.title || `Promo ${index + 1}`,
        subtitle: 'Check out this offer!',
        imageUrl: getImageUrl(b?.image_url || b?.image, 'https://via.placeholder.com/800x400'),
        actionUrl: b?.action_url || b?.link || b?.url || '',
      }));

      const staticBanners: Banner[] = [
        {
          id: 'mock1',
          title: 'Special Discount on Local Salons',
          subtitle: 'Up to 50% Off',
          imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
          actionUrl: '/categories/salons',
        },
        {
          id: 'mock2',
          title: 'Top Rated Restaurants',
          subtitle: 'Explore the best dining spots',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
          actionUrl: '/categories/restaurants',
        },
        {
          id: 'mock3',
          title: 'Premium Car Services',
          subtitle: 'Get 20% off on first service',
          imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop',
          actionUrl: '/categories/car-services',
        }
      ];

      const banners = fetchedBanners.length > 0 ? fetchedBanners : staticBanners;

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
          slug: b?.slug || String(b?.id || index),
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

      // Map Popular Searches to Trending Categories
      const trendingCategories: Category[] = extractArray(apiPopularSearches).map((ps: any, index: number) => ({
        id: String(ps?.category_slug || ps?.id || index),
        name: ps?.category_name || `Trending ${index + 1}`,
        iconName: getImageUrl(ps?.category_image, 'flame-outline'),
        iconLibrary: 'Ionicons',
        color: '#c10007',
        bgColor: 'rgba(193, 0, 7, 0.1)',
      }));

      // Map Popular Near You to Nearby Businesses
      const nearby: Business[] = extractArray(apiPopularNearYou).map((b: any, index: number) => {
        let firstImageUrl = null;
        if (Array.isArray(b?.images) && b.images.length > 0) {
          firstImageUrl = b.images[0].image || b.images[0].image_url;
        }

        return {
          id: String(b?.id || index),
          name: b?.company_name || b?.business_name || b?.name || `Business ${index + 1}`,
          slug: b?.slug || String(b?.id || index),
          category: b?.category || 'General',
          rating: Number(b?.rating) || 4.5, // The API doesn't seem to return a rating, defaulting
          reviewsCount: Math.floor(Math.random() * 500) + 10,
          isVerified: b?.status === 'verified',
          coverImage: getImageUrl(firstImageUrl || b?.cover_image || b?.image_url, 'https://via.placeholder.com/400x300'),
          isPremium: false,
          isTrending: false,
          tags: [],
          isOpenNow: true,
          fullAddress: b?.location || b?.address || 'Location not specified',
          distanceStr: b?.distance ? `${Number(b.distance).toFixed(1)} km` : 'Near you',
        };
      });

      // Construct the aggregated HomeData expected by the UI
      return {
        categories: categories,
        trendingCategories: trendingCategories.length > 0 ? trendingCategories : categories.slice(0, 4),
        banners: banners,
        featuredBusinesses: businesses.filter(b => b.isVerified).slice(0, 5),
        premiumBusinesses: businesses.filter(b => b.isPremium).slice(0, 5),
        nearbyBusinesses: nearby.length > 0 ? nearby : businesses.slice(0, 5),
        recommendedBusinesses: businesses.slice(0, 5),
      };
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });
}
