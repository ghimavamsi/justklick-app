import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export function FavoritesSkeleton() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bgClass = isDark ? 'bg-muted' : 'bg-muted/50';

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View className="px-6 pt-8 pb-4">
        <Animated.View style={animatedStyle} className={`w-40 h-8 rounded-md mb-2 ${bgClass}`} />
        <Animated.View style={animatedStyle} className={`w-64 h-4 rounded-md ${bgClass}`} />
      </View>

      {/* Stats Skeleton */}
      <View className="px-6 py-4 flex-row justify-between">
        <Animated.View style={animatedStyle} className={`w-[48%] h-24 rounded-[20px] ${bgClass}`} />
        <Animated.View style={animatedStyle} className={`w-[48%] h-24 rounded-[20px] ${bgClass}`} />
      </View>

      {/* Search Skeleton */}
      <View className="px-6 py-2">
        <Animated.View style={animatedStyle} className={`w-full h-12 rounded-[16px] ${bgClass}`} />
      </View>

      {/* Cards Skeleton */}
      <View className="px-6 py-6 gap-y-4">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className={`w-full bg-card rounded-[24px] border border-border p-4 shadow-sm overflow-hidden`}>
            <View className="flex-row">
              {/* Image Skeleton */}
              <Animated.View style={animatedStyle} className={`w-24 h-24 rounded-[16px] mr-4 ${bgClass}`} />
              
              <View className="flex-1 py-1 justify-between">
                <View>
                  <Animated.View style={animatedStyle} className={`w-32 h-5 rounded-md mb-2 ${bgClass}`} />
                  <Animated.View style={animatedStyle} className={`w-20 h-4 rounded-md mb-3 ${bgClass}`} />
                </View>
                <View className="flex-row items-center justify-between">
                  <Animated.View style={animatedStyle} className={`w-16 h-4 rounded-md ${bgClass}`} />
                  <Animated.View style={animatedStyle} className={`w-12 h-4 rounded-md ${bgClass}`} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
