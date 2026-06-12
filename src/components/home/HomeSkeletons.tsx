import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

function SkeletonPulse({ style, className }: { style?: any, className?: string }) {
  const { colorScheme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bgClass = colorScheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200';

  return (
    <Animated.View style={[animatedStyle, style]} className={`${bgClass} rounded-md ${className}`} />
  );
}

export function HomeSkeletons() {
  return (
    <View className="flex-1 bg-background pt-4">
      {/* Search Skeleton */}
      <View className="px-5 mb-8">
        <SkeletonPulse className="w-full h-14 rounded-2xl" />
        <View className="flex-row mt-4">
          {[1, 2, 3].map(i => <SkeletonPulse key={i} className="w-20 h-8 rounded-full mr-2" />)}
        </View>
      </View>

      {/* Categories Skeleton */}
      <View className="flex-row px-5 mb-8 overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <View key={i} className="items-center mr-6">
            <SkeletonPulse className="w-16 h-16 rounded-3xl mb-2" />
            <SkeletonPulse className="w-12 h-3" />
          </View>
        ))}
      </View>

      {/* Banner Skeleton */}
      <View className="px-5 mb-8">
        <SkeletonPulse className="w-full h-44 rounded-3xl" />
      </View>

      {/* Business Section Skeleton */}
      <View className="px-5 mb-8">
        <SkeletonPulse className="w-48 h-6 mb-4" />
        <View className="flex-row">
          {[1, 2].map(i => (
            <View key={i} className="mr-5 border border-border/20 rounded-3xl overflow-hidden" style={{ width: width * 0.75 }}>
              <SkeletonPulse className="w-full h-40" />
              <View className="p-4">
                <SkeletonPulse className="w-24 h-3 mb-3" />
                <SkeletonPulse className="w-48 h-5 mb-4" />
                <SkeletonPulse className="w-32 h-4" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
