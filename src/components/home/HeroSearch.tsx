import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const RECENT_SEARCHES = ['Restaurants', 'Hospitals', 'Hotels', 'Plumbers'];

export function HeroSearch() {
  const { colorScheme } = useTheme();

  return (
    <View className="px-5 pt-3 pb-3 bg-background z-40">
      {/* Recent Searches / Quick Links */}
      <View className="flex-row items-center">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
          {RECENT_SEARCHES.map((search, index) => (
            <TouchableOpacity 
              key={index}
              className="px-4 py-2 bg-muted rounded-full mr-2 border border-border/50 flex-row items-center"
            >
              <Ionicons name="time-outline" size={14} color="#64748B" className="mr-1" />
              <Text className="text-xs font-semibold text-foreground ml-1">{search}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
