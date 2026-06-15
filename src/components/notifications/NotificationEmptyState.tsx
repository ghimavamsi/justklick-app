import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export function NotificationEmptyState({ isSearch }: { isSearch?: boolean }) {
  const router = useRouter();

  return (
    <Animated.View 
      entering={FadeInUp.duration(400).springify()} 
      className="flex-1 items-center justify-center pt-20 px-10"
    >
      <View className="w-32 h-32 bg-muted rounded-full items-center justify-center mb-6 border border-border/50 shadow-sm relative">
        <View className="absolute inset-0 bg-primary/5 rounded-full" />
        <Ionicons name={isSearch ? "search-outline" : "notifications-off-outline"} size={48} color="#94A3B8" />
        
        {!isSearch && (
          <View className="absolute top-4 right-4 w-8 h-8 bg-background rounded-full items-center justify-center border border-border shadow-sm">
            <Ionicons name="checkmark" size={16} color="#10B981" />
          </View>
        )}
      </View>
      
      <Text className="text-2xl font-extrabold text-foreground mb-3 text-center tracking-tight">
        {isSearch ? "No Notifications Found" : "You're All Caught Up"}
      </Text>
      
      <Text className="text-base text-muted-foreground text-center font-medium leading-relaxed mb-8">
        {isSearch 
          ? "We couldn't find any notifications matching your search." 
          : "We'll notify you when something interesting happens nearby."}
      </Text>

      {!isSearch && (
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/search')}
          className="bg-[#1C398E] dark:bg-blue-600 px-6 py-3.5 rounded-full shadow-md flex-row items-center"
        >
          <Ionicons name="compass" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">Explore Businesses</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
