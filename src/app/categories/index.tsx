import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, RefreshControl, Platform } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useTheme } from '../../hooks/useTheme';
import { useCategoryExploreData, useCategorySearch } from '../../hooks/useCategoryExplore';
import { ExploreCategory } from '../../types/category.types';

// Components
import { CategoryHero } from '../../components/categories/CategoryHero';
import { CategoryGrid } from '../../components/categories/CategoryGrid';
import { TrendingCategoryRow } from '../../components/categories/TrendingCategoryRow';
import { CategorySkeletons } from '../../components/categories/CategorySkeletons';
import { CategoryEmptyState } from '../../components/categories/CategoryEmptyState';
import { useSearchStore } from '../../store/search-store';

export default function ExploreCategoriesScreen() {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setQuery, setPhase } = useSearchStore();
  
  const scrollY = useSharedValue(0);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Data Queries
  const { data: exploreData, isLoading: isExploreLoading, isError: isExploreError, refetch, isRefetching } = useCategoryExploreData();
  const { data: searchResults, isLoading: isSearchLoading } = useCategorySearch(debouncedQuery);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleCategoryPress = (category: ExploreCategory) => {
    setQuery(category.name);
    setPhase('results');
    router.push('/search');
  };

  const isSearching = debouncedQuery.length > 0;
  const isLoading = isSearching ? isSearchLoading : isExploreLoading;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Sticky Collapsing Hero */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <CategoryHero 
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
          // The Hero expands up to ~240px. We pad the top so content starts below it.
          paddingTop: Math.max(insets.top, 20) + 240, 
          paddingBottom: insets.bottom + 40 
        }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={refetch}
            tintColor={colorScheme === 'dark' ? '#c10007' : '#1C398E'}
            colors={['#c10007', '#1C398E', '#F59E0B']}
            progressBackgroundColor={colorScheme === 'dark' ? '#1e293b' : '#ffffff'}
            progressViewOffset={Math.max(insets.top, 20) + 240} // Offset the spinner below the hero
          />
        }
      >
        {isLoading ? (
          <CategorySkeletons />
        ) : isSearching ? (
          // Search Results View
          searchResults && searchResults.length > 0 ? (
            <View className="pt-6">
              <Text className="px-5 text-lg font-extrabold text-foreground mb-4">
                Results for "{debouncedQuery}"
              </Text>
              <CategoryGrid categories={searchResults} onCategoryPress={handleCategoryPress} />
            </View>
          ) : (
            <CategoryEmptyState query={debouncedQuery} />
          )
        ) : exploreData ? (
          // Default Explore View
          <View>
            <TrendingCategoryRow 
              title="Trending Near You" 
              categories={exploreData.trending} 
              onCategoryPress={handleCategoryPress} 
            />
            
            <View className="px-5 mt-4 mb-2">
              <Text className="text-xl font-extrabold text-foreground tracking-tight">Recommended For You</Text>
              <Text className="text-sm font-medium text-muted-foreground mt-1">Based on your activity</Text>
            </View>
            <CategoryGrid categories={exploreData.recommended} onCategoryPress={handleCategoryPress} />

            <View className="px-5 mt-10 mb-2">
              <Text className="text-xl font-extrabold text-foreground tracking-tight">All Categories</Text>
            </View>
            <CategoryGrid categories={exploreData.all.filter(c => !exploreData.recommended.find(r => r.id === c.id))} onCategoryPress={handleCategoryPress} />
          </View>
        ) : (
          // Error State
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-foreground font-medium">Failed to load categories. Please try again.</Text>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}
