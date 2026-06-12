import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Business } from '../../types/home.types';
import { BusinessCard } from './BusinessCard';
import { Ionicons } from '@expo/vector-icons';

interface BusinessSectionProps {
  title: string;
  subtitle?: string;
  businesses: Business[];
  variant?: 'featured' | 'premium' | 'nearby' | 'recommended';
  icon?: string;
  iconColor?: string;
}

export function BusinessSection({ 
  title, 
  subtitle, 
  businesses, 
  variant = 'featured',
  icon,
  iconColor
}: BusinessSectionProps) {
  
  if (!businesses || businesses.length === 0) return null;

  return (
    <View className="py-5">
      <View className="px-5 mb-4 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <View className="flex-row items-center mb-1">
            {icon && <Ionicons name={icon as any} size={20} color={iconColor} className="mr-2" />}
            <Text className="text-xl font-extrabold text-foreground tracking-tight">{title}</Text>
          </View>
          {subtitle && <Text className="text-sm font-medium text-muted-foreground">{subtitle}</Text>}
        </View>
        <Text className="text-sm font-bold text-primary">See All</Text>
      </View>

      <FlatList
        data={businesses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <BusinessCard business={item} variant={variant} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 5 }} // paddingRight 5 because card has mr-5
      />
    </View>
  );
}
