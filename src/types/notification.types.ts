export type NotificationCategory = 'All' | 'Updates' | 'Offers' | 'Businesses' | 'Reviews' | 'Favorites' | 'Recommendations';

export type NotificationType = 'business_update' | 'recommendation' | 'offer' | 'review' | 'favorite' | 'system';

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  data: any; // Dynamic JSON object from backend
  is_read: boolean;
  created_at: string; // ISO string
}

export interface NotificationSummary {
  unreadCount: number;
  insightText: string;
}

export interface NotificationsData {
  summary: NotificationSummary;
  notifications: NotificationItem[];
}
