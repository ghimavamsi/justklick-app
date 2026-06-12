import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Business } from '../../types/home.types';
import { useTheme } from '../../hooks/useTheme';

interface BusinessCardProps {
  business: Business;
  variant?: 'featured' | 'premium' | 'nearby' | 'recommended';
}

const { width } = Dimensions.get('window');

export function BusinessCard({ business, variant = 'featured' }: BusinessCardProps) {
  const { colorScheme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.98); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  // Adjust card dimensions and styling based on variant
  let cardWidth = width * 0.75;
  let imageHeight = 160;
  let isCompact = false;

  if (variant === 'nearby' || variant === 'recommended') {
    cardWidth = width * 0.65;
    imageHeight = 120;
    isCompact = true;
  }

  const isPremium = variant === 'premium' || business.isPremium;

  return (
    <Animated.View style={animatedStyle} className="mr-5 mb-4">
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-card rounded-3xl overflow-hidden border"
        style={{
          width: cardWidth,
          borderColor: isPremium ? '#F59E0B' : (colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
          shadowColor: colorScheme === 'dark' ? 'transparent' : (isPremium ? '#F59E0B' : '#64748B'),
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: colorScheme === 'dark' ? 0 : 0.1,
          shadowRadius: 16,
          elevation: colorScheme === 'dark' ? 0 : 5,
        }}
      >
        {/* Cover Image */}
        <View style={{ height: imageHeight, width: '100%', backgroundColor: '#E2E8F0' }}>
          <Image 
            source={{ uri: business.coverImage }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          
          {/* Favorite Button Overlay */}
          <TouchableOpacity className="absolute top-3 right-3 w-8 h-8 bg-background/80 rounded-full items-center justify-center backdrop-blur-md">
            <Ionicons name="heart-outline" size={18} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
          </TouchableOpacity>

          {/* Premium Badge Overlay */}
          {isPremium && (
            <View className="absolute top-3 left-3 bg-[#F59E0B] px-2 py-1 rounded-full flex-row items-center border border-white/20 shadow-sm">
              <Ionicons name="star" size={10} color="#FFF" />
              <Text className="text-white text-[10px] font-bold uppercase ml-1 tracking-wider">Premium</Text>
            </View>
          )}
        </View>

        {/* Content Details */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold text-primary">{business.category}</Text>
            {business.distanceStr && (
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={12} color="#64748B" />
                <Text className="text-[10px] text-muted-foreground font-medium ml-0.5">{business.distanceStr}</Text>
              </View>
            )}
          </View>

          <Text className="text-lg font-extrabold text-foreground mb-2" numberOfLines={1}>
            {business.name}
            {business.isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginLeft: 4 }} />
            )}
          </Text>

          <View className="flex-row items-center justify-between mt-auto">
            <View className="flex-row items-center">
              <View className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded flex-row items-center mr-2 border border-amber-200 dark:border-amber-800/50">
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text className="text-amber-700 dark:text-amber-400 text-xs font-bold ml-1">{business.rating}</Text>
              </View>
              <Text className="text-xs text-muted-foreground font-medium">({business.reviewsCount} reviews)</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
