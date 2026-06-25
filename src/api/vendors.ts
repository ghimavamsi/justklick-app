import apiClient from './client';
import { CreateReviewSchema, MessageOut } from '../types/api.types';

export const vendorsApi = {
  // Submit a review for a business
  createReview: async (data: CreateReviewSchema): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/vendors/reviews', data);
    return response.data;
  },

  // Get reviews for a specific business
  getBusinessReviews: async (businessId: number): Promise<any> => {
    const response = await apiClient.get<any>(`/api/vendors/business/${businessId}/reviews`);
    return response.data;
  },

  // Get total reviews count for a business
  getReviewsCount: async (businessId: number): Promise<any> => {
    const response = await apiClient.get<any>(`/api/vendors/total/${businessId}/reviews/count`);
    return response.data;
  }
};
