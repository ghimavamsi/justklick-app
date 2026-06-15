import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export function ProfileSkeletons() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="flex-1 px-6 pt-6">
      {/* Header Skeleton */}
      <View className="items-center mb-8">
        <Animated.View style={animatedStyle} className="w-24 h-24 rounded-full bg-muted mb-4" />
        <Animated.View style={animatedStyle} className="w-48 h-6 bg-muted rounded-md mb-2" />
        <Animated.View style={animatedStyle} className="w-32 h-4 bg-muted rounded-md" />
      </View>

      {/* Completion Card Skeleton */}
      <Animated.View style={animatedStyle} className="w-full h-32 bg-muted rounded-[24px] mb-8" />

      {/* Stats Grid Skeleton */}
      <View className="flex-row flex-wrap justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Animated.View key={i} style={animatedStyle} className="w-[48%] h-24 bg-muted rounded-2xl mb-4" />
        ))}
      </View>

      {/* Settings Rows Skeleton */}
      <View className="w-full bg-card rounded-[24px] p-2 border border-border">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row items-center p-4 border-b border-border last:border-b-0">
            <Animated.View style={animatedStyle} className="w-8 h-8 bg-muted rounded-full mr-4" />
            <Animated.View style={animatedStyle} className="flex-1 h-4 bg-muted rounded-md" />
          </View>
        ))}
      </View>
    </View>
  );
}
