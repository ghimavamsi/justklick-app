import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/home';
import { businessDetailsService } from '../api/mock/business.mock';
import { BusinessDetails } from '../types/business.types';

export const BUSINESS_DETAILS_KEY = 'businessDetails';
export const BUSINESS_REVIEWS_KEY = 'businessReviews';
export const SIMILAR_BUSINESSES_KEY = 'similarBusinesses';

export function useBusinessDetails(id: string) {
  return useQuery<BusinessDetails>({
    queryKey: [BUSINESS_DETAILS_KEY, id],
    queryFn: async () => {
      // Fetch live data
      const b: any = await homeApi.fetchBusinessDetails(id);
      
      const getImageUrl = (url: string | null | undefined, fallback: string) => {
        if (!url) return fallback;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${url}`;
        return url;
      };

      // Extract images array of strings
      const rawImages = Array.isArray(b?.images) ? b.images : [];
      const gallery = rawImages.length > 0 
        ? rawImages.map((imgObj: any) => getImageUrl(imgObj.image || imgObj.image_url, 'https://via.placeholder.com/800x600'))
        : ['https://via.placeholder.com/800x600'];

      // Map API schema to UI schema
      return {
        id: String(b?.id || id),
        name: b?.company_name || b?.business_name || b?.name || 'Unknown Business',
        category: b?.category || 'General',
        rating: Number(b?.rating) || 4.5,
        reviewsCount: b?.reviews_count || Math.floor(Math.random() * 500) + 10,
        isVerified: b?.status === 'verified' || !!b?.is_verified,
        coverImage: gallery[0],
        gallery: gallery,
        isPremium: !!b?.is_premium,
        isOpenNow: b?.is_open_now !== undefined ? !!b?.is_open_now : true,
        fullAddress: b?.location || b?.full_address || 'Location not specified',
        distanceStr: b?.distance || '2.5 km',
        description: b?.description || 'No description available.',
        about: b?.description || 'No description available.',
        establishedYear: b?.established_year || 2020,
        services: Array.isArray(b?.services) 
          ? b.services.map((s: any, i: number) => typeof s === 'string' 
              ? { id: String(i), name: s, iconName: 'checkmark-circle-outline' } 
              : s) 
          : [{ id: '1', name: 'Consultation', iconName: 'people-outline' }],
        amenities: Array.isArray(b?.amenities) 
          ? b.amenities.map((a: any, i: number) => typeof a === 'string' 
              ? { id: String(i), name: a, iconName: 'star-outline' } 
              : a) 
          : [{ id: '1', name: 'Parking', iconName: 'car-outline' }],
        location: {
          address: b?.location || b?.full_address || 'Location not specified',
          area: 'Downtown',
          city: 'City',
          state: 'State',
          pincode: '000000',
        },
        contact: {
          mobile: b?.phone || '+1 234 567 8900',
          email: b?.email || 'contact@business.com',
          website: b?.website || 'https://example.com'
        },
        ratingSummary: {
          '5': 60,
          '4': 25,
          '3': 10,
          '2': 3,
          '1': 2
        },
        hours: []
      } as BusinessDetails;
    },
    enabled: !!id,
  });
}

export function useBusinessReviews(id: string) {
  return useQuery({
    queryKey: [BUSINESS_REVIEWS_KEY, id],
    queryFn: () => businessDetailsService.getBusinessReviews(id),
    enabled: !!id,
  });
}

export function useSimilarBusinesses(id: string) {
  return useQuery({
    queryKey: [SIMILAR_BUSINESSES_KEY, id],
    queryFn: () => businessDetailsService.getSimilarBusinesses(id),
    enabled: !!id,
  });
}
