export interface ApiCategory {
  id?: number | string;
  name?: string;
  category_name?: string;
  slug?: string;
  icon?: string;
  image?: string;
  description?: string;
}

export interface ApiAdvertisement {
  id?: number | string;
  title?: string;
  image?: string;
  image_url?: string;
  link?: string;
  url?: string;
  action_url?: string;
}

export interface ApiBusiness {
  id?: number | string;
  name?: string;
  business_name?: string;
  slug?: string;
  category?: string | any;
  rating?: number | string;
  reviews_count?: number;
  is_verified?: boolean;
  cover_image?: string;
  image_url?: string;
  is_premium?: boolean;
  is_trending?: boolean;
  tags?: string[];
  is_open_now?: boolean;
  location?: string;
  full_address?: string;
  distance?: string;
}

// --- NEW BACKEND SCHEMAS ---

export interface MessageOut {
  success: boolean;
  message: string;
}

export interface BusinessListingSchema {
  id: number;
  company_name: string;
  slug: string;
  category?: string | null;
  location: string;
  phone: string;
  address?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface PopularSearchSchema {
  id: number;
  category_name: string;
  category_slug: string;
  category_image?: string | null;
  search_count: number;
  listings_count: number;
  display_order: number;
  is_featured: boolean;
  top_listings: BusinessListingSchema[];
}

export interface WhyChooseUssSchema {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutSchema {
  id: number;
  section_tag: string;
  main_title: string;
  main_description: string;
  button_text: string;
  button_link: string;
  about_image?: string | null;
  top_badge_text: string;
  trust_card_title: string;
  trust_card_subtitle: string;
  visitors_icon: string;
  visitors_count: string;
  visitors_label: string;
  students_icon: string;
  students_count: string;
  students_label: string;
  businesses_icon: string;
  businesses_count: string;
  businesses_label: string;
  feature_one_icon: string;
  feature_one_title: string;
  feature_two_icon: string;
  feature_two_title: string;
  feature_three_icon: string;
  feature_three_title: string;
  is_active: boolean;
}

export interface TouristPlaceSchema {
  id: number;
  title: string;
  location: string;
  description: string;
  rating: number;
  image?: string | null;
}

export interface ContactEnquirySchema {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CreateReviewSchema {
  business_id: number;
  rating: number;
  review: string;
}

export interface DeviceTokenSchema {
  token: string;
  type?: string;
}

export interface SendNotificationSchema {
  user_id: number;
  title: string;
  message: string;
  data?: any;
}

export interface NearbyBusinessImageSchema {
  id: number;
  image?: string | null;
}

export interface NearbyBusinessSchema {
  id: number;
  company_name: string;
  slug: string;
  category?: string | null;
  location: string;
  phone: string;
  email: string;
  address?: string | null;
  description?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  distance?: number | null;
  images: NearbyBusinessImageSchema[];
}

export interface BusinessImageSchema {
  id: number;
  image: string;
}

export interface FieldValueSchema {
  label: string;
  field_key: string;
  field_type: string;
  value?: string | null;
}

export interface BusinessDetailSchema {
  id: number;
  company_name: string;
  slug: string;
  category?: string | null;
  location: string;
  address?: string | null;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  description?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  images: BusinessImageSchema[];
  field_values: FieldValueSchema[];
}

export interface CategoryFieldSchema {
  id: number;
  label: string;
  field_key: string;
  field_type: string;
  options?: any | null;
  show_as_filter: boolean;
  is_required: boolean;
  order: number;
}

export interface CategorySchema {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  is_active: boolean;
  fields: CategoryFieldSchema[];
}
