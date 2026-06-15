import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ExploreCategory } from '../../types/category.types';
import { useTheme } from '../../hooks/useTheme';

interface CategoryPremiumCardProps {
  category: ExploreCategory;
  onPress: (category: ExploreCategory) => void;
  style?: any;
}

export function CategoryPremiumCard({ category, onPress, style }: CategoryPremiumCardProps) {
  const { colorScheme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  // Calculate height based on cardSize
  const height = category.cardSize === 'large' ? 180 : category.cardSize === 'medium' ? 140 : 100;

  return (
    <Animated.View style={[animatedStyle, style]} className="mb-4">
      <TouchableOpacity 
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(category)}
        className="bg-card rounded-[28px] overflow-hidden border"
        style={{
          height,
          borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          shadowColor: colorScheme === 'dark' ? '#000' : category.color,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.08,
          shadowRadius: 16,
          elevation: colorScheme === 'dark' ? 0 : 5,
        }}
      >
        {/* Soft Background Gradient corresponding to the category color */}
        <LinearGradient
          colors={colorScheme === 'dark' ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.8)']}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1 }}
        />
        <View 
          className="absolute inset-0 opacity-10 dark:opacity-[0.03]" 
          style={{ backgroundColor: category.color }} 
        />

        <View className="flex-1 p-5 justify-between z-10">
          <View className="flex-row justify-between items-start">
            {/* Premium Icon Container */}
            <LinearGradient
              colors={category.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className={`items-center justify-center rounded-2xl shadow-sm ${category.cardSize === 'small' ? 'w-10 h-10' : 'w-14 h-14'}`}
            >
              <Ionicons 
                name={category.iconName as any} 
                size={category.cardSize === 'small' ? 20 : 28} 
                color="#FFF" 
              />
            </LinearGradient>

            {/* Badges */}
            {category.isTrending && category.cardSize !== 'small' && (
              <View className="bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full border border-rose-200 dark:border-rose-800/50 flex-row items-center">
                <Ionicons name="flame" size={10} color="#F43F5E" />
                <Text className="text-rose-600 dark:text-rose-400 text-[10px] font-bold ml-1 uppercase">Trending</Text>
              </View>
            )}
            {!category.isTrending && category.isPopular && category.cardSize !== 'small' && (
              <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800/50">
                <Text className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">Popular</Text>
              </View>
            )}
          </View>

          <View>
            <Text 
              className={`font-bold text-foreground mb-1 ${category.cardSize === 'small' ? 'text-sm' : 'text-xl'}`}
              numberOfLines={1}
            >
              {category.name}
            </Text>
            <Text className="text-muted-foreground text-xs font-medium">
              {category.businessCount.toLocaleString()} Businesses
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
