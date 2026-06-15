import { ProfileDashboardData } from '../../types/profile.types';

export const MOCK_PROFILE_DASHBOARD: ProfileDashboardData = {
  statistics: {
    favoritesCount: 24,
    reviewsCount: 12,
    viewsCount: 156,
    offersClaimed: 4,
  },
  completionPercentage: 80,
  completionTasks: [
    {
      id: 'task_1',
      title: 'Add Profile Picture',
      isCompleted: true,
      actionUrl: '/profile/edit',
    },
    {
      id: 'task_2',
      title: 'Verify Email Address',
      isCompleted: true,
      actionUrl: '/profile/verify-email',
    },
    {
      id: 'task_3',
      title: 'Add Alternate Number',
      isCompleted: false,
      actionUrl: '/profile/edit',
    },
    {
      id: 'task_4',
      title: 'Add Date of Birth',
      isCompleted: false,
      actionUrl: '/profile/edit',
    },
  ],
  recentActivity: [
    {
      id: 'act_1',
      type: 'favorite',
      title: 'Paradise Biryani',
      subtitle: 'Added to your favorites',
      timestamp: '2 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 'act_2',
      type: 'review',
      title: 'Urban Coffee Roasters',
      subtitle: 'You rated them 5 stars',
      timestamp: 'Yesterday',
      rating: 5,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 'act_3',
      type: 'viewed',
      title: 'Apollo Hospitals',
      subtitle: 'You viewed this business',
      timestamp: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&auto=format&fit=crop',
    },
  ]
};
