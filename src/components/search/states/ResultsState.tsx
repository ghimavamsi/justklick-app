import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchStore } from '../../../store/search-store';
import { MOCK_NEARBY_DATA, SUBCATEGORIES, FILTERS, MOCK_SEARCH_BANNERS } from '../../../api/mock/search.mock';
import { SearchResultCard } from '../SearchResultCard';
import { SearchResultSkeleton } from '../SearchResultSkeleton';
import { FilterSheet } from '../FilterSheet';
import { useTheme } from '../../../hooks/useTheme';

const { width } = Dimensions.get('window');

export function ResultsState() {
  const { query, activeSubcategory, setActiveSubcategory, activeFilters, setFilter } = useSearchStore();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);

  // Trigger loading state on query or filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1-second simulated network delay
    return () => clearTimeout(timer);
  }, [query, activeSubcategory, activeFilters]);

  const matchingKey = Object.keys(SUBCATEGORIES).find(key => query.toLowerCase().includes(key));
  const availableSubcategories = matchingKey ? SUBCATEGORIES[matchingKey] : [];

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
    let data = MOCK_NEARBY_DATA;

    if (query) {
      const q = query.toLowerCase();
      data = data.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q) ||
        b.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (activeSubcategory) {
      data = data.filter(b => b.tags?.includes(activeSubcategory));
    }

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
  }, [query, activeSubcategory, activeFilters]);

  const bannerListRef = useRef<FlatList>(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (MOCK_SEARCH_BANNERS.length === 0) return;
    
    const interval = setInterval(() => {
      let nextIndex = activeBannerIndex + 1;
      if (nextIndex >= MOCK_SEARCH_BANNERS.length) {
        nextIndex = 0;
      }
      bannerListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveBannerIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBannerIndex]);

  const renderHeaders = () => (
    <View className="mb-4">
      
      {/* Promotional Banners */}
      <View className="mb-4 mt-2">
        <FlatList
          ref={bannerListRef}
          data={MOCK_SEARCH_BANNERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              bannerListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveBannerIndex(index);
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width, paddingHorizontal: 16 }}>
              <TouchableOpacity activeOpacity={0.9} className="rounded-2xl overflow-hidden shadow-sm w-full bg-muted" style={{ height: 140 }}>
                <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 16 }}
                >
                  <Text className="text-white font-extrabold text-xl shadow-sm">{item.title}</Text>
                </LinearGradient>
                
                <View className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded border border-white/20">
                  <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Sponsored</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Subcategories Ribbon */}
      {availableSubcategories.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        >
          {availableSubcategories.map((subcatObj) => {
            const subcat = subcatObj.name;
            const iconName = subcatObj.icon;
            const iconColor = subcatObj.color;
            const isActive = activeSubcategory === subcat;
            return (
              <TouchableOpacity
                key={subcat}
                onPress={() => setActiveSubcategory(isActive ? null : subcat)}
                className={`mr-3 px-3 py-1.5 rounded-full border flex-row items-center self-start ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-background border-border shadow-sm'}`}
              >
                <Ionicons name={iconName as any} size={16} color={isActive ? '#c10007' : iconColor} style={{ marginRight: 6 }} />
                <Text className={`font-semibold text-[13px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                  {subcat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Quick Filters & Sorting Ribbon */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      >
        {/* Main Filter Dropdown Toggle */}
        <TouchableOpacity
          onPress={() => setFilterSheetVisible(true)}
          className="flex-row items-center mr-3 px-3 py-1.5 rounded-full border border-border bg-card shadow-sm"
        >
          <Ionicons name="options" size={16} color={isDark ? '#FFF' : '#000'} style={{ marginRight: 6 }} />
          <Text className="font-bold text-[13px] text-foreground">Filters</Text>
          <Ionicons name="chevron-down" size={14} color={isDark ? '#FFF' : '#000'} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        {FILTERS.map((filter) => {
          const isActive = !!activeFilters[filter.id];
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => handleToggleFilter(filter.id)}
              className={`flex-row items-center mr-3 px-3 py-1.5 rounded-full border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-background border-border'}`}
            >
              {filter.icon && (
                <Ionicons 
                  name={filter.icon as any} 
                  size={16} 
                  color={isActive ? '#c10007' : filter.color} 
                  style={{ marginRight: 6 }} 
                />
              )}
              <Text className={`font-semibold text-[13px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                {filter.label}
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
        })}
      </ScrollView>

      {/* Search Result Summary Header */}
      {!isLoading && (
        <View className="px-4 mb-2 mt-2 flex-row justify-between items-center">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Showing results for your search
          </Text>
          <Text className="text-xs text-muted-foreground font-medium">
            {filteredData.length} items
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList 
        data={isLoading ? ([1, 2, 3] as any[]) : filteredData}
        keyExtractor={(item, index) => isLoading ? `skeleton-${index}` : item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaders}
        renderItem={({ item }) => (
          <View className="px-4">
            {isLoading ? (
              <SearchResultSkeleton />
            ) : (
              <SearchResultCard business={item} />
            )}
          </View>
        )}
        ListEmptyComponent={() => {
          if (isLoading) return null;
          return (
            <View className="flex-1 items-center justify-center pt-20">
              <Ionicons name="search-outline" size={64} color="#64748B" style={{ opacity: 0.3 }} />
              <Text className="text-lg font-bold text-foreground mt-4">No exact matches</Text>
              <Text className="text-sm text-muted-foreground mt-2 text-center px-8">
                Try adjusting your filters or searching for something else to find premium businesses.
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
