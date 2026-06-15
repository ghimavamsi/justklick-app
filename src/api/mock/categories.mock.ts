import { CategoryExploreData, ExploreCategory } from '../../types/category.types';

const CATEGORIES: ExploreCategory[] = [
  {
    id: 'c1',
    name: 'Restaurants',
    iconName: 'restaurant',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    gradientColors: ['#FF9A9E', '#FECFEF'],
    businessCount: 12500,
    isPopular: true,
    isTrending: true,
    cardSize: 'large',
    tags: ['Food', 'Dine-in', 'Delivery'],
  },
  {
    id: 'c2',
    name: 'Healthcare',
    iconName: 'medical',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    gradientColors: ['#a18cd1', '#fbc2eb'],
    businessCount: 8400,
    isPopular: true,
    isTrending: true,
    cardSize: 'large',
    tags: ['Hospitals', 'Clinics', 'Pharmacy'],
  },
  {
    id: 'c3',
    name: 'Shopping',
    iconName: 'bag-handle',
    color: '#10B981',
    bgColor: '#D1FAE5',
    gradientColors: ['#84fab0', '#8fd3f4'],
    businessCount: 15200,
    isPopular: true,
    cardSize: 'medium',
    tags: ['Malls', 'Supermarkets', 'Fashion'],
  },
  {
    id: 'c4',
    name: 'Automobile',
    iconName: 'car',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    gradientColors: ['#fccb90', '#d57eeb'],
    businessCount: 4300,
    isPopular: true,
    cardSize: 'medium',
    tags: ['Dealers', 'Service', 'Wash'],
  },
  {
    id: 'c5',
    name: 'Real Estate',
    iconName: 'home',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    gradientColors: ['#e0c3fc', '#8ec5fc'],
    businessCount: 3100,
    cardSize: 'small',
    tags: ['Brokers', 'Rentals', 'Commercial'],
  },
  {
    id: 'c6',
    name: 'Education',
    iconName: 'school',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    gradientColors: ['#f093fb', '#f5576c'],
    businessCount: 5600,
    isTrending: true,
    cardSize: 'medium',
    tags: ['Schools', 'Colleges', 'Tuition'],
  },
  {
    id: 'c7',
    name: 'Beauty & Spa',
    iconName: 'flower',
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    gradientColors: ['#4facfe', '#00f2fe'],
    businessCount: 7800,
    isTrending: true,
    cardSize: 'small',
    tags: ['Salons', 'Massage', 'Wellness'],
  },
  {
    id: 'c8',
    name: 'Fitness',
    iconName: 'barbell',
    color: '#F97316',
    bgColor: '#FFEDD5',
    gradientColors: ['#fa709a', '#fee140'],
    businessCount: 2900,
    cardSize: 'small',
    tags: ['Gyms', 'Yoga', 'Zumba'],
  },
  {
    id: 'c9',
    name: 'Travel',
    iconName: 'airplane',
    color: '#06B6D4',
    bgColor: '#CFFAFE',
    gradientColors: ['#43e97b', '#38f9d7'],
    businessCount: 1800,
    cardSize: 'medium',
    tags: ['Agencies', 'Hotels', 'Tours'],
  },
  {
    id: 'c10',
    name: 'Events',
    iconName: 'calendar',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    gradientColors: ['#30cfd0', '#330867'],
    businessCount: 2100,
    cardSize: 'small',
    tags: ['Planners', 'Venues', 'Catering'],
  },
  {
    id: 'c11',
    name: 'Electronics',
    iconName: 'desktop',
    color: '#64748B',
    bgColor: '#F1F5F9',
    gradientColors: ['#b224ef', '#7579ff'],
    businessCount: 4200,
    cardSize: 'small',
    tags: ['Mobile', 'Computers', 'Repair'],
  },
  {
    id: 'c12',
    name: 'Home Services',
    iconName: 'hammer',
    color: '#A855F7',
    bgColor: '#F3E8FF',
    gradientColors: ['#ff0844', '#ffb199'],
    businessCount: 9500,
    cardSize: 'large',
    tags: ['Plumbing', 'Electrical', 'Cleaning'],
  }
];

export const fetchCategoryExploreData = async (): Promise<CategoryExploreData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    featured: CATEGORIES.filter(c => c.isPopular),
    trending: CATEGORIES.filter(c => c.isTrending),
    recommended: [CATEGORIES[2], CATEGORIES[5], CATEGORIES[7], CATEGORIES[11]], // Shopping, Education, Fitness, Home Services
    all: CATEGORIES,
  };
};

export const searchCategories = async (query: string): Promise<ExploreCategory[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (!query) return CATEGORIES;
  
  const lowerQuery = query.toLowerCase();
  return CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) || 
    c.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
