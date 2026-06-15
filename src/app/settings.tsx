import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="px-6 pb-4 border-b border-border/50 flex-row items-center bg-background/95 shadow-sm z-50"
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border shadow-sm mr-4"
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground tracking-tight">App Settings</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">
          Coming Soon
        </Text>
        <View className="bg-card rounded-[24px] p-6 border border-border items-center justify-center shadow-sm">
          <Ionicons name="construct-outline" size={48} color="#1C398E" style={{ marginBottom: 16 }} />
          <Text className="text-lg font-bold text-foreground mb-2 text-center">Settings Area</Text>
          <Text className="text-sm text-muted-foreground text-center">
            This screen will contain detailed application settings in the future.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
