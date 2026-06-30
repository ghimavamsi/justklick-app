import apiClient from './client';
import { MessageOut } from '../types/api.types';

export const businessesApi = {
  // Add a business to favourites
  saveBusiness: async (businessId: number): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/businesses/favourites/', null, {
      params: { business_id: businessId }
    });
    return response.data;
  },

  // Get all saved businesses (favourites)
  getSavedBusinesses: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/api/businesses/favourites/');
    return response.data;
  },

  unsaveBusiness: async (savedId: number): Promise<MessageOut> => {
    const response = await apiClient.delete<MessageOut>(`/api/businesses/favourites/${savedId}/`);
    return response.data;
  },

  // Get dynamic filters for a specific category slug
  getCategoryFilters: async (slug: string): Promise<any> => {
    const response = await apiClient.get<any>(`/api/businesses/categories/${slug}/filters/`);
    return response.data;
  }
};
