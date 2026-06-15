import { useQuery } from '@tanstack/react-query';
import { fetchCategoryExploreData, searchCategories } from '../api/mock/categories.mock';
import { CategoryExploreData, ExploreCategory } from '../types/category.types';

export const CATEGORY_EXPLORE_KEY = ['categoryExplore'];
export const CATEGORY_SEARCH_KEY = (query: string) => ['categorySearch', query];

export function useCategoryExploreData() {
  return useQuery<CategoryExploreData, Error>({
    queryKey: CATEGORY_EXPLORE_KEY,
    queryFn: fetchCategoryExploreData,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategorySearch(query: string) {
  return useQuery<ExploreCategory[], Error>({
    queryKey: CATEGORY_SEARCH_KEY(query),
    queryFn: () => searchCategories(query),
    enabled: true, // Will run automatically as user types, assuming query is debounced before being passed here
    staleTime: 1000 * 60, // 1 minute
  });
}
