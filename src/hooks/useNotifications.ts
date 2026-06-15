import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationAsRead, deleteNotification, markAllAsRead } from '../api/mock/notifications.mock';
import { NotificationCategory } from '../types/notification.types';

export const NOTIFICATIONS_KEY = (category: string, query: string) => ['notifications', category, query];

export function useNotificationsList(category: NotificationCategory, query: string) {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY(category, query),
    queryFn: () => fetchNotifications(category, query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate all notification queries to refresh counts and lists
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
