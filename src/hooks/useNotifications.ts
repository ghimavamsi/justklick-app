import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { NotificationCategory, NotificationItem, NotificationsData } from '../types/notification.types';
import { fetchNotifications as fetchMockNotifications } from '../api/mock/notifications.mock';
import { useAuthStore } from '../store/auth-store';

export const NOTIFICATIONS_KEY = (category: string, query: string) => ['notifications', category, query];

export function useNotificationsList(category: NotificationCategory, query: string) {
  return useQuery<NotificationsData>({
    queryKey: NOTIFICATIONS_KEY(category, query),
    queryFn: async () => {
      try {
        const response = await notificationsApi.listNotifications();
        
        // Map the backend response to NotificationItem schema exactly
        const responseArray = Array.isArray(response) ? response : ((response as any)?.notifications || []);
        
        let notifications: NotificationItem[] = responseArray.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message || '',
          data: n.data || {},
          is_read: !!n.is_read,
          created_at: n.created_at || new Date().toISOString(),
        }));

        // Filter locally since API doesn't seem to have category/query params yet
        if (category !== 'All') {
          notifications = notifications.filter(n => {
            const type = n.data?.type || 'system';
            if (category === 'Updates') return type === 'business_update';
            if (category === 'Offers') return type === 'offer';
            if (category === 'Businesses') return type === 'business_update';
            if (category === 'Reviews') return type === 'review';
            if (category === 'Favorites') return type === 'favorite';
            if (category === 'Recommendations') return type === 'recommendation';
            return true;
          });
        }
        
        if (query) {
          const lowerQ = query.toLowerCase();
          notifications = notifications.filter(n => 
            n.title?.toLowerCase().includes(lowerQ) || 
            n.message?.toLowerCase().includes(lowerQ)
          );
        }

        return {
          summary: {
            unreadCount: notifications.filter(n => !n.is_read).length,
            insightText: notifications.filter(n => !n.is_read).length > 0 ? 'You have new notifications to check.' : 'You are all caught up.'
          },
          notifications,
        };
      } catch (e) {
        console.error('Failed to fetch real notifications', e);
        // Return empty state instead of mock data for production
        return {
          summary: { unreadCount: 0, insightText: 'Failed to load notifications.' },
          notifications: []
        };
      }
    },
    enabled: useAuthStore.getState().isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      // Return true for mock logic if it fails
      try {
        await notificationsApi.markNotificationRead(notificationId);
        return true;
      } catch (e) {
        console.warn('Failed to mark real notification as read, falling back to mock');
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        await notificationsApi.markAllNotificationsRead();
        return true;
      } catch (e) {
        console.warn('Failed to mark all real notifications as read, falling back to mock');
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => notificationsApi.deleteNotification(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
