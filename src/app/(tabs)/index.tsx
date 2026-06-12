import React from 'react';
import { View, Text, StatusBar, ListRenderItem } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHomeData } from '../../hooks/useHomeData';
import { useTheme } from '../../hooks/useTheme';

// Components
import { HomeHeader } from '../../components/home/HomeHeader';
import { HeroSearch } from '../../components/home/HeroSearch';
import { CategoryCarousel } from '../../components/home/CategoryCarousel';
import { PromoBannerCarousel } from '../../components/home/PromoBannerCarousel';
import { BusinessSection } from '../../components/home/BusinessSection';
import { TrendingCategories } from '../../components/home/TrendingCategories';
import { HomeSkeletons } from '../../components/home/HomeSkeletons';

// Section Enum for FlatList
type HomeSectionType = 
  | 'search' 
  | 'categories' 
  | 'banners' 
  | 'featured' 
  | 'premium' 
  | 'nearby' 
  | 'trending' 
  | 'recommended'
  | 'footer';

const SECTIONS: HomeSectionType[] = [
  'search', 
  'categories', 
  'banners', 
  'featured', 
  'premium', 
  'nearby', 
  'trending', 
  'recommended',
  'footer'
];

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const { data, isLoading, isError } = useHomeData();
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  
  // Calculate the expanded header height dynamically based on safe area
  const headerHeight = Math.max(insets.top, 20) + 12 + 105; // paddingTop + 105

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
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
      case 'search':
        return <HeroSearch />;
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
            title="Near You" 
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
      
      <HomeHeader scrollY={scrollY} />

      <Animated.FlatList
        data={SECTIONS}
        keyExtractor={(item) => item}
        renderItem={renderSection}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 40 }}
      />
    </View>
  );
}
