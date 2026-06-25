import React from 'react';
import { View, ScrollView, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { dynamicApi } from '@/api/dynamic';
import { useTheme } from '@/hooks/useTheme';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();

  const { data: touristPlaces, isLoading: isPlacesLoading } = useQuery({
    queryKey: ['touristPlaces'],
    queryFn: () => dynamicApi.getTouristPlaces()
  });

  const { data: faqs, isLoading: isFaqsLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => dynamicApi.getFaqs()
  });

  const { data: whyChooseUs, isLoading: isWhyLoading } = useQuery({
    queryKey: ['whyChooseUs'],
    queryFn: () => dynamicApi.getWhyChooseUs()
  });

  const isLoading = isPlacesLoading || isFaqsLoading || isWhyLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1C398E" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: Math.max(insets.top, 20) + 10, paddingBottom: 100 }}
    >
      {/* Header */}
      <View className="px-5 mb-6">
        <Text className="text-3xl font-extrabold text-foreground mb-1">Explore</Text>
        <Text className="text-sm text-muted-foreground">Discover tourist places and learn more about us</Text>
      </View>

      {/* Tourist Places */}
      {touristPlaces && touristPlaces.length > 0 && (
        <View className="mb-8">
          <View className="px-5 mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-foreground">Top Tourist Places</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}>
            {touristPlaces.map((place) => (
              <View key={place.id} className="w-64 bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <Image 
                  source={{ uri: place.image ? (place.image.startsWith('http') ? place.image : `https://justklick-backend-kjrdc8-2f68d5-162-35-161-160.sslip.io${place.image}`) : 'https://via.placeholder.com/400x200' }} 
                  className="w-full h-32" 
                />
                <View className="p-4">
                  <Text className="font-bold text-base text-foreground mb-1" numberOfLines={1}>{place.title}</Text>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location" size={14} color="#64748B" />
                    <Text className="text-xs text-muted-foreground ml-1" numberOfLines={1}>{place.location}</Text>
                  </View>
                  <Text className="text-xs text-muted-foreground" numberOfLines={2}>{place.description}</Text>
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text className="text-xs font-bold text-foreground ml-1">{place.rating}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Why Choose Us */}
      {whyChooseUs && whyChooseUs.length > 0 && (
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">Why Choose Us</Text>
          <View className="gap-4">
            {whyChooseUs.map((item) => (
              <View key={item.id} className="flex-row items-start bg-card p-4 rounded-2xl border border-border shadow-sm">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
                  <Ionicons name={item.icon ? (item.icon as any) : "checkmark-circle"} size={20} color="#1C398E" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground mb-1">{item.title}</Text>
                  <Text className="text-xs text-muted-foreground leading-relaxed">{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden">
            {faqs.map((faq: any, index: number) => (
              <View key={faq.id || index} className={`p-4 ${index !== faqs.length - 1 ? 'border-b border-border' : ''}`}>
                <Text className="font-bold text-foreground mb-2">{faq.question || faq.title}</Text>
                <Text className="text-xs text-muted-foreground leading-relaxed">{faq.answer || faq.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
