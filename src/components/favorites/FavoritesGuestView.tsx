import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export function FavoritesGuestView() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const benefits = [
    { icon: 'heart', title: 'Save Businesses', desc: 'Keep track of places you love' },
    { icon: 'notifications', title: 'Get Updates', desc: 'Receive offers from favorites' },
    { icon: 'flash', title: 'Access Quickly', desc: 'Find your trusted places instantly' },
  ];

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View className="px-6 pt-8 pb-6">
        <Text className="text-3xl font-extrabold text-foreground mb-2">Favorites</Text>
        <Text className="text-base text-muted-foreground font-medium">
          Save businesses you love and access them anytime.
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-8 py-10">
        {/* Placeholder for premium illustration */}
        <View className="w-48 h-48 rounded-full bg-primary/10 items-center justify-center mb-8 border-[8px] border-background shadow-sm">
          <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center">
            <Ionicons name="heart" size={64} color="#1C398E" />
          </View>
        </View>

        <Text className="text-2xl font-bold text-foreground text-center mb-8">
          Build Your Collection
        </Text>

        <View className="w-full gap-y-6 mb-12">
          {benefits.map((item, index) => (
            <View key={index} className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-muted items-center justify-center mr-4">
                <Ionicons name={item.icon as any} size={24} color={isDark ? '#FFF' : '#1C398E'} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted-foreground">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View className="w-full gap-y-3">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            className="w-full h-14 bg-primary rounded-[16px] items-center justify-center shadow-sm"
          >
            <Text className="text-primary-foreground font-bold text-[16px]">Login to Save Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            className="w-full h-14 bg-transparent border border-border rounded-[16px] items-center justify-center"
          >
            <Text className="text-foreground font-bold text-[16px]">Continue Exploring</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
