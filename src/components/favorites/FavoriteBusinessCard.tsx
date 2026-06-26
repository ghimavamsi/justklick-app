import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { Business } from '../../types/home.types';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  business: Business;
  index: number;
  onRemove: (id: string) => void;
}

export function FavoriteBusinessCard({ business, index, onRemove }: Props) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const renderRightActions = () => {
    return (
      <View className="flex-row items-center justify-center pl-2 my-2 w-[120px]">
        <TouchableOpacity 
          className="w-12 h-12 rounded-full bg-muted items-center justify-center shadow-sm mr-2"
          activeOpacity={0.8}
        >
          <Ionicons name="share-social" size={20} color={isDark ? '#FFF' : '#1C398E'} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onRemove(business.id)}
          className="w-12 h-12 rounded-full bg-destructive items-center justify-center shadow-sm"
          activeOpacity={0.8}
        >
          <Ionicons name="trash" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View 
      className="w-full mb-4"
    >
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
      >
        <View className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push(`/business/${business.slug || business.id}` as any)}
            className="p-4 flex-row"
          >
            {/* Cover Image */}
            <View className="relative w-28 h-28 rounded-[16px] overflow-hidden mr-4 bg-muted">
              <Image 
                source={{ uri: business.coverImage }} 
                className="w-full h-full"
                resizeMode="cover"
              />
              {business.isOpenNow !== undefined && (
                <View className="absolute top-2 left-2 bg-background/90 px-2 py-0.5 rounded-full">
                  <Text className={`text-[10px] font-bold ${business.isOpenNow ? 'text-green-500' : 'text-red-500'}`}>
                    {business.isOpenNow ? 'OPEN' : 'CLOSED'}
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <View className="flex-1 py-1">
              <View className="flex-row justify-between items-start mb-1">
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center mb-1">
                    {business.isPremium && (
                      <View className="bg-amber-500/20 px-1.5 py-0.5 rounded mr-1.5">
                        <Text className="text-[9px] font-bold text-amber-600">PREMIUM</Text>
                      </View>
                    )}
                    <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {business.category}
                    </Text>
                  </View>
                  <Text className="text-base font-extrabold text-foreground" numberOfLines={1}>
                    {business.name}
                  </Text>
                </View>
                
                <Ionicons name="heart" size={16} color="#ef4444" style={{ marginTop: 2 }} />
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text className="text-xs font-bold text-foreground ml-1">{business.rating}</Text>
                <Text className="text-xs font-medium text-muted-foreground ml-1">
                  ({business.reviewsCount})
                </Text>
                {business.distanceStr && (
                  <>
                    <Text className="text-xs text-muted-foreground mx-1">•</Text>
                    <Text className="text-xs font-medium text-muted-foreground">{business.distanceStr}</Text>
                  </>
                )}
              </View>

              {business.fullAddress && (
                <View className="flex-row items-start mt-auto">
                  <Ionicons name="location-outline" size={12} color="#94a3b8" style={{ marginTop: 2, marginRight: 4 }} />
                  <Text className="text-xs font-medium text-muted-foreground flex-1" numberOfLines={1}>
                    {business.fullAddress}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </Animated.View>
  );
}
