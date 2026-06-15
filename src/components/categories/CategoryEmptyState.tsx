import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function CategoryEmptyState({ query }: { query: string }) {
  return (
    <Animated.View 
      entering={FadeInUp.duration(400).springify()} 
      className="flex-1 items-center justify-center pt-20 px-10"
    >
      <View className="w-32 h-32 bg-muted rounded-full items-center justify-center mb-6 border border-border/50 shadow-sm">
        <View className="absolute inset-0 bg-primary/10 rounded-full" />
        <Ionicons name="search-outline" size={48} color="#94A3B8" />
        <View className="absolute top-4 right-4 w-6 h-6 bg-rose-500 rounded-full items-center justify-center border-2 border-background">
          <Ionicons name="close" size={14} color="#FFF" />
        </View>
      </View>
      
      <Text className="text-2xl font-extrabold text-foreground mb-3 text-center tracking-tight">
        No Categories Found
      </Text>
      
      <Text className="text-base text-muted-foreground text-center font-medium leading-relaxed">
        We couldn't find any categories matching "{query}". Try adjusting your search term to discover businesses near you.
      </Text>
    </Animated.View>
  );
}
