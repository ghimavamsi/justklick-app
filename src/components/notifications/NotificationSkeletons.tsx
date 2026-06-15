import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

function SkeletonPulse({ style, className }: { style?: any, className?: string }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={`bg-muted rounded-md ${className}`} />
  );
}

export function NotificationSkeletons() {
  return (
    <View className="flex-1 bg-background pt-4">
      {/* Summary Card Skeleton */}
      <View className="px-5 mb-6">
        <SkeletonPulse className="w-full h-[88px] rounded-2xl" />
      </View>

      {/* Chips Skeleton */}
      <View className="px-5 mb-6 flex-row">
        <SkeletonPulse className="w-16 h-10 rounded-full mr-3" />
        <SkeletonPulse className="w-24 h-10 rounded-full mr-3" />
        <SkeletonPulse className="w-20 h-10 rounded-full mr-3" />
        <SkeletonPulse className="w-28 h-10 rounded-full mr-3" />
      </View>

      {/* Notification Rows Skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} className="px-5 py-4 border-b border-border/40 flex-row items-start">
          <SkeletonPulse className="w-14 h-14 rounded-full mr-4" />
          <View className="flex-1 justify-center pt-1">
            <SkeletonPulse className="w-3/4 h-5 mb-2" />
            <SkeletonPulse className="w-full h-4 mb-1" />
            <SkeletonPulse className="w-2/3 h-4 mb-3" />
            <SkeletonPulse className="w-16 h-3" />
          </View>
        </View>
      ))}
    </View>
  );
}
