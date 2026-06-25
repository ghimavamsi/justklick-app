import apiClient from './client';
import { DeviceTokenSchema, SendNotificationSchema, MessageOut } from '../types/api.types';

export const notificationsApi = {
  // Save or update FCM device token
  saveDeviceToken: async (data: DeviceTokenSchema): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/notifications/save-device-token', data);
    return response.data;
  },

  // Send login push to current user
  sendLoginPush: async (): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/notifications/send-login-push');
    return response.data;
  },

  // Send a custom notification to a user
  sendNotification: async (data: SendNotificationSchema): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/notifications/send', data);
    return response.data;
  },

  // List all notifications for current user
  listNotifications: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/api/notifications/list');
    return response.data;
  },

  // Mark specific notification as read
  markNotificationRead: async (notificationId: string): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>(`/api/notifications/${notificationId}/mark-read`);
    return response.data;
  },

  // Mark all notifications as read for current user
  markAllNotificationsRead: async (): Promise<MessageOut> => {
    const response = await apiClient.post<MessageOut>('/api/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<MessageOut> => {
    const response = await apiClient.delete<MessageOut>(`/api/notifications/delete/${notificationId}`);
    return response.data;
  }
};
