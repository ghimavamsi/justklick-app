import { useQuery } from '@tanstack/react-query';
import { fetchHomeData } from '../api/mock/home.mock';
import { HomeData } from '../types/home.types';

export const HOME_QUERY_KEY = ['homeData'];

export function useHomeData() {
  return useQuery<HomeData, Error>({
    queryKey: HOME_QUERY_KEY,
    queryFn: fetchHomeData,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });
}
