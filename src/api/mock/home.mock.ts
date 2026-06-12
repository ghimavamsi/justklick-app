import { Banner, Business, Category, HomeData } from '../../types/home.types';

// Unsplash highly polished imagery
const FEATURED_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', // Office / Consultants
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', // Coaching / Meeting
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop', // Hostel / Modern building
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop', // Premium Appartment
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', // Healthcare
];

const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Study Abroad', iconName: 'airplane', color: '#1C398E', bgColor: 'bg-[#1C398E]/10' },
  { id: 'c2', name: 'Coaching', iconName: 'library', color: '#c10007', bgColor: 'bg-[#c10007]/10' },
  { id: 'c3', name: 'Hostels', iconName: 'business', color: '#10B981', bgColor: 'bg-[#10B981]/10' },
  { id: 'c4', name: 'Healthcare', iconName: 'medkit', color: '#F59E0B', bgColor: 'bg-[#F59E0B]/10' },
  { id: 'c5', name: 'Restaurants', iconName: 'restaurant', color: '#8B5CF6', bgColor: 'bg-[#8B5CF6]/10' },
  { id: 'c6', name: 'Automobile', iconName: 'car', color: '#3B82F6', bgColor: 'bg-[#3B82F6]/10' },
  { id: 'c7', name: 'Real Estate', iconName: 'home', color: '#EC4899', bgColor: 'bg-[#EC4899]/10' },
  { id: 'c8', name: 'More Services', iconName: 'grid', color: '#64748B', bgColor: 'bg-[#64748B]/10' },
];

const BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Top Rated Consultants',
    subtitle: 'Find verified experts to guide your career.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop',
    actionUrl: '/business/consultants'
  },
  {
    id: 'b2',
    title: 'Premium Hostels',
    subtitle: 'Discover luxurious student living spaces near you.',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000&auto=format&fit=crop',
    actionUrl: '/business/hostels'
  }
];

const FEATURED_BUSINESSES: Business[] = [
  {
    id: 'fb1',
    name: 'Apex Global Education',
    category: 'Study Abroad',
    rating: 4.9,
    reviewsCount: 1240,
    isVerified: true,
    coverImage: FEATURED_IMAGES[0],
  },
  {
    id: 'fb2',
    name: 'Prime Learning Hub',
    category: 'Coaching',
    rating: 4.7,
    reviewsCount: 856,
    isVerified: true,
    coverImage: FEATURED_IMAGES[1],
  },
  {
    id: 'fb3',
    name: 'City Care Hospital',
    category: 'Healthcare',
    rating: 4.8,
    reviewsCount: 2045,
    isVerified: true,
    coverImage: FEATURED_IMAGES[4],
  }
];

const PREMIUM_BUSINESSES: Business[] = [
  {
    id: 'pb1',
    name: 'Elite Living Spaces',
    category: 'Hostels',
    rating: 5.0,
    reviewsCount: 432,
    isVerified: true,
    isPremium: true,
    coverImage: FEATURED_IMAGES[3],
  },
  {
    id: 'pb2',
    name: 'Oxford Mentors',
    category: 'Study Abroad',
    rating: 4.9,
    reviewsCount: 3120,
    isVerified: true,
    isPremium: true,
    coverImage: FEATURED_IMAGES[0],
  }
];

const NEARBY_BUSINESSES: Business[] = [
  {
    id: 'nb1',
    name: 'Green Leaf Cafe',
    category: 'Restaurants',
    rating: 4.5,
    reviewsCount: 128,
    isVerified: true,
    distanceStr: '0.8 km',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nb2',
    name: 'Rapid Auto Service',
    category: 'Automobile',
    rating: 4.2,
    reviewsCount: 85,
    isVerified: false,
    distanceStr: '1.2 km',
    coverImage: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nb3',
    name: 'Central Library Coaching',
    category: 'Coaching',
    rating: 4.6,
    reviewsCount: 420,
    isVerified: true,
    distanceStr: '2.5 km',
    coverImage: FEATURED_IMAGES[1],
  }
];

const RECOMMENDED_BUSINESSES: Business[] = [
  {
    id: 'rb1',
    name: 'Visa Success Partners',
    category: 'Study Abroad',
    rating: 4.8,
    reviewsCount: 950,
    isVerified: true,
    coverImage: FEATURED_IMAGES[0],
  },
  {
    id: 'rb2',
    name: 'Campus View Housing',
    category: 'Hostels',
    rating: 4.3,
    reviewsCount: 215,
    isVerified: true,
    coverImage: FEATURED_IMAGES[2],
  }
];

export const fetchHomeData = async (): Promise<HomeData> => {
  // Simulate network delay to showcase premium skeletons
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        categories: CATEGORIES,
        trendingCategories: CATEGORIES.slice(0, 4),
        banners: BANNERS,
        featuredBusinesses: FEATURED_BUSINESSES,
        premiumBusinesses: PREMIUM_BUSINESSES,
        nearbyBusinesses: NEARBY_BUSINESSES,
        recommendedBusinesses: RECOMMENDED_BUSINESSES,
      });
    }, 1500);
  });
};
