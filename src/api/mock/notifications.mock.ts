import { NotificationItem, NotificationCategory, NotificationsData } from '../../types/notification.types';

let MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'business_update',
    title: 'Green Leaf Cafe verified!',
    description: 'Green Leaf Cafe has received the Premium verification badge. Check out their new menu.',
    timestamp: '10m ago',
    isRead: false,
    businessId: 'n1',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'n2',
    type: 'offer',
    title: '20% off at City Care Hospital',
    description: 'Exclusive health checkup package available this week. Book your appointment now.',
    timestamp: '2h ago',
    isRead: false,
    businessId: 'n2',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'n3',
    type: 'recommendation',
    title: 'Trending near you: Rapid Auto Service',
    description: '5 people in your area recently reviewed Rapid Auto Service positively.',
    timestamp: '5h ago',
    isRead: true,
    businessId: 'n3',
    imageUrl: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'n4',
    type: 'review',
    title: 'Your review got 12 likes',
    description: 'People found your review for "Premium Student Hostel" very helpful.',
    timestamp: '1d ago',
    isRead: true,
    businessId: 'n4',
    avatarText: 'PS',
  },
  {
    id: 'n5',
    type: 'favorite',
    title: 'New photos added',
    description: 'Safe Stay Girls Hostel added 5 new photos to their gallery.',
    timestamp: '1d ago',
    isRead: true,
    businessId: 'n5',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'n6',
    type: 'system',
    title: 'Welcome to JustKlick',
    description: 'Discover the best businesses, professionals, and services around you.',
    timestamp: '3d ago',
    isRead: true,
    avatarText: 'JK',
  },
];

export const fetchNotifications = async (category: NotificationCategory = 'All', searchQuery: string = ''): Promise<NotificationsData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filtered = [...MOCK_NOTIFICATIONS];

  // Apply Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.description.toLowerCase().includes(q)
    );
  }

  // Apply Category Filter
  if (category !== 'All') {
    switch (category) {
      case 'Updates':
        filtered = filtered.filter(n => n.type === 'business_update' || n.type === 'system');
        break;
      case 'Offers':
        filtered = filtered.filter(n => n.type === 'offer');
        break;
      case 'Businesses':
        filtered = filtered.filter(n => n.businessId != null);
        break;
      case 'Reviews':
        filtered = filtered.filter(n => n.type === 'review');
        break;
      case 'Favorites':
        filtered = filtered.filter(n => n.type === 'favorite');
        break;
      case 'Recommendations':
        filtered = filtered.filter(n => n.type === 'recommendation');
        break;
    }
  }

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
  
  let insightText = "You're all caught up!";
  if (unreadCount > 0) {
    insightText = `You have ${unreadCount} new update${unreadCount > 1 ? 's' : ''} to check out.`;
  }

  return {
    summary: {
      unreadCount,
      insightText,
    },
    notifications: filtered,
  };
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => 
    n.id === id ? { ...n, isRead: true } : n
  );
};

export const markAllAsRead = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => ({ ...n, isRead: true }));
};

export const deleteNotification = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.filter(n => n.id !== id);
};
