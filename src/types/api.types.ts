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
