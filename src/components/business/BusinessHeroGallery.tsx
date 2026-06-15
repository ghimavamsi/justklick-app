import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, Extrapolation, SharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  images: string[];
  scrollY: SharedValue<number>;
}

const { width } = Dimensions.get('window');
const HERO_HEIGHT = width * 1.0; // Square ratio for premium feel
const AUTO_SCROLL_INTERVAL = 3500;

export function BusinessHeroGallery({ images, scrollY }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const { colorScheme } = useTheme();
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  // Auto-scroll logic
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex, images]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, HERO_HEIGHT],
      [-50, 0, HERO_HEIGHT * 0.5],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  if (!images || images.length === 0) return null;

  return (
    <View style={{ height: HERO_HEIGHT, width, overflow: 'hidden' }}>
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={[animatedStyle, { flex: 1, backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#F1F5F9' }]}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={{ width, height: HERO_HEIGHT }}
            contentFit="cover"
            transition={300}
          />
        ))}
      </Animated.ScrollView>

      {/* Image Counter */}
      {images.length > 1 && (
        <View className="absolute bottom-[44px] right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
          <Text className="text-white text-xs font-bold tracking-wider">
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* Dark overlay gradient at bottom to blend with content */}
      <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0 opacity-80" />
    </View>
  );
}
