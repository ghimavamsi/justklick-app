import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Category } from '../../types/home.types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import { useSearchStore } from '../../store/search-store';

interface TrendingCategoriesProps {
  categories: Category[];
}

export function TrendingCategories({ categories }: TrendingCategoriesProps) {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { setQuery, setPhase } = useSearchStore();
  
  if (!categories || categories.length === 0) return null;

  const handleCategoryPress = (categoryName: string) => {
    setQuery(categoryName);
    setPhase('results');
    router.push('/(tabs)/search');
  };

  return (
    <View className="py-5 px-5">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-extrabold text-foreground tracking-tight">Trending Categories</Text>
      </View>
      
      <View className="flex-row flex-wrap justify-between">
        {categories.map((cat, idx) => (
          <TouchableOpacity 
            key={cat.id} 
            className="w-[48%] bg-card p-4 rounded-3xl mb-4 border border-border/50 shadow-sm"
            activeOpacity={0.8}
            onPress={() => handleCategoryPress(cat.name)}
            style={{
              shadowColor: colorScheme === 'dark' ? '#000' : cat.color,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-3 ${cat.bgColor}`}>
              {cat.iconName && (cat.iconName.startsWith('http') || cat.iconName.startsWith('/')) ? (
                <Image 
                  source={{ uri: cat.iconName }} 
                  style={{ width: 26, height: 26 }} 
                  resizeMode="contain" 
                />
              ) : (
                <Ionicons name={(cat.iconName || 'grid-outline') as any} size={24} color={cat.color} />
              )}
            </View>
            <Text className="text-sm font-bold text-foreground mb-1">{cat.name}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[10px] font-bold text-muted-foreground mr-1 uppercase tracking-wider">Explore</Text>
              <Ionicons name="chevron-forward" size={10} color="#64748B" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
