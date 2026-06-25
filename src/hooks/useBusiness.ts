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
      let gallery = rawImages.length > 0 
        ? rawImages.map((imgObj: any) => getImageUrl(imgObj.image || imgObj.image_url, 'https://via.placeholder.com/800x600'))
        : [];
      
      if (gallery.length === 0 && (b?.image || b?.cover_image)) {
        gallery = [getImageUrl(b?.image || b?.cover_image, 'https://via.placeholder.com/800x600')];
      }

      if (gallery.length === 0) {
        gallery = ['https://via.placeholder.com/800x600'];
      }

      // Parse dynamic field_values
      let parsedServices: any[] = [];
      let parsedAmenities: any[] = [];
      if (Array.isArray(b?.field_values)) {
        const servicesField = b.field_values.find((f: any) => f.field_key === 'services');
        if (servicesField && servicesField.value) {
          try {
            const arr = JSON.parse(servicesField.value);
            if (Array.isArray(arr)) {
              parsedServices = arr.map((s, i) => ({ id: String(i), name: s, iconName: 'checkmark-circle-outline' }));
            }
          } catch (e) {}
        }
        const amenitiesField = b.field_values.find((f: any) => f.field_key === 'amenities');
        if (amenitiesField && amenitiesField.value) {
          try {
            const arr = JSON.parse(amenitiesField.value);
            if (Array.isArray(arr)) {
              parsedAmenities = arr.map((s, i) => ({ id: String(i), name: s, iconName: 'star-outline' }));
            }
          } catch (e) {}
        }
      }
      
      // Map API schema to UI schema without dummy data
      return {
        id: String(b?.id || id),
        name: b?.company_name || b?.business_name || b?.name || 'Unknown Business',
        slug: b?.slug || id,
        category: b?.category || 'General',
        rating: Number(b?.rating) || 0,
        reviewsCount: b?.reviews_count || 0,
        isVerified: b?.status === 'verified' || !!b?.is_verified,
        coverImage: gallery[0],
        gallery: gallery,
        isPremium: !!b?.is_premium,
        isOpenNow: b?.is_open_now !== undefined ? !!b?.is_open_now : true,
        fullAddress: b?.location || b?.address || b?.full_address || '',
        distanceStr: b?.distance || '',
        description: b?.description || '',
        about: b?.description || '',
        establishedYear: b?.established_year || null,
        services: parsedServices,
        amenities: parsedAmenities,
        location: {
          address: b?.address || b?.location || b?.full_address || '',
          area: b?.location?.split(' ')?.[0] || '',
          city: b?.location?.split(' ')?.[1] || '',
          state: b?.location?.split(' ')?.[2] || '',
          pincode: '',
        },
        contact: {
          mobile: b?.phone || b?.whatsapp || '',
          email: b?.email || '',
          website: b?.website || ''
        },
        ratingSummary: {
          '5': 0,
          '4': 0,
          '3': 0,
          '2': 0,
          '1': 0
        },
        hours: []
      } as BusinessDetails;
    },
    enabled: !!id,
  });
}

import { vendorsApi } from '../api/vendors';

export function useBusinessReviews(id: string) {
  return useQuery({
    queryKey: [BUSINESS_REVIEWS_KEY, id],
    queryFn: async () => {
      try {
        const response = await vendorsApi.getBusinessReviews(Number(id));
        // Ensure we return an array. Assuming API returns an array or { results: [] }
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      } catch (err) {
        console.warn('Failed to fetch real reviews, returning empty', err);
        return [];
      }
    },
    enabled: !!id,
  });
}

export function useSimilarBusinesses(id: string) {
  return useQuery({
    queryKey: [SIMILAR_BUSINESSES_KEY, id],
    queryFn: async () => {
      // Return empty array for similar businesses until a real API is available
      return [];
    },
    enabled: !!id,
  });
}
