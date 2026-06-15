import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

export function BusinessDetailsSkeleton() {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bgClass = isDark ? 'bg-slate-800' : 'bg-slate-200';

  return (
    <View className="flex-1 bg-background">
      {/* Header Overlay Skeleton */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top || 44, height: (insets.top || 44) + 60 }}
      >
        <Animated.View style={animatedStyle} className={`w-10 h-10 rounded-full ${bgClass}`} />
        <View className="flex-row">
          <Animated.View style={animatedStyle} className={`w-10 h-10 rounded-full ${bgClass} mr-3`} />
          <Animated.View style={animatedStyle} className={`w-10 h-10 rounded-full ${bgClass}`} />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Gallery Skeleton */}
        <Animated.View style={[animatedStyle, { height: width }]} className={`w-full ${bgClass}`} />

        {/* Overview Card Skeleton */}
        <View className="-mt-8 mx-4 bg-card rounded-[32px] p-6 border border-border shadow-sm">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <Animated.View style={animatedStyle} className={`h-8 w-3/4 rounded-lg ${bgClass} mb-2`} />
              <Animated.View style={animatedStyle} className={`h-4 w-1/2 rounded-lg ${bgClass}`} />
            </View>
            <Animated.View style={animatedStyle} className={`w-12 h-12 rounded-full ${bgClass}`} />
          </View>
          
          <Animated.View style={animatedStyle} className={`h-16 w-full rounded-2xl ${bgClass} mt-2`} />
        </View>

        {/* Quick Actions Skeleton */}
        <View className="flex-row justify-between px-6 mt-6">
          {[1, 2, 3, 4].map(i => (
            <Animated.View key={i} style={animatedStyle} className={`w-16 h-16 rounded-2xl ${bgClass}`} />
          ))}
        </View>

        {/* Info Section Skeleton */}
        <View className="px-6 mt-8 mb-6">
          <Animated.View style={animatedStyle} className={`h-6 w-1/3 rounded-lg ${bgClass} mb-4`} />
          <Animated.View style={animatedStyle} className={`h-4 w-full rounded-lg ${bgClass} mb-2`} />
          <Animated.View style={animatedStyle} className={`h-4 w-full rounded-lg ${bgClass} mb-2`} />
          <Animated.View style={animatedStyle} className={`h-4 w-3/4 rounded-lg ${bgClass}`} />
        </View>

        {/* Services Chips Skeleton */}
        <View className="px-6 mt-4 mb-6">
          <Animated.View style={animatedStyle} className={`h-6 w-1/4 rounded-lg ${bgClass} mb-4`} />
          <View className="flex-row flex-wrap">
            {[1, 2, 3, 4, 5].map(i => (
              <Animated.View key={i} style={animatedStyle} className={`h-10 w-24 rounded-full ${bgClass} mr-3 mb-3`} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
