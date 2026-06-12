import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export function Skeleton({ style, className }: SkeletonProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={className}
      style={[
        { backgroundColor: isDark ? '#334155' : '#E2E8F0', borderRadius: 8 },
        animatedStyle,
        style,
      ]}
    />
  );
}
