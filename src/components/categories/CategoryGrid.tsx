import React from 'react';
import { View } from 'react-native';
import { ExploreCategory } from '../../types/category.types';
import { CategoryPremiumCard } from './CategoryPremiumCard';

interface CategoryGridProps {
  categories: ExploreCategory[];
  onCategoryPress: (category: ExploreCategory) => void;
}

export function CategoryGrid({ categories, onCategoryPress }: CategoryGridProps) {
  // Split categories into two columns to create a masonry-like editorial layout
  const leftColumn: ExploreCategory[] = [];
  const rightColumn: ExploreCategory[] = [];

  categories.forEach((category, index) => {
    if (index % 2 === 0) {
      leftColumn.push(category);
    } else {
      rightColumn.push(category);
    }
  });

  return (
    <View className="flex-row px-5 mt-2">
      {/* Left Column */}
      <View className="flex-1 pr-2">
        {leftColumn.map((category) => (
          <CategoryPremiumCard 
            key={category.id} 
            category={category} 
            onPress={onCategoryPress} 
          />
        ))}
      </View>
      
      {/* Right Column */}
      <View className="flex-1 pl-2 pt-8">
        {rightColumn.map((category) => (
          <CategoryPremiumCard 
            key={category.id} 
            category={category} 
            onPress={onCategoryPress} 
          />
        ))}
      </View>
    </View>
  );
}
