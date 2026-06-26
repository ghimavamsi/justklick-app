import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSearchAPI } from '../../hooks/useSearchAPI';
import { SearchResultCard } from '../../components/search/SearchResultCard';
import { SearchResultSkeleton } from '../../components/search/SearchResultSkeleton';
import { FilterSheet } from '../../components/search/FilterSheet';
import { useTheme } from '../../hooks/useTheme';
import { useSearchStore } from '../../store/search-store';

export default function CategoryListingScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { activeFilters, setFilter } = useSearchStore();

  // Fetch businesses for this category slug
  const { data: apiData, isLoading: isApiLoading } = useSearchAPI('', slug);
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);

  const handleToggleFilter = (filterId: string) => {
    if (filterId === 'sort_distance' && !activeFilters['sort_distance']) {
      setFilter('sort_rating', false);
    }
    if (filterId === 'sort_rating' && !activeFilters['sort_rating']) {
      setFilter('sort_distance', false);
    }
    setFilter(filterId, !activeFilters[filterId]);
  };

  const filteredData = useMemo(() => {
    let data = apiData || [];

    if (activeFilters['top_rated']) {
      data = data.filter(b => b.rating >= 4.5);
    }
    if (activeFilters['open_now']) {
      data = data.filter(b => b.isOpenNow);
    }
    if (activeFilters['verified']) {
      data = data.filter(b => b.isVerified);
    }
    if (activeFilters['premium']) {
      data = data.filter(b => b.isPremium);
    }

    if (activeFilters['sort_rating']) {
      data = [...data].sort((a, b) => b.rating - a.rating);
    } else if (activeFilters['sort_distance']) {
      data = [...data].sort((a, b) => parseFloat(a.distanceStr || '0') - parseFloat(b.distanceStr || '0'));
    }

    return data;
  }, [apiData, activeFilters]);

  // Try to parse a readable name from slug for the header
  const headerTitle = useMemo(() => {
    if (!slug) return 'Explore Category';
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, [slug]);

  const FILTERS = [
    { id: 'top_rated', label: 'Top Rated', icon: 'star', color: '#F59E0B' },
    { id: 'open_now', label: 'Open Now', icon: 'time', color: '#10B981' },
    { id: 'verified', label: 'Verified', icon: 'checkmark-circle', color: '#3B82F6' },
    { id: 'premium', label: 'Premium', icon: 'diamond', color: '#8B5CF6' },
  ];

  const renderHeader = () => (
    <View className="mb-4">
      {/* Quick Filters Ribbon */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}
        data={[{ id: 'filters_btn' }, ...FILTERS]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          if (item.id === 'filters_btn') {
            return (
              <TouchableOpacity
                onPress={() => setFilterSheetVisible(true)}
                className="flex-row items-center mr-3 px-3 py-1.5 rounded-full border border-border bg-card shadow-sm"
              >
                <Ionicons name="options" size={16} color={isDark ? '#FFF' : '#000'} style={{ marginRight: 6 }} />
                <Text className="font-bold text-[13px] text-foreground">Filters</Text>
                <Ionicons name="chevron-down" size={14} color={isDark ? '#FFF' : '#000'} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            );
          }

          const isActive = !!activeFilters[item.id];
          return (
            <TouchableOpacity
              onPress={() => handleToggleFilter(item.id)}
              className={`flex-row items-center mr-3 px-3 py-1.5 rounded-full border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-background border-border'}`}
            >
              {item.icon && (
                <Ionicons 
                  name={item.icon as any} 
                  size={16} 
                  color={isActive ? '#c10007' : item.color} 
                  style={{ marginRight: 6 }} 
                />
              )}
              <Text className={`font-semibold text-[13px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                {item.label}
              </Text>
              {isActive && (
                <Ionicons 
                  name="close" 
                  size={14} 
                  color="#c10007" 
                  style={{ marginLeft: 6 }} 
                />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Summary */}
      {!isApiLoading && (
        <View className="px-4 mb-2 flex-row justify-between items-center">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Showing results for {headerTitle}
          </Text>
          <Text className="text-xs text-muted-foreground font-medium">
            {filteredData.length} items
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-card shadow-sm border border-border mr-3"
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground flex-1" numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      <FlatList 
        data={isApiLoading ? [1, 2, 3] : filteredData}
        keyExtractor={(item, index) => isApiLoading ? `skeleton-${index}` : (item as any).id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View className="px-4">
            {isApiLoading ? (
              <SearchResultSkeleton />
            ) : (
              <SearchResultCard business={item as any} />
            )}
          </View>
        )}
        ListEmptyComponent={() => {
          if (isApiLoading) return null;
          return (
            <View className="flex-1 items-center justify-center pt-20">
              <Ionicons name="folder-open-outline" size={64} color="#64748B" style={{ opacity: 0.3 }} />
              <Text className="text-lg font-bold text-foreground mt-4">No businesses found</Text>
              <Text className="text-sm text-muted-foreground mt-2 text-center px-8">
                There are currently no listings in the {headerTitle} category.
              </Text>
            </View>
          );
        }}
      />

      <FilterSheet 
        visible={isFilterSheetVisible} 
        onClose={() => setFilterSheetVisible(false)} 
      />
    </View>
  );
}
