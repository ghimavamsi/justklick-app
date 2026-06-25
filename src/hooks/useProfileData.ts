import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { MOCK_PROFILE_DASHBOARD } from '../api/mock/profile.mock';
import { ProfileDashboardData } from '../types/profile.types';

export function useProfileDashboard() {
  return useQuery<ProfileDashboardData>({
    queryKey: ['profile-dashboard'],
    queryFn: async () => {
      try {
        const response = await authApi.getDashboard();
        // The backend might not return exactly the structure expected by the UI.
        // We will merge it with the MOCK_PROFILE_DASHBOARD to ensure safe defaults.
        return {
          ...MOCK_PROFILE_DASHBOARD,
          ...response,
        } as ProfileDashboardData;
      } catch (err) {
        // Fallback to mock data if the API call fails or is not authenticated properly
        console.warn('Failed to fetch dashboard API, falling back to mock.', err);
        return MOCK_PROFILE_DASHBOARD;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
