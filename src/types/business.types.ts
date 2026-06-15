import { Business } from './home.types';

export interface Service {
  id: string;
  name: string;
  iconName: string; // Ionicons
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

export interface ContactInfo {
  mobile: string;
  alternateNumber?: string;
  email?: string;
  website?: string;
}

export interface LocationInfo {
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface RatingSummary {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
}

export interface BusinessDetails extends Business {
  description: string;
  about: string;
  establishedYear: number;
  services: Service[];
  amenities: Amenity[];
  contact: ContactInfo;
  location: LocationInfo;
  hours: BusinessHours[];
  faqs?: FAQ[];
  ratingSummary: RatingSummary;
  gallery: string[];
}

export interface Review {
  id: string;
  businessId: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  text: string;
  date: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  businessResponse?: string;
}
