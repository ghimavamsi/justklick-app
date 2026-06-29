import React from 'react';
import { View, Text, StatusBar, ListRenderItem, RefreshControl } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeData } from '../../hooks/useHomeData';
import { useTheme } from '../../hooks/useTheme';

// Components
import { HomeHeader } from '../../components/home/HomeHeader';

import { CategoryCarousel } from '../../components/home/CategoryCarousel';
import { PromoBannerCarousel } from '../../components/home/PromoBannerCarousel';
import { BusinessSection } from '../../components/home/BusinessSection';
import { TrendingCategories } from '../../components/home/TrendingCategories';
import { HomeSkeletons } from '../../components/home/HomeSkeletons';

// Section Enum for FlatList
type HomeSectionType = 
  | 'categories' 
  | 'banners' 
  | 'featured' 
  | 'premium' 
  | 'nearby' 
  | 'trending' 
  | 'recommended'
  | 'footer';

const SECTIONS: HomeSectionType[] = [
  'categories',
  'banners',
  'nearby',
  'featured',
  'premium',
  'trending',
  'recommended',
  'footer',
];

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useHomeData();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  
  // Calculate the expanded header height dynamically based on safe area
  const headerHeight = Math.max(insets.top, 20) + 12 + 105; // paddingTop + 105

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  React.useEffect(() => {
    import('expo-router').then(({ SplashScreen }) => {
      SplashScreen.hideAsync();
    });
  }, []);

  const pullToRefreshGlowStyle = useAnimatedStyle(() => {
    // When scrollY is negative, the user is pulling down
    const pullDistance = Math.max(0, -scrollY.value);
    const opacity = Math.min(pullDistance / 80, 1);
    const scale = 1 + Math.min(pullDistance / 200, 0.5);
    
    return {
      opacity: isRefetching ? 1 : opacity,
      transform: [{ scale: isRefetching ? 1.2 : scale }],
      position: 'absolute',
      top: headerHeight - 20,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 0, // Behind the FlatList content
    };
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <HomeHeader scrollY={scrollY} />
        <View style={{ paddingTop: headerHeight }}>
          <HomeSkeletons />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Failed to load data. Please try again.</Text>
      </View>
    );
  }

  const renderSection: ListRenderItem<HomeSectionType> = ({ item }) => {
    switch (item) {

      case 'categories':
        return <CategoryCarousel categories={data.categories} />;
      case 'banners':
        return <PromoBannerCarousel banners={data.banners} />;
      case 'featured':
        return (
          <BusinessSection 
            title="Featured Businesses" 
            subtitle="Top rated places this week"
            businesses={data.featuredBusinesses} 
            variant="featured"
            icon="star-outline"
            iconColor="#F59E0B"
          />
        );
      case 'premium':
        return (
          <BusinessSection 
            title="Premium Picks" 
            businesses={data.premiumBusinesses} 
            variant="premium"
            icon="diamond-outline"
            iconColor="#1C398E"
          />
        );
      case 'nearby':
        return (
          <BusinessSection 
            title="Popular Near You" 
            subtitle="Discover great places around you"
            businesses={data.nearbyBusinesses} 
            variant="nearby"
            icon="location-outline"
            iconColor="#10B981"
          />
        );
      case 'trending':
        return <TrendingCategories categories={data.trendingCategories} />;
      case 'recommended':
        return (
          <BusinessSection 
            title="Recommended For You" 
            businesses={data.recommendedBusinesses} 
            variant="recommended"
            icon="sparkles-outline"
            iconColor="#8B5CF6"
          />
        );
      case 'footer':
        return <View className="h-24 items-center justify-center">
          <Text className="text-xs text-muted-foreground">Made with ❤️ by JustKlick</Text>
        </View>;
      default:
        return null;
    }
  };



  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Innovative Pull-to-Refresh Light Effect */}
      <Animated.View style={pullToRefreshGlowStyle} pointerEvents="none">
        <View 
          className="w-48 h-24 rounded-full" 
          style={{ 
            backgroundColor: colorScheme === 'dark' ? 'rgba(193, 0, 7, 0.15)' : 'rgba(28, 57, 142, 0.1)',
            shadowColor: colorScheme === 'dark' ? '#c10007' : '#1C398E',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 30,
            elevation: 10,
          }} 
        />
      </Animated.View>

      <HomeHeader scrollY={scrollY} />

      <Animated.FlatList
        data={SECTIONS}
        keyExtractor={(item) => item}
        renderItem={renderSection}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={refetch}
            tintColor={colorScheme === 'dark' ? '#c10007' : '#1C398E'}
            colors={['#c10007', '#1C398E', '#F59E0B']}
            progressBackgroundColor={colorScheme === 'dark' ? '#1e293b' : '#ffffff'}
            progressViewOffset={headerHeight + 10}
          />
        }
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 40 }}
      />
    </View>
  );
}
