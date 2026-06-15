export type ProfileActivityType = 'favorite' | 'review' | 'viewed' | 'recommendation';

export interface ProfileActivityItem {
  id: string;
  type: ProfileActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
  imageUrl?: string;
  rating?: number; // If review
  actionUrl?: string;
}

export interface ProfileCompletionTask {
  id: string;
  title: string;
  isCompleted: boolean;
  actionUrl: string;
}

export interface ProfileStatistics {
  favoritesCount: number;
  reviewsCount: number;
  viewsCount: number;
  offersClaimed: number;
}

export interface ProfileDashboardData {
  statistics: ProfileStatistics;
  completionPercentage: number;
  completionTasks: ProfileCompletionTask[];
  recentActivity: ProfileActivityItem[];
}
