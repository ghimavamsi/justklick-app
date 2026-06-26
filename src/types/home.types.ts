export interface Category {
  id: string;
  name: string;
  slug?: string;
  iconName: string;
  iconLibrary?: 'Ionicons' | 'SymbolView';
  color: string;
  bgColor: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  coverImage: string;
  distanceStr?: string;
  isPremium?: boolean;
  isTrending?: boolean;
  tags?: string[];
  isOpenNow?: boolean;
  images?: string[];
  experience?: string;
  timings?: string;
  fullAddress?: string;
  isTrusted?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionUrl: string;
}

export interface HomeData {
  categories: Category[];
  trendingCategories: Category[];
  banners: Banner[];
  featuredBusinesses: Business[];
  premiumBusinesses: Business[];
  nearbyBusinesses: Business[];
  recommendedBusinesses: Business[];
}
