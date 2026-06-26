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
        
        // Safety check: if backend returns HTML instead of JSON
        if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
          console.warn('Backend returned HTML for /api/dashboard. Falling back to defaults.');
          throw new Error('Backend returned HTML for dashboard');
        }
        
        // Merge with safe defaults so the UI doesn't crash if fields are missing
        return {
          statistics: {
            favoritesCount: response?.statistics?.favoritesCount ?? 0,
            reviewsCount: response?.statistics?.reviewsCount ?? 0,
            viewsCount: response?.statistics?.viewsCount ?? 0,
            offersClaimed: response?.statistics?.offersClaimed ?? 0,
          },
          recentActivity: response?.recentActivity || [],
          completionPercentage: response?.completionPercentage ?? 100,
          completionTasks: response?.completionTasks || []
        } as ProfileDashboardData;
      } catch (err) {
        console.warn('Failed to fetch dashboard API', err);
        return {
          statistics: { favoritesCount: 0, reviewsCount: 0, viewsCount: 0, offersClaimed: 0 },
          recentActivity: [],
          completionPercentage: 100,
          completionTasks: []
        } as ProfileDashboardData;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
