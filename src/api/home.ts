import apiClient from './client';
import { ApiCategory, ApiAdvertisement, ApiBusiness } from '../types/api.types';

export const homeApi = {
  // Advertisements / Banners
  fetchAdvertisements: async (): Promise<ApiAdvertisement[]> => {
    const response = await apiClient.get<ApiAdvertisement[]>('/api/advertisements/');
    return response.data;
  },

  // Categories
  fetchCategories: async (): Promise<ApiCategory[]> => {
    const response = await apiClient.get<ApiCategory[]>('/api/categories/');
    return response.data;
  },

  // Business Listing
  fetchBusinesses: async (lat?: number, lng?: number, query?: string, category?: string): Promise<ApiBusiness[]> => {
    const params: any = {};
    if (lat !== undefined && lng !== undefined) {
      params.lat = lat;
      params.lng = lng;
    }
    if (query) {
      params.search = query; // Or params.q = query, based on DRF conventions (usually 'search')
    }
    if (category) {
      params.category = category;
    }
    const response = await apiClient.get<ApiBusiness[]>('/api/businesses/', { params });
    return response.data;
  },

  // Business Details
  fetchBusinessDetails: async (slug: string): Promise<ApiBusiness> => {
    const response = await apiClient.get<ApiBusiness>(`/api/businesses/${slug}/`);
    return response.data;
  },

  // Location Search
  searchByLocation: async (query: string): Promise<{name: string, lat: number, lng: number}[]> => {
    const response = await apiClient.get<{name: string, lat: number, lng: number}[]>('/api/locations/search/', {
      params: { q: query }
    });
    return response.data;
  }
};
