import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NotificationCategory } from '../../types/notification.types';
import { useTheme } from '../../hooks/useTheme';

interface NotificationCategoryChipsProps {
  categories: NotificationCategory[];
  activeCategory: NotificationCategory;
  onSelectCategory: (category: NotificationCategory) => void;
}

export function NotificationCategoryChips({ categories, activeCategory, onSelectCategory }: NotificationCategoryChipsProps) {
  const { colorScheme } = useTheme();
  
  return (
    <View className="mb-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              className={`mr-3 px-5 py-2.5 rounded-full border ${
                isActive 
                  ? 'bg-primary border-primary' 
                  : 'bg-card border-border/50'
              }`}
            >
              <Text 
                className={`font-bold text-sm ${
                  isActive ? 'text-primary-foreground' : 'text-foreground'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
