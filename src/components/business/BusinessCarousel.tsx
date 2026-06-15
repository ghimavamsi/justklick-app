import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Business } from '../../types/home.types';
import { BusinessCard } from '../home/BusinessCard';

interface Props {
  title: string;
  businesses: Business[];
}

export function BusinessCarousel({ title, businesses }: Props) {
  if (!businesses || businesses.length === 0) return null;

  return (
    <View className="mb-8">
      <View className="px-6 mb-4">
        <Text className="text-xl font-extrabold text-foreground">{title}</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 4 }}
      >
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} variant="nearby" />
        ))}
      </ScrollView>
    </View>
  );
}
