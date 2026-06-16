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

export function HomeSkeletons() {
  return (
    <View className="flex-1 bg-background">
      
      {/* HeroSearch Skeleton */}
      <View className="px-5 pt-3 pb-3 flex-row">
        {[1, 2, 3, 4].map(i => (
          <SkeletonPulse key={i} className="w-24 h-8 rounded-full mr-2" />
        ))}
      </View>

      {/* CategoryCarousel Skeleton */}
      <View className="py-2 px-5 flex-row overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} className="w-[76px] items-center mr-4">
            <SkeletonPulse className="w-16 h-16 rounded-3xl mb-3" />
            <SkeletonPulse className="w-12 h-3" />
          </View>
        ))}
      </View>

      {/* PromoBannerCarousel Skeleton */}
      <View className="py-6 px-5 items-center">
        <SkeletonPulse className="w-full h-[180px] rounded-3xl" />
        <View className="flex-row justify-center mt-4">
          <SkeletonPulse className="w-5 h-1.5 rounded-full mx-1" />
          <SkeletonPulse className="w-1.5 h-1.5 rounded-full mx-1" />
          <SkeletonPulse className="w-1.5 h-1.5 rounded-full mx-1" />
        </View>
      </View>

      {/* BusinessSection Skeleton (Featured) */}
      <View className="py-5">
        <View className="px-5 mb-4">
          <SkeletonPulse className="w-48 h-6 mb-2" />
          <SkeletonPulse className="w-32 h-4" />
        </View>
        <View className="flex-row pl-5 overflow-hidden">
          {[1, 2].map(i => (
            <View 
              key={i} 
              className="mr-5 mb-4 bg-card rounded-3xl overflow-hidden border border-border/50" 
              style={{ width: width * 0.75 }}
            >
              <SkeletonPulse className="w-full h-[160px] rounded-none" />
              <View className="p-4">
                <View className="flex-row justify-between mb-2">
                  <SkeletonPulse className="w-20 h-3" />
                  <SkeletonPulse className="w-12 h-3" />
                </View>
                <SkeletonPulse className="w-48 h-5 mb-4" />
                <View className="flex-row mt-auto">
                  <SkeletonPulse className="w-10 h-4 mr-2" />
                  <SkeletonPulse className="w-20 h-4" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* BusinessSection Skeleton (Premium) */}
      <View className="py-5">
        <View className="px-5 mb-4">
          <SkeletonPulse className="w-40 h-6 mb-2" />
        </View>
        <View className="flex-row pl-5 overflow-hidden">
          {[1, 2].map(i => (
            <View 
              key={i} 
              className="mr-5 mb-4 bg-card rounded-3xl overflow-hidden border border-border/50" 
              style={{ width: width * 0.75 }}
            >
              <SkeletonPulse className="w-full h-[160px] rounded-none" />
              <View className="p-4">
                <SkeletonPulse className="w-48 h-5 mb-4" />
                <SkeletonPulse className="w-24 h-4" />
              </View>
            </View>
          ))}
        </View>
      </View>

    </View>
  );
}
