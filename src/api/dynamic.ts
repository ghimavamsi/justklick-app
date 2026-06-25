import apiClient from './client';
import { 
  NearbyBusinessSchema, 
  PopularSearchSchema, 
  WhyChooseUssSchema, 
  AboutSchema, 
  ContactEnquirySchema, 
  TouristPlaceSchema,
  MessageOut
} from '../types/api.types';

export const dynamicApi = {
  // Get popular businesses near location
  getPopularNearYou: async (latitude: number, longitude: number, radius: number = 10.0, limit: number = 50, categoryId?: number): Promise<NearbyBusinessSchema[]> => {
    const params: any = { latitude, longitude, radius, limit };
    if (categoryId) params.category_id = categoryId;
    const response = await apiClient.get<NearbyBusinessSchema[]>('/api/dynamic/popular-near-you/', { params });
    return response.data;
  },

  // Get popular searches/categories
  getPopularSearches: async (limit: number = 10): Promise<PopularSearchSchema[]> => {
    const response = await apiClient.get<PopularSearchSchema[]>('/api/dynamic/popular-searches/', { params: { limit } });
    return response.data;
  },

  // Get Why Choose Us list
  getWhyChooseUs: async (): Promise<WhyChooseUssSchema[]> => {
    const response = await apiClient.get<WhyChooseUssSchema[]>('/api/dynamic/why-choose-us/');
    return response.data;
  },

  // Get FAQs
  getFaqs: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dynamic/faqs/');
    return response.data;
  },

  // Get About / Homepage static data
  getAbout: async (): Promise<AboutSchema> => {
    const response = await apiClient.get<AboutSchema>('/api/dynamic/about');
    return response.data;
  },

  // Get Contact Page
  getContactPage: async (): Promise<any> => {
    const response = await apiClient.get<any>('/api/dynamic/contact-page');
    return response.data;
  },

  // Submit Contact Enquiry
  submitContact: async (data: ContactEnquirySchema): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/dynamic/contact-submit', data);
    return response.data;
  },

  // Get User Contact Enquiries
  getContactEnquiries: async (): Promise<ContactEnquirySchema[]> => {
    const response = await apiClient.get<ContactEnquirySchema[]>('/api/dynamic/contact-enquiries');
    return response.data;
  },

  // Get Tourist Places
  getTouristPlaces: async (): Promise<TouristPlaceSchema[]> => {
    const response = await apiClient.get<TouristPlaceSchema[]>('/api/dynamic/tourist-places/');
    return response.data;
  }
};
