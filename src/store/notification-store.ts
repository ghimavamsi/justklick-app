import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => {
          const newNotification = { ...notification, isRead: false };
          return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          };
        }),
      markAsRead: (id) =>
        set((state) => {
          let wasUnread = false;
          const notifications = state.notifications.map((notif) => {
            if (notif.id === id && !notif.isRead) {
              wasUnread = true;
              return { ...notif, isRead: true };
            }
            return notif;
          });
          return {
            notifications,
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        }),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, isRead: true })),
          unreadCount: 0,
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
