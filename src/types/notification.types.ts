export type NotificationCategory = 'All' | 'Updates' | 'Offers' | 'Businesses' | 'Reviews' | 'Favorites' | 'Recommendations';

export type NotificationType = 'business_update' | 'recommendation' | 'offer' | 'review' | 'favorite' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO string or relative time string
  isRead: boolean;
  businessId?: string;
  imageUrl?: string;
  avatarText?: string;
  actionUrl?: string;
}

export interface NotificationSummary {
  unreadCount: number;
  insightText: string;
}

export interface NotificationsData {
  summary: NotificationSummary;
  notifications: NotificationItem[];
}
