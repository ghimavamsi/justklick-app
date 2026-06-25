import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, SharedValue, Extrapolation, withTiming, useSharedValue, Easing, withRepeat } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth-store';
import { useUserStore } from '../../store/user-store';
import { useLocationStore } from '../../store/location-store';
import { LocationSelectorSheet } from '../location/LocationSelectorSheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useNotificationsList } from '../../hooks/useNotifications';

const { width: screenWidth } = Dimensions.get('window');

interface HomeHeaderProps {
  scrollY: SharedValue<number>;
}

export function HomeHeader({ scrollY }: HomeHeaderProps) {
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuthStore();
  const { profile } = useUserStore();
  const { currentLocation, manualLocation } = useLocationStore();
  
  // Get unread notification status
  const { data: notificationsData } = useNotificationsList('All', '');
  const hasUnreadNotifications = (notificationsData?.summary?.unreadCount ?? 0) > 0;

  const [isLocationSelectorVisible, setIsLocationSelectorVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const activeLocation = manualLocation || currentLocation;
  const locationText = activeLocation?.shortAddress || 'Set Location';
  
  const paddingTop = Math.max(insets.top, 20) + 8; // Top padding
  const HEADER_EXPANDED_HEIGHT = Math.max(insets.top, 20) + 120; // Increased to prevent bottom clipping
  const HEADER_COLLAPSED_HEIGHT = Math.max(insets.top, 20) + 75;
  const SCROLL_DISTANCE = 60;

  // Infinite Rotation for Search Bar Border
  const rotation = useSharedValue(0);

  useEffect(() => {
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

  // Header Container Animation
  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT], Extrapolation.CLAMP);
    const shadowOpacity = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, 0.15], Extrapolation.CLAMP);
    return {
      height,
      shadowOpacity,
    };
  });

  // Logo Animation (Fades out and scales down)
  const logoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_DISTANCE / 2], [1, 0], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [1, 0.8], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, -10], Extrapolation.CLAMP);
    
    return {
      opacity,
      transform: [{ scale }, { translateY }],
      // Hide completely when invisible to avoid capturing touches
      zIndex: opacity === 0 ? -1 : 10, 
    };
  });

  // Left Side (Stays big, no scaling needed)
  const leftSideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }, { translateX: 0 }],
    };
  });

  // Right Side (Stays big, no scaling needed)
  const rightSideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }, { translateX: 0 }],
    };
  });

  // Location Pill inner content animation (shrinks text/chevron so it becomes a simple icon)
  const locationTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_DISTANCE / 2], [1, 0], Extrapolation.CLAMP);
    // 80 is roughly the width of the text + chevron
    const width = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [85, 0], Extrapolation.CLAMP);
    const marginLeft = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [6, 0], Extrapolation.CLAMP);
    
    return {
      opacity,
      width,
      marginLeft,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
    };
  });

  // Search Bar Animation (Moves up and shrinks width perfectly into center)
  const searchStyle = useAnimatedStyle(() => {
    // Target Top is paddingTop + 13 so it's perfectly centered in the 70px collapsed row
    const top = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [paddingTop + 60, paddingTop + 13], Extrapolation.CLAMP);
    // Since Location text collapses, left side only takes up ~55px + 20px padding = 75px.
    // Setting target left to 85 gives a perfect 10px gap!
    const left = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [20, 85], Extrapolation.CLAMP);
    const right = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [20, 125], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [50, 44], Extrapolation.CLAMP);
    
    return {
      top,
      left,
      right,
      height,
      position: 'absolute',
    };
  });

  const getInitials = () => {
    if (!isAuthenticated || !profile?.name) return 'G';
    return profile.name.substring(0, 2).toUpperCase();
  };

  const isDark = colorScheme === 'dark';
  const gradientColors = isDark 
    ? ['#1e293b', '#0f172a'] as const // Slate 800 to 900
    : ['#ffffff', '#f1f5f9'] as const; // White to Slate 100

  return (
    <Animated.View 
      className="absolute top-0 w-full z-50 bg-background border-b border-border"
      style={[{
        shadowColor: colorScheme === 'dark' ? '#000' : '#1C398E',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
      }, headerStyle]}
    >
      {/* 
        TOP ROW STATIC ELEMENTS
        Location (Left) and Icons (Right)
      */}
      <View style={{ paddingTop, height: paddingTop + 70, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left: Location Pill */}
        <Animated.View style={leftSideStyle}>
          <TouchableOpacity 
            onPress={() => setIsLocationSelectorVisible(true)}
            className="flex-row items-center justify-center bg-muted/80 px-4 h-11 rounded-full border border-border/50" 
            activeOpacity={0.7} 
            style={{ maxWidth: 200 }}
          >
            <Ionicons name="location" size={24} color="#c10007" />
            <Animated.View style={locationTextStyle}>
              <Text className="text-xs font-extrabold text-foreground" numberOfLines={1}>
                {locationText}
              </Text>
              <View className="ml-1">
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Right: Notification & Avatar */}
        <Animated.View className="flex-row items-center gap-3" style={rightSideStyle}>
          <TouchableOpacity 
            onPress={() => router.push('/notifications')}
            className="w-11 h-11 rounded-full bg-muted items-center justify-center border border-border relative"
          >
            <Ionicons name="notifications-outline" size={22} color={isDark ? '#FFF' : '#000'} />
            {hasUnreadNotifications && (
              <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#c10007]" />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-primary items-center justify-center shadow-sm">
            <Text className="text-primary-foreground font-bold text-base">{getInitials()}</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>

      {/* ANIMATED CENTER LOGO */}
      <Animated.View 
        style={[{ position: 'absolute', top: paddingTop + 18, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }, logoStyle]}
        pointerEvents="none"
      >
        <Text className="text-3xl font-extrabold tracking-tight text-primary">
          Just<Text className="text-[#c10007]">Klick</Text>
        </Text>
      </Animated.View>

      {/* ANIMATED SEARCH BAR */}
      <Animated.View style={[searchStyle, {
        shadowColor: isDark ? '#c10007' : '#1C398E', // Themed elegant shadow
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      }]}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={{ flex: 1, borderRadius: 999 }}
          onPress={() => router.push('/(tabs)/search')}
        >
          {/* Gradient Border Wrapper */}
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
                  top: -screenWidth / 2 + 24, // Center vertically
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
              <Ionicons name="search" size={20} color={isDark ? '#94a3b8' : '#64748B'} />
              
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: isDark ? '#cbd5e1' : '#64748B', fontSize: 12, fontWeight: '600', letterSpacing: 0.2 }} numberOfLines={1}>
                  Search businesses, restaurants and more...
                </Text>
              </View>


            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <LocationSelectorSheet 
        visible={isLocationSelectorVisible} 
        onClose={() => setIsLocationSelectorVisible(false)} 
      />
    </Animated.View>
  );
}
