import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, useToggleFavorite } from '../../hooks/useFavorites';
import { FavoritesSkeleton } from './FavoritesSkeleton';
import { FavoriteBusinessCard } from './FavoriteBusinessCard';
import { FavoritesSortSheet } from './FavoritesSortSheet';
import { useTheme } from '../../hooks/useTheme';
import { Business } from '../../types/home.types';

export function FavoritesAuthView() {
  const { data: favorites, isLoading, refetch, isRefetching } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);

  // Derive categories from favorites
  const categories = useMemo(() => {
    if (!favorites) return [];
    const catSet = new Set(favorites.map(f => f.category));
    return ['All', ...Array.from(catSet)];
  }, [favorites]);

  const filteredData = useMemo(() => {
    if (!favorites) return [];
    let result = [...favorites];
    
    // Sort
    if (sortBy === 'highest_rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'nearest') {
      // Mock nearest sorting by just grouping businesses with distanceStr
      result.sort((a, b) => (a.distanceStr ? 0 : 1) - (b.distanceStr ? 0 : 1));
    }
    // 'newest' is default from API

    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(f => f.category === selectedCategory);
    }
    
    if (searchQuery.trim() !== '') {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(lowerQ) || 
        f.category.toLowerCase().includes(lowerQ)
      );
    }
    
    return result;
  }, [favorites, searchQuery, selectedCategory, sortBy]);

  const handleRemove = (id: string) => {
    const business = favorites?.find(b => b.id === id);
    if (business) {
      toggleFavorite({ business, isCurrentlyFavorite: true });
    }
  };

  if (isLoading) return <FavoritesSkeleton />;

  if (!favorites || favorites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 bg-background">
        <View className="w-48 h-48 rounded-full bg-primary/10 items-center justify-center mb-8 border-[8px] border-background shadow-sm">
          <Ionicons name="heart-outline" size={64} color="#1C398E" />
        </View>
        <Text className="text-2xl font-bold text-foreground text-center mb-3">
          Your Collection is Empty
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-8">
          Start exploring JustKlick and save businesses you love.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-8 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-3xl font-extrabold text-foreground mb-1">Favorites</Text>
            <Text className="text-sm text-muted-foreground font-medium">
              {favorites.length} saved {favorites.length === 1 ? 'business' : 'businesses'}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setIsSortSheetVisible(true)}
            className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border"
          >
            <Ionicons name="options-outline" size={20} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-muted/50 rounded-[16px] px-4 h-12 border border-border">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search favorites..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-2 text-foreground font-medium text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 px-6">
        {filteredData.length === 0 ? (
          <ScrollView 
            contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={isDark ? "#FFF" : "#000"} />}
          >
            <Text className="text-lg font-bold text-foreground">No matches found</Text>
            <Text className="text-muted-foreground text-sm mt-2">Try a different search term</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={isDark ? "#FFF" : "#000"} />}
            renderItem={({ item, index }: { item: Business; index: number }) => (
              <FavoriteBusinessCard 
                business={item} 
                index={index} 
                onRemove={handleRemove} 
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          />
        )}
      </View>

      <FavoritesSortSheet
        visible={isSortSheetVisible}
        onClose={() => setIsSortSheetVisible(false)}
        currentSort={sortBy}
        onSortChange={setSortBy}
      />
    </View>
  );
}
