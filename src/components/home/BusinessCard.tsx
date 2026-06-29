import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Business } from '../../types/home.types';
import { useTheme } from '../../hooks/useTheme';
import { useFavorites, useToggleFavorite } from '../../hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { vendorsApi } from '../../api/vendors';

interface BusinessCardProps {
  business: Business;
  variant?: 'featured' | 'premium' | 'nearby' | 'recommended';
}

const { width } = Dimensions.get('window');

export function BusinessCard({ business, variant = 'featured' }: BusinessCardProps) {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { data: favorites } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  
  const { data: dynamicReviewData } = useQuery({
    queryKey: ['reviewsCount', business.id],
    queryFn: () => vendorsApi.getReviewsCount(Number(business.id)),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Extract count from API response (assuming it might be an object with 'count' or 'total_reviews')
  const displayReviewsCount = dynamicReviewData?.count 
    ?? dynamicReviewData?.total_reviews 
    ?? (typeof dynamicReviewData === 'number' ? dynamicReviewData : business.reviewsCount);
  
  const scale = useSharedValue(1);

  const isFavorite = favorites?.some((f) => f.id === business.id) ?? false;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.98); };
  const handlePressOut = () => { scale.value = withSpring(1); };
  const handlePress = () => { router.push(`/business/${business.slug || business.id}`); };

  const handleFavoritePress = () => {
    toggleFavorite({ business, isCurrentlyFavorite: isFavorite });
  };

  // Adjust card dimensions and styling based on variant
  let cardWidth = width * 0.75;
  let imageHeight = 160;
  let isCompact = false;

  let isHalfWidth = false;

  if (variant === 'nearby' || variant === 'recommended') {
    cardWidth = (width - 60) / 2;
    imageHeight = 130;
    isCompact = true;
    isHalfWidth = true;
  }

  const isPremium = variant === 'premium' || business.isPremium;

  return (
    <Animated.View style={animatedStyle} className="mr-5 mb-4">
      <TouchableOpacity 
        activeOpacity={1}
        onPress={handlePress}
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
          <TouchableOpacity 
            onPress={handleFavoritePress}
            className={`absolute top-2 right-2 ${isHalfWidth ? 'w-7 h-7' : 'w-8 h-8'} bg-background/80 rounded-full items-center justify-center backdrop-blur-md`}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={isHalfWidth ? 16 : 18} 
              color={isFavorite ? "#ef4444" : (colorScheme === 'dark' ? '#FFF' : '#000')} 
            />
          </TouchableOpacity>

          {/* Premium Badge Overlay */}
          {isPremium && (
            <View className={`absolute top-2 left-2 bg-[#F59E0B] ${isHalfWidth ? 'px-1.5 py-0.5' : 'px-2 py-1'} rounded-full flex-row items-center border border-white/20 shadow-sm`}>
              <Ionicons name="star" size={isHalfWidth ? 8 : 10} color="#FFF" />
              <Text className={`text-white ${isHalfWidth ? 'text-[8px]' : 'text-[10px]'} font-bold uppercase ml-1 tracking-wider`}>Premium</Text>
            </View>
          )}
        </View>

        {/* Content Details */}
        <View className={isHalfWidth ? "p-3" : "p-4"}>
          <View className="flex-row items-center justify-between mb-1">
            <Text className="font-semibold text-primary flex-1 mr-1" style={{ fontSize: isHalfWidth ? 10 : 12 }} numberOfLines={1}>{business.category}</Text>
            {business.distanceStr && (
              <View className="flex-row items-center shrink-0">
                <Ionicons name="location-outline" size={isHalfWidth ? 10 : 12} color="#64748B" />
                <Text className="text-muted-foreground font-medium ml-0.5" style={{ fontSize: isHalfWidth ? 9 : 10 }}>{business.distanceStr}</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-start mb-2" style={{ minHeight: isHalfWidth ? 36 : 24 }}>
            <Text className="font-extrabold text-foreground flex-1" style={{ fontSize: isHalfWidth ? 14 : 18, lineHeight: isHalfWidth ? 18 : 24 }} numberOfLines={isHalfWidth ? 2 : 1}>
              {business.name}
            </Text>
            {business.isVerified && (
              <Ionicons name="checkmark-circle" size={isHalfWidth ? 14 : 16} color="#10B981" style={{ marginLeft: 4, marginTop: isHalfWidth ? 2 : 4 }} />
            )}
          </View>

          <View className="flex-row items-center justify-between mt-auto">
            <View className="flex-row items-center flex-1">
              <View className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded flex-row items-center mr-1 border border-amber-200 dark:border-amber-800/50">
                <Ionicons name="star" size={isHalfWidth ? 10 : 12} color="#F59E0B" />
                <Text className="text-amber-700 dark:text-amber-400 font-bold ml-1" style={{ fontSize: isHalfWidth ? 10 : 12 }}>{business.rating}</Text>
              </View>
              <Text className="text-muted-foreground font-medium flex-1" style={{ fontSize: isHalfWidth ? 9 : 12 }} numberOfLines={1}>({displayReviewsCount} reviews)</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
