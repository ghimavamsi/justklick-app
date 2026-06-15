import { useQuery } from '@tanstack/react-query';
import { MOCK_PROFILE_DASHBOARD } from '../api/mock/profile.mock';
import { ProfileDashboardData } from '../types/profile.types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProfileDashboard() {
  return useQuery<ProfileDashboardData>({
    queryKey: ['profile-dashboard'],
    queryFn: async () => {
      await delay(800); // Premium loading feel
      return MOCK_PROFILE_DASHBOARD;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
