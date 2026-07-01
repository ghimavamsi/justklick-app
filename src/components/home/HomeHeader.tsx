import React, { useState, useEffect, useRef } from 'react';
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
  const isNavigating = useRef(false);

  const handleNavigation = (path: any) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.push(path);
    setTimeout(() => {
      isNavigating.current = false;
    }, 500); // 500ms debounce
  };

  
  const activeLocation = manualLocation || currentLocation;
  const locationText = activeLocation?.shortAddress || 'Set Location';
  
  const paddingTop = Math.max(insets.top, 20) + 8; // Top padding
  const HEADER_EXPANDED_HEIGHT = Math.max(insets.top, 20) + 115; // Adjusted for tighter layout
  const HEADER_COLLAPSED_HEIGHT = Math.max(insets.top, 20) + 60; // Tighter top row
  const SCROLL_DISTANCE = 50;

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
    const translateY = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, -5], Extrapolation.CLAMP);
    
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
    const marginLeft = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [4, 0], Extrapolation.CLAMP);
    
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
    // Target Top is perfectly centered in the 60px collapsed row
    const top = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [paddingTop + 55, paddingTop + 8], Extrapolation.CLAMP);
    // Left constraint: Collapsed location pill is just an icon, taking ~40px + 20px padding = 60px. Left=68 gives a perfect 8px gap.
    const left = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [20, 68], Extrapolation.CLAMP);
    // Right constraint: Two 36px icons + 8px gap = 80px + 20px padding = 100px. Right=108 gives a perfect 8px gap.
    const right = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [20, 108], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [50, 44], Extrapolation.CLAMP);
    
    return {
      top,
      left,
      right,
      height,
      position: 'absolute',
    };
  });


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
      <View style={{ paddingTop, height: paddingTop + 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left: Location Pill (Takes maximum 35% of screen width to never overlap center) */}
        <Animated.View style={[leftSideStyle, { maxWidth: screenWidth * 0.35 }]}>
          <TouchableOpacity 
            onPress={() => setIsLocationSelectorVisible(true)}
            className="flex-row items-center justify-center bg-muted/80 px-2.5 h-9 rounded-full border border-border/50" 
            activeOpacity={0.7} 
          >
            <Ionicons name="location" size={18} color="#c10007" />
            <Animated.View style={locationTextStyle}>
              <Text className="text-[11px] font-extrabold text-foreground" numberOfLines={1}>
                {locationText}
              </Text>
              <View className="ml-0.5">
                <Ionicons name="chevron-down" size={14} color="#64748B" />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Right: Notification & Avatar (Takes maximum 35% of screen width) */}
        <Animated.View className="flex-row items-center gap-2" style={[rightSideStyle, { maxWidth: screenWidth * 0.35, justifyContent: 'flex-end' }]}>
          <TouchableOpacity 
            onPress={() => handleNavigation('/notifications')}
            className="w-9 h-9 rounded-full bg-muted items-center justify-center border border-border relative"
          >
            <Ionicons name="notifications-outline" size={20} color={isDark ? '#FFF' : '#000'} />
            {hasUnreadNotifications && (
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c10007]" />
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleNavigation('/(tabs)/profile')}
            className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center border border-primary/20 shadow-sm"
          >
            <Ionicons name="person" size={18} color="#1C398E" />
          </TouchableOpacity>
        </Animated.View>

      </View>

      {/* ANIMATED CENTER LOGO */}
      <Animated.View 
        style={[{ position: 'absolute', top: paddingTop + 15, left: screenWidth * 0.3, right: screenWidth * 0.3, alignItems: 'center', justifyContent: 'center' }, logoStyle]}
        pointerEvents="none"
      >
        <Text className="text-2xl font-extrabold tracking-tight text-primary" numberOfLines={1} adjustsFontSizeToFit>
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
          onPress={() => handleNavigation('/(tabs)/search')}
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
                  Search across Hostels, Colleges & Services
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
