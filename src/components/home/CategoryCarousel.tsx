import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/home.types';

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      className="w-20 items-center justify-start mr-3"
      activeOpacity={0.7}
    >
      <View className={`w-16 h-16 rounded-3xl items-center justify-center mb-3 border border-border/50 ${item.bgColor}`}>
        <Ionicons name={item.iconName as any} size={28} color={item.color} />
      </View>
      <Text className="text-[11px] font-bold text-foreground text-center tracking-tight" numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="py-2">
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}
