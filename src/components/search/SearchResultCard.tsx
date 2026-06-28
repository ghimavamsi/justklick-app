import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Business } from '../../types/home.types';
import { useTheme } from '../../hooks/useTheme';

interface SearchResultCardProps {
  business: Business;
}

const { width } = Dimensions.get('window');

import { router } from 'expo-router';

export function SearchResultCard({ business }: SearchResultCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = business.images && business.images.length > 0 ? business.images : [business.coverImage];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => router.push(`/business/${business.slug || business.id}`)}
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm mb-6"
    >
      
      {/* Image Carousel */}
      <View style={{ height: 200, width: '100%' }}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(_, idx) => `img-${idx}`}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item }} 
              style={{ width: width - 32, height: 200 }} 
              resizeMode="cover"
            />
          )}
        />
        
        {/* Image Counter Badge */}
        {images.length > 1 && (
          <View className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-full flex-row items-center backdrop-blur-md">
            <Ionicons name="images-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
            <Text className="text-white text-xs font-bold">
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        )}
        
        {/* Badges Overlay */}
        <View className="absolute top-3 left-3 flex-row items-center space-x-2">
          {business.isPremium && (
            <View className="bg-[#F59E0B] px-2 py-1 rounded flex-row items-center shadow-sm mr-2">
              <Ionicons name="star" size={10} color="#FFF" />
              <Text className="text-white text-[10px] font-bold uppercase ml-1 tracking-wider">Premium</Text>
            </View>
          )}
          {business.isTrusted && (
            <View className="bg-blue-600 px-2 py-1 rounded flex-row items-center shadow-sm">
              <Ionicons name="shield-checkmark" size={10} color="#FFF" />
              <Text className="text-white text-[10px] font-bold uppercase ml-1 tracking-wider">Trusted</Text>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full items-center justify-center backdrop-blur-md">
          <Ionicons name="heart-outline" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View className="p-4">
        
        {/* Header: Title and Rating */}
        <View className="flex-row justify-between items-start mb-1">
          <View className="flex-1 pr-2">
            <Text className="text-xl font-extrabold text-foreground" numberOfLines={2}>
              {business.name}
              {business.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginLeft: 6 }} />
              )}
            </Text>
          </View>
          
          <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded flex-row items-center border border-green-200 dark:border-green-800/50">
            <Text className="text-green-700 dark:text-green-400 text-sm font-bold mr-1">{business.rating}</Text>
            <Ionicons name="star" size={12} color="#15803D" />
          </View>
        </View>
        
        {/* Ratings Count */}
        <Text className="text-xs text-muted-foreground font-medium mb-3">
          {business.reviewsCount} Ratings
        </Text>

        {/* Address */}
        <View className="flex-row items-start mb-2">
          <Ionicons name="location" size={16} color="#64748B" style={{ marginTop: 2, marginRight: 6 }} />
          <Text className="text-sm text-foreground flex-1 leading-snug">
            {business.fullAddress || business.distanceStr}
            {business.fullAddress && business.distanceStr && (
              <Text className="text-muted-foreground"> • {business.distanceStr}</Text>
            )}
          </Text>
        </View>

        {/* Experience & Timings */}
        <View className="flex-row flex-wrap items-center mb-4">
          {business.experience && (
            <View className="flex-row items-center mr-4 mb-1">
              <Ionicons name="briefcase-outline" size={14} color="#64748B" style={{ marginRight: 4 }} />
              <Text className="text-xs text-foreground font-medium">{business.experience}</Text>
            </View>
          )}
          {business.timings && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={14} color={business.isOpenNow ? '#10B981' : '#EF4444'} style={{ marginRight: 4 }} />
              <Text className={`text-xs font-medium ${business.isOpenNow ? 'text-green-600 dark:text-green-500' : 'text-red-500'}`}>
                {business.timings}
              </Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {business.tags && business.tags.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {business.tags.map(tag => (
              <View key={tag} className="bg-muted px-2 py-1 rounded flex-row items-center mr-2 mb-2">
                <Text className="text-[10px] text-muted-foreground font-semibold">{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Divider */}
        <View className="h-px bg-border w-full mb-3" />

        {/* Action Buttons Row */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="flex-row items-center justify-center flex-1 py-2 bg-green-500 rounded-lg mr-2">
            <Ionicons name="call" size={16} color="#FFF" />
            <Text className="text-white text-xs font-bold ml-2">Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-center flex-1 py-2 bg-[#25D366] rounded-lg mr-2">
            <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
            <Text className="text-white text-xs font-bold ml-2">WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-center flex-1 py-2 bg-primary rounded-lg mr-2">
            <Ionicons name="mail" size={16} color="#FFF" />
            <Text className="text-white text-xs font-bold ml-2">Enquire</Text>
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-muted items-center justify-center mr-2">
              <Ionicons name="navigate-outline" size={18} color="#000" style={isDark ? {color: '#FFF'} : {}} />
            </TouchableOpacity>
            
            <TouchableOpacity className="w-10 h-10 rounded-full bg-muted items-center justify-center">
              <Ionicons name="share-social-outline" size={18} color="#000" style={isDark ? {color: '#FFF'} : {}} />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}
