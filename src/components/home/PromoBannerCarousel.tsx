import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Banner } from '../../types/home.types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PromoBannerCarouselProps {
  banners: Banner[];
}

const { width } = Dimensions.get('window');

export function PromoBannerCarousel({ banners }: PromoBannerCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  
  // Clone first and last items to create the infinite scroll illusion
  const extendedBanners = banners && banners.length > 0 ? [
    { ...banners[banners.length - 1], id: `clone-last-${banners[banners.length - 1].id}` },
    ...banners,
    { ...banners[0], id: `clone-first-${banners[0].id}` }
  ] : [];

  // Auto-scroll logic
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        flatListRef.current?.scrollToIndex({ 
          index: nextIndex, 
          animated: true 
        });
        return nextIndex;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [banners]);

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    
    if (newIndex === 0) {
      // Reached the fake "last" banner, jump to the real "last" banner silently
      flatListRef.current?.scrollToIndex({ index: banners.length, animated: false });
      setCurrentIndex(banners.length);
    } else if (newIndex === extendedBanners.length - 1) {
      // Reached the fake "first" banner, jump to the real "first" banner silently
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      setCurrentIndex(1);
    }
  };

  const handleAnimationEnd = () => {
    if (currentIndex === 0) {
      flatListRef.current?.scrollToIndex({ index: banners.length, animated: false });
      setCurrentIndex(banners.length);
    } else if (currentIndex === extendedBanners.length - 1) {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      setCurrentIndex(1);
    }
  };

  const renderItem = ({ item }: { item: Banner }) => (
    <View style={{ width, alignItems: 'center' }}>
      <TouchableOpacity 
        className="rounded-3xl overflow-hidden shadow-lg border border-border/50"
        style={{ width: width - 40, height: 180 }}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.imageUrl }} 
          className="absolute w-full h-full"
          resizeMode="cover"
        />
        
        {/* Diagonal Gradient Overlay (darker over a larger area for long text) */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          locations={[0, 0.5, 1]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        />
        
        <View className="flex-1 p-5 justify-between">
          <View className="bg-primary/90 self-start px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <Text className="text-white text-xs font-bold uppercase tracking-widest">Featured</Text>
          </View>
          <View>
            <Text className="text-white font-extrabold text-2xl mb-1 shadow-sm">{item.title}</Text>
            <Text className="text-gray-200 font-medium text-sm mb-2" numberOfLines={2}>{item.subtitle}</Text>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-xs mr-1">Explore</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const getRealIndex = (index: number) => {
    if (!banners || banners.length === 0) return 0;
    if (index === 0) return banners.length - 1;
    if (index === extendedBanners.length - 1) return 0;
    return index - 1;
  };

  return (
    <View className="py-6">
      {extendedBanners.length > 0 && (
        <FlatList
          ref={flatListRef}
          data={extendedBanners}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          disableIntervalMomentum={true}
          snapToInterval={width} // Forces strict 1 item per screen
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollAnimationEnd={handleAnimationEnd}
          initialScrollIndex={1}
        />
      )}
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-4">
        {banners && banners.map((_, i) => (
          <View 
            key={i} 
            className={`h-1.5 rounded-full mx-1 ${i === getRealIndex(currentIndex) ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} 
          />
        ))}
      </View>
    </View>
  );
}
