import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function NotificationSettingsScreen() {
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    businessUpdates: true,
    nearbyRecommendations: true,
    offers: true,
    reviewActivity: true,
    favoritesActivity: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ title, description, stateKey, icon, isLast = false }: { title: string, description: string, stateKey: keyof typeof settings, icon: string, isLast?: boolean }) => (
    <View className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-border/40' : ''}`}>
      <View className="flex-row items-center flex-1 pr-4">
        <View className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border/50 mr-4">
          <Ionicons name={icon as any} size={20} color={isDark ? '#94a3b8' : '#64748B'} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-foreground mb-0.5">{title}</Text>
          <Text className="text-xs text-muted-foreground font-medium leading-tight">{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[stateKey]}
        onValueChange={() => toggleSetting(stateKey)}
        trackColor={{ false: isDark ? '#334155' : '#cbd5e1', true: '#1C398E' }}
        thumbColor={settings[stateKey] ? '#FFF' : '#f8fafc'}
        ios_backgroundColor={isDark ? '#334155' : '#cbd5e1'}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View 
        className="px-5 pb-4 border-b border-border shadow-sm bg-card"
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border/50"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text className="text-lg font-extrabold text-foreground">Notification Settings</Text>
          <View className="w-10 h-10" /> {/* Spacer */}
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">Delivery Methods</Text>
        <View className="bg-card rounded-2xl px-4 border border-border mb-8 shadow-sm">
          <SettingRow 
            title="Push Notifications" 
            description="Receive notifications directly on your device." 
            stateKey="pushNotifications" 
            icon="phone-portrait-outline" 
          />
          <SettingRow 
            title="Email Notifications" 
            description="Receive daily summaries and important alerts via email." 
            stateKey="emailNotifications" 
            icon="mail-outline" 
            isLast 
          />
        </View>

        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">Alert Preferences</Text>
        <View className="bg-card rounded-2xl px-4 border border-border mb-10 shadow-sm">
          <SettingRow 
            title="Business Updates" 
            description="News, new photos, and status changes from businesses." 
            stateKey="businessUpdates" 
            icon="storefront-outline" 
          />
          <SettingRow 
            title="Nearby Recommendations" 
            description="Trending places and hidden gems around your location." 
            stateKey="nearbyRecommendations" 
            icon="sparkles-outline" 
          />
          <SettingRow 
            title="Offers & Promotions" 
            description="Exclusive discounts and limited-time deals." 
            stateKey="offers" 
            icon="pricetag-outline" 
          />
          <SettingRow 
            title="Review Activity" 
            description="Likes and business responses to your reviews." 
            stateKey="reviewActivity" 
            icon="star-outline" 
          />
          <SettingRow 
            title="Favorites Activity" 
            description="Updates specifically from your saved businesses." 
            stateKey="favoritesActivity" 
            icon="heart-outline" 
            isLast 
          />
        </View>

      </ScrollView>
    </View>
  );
}
