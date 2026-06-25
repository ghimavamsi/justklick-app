import React, { useState, useEffect } from 'react';
import { View, StatusBar, RefreshControl, Platform } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useNotificationsList, useMarkNotificationRead } from '../../hooks/useNotifications';
import { NotificationCategory, NotificationItem } from '../../types/notification.types';

// Components
import { NotificationHeader } from '../../components/notifications/NotificationHeader';
import { NotificationSummaryCard } from '../../components/notifications/NotificationSummaryCard';
import { NotificationCategoryChips } from '../../components/notifications/NotificationCategoryChips';
import { SwipeableNotificationRow } from '../../components/notifications/SwipeableNotificationRow';
import { NotificationSkeletons } from '../../components/notifications/NotificationSkeletons';
import { NotificationEmptyState } from '../../components/notifications/NotificationEmptyState';

const CATEGORIES: NotificationCategory[] = ['All', 'Updates', 'Offers', 'Businesses', 'Reviews', 'Favorites', 'Recommendations'];

export default function NotificationsScreen() {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const scrollY = useSharedValue(0);
  
  // State
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Data
  const { data, isLoading, refetch, isRefetching } = useNotificationsList(activeCategory, debouncedQuery);
  const { mutate: markAsRead } = useMarkNotificationRead();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleNotificationPress = (notification: NotificationItem) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Intelligent Navigation based on notification type
    console.log('Navigating based on notification:', notification.data?.type);
    // In future:
    // if (notification.data?.businessId) router.push(`/business/${notification.data.businessId}`);
  };

  const isSearchActive = debouncedQuery.length > 0;
  // Header is now always 180px tall since search is permanently visible.
  const headerPadding = 180;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Sticky Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <NotificationHeader 
          scrollY={scrollY} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 20) + headerPadding, 
          paddingBottom: insets.bottom + 40 
        }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={refetch}
            tintColor={colorScheme === 'dark' ? '#c10007' : '#1C398E'}
            colors={['#c10007', '#1C398E']}
            progressViewOffset={Math.max(insets.top, 20) + headerPadding}
          />
        }
      >
        {isLoading ? (
          <NotificationSkeletons />
        ) : (
          <>
            {/* Summary Card Removed per user request */}

            {!isSearchActive && (
              <NotificationCategoryChips 
                categories={CATEGORIES} 
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
              />
            )}

            {data?.notifications && data.notifications.length > 0 ? (
              <View className="bg-card">
                {data.notifications.map((notification) => (
                  <SwipeableNotificationRow 
                    key={notification.id} 
                    notification={notification} 
                    onPress={handleNotificationPress} 
                  />
                ))}
              </View>
            ) : (
              <NotificationEmptyState isSearch={isSearchActive || activeCategory !== 'All'} />
            )}
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}
