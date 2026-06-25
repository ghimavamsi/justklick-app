import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../../types/notification.types';
import { useTheme } from '../../hooks/useTheme';

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: (notification: NotificationItem) => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const getIconConfig = () => {
    const type = notification.data?.type || 'system';
    switch (type) {
      case 'business_update': return { name: 'storefront', color: '#10B981', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
      case 'recommendation': return { name: 'sparkles', color: '#8B5CF6', bg: 'bg-purple-100 dark:bg-purple-900/30' };
      case 'offer': return { name: 'pricetag', color: '#F59E0B', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'review': return { name: 'star', color: '#3B82F6', bg: 'bg-blue-100 dark:bg-blue-900/30' };
      case 'favorite': return { name: 'heart', color: '#c10007', bg: 'bg-red-100 dark:bg-red-900/30' };
      case 'system': return { name: 'information-circle', color: '#64748B', bg: 'bg-slate-100 dark:bg-slate-800' };
      default: return { name: 'notifications', color: '#1C398E', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    }
  };

  const iconConfig = getIconConfig();
  
  // Format relative timestamp safely
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(notification)}
      className={`px-5 py-4 border-b border-border/40 flex-row items-start ${!notification.is_read ? (isDark ? 'bg-[#1C398E]/10' : 'bg-[#1C398E]/5') : 'bg-background'}`}
    >
      {/* Left Media Area */}
      <View className="mr-4 relative">
        {notification.data?.imageUrl ? (
          <Image source={{ uri: notification.data.imageUrl }} className="w-14 h-14 rounded-full border border-border/50" />
        ) : (
          <View className={`w-14 h-14 rounded-full items-center justify-center border border-border/50 ${notification.data?.avatarText ? 'bg-primary/10' : iconConfig.bg}`}>
            {notification.data?.avatarText ? (
              <Text className="text-primary font-bold text-lg">{notification.data.avatarText}</Text>
            ) : (
              <Ionicons name={iconConfig.name as any} size={24} color={iconConfig.color} />
            )}
          </View>
        )}
        
        {/* Unread dot overlay */}
        {!notification.is_read && (
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#c10007] rounded-full border-2 border-background" />
        )}
        
        {/* Type Icon overlay (if using image) */}
        {notification.data?.imageUrl && (
          <View className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-background ${iconConfig.bg}`}>
            <Ionicons name={iconConfig.name as any} size={12} color={iconConfig.color} />
          </View>
        )}
      </View>

      {/* Content Area */}
      <View className="flex-1 justify-center">
        <Text 
          className={`text-base mb-1 ${!notification.is_read ? 'font-extrabold text-foreground' : 'font-bold text-foreground/80'}`}
          numberOfLines={2}
        >
          {notification.title}
        </Text>
        <Text className="text-sm text-muted-foreground font-medium mb-2 leading-tight" numberOfLines={2}>
          {notification.message}
        </Text>
        <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          {formatTime(notification.created_at)}
        </Text>
      </View>

    </TouchableOpacity>
  );
}
