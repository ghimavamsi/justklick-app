import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchStore } from '../../../store/search-store';
import { RECENT_SEARCHES, TRENDING_SEARCHES } from '../../../api/mock/search.mock';
import { useTheme } from '../../../hooks/useTheme';
import { CategoryCarousel } from '../../home/CategoryCarousel';
import { useHomeData } from '../../../hooks/useHomeData';

export function EmptyState() {
  const { recentSearches, removeRecentSearch, clearRecentSearches, setQuery } = useSearchStore();
  const { colorScheme } = useTheme();
  const { data: homeData } = useHomeData();
  const categories = homeData?.categories || [];
  
  const isDark = colorScheme === 'dark';

  // Use mock recent searches if local storage is empty for demonstration purposes
  const displayRecentSearches = recentSearches.length > 0 ? recentSearches : RECENT_SEARCHES.slice(0, 3);

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Recent Searches Section */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-extrabold text-foreground tracking-tight">Recent Searches</Text>
          {recentSearches.length > 0 && (
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text className="text-sm font-bold text-primary">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row flex-wrap gap-3">
          {displayRecentSearches.map((search, index) => (
            <TouchableOpacity
              key={`recent-${index}`}
              onPress={() => setQuery(search)}
              className="flex-row items-center bg-muted px-4 py-2.5 rounded-full border border-border/50"
            >
              <Ionicons name="time-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
              <Text className="text-sm font-medium text-foreground">{search}</Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity 
                  onPress={() => removeRecentSearch(search)}
                  className="ml-3 p-1 -mr-2"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={14} color="#64748B" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trending Searches Section */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="trending-up" size={20} color="#c10007" style={{ marginRight: 8 }} />
          <Text className="text-lg font-extrabold text-foreground tracking-tight">Trending Near You</Text>
        </View>

        <View className="bg-muted/30 rounded-3xl border border-border/50 overflow-hidden">
          {TRENDING_SEARCHES.map((trending, index) => (
            <TouchableOpacity
              key={`trending-${index}`}
              onPress={() => setQuery(trending)}
              className={`flex-row items-center justify-between p-4 ${index !== TRENDING_SEARCHES.length - 1 ? 'border-b border-border/50' : ''}`}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-background items-center justify-center border border-border/50 mr-4 shadow-sm">
                  <Text className="text-xs font-bold text-muted-foreground">{index + 1}</Text>
                </View>
                <Text className="text-base font-semibold text-foreground">{trending}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#64748B" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Categories Grid */}
      <View style={{ marginHorizontal: -20 }}>
        <CategoryCarousel categories={categories} />
      </View>

    </ScrollView>
  );
}
