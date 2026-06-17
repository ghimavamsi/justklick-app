import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/home';
import { CategoryExploreData, ExploreCategory } from '../types/category.types';

export const CATEGORY_EXPLORE_KEY = ['categoryExplore'];
export const CATEGORY_SEARCH_KEY = (query: string) => ['categorySearch', query];

// Helper to map ApiCategory to ExploreCategory
const mapToExploreCategory = (c: any, index: number): ExploreCategory => {
  // Helper to fix relative URLs and force HTTPS
  const getImageUrl = (url: string | null | undefined, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith('http:')) return url.replace('http:', 'https:');
    if (url.startsWith('https:')) return url;
    
    const relativePath = url.startsWith('/') ? url : `/${url}`;
    return `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${relativePath}`;
  };

  const gradients: [string, string][] = [
    ['#FF9A9E', '#FECFEF'],
    ['#a18cd1', '#fbc2eb'],
    ['#84fab0', '#8fd3f4'],
    ['#fccb90', '#d57eeb'],
    ['#e0c3fc', '#8ec5fc'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#fa709a', '#fee140'],
    ['#43e97b', '#38f9d7'],
    ['#30cfd0', '#330867'],
    ['#b224ef', '#7579ff'],
    ['#ff0844', '#ffb199']
  ];

  const sizes: ('large' | 'medium' | 'small')[] = ['large', 'large', 'medium', 'medium', 'small', 'medium', 'small', 'small', 'medium', 'small', 'small', 'large'];

  return {
    id: String(c?.id || c?.slug || index),
    name: c?.name || c?.category_name || `Category ${index + 1}`,
    iconName: getImageUrl(c?.image || c?.icon, 'grid-outline'), 
    iconLibrary: 'Ionicons',
    color: '#1C398E',
    bgColor: 'rgba(28, 57, 142, 0.1)',
    gradientColors: gradients[index % gradients.length],
    businessCount: Math.floor(Math.random() * 500) + 50, // mock count for now
    isPopular: index % 3 === 0,
    isTrending: index % 4 === 0,
    cardSize: sizes[index % sizes.length],
    tags: [],
  };
};

const fetchCategoriesMapped = async () => {
  const apiCategories = await homeApi.fetchCategories();
  
  const extractArray = (data: any) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  };

  return extractArray(apiCategories).map(mapToExploreCategory);
};

export function useCategoryExploreData() {
  return useQuery<CategoryExploreData, Error>({
    queryKey: CATEGORY_EXPLORE_KEY,
    queryFn: async () => {
      const categories = await fetchCategoriesMapped();

      return {
        all: categories,
        featured: categories.filter((c: ExploreCategory) => c.isPopular),
        trending: categories.filter((c: ExploreCategory) => c.isTrending),
        recommended: categories.slice(0, 4), // fallback
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategorySearch(query: string) {
  return useQuery<ExploreCategory[], Error>({
    queryKey: CATEGORY_SEARCH_KEY(query),
    queryFn: async () => {
      const categories = await fetchCategoriesMapped();

      if (!query) return categories;

      const lowerQuery = query.toLowerCase();
      return categories.filter((c: ExploreCategory) => 
        c.name.toLowerCase().includes(lowerQuery)
      );
    },
    enabled: true, 
    staleTime: 1000 * 60, // 1 minute
  });
}
