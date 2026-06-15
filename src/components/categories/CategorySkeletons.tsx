import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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

export function CategorySkeletons() {
  return (
    <View className="flex-1 bg-background pt-6">
      
      {/* Trending Skeleton Row */}
      <View className="px-5 mb-6 flex-row">
        {[1, 2, 3].map((i) => (
          <SkeletonPulse key={i} className="w-[160px] h-[140px] rounded-[28px] mr-4" />
        ))}
      </View>

      {/* Recommended Header Skeleton */}
      <View className="px-5 mb-4 mt-6">
        <SkeletonPulse className="w-48 h-6 mb-1" />
        <SkeletonPulse className="w-32 h-4" />
      </View>

      {/* Masonry Grid Skeletons */}
      <View className="flex-row px-5">
        <View className="flex-1 pr-2">
          <SkeletonPulse className="w-full h-[180px] rounded-[28px] mb-4" />
          <SkeletonPulse className="w-full h-[100px] rounded-[28px] mb-4" />
          <SkeletonPulse className="w-full h-[140px] rounded-[28px] mb-4" />
        </View>
        <View className="flex-1 pl-2 pt-8">
          <SkeletonPulse className="w-full h-[140px] rounded-[28px] mb-4" />
          <SkeletonPulse className="w-full h-[180px] rounded-[28px] mb-4" />
          <SkeletonPulse className="w-full h-[100px] rounded-[28px] mb-4" />
        </View>
      </View>

    </View>
  );
}
