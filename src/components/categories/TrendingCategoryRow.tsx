import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ExploreCategory } from '../../types/category.types';
import { CategoryPremiumCard } from './CategoryPremiumCard';
import { Ionicons } from '@expo/vector-icons';

interface TrendingCategoryRowProps {
  title: string;
  categories: ExploreCategory[];
  onCategoryPress: (category: ExploreCategory) => void;
}

export function TrendingCategoryRow({ title, categories, onCategoryPress }: TrendingCategoryRowProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <View className="py-6">
      <View className="px-5 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons name="flame" size={20} color="#F43F5E" style={{ marginRight: 8 }} />
          <Text className="text-xl font-extrabold text-foreground tracking-tight">{title}</Text>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ width: 160, marginRight: 16 }}>
            <CategoryPremiumCard 
              category={{ ...item, cardSize: 'medium' }} 
              onPress={onCategoryPress} 
              style={{ marginBottom: 0 }} // Override the default mb-4 for horizontal lists
            />
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 4, paddingBottom: 20 }}
      />
    </View>
  );
}
