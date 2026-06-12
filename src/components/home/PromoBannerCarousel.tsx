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
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-scroll logic
  useEffect(() => {
    if (!banners || banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
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

  const onMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
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
        
        {/* Bottom-to-Top Gradient Overlay specifically for the text */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.8]}
          className="absolute bottom-0 w-full h-[70%]"
        />
        
        <View className="flex-1 p-5 justify-between">
          <View className="bg-primary/90 self-start px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <Text className="text-white text-xs font-bold uppercase tracking-widest">Featured</Text>
          </View>
          <View>
            <Text className="text-white font-extrabold text-2xl mb-1 shadow-sm">{item.title}</Text>
            <Text className="text-gray-200 font-medium text-sm mb-2">{item.subtitle}</Text>
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-xs mr-1">Explore</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
        snapToInterval={width} // Forces strict 1 item per screen
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        // No paddingHorizontal here, the item itself handles the margins
      />
      
      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-4">
        {banners.map((_, i) => (
          <View 
            key={i} 
            className={`h-1.5 rounded-full mx-1 ${i === currentIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} 
          />
        ))}
      </View>
    </View>
  );
}
