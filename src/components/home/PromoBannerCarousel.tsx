import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Banner } from '../../types/home.types';
import { Ionicons } from '@expo/vector-icons';

interface PromoBannerCarouselProps {
  banners: Banner[];
}

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export function PromoBannerCarousel({ banners }: PromoBannerCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  
  // Optional: Auto-scroll effect can be added here
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  const renderItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity 
      className="rounded-3xl overflow-hidden mr-4 shadow-md bg-card border border-border"
      style={{ width: BANNER_WIDTH, height: 180 }}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      {/* Dark overlay for text readability */}
      <View className="absolute w-full h-full bg-black/40" />
      
      <View className="flex-1 p-5 justify-between">
        <View className="bg-primary/90 self-start px-3 py-1 rounded-full border border-white/20">
          <Text className="text-white text-xs font-bold uppercase tracking-widest">Featured</Text>
        </View>
        <View>
          <Text className="text-white font-extrabold text-2xl mb-1 shadow-sm">{item.title}</Text>
          <Text className="text-white/90 font-medium text-sm mb-2">{item.subtitle}</Text>
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-xs mr-1">Explore</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="py-6">
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        snapToInterval={BANNER_WIDTH + 16} // width + margin
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </View>
  );
}
