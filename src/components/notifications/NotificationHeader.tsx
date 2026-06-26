import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Animated, { interpolate, Extrapolation, useAnimatedStyle, SharedValue, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';
import { useMarkAllNotificationsRead } from '../../hooks/useNotifications';

const { width: screenWidth } = Dimensions.get('window');

interface NotificationHeaderProps {
  scrollY: SharedValue<number>;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}

export function NotificationHeader({ scrollY, searchQuery, setSearchQuery }: NotificationHeaderProps) {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  const isDark = colorScheme === 'dark';

  // Infinite Rotation for Search Bar Border
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const rotatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Animation values for collapsing the header
  const headerHeight = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [180, 130],
      Extrapolation.CLAMP
    );
    return { height: height + insets.top };
  });

  const subtitleOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 60],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const titleScale = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.85],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }, { translateX }] };
  });

  const searchTransform = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -10],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View 
      className="bg-background z-50 shadow-sm border-b border-border/30 overflow-hidden" 
      style={[{ paddingTop: insets.top }, headerHeight]}
    >
      <View className="flex-1 px-5 pt-2 relative">
        {/* Top Nav Row */}
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border/50"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => markAllRead()}
              className="px-3 h-10 rounded-full bg-muted items-center justify-center border border-border/50"
            >
              <Text className="text-xs font-bold text-primary">Mark all read</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Area */}
        <View className="flex-row items-end justify-between mb-4">
          <Animated.View style={titleScale} className="flex-1">
            <Text className="text-3xl font-extrabold text-foreground tracking-tight">Notifications</Text>
            <Animated.Text style={subtitleOpacity} className="text-sm text-muted-foreground font-medium mt-1 pr-4" numberOfLines={2}>
              Stay updated with businesses, offers, reviews, and recommendations.
            </Animated.Text>
          </Animated.View>
        </View>

        {/* Spinning Search Input */}
        <Animated.View style={[searchTransform, {
          shadowColor: isDark ? '#c10007' : '#1C398E',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }]} className="absolute bottom-4 left-5 right-5 h-[44px]">
          <View 
            style={{ 
              flex: 1, 
              borderRadius: 999, 
              overflow: 'hidden', 
              padding: 1.5,
              position: 'relative',
              justifyContent: 'center',
            }}
          >
            {/* Spinning Gradient Background Layer */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: screenWidth * 2,
                  height: screenWidth * 2,
                  left: -screenWidth / 2,
                  top: -screenWidth / 2 + 22,
                },
                rotatingStyle,
              ]}
            >
              <LinearGradient
                colors={['#c10007', '#1C398E', '#c10007']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </Animated.View>

            {/* Inner Background Gradient (The actual search bar) */}
            <LinearGradient
              colors={isDark ? ['#1e293b', '#0f172a'] : ['#ffffff', '#f8fafc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 999 }}
            >
              <Ionicons name="search" size={20} color={isDark ? '#94a3b8' : '#64748B'} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search notifications..."
                placeholderTextColor="#94A3B8"
                style={{ color: isDark ? '#cbd5e1' : '#64748B', fontSize: 13, fontWeight: '600', letterSpacing: 0.2, flex: 1, height: '100%' }}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1 bg-muted rounded-full ml-2">
                  <Ionicons name="close" size={14} color="#64748B" />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        </Animated.View>

      </View>
    </Animated.View>
  );
}
