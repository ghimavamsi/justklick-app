import { useQuery } from '@tanstack/react-query';
import { businessDetailsService } from '../api/mock/business.mock';

export const BUSINESS_DETAILS_KEY = 'businessDetails';
export const BUSINESS_REVIEWS_KEY = 'businessReviews';
export const SIMILAR_BUSINESSES_KEY = 'similarBusinesses';

export function useBusinessDetails(id: string) {
  return useQuery({
    queryKey: [BUSINESS_DETAILS_KEY, id],
    queryFn: () => businessDetailsService.getBusinessDetails(id),
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
