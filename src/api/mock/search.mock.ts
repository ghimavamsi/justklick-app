import { Business, Category } from '../../types/home.types';

export const RECENT_SEARCHES = [
  'Restaurants',
  'Hospitals',
  'Hostels',
  'Electricians',
  'Coaching Centers',
];

export const TRENDING_SEARCHES = [
  'Restaurants Near Me',
  'Best Hospitals',
  'Top Rated Hostels',
  'Beauty Salons',
  'Study Abroad Consultants',
];

export const SEARCH_SUGGESTIONS = [
  { id: 's1', text: 'Hotels', type: 'category', icon: 'business' },
  { id: 's2', text: 'Hotel Booking', type: 'service', icon: 'calendar' },
  { id: 's3', text: 'Hotels Near Me', type: 'query', icon: 'location' },
  { id: 's4', text: 'Hotel Restaurants', type: 'category', icon: 'restaurant' },
  { id: 's5', text: 'Hotel Services', type: 'service', icon: 'briefcase' },
];

// Reusing some of the high quality Unsplash images from home mock
const IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop', // Cafe
  'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop', // Auto
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', // Office
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop', // Hostel
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', // Healthcare
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop', // Girls Hostel
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', // Premium Hostel
];

export const SUBCATEGORIES: Record<string, {name: string, icon: string, color: string}[]> = {
  hostel: [
    { name: 'Boys Hostel', icon: 'man', color: '#3B82F6' }, 
    { name: 'Girls Hostel', icon: 'woman', color: '#EC4899' }, 
    { name: 'AC Rooms', icon: 'snow', color: '#06B6D4' }, 
    { name: 'Attached Washroom', icon: 'water', color: '#14B8A6' }, 
    { name: 'Food Included', icon: 'restaurant', color: '#F59E0B' }
  ],
  hotel: [
    { name: '5 Star', icon: 'star', color: '#F59E0B' }, 
    { name: 'Couples Allowed', icon: 'heart', color: '#EF4444' }, 
    { name: 'Business', icon: 'briefcase', color: '#6366F1' }, 
    { name: 'Resorts', icon: 'leaf', color: '#10B981' }
  ],
  hospital: [
    { name: 'Cardiology', icon: 'heart', color: '#EF4444' }, 
    { name: 'Dental', icon: 'medkit', color: '#3B82F6' }, 
    { name: '24/7 ER', icon: 'medical', color: '#DC2626' }, 
    { name: 'Pediatrics', icon: 'happy', color: '#8B5CF6' }
  ],
  restaurant: [
    { name: 'Veg Only', icon: 'leaf', color: '#10B981' }, 
    { name: 'Fine Dining', icon: 'wine', color: '#8B5CF6' }, 
    { name: 'Fast Food', icon: 'pizza', color: '#F59E0B' }, 
    { name: 'Cafe', icon: 'cafe', color: '#D97706' }
  ],
};

export const FILTERS = [
  { id: 'sort_distance', label: 'Sort: Distance', icon: 'location', color: '#3B82F6' },
  { id: 'sort_rating', label: 'Sort: Rating', icon: 'trending-up', color: '#EF4444' },
  { id: 'top_rated', label: 'Top Rated 4.5+', icon: 'star', color: '#F59E0B' },
  { id: 'open_now', label: 'Open Now', icon: 'time', color: '#10B981' },
  { id: 'verified', label: 'Verified', icon: 'checkmark-circle', color: '#8B5CF6' },
  { id: 'premium', label: 'Premium', icon: 'diamond', color: '#EC4899' },
];

export const MOCK_SEARCH_BANNERS = [
  { id: 'b1', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop', title: 'Top Rated Hostels near you' },
  { id: 'b2', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop', title: 'Premium AC Rooms available' },
  { id: 'b3', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', title: 'Budget Stays for Students' },
  { id: 'b4', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop', title: 'Executive Paying Guests' },
];

export const MOCK_NEARBY_DATA: Business[] = [
  {
    id: 'n1',
    name: 'Green Leaf Cafe',
    category: 'Restaurants',
    rating: 4.5,
    reviewsCount: 128,
    isVerified: true,
    distanceStr: '0.8 km',
    coverImage: IMAGES[0],
    isPremium: true,
    tags: ['Veg Only', 'Cafe', 'AC Rooms'],
    isOpenNow: true,
    images: [IMAGES[0], IMAGES[1], IMAGES[2]],
    experience: '8 Years in Business',
    timings: 'Open until 11:00 PM',
    fullAddress: 'Plot 45, VIP Hills, Madhapur, Hyderabad',
    isTrusted: true,
  },
  {
    id: 'n2',
    name: 'City Care Hospital',
    category: 'Healthcare',
    rating: 4.8,
    reviewsCount: 2045,
    isVerified: true,
    distanceStr: '1.2 km',
    coverImage: IMAGES[4],
    tags: ['24/7 ER', 'Cardiology'],
    isOpenNow: true,
    images: [IMAGES[4], IMAGES[3], IMAGES[2]],
    experience: '15 Years in Business',
    timings: 'Open 24 Hours',
    fullAddress: 'Road No 36, Jubilee Hills, Hyderabad',
    isTrusted: true,
  },
  {
    id: 'n3',
    name: 'Rapid Auto Service',
    category: 'Automobile',
    rating: 4.2,
    reviewsCount: 85,
    isVerified: false,
    distanceStr: '2.0 km',
    coverImage: IMAGES[1],
    tags: ['Mechanic'],
    isOpenNow: false,
    images: [IMAGES[1], IMAGES[0], IMAGES[2]],
    experience: '3 Years in Business',
    timings: 'Closes at 8:00 PM',
    fullAddress: 'Shop 12, KPHB Colony, Kukatpally',
  },
  {
    id: 'n4',
    name: 'Premium Student Hostel',
    category: 'Hostels',
    rating: 4.6,
    reviewsCount: 310,
    isVerified: true,
    distanceStr: '3.5 km',
    coverImage: IMAGES[3],
    isPremium: true,
    tags: ['Boys Hostel', 'Food Included', 'AC Rooms'],
    isOpenNow: true,
    images: [IMAGES[3], IMAGES[5], IMAGES[6]],
    experience: '10 Years in Business',
    timings: 'Open 24 Hours',
    fullAddress: 'Ayyappa Society, Madhapur, Hyderabad',
    isTrusted: true,
  },
  {
    id: 'n5',
    name: 'Safe Stay Girls Hostel',
    category: 'Hostels',
    rating: 4.3,
    reviewsCount: 145,
    isVerified: true,
    distanceStr: '1.5 km',
    coverImage: IMAGES[5],
    tags: ['Girls Hostel', 'Attached Washroom', 'Food Included'],
    isOpenNow: true,
    images: [IMAGES[5], IMAGES[3], IMAGES[6]],
    experience: '5 Years in Business',
    timings: 'Open until 10:00 PM',
    fullAddress: 'Sri Ram Nagar, Kondapur, Hyderabad',
    isTrusted: false,
  },
  {
    id: 'n6',
    name: 'Executive Boys PG',
    category: 'Hostels',
    rating: 3.9,
    reviewsCount: 56,
    isVerified: false,
    distanceStr: '0.5 km',
    coverImage: IMAGES[6],
    tags: ['Boys Hostel', 'Non-AC'],
    isOpenNow: false,
    images: [IMAGES[6], IMAGES[5], IMAGES[3]],
    experience: '2 Years in Business',
    timings: 'Closes at 9:00 PM',
    fullAddress: 'Image Hospital Road, Ameerpet, Hyderabad',
  },
];
