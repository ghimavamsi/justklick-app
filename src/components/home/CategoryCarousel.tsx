import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/home.types';
import { useTheme } from '../../hooks/useTheme';

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const renderItem = ({ item }: { item: Category }) => {
    // In dark mode, we use a stronger opacity (33 in hex = ~20%) to make the color pop against black.
    // In light mode, we use a softer opacity (15 in hex = ~8%).
    const dynamicBgColor = item.color + (isDark ? '33' : '15');
    
    return (
      <TouchableOpacity 
        className="items-center justify-start mr-4"
        style={{ minWidth: 76, maxWidth: 110 }}
        activeOpacity={0.7}
      >
        <View 
          className="w-16 h-16 rounded-3xl items-center justify-center mb-3 border"
          style={{ 
            backgroundColor: dynamicBgColor,
            borderColor: isDark ? item.color + '40' : item.color + '20' 
          }}
        >
          <Ionicons name={item.iconName as any} size={28} color={isDark ? '#FFF' : item.color} />
        </View>
        <Text className="text-[11px] font-bold text-foreground text-center tracking-tight" numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="py-2 mb-2">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text className="text-xl font-extrabold text-foreground tracking-tight">Explore</Text>
        <TouchableOpacity onPress={() => router.push('/categories' as any)}>
          <Text className="text-sm font-bold text-primary">View All</Text>
        </TouchableOpacity>
      </View>
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
