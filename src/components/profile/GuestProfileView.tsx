import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useRouter } from 'expo-router';

interface GuestProfileViewProps {
  onLoginPress: () => void;
  onExplorePress: () => void;
}

export function GuestProfileView({ onLoginPress, onExplorePress }: GuestProfileViewProps) {
  const { colorScheme } = useTheme();
  const router = useRouter();

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Guest Header & Auth CTAs */}
      <View className="px-6 mb-8 mt-4">
        <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6 border-4 border-background shadow-sm">
          <Ionicons name="person" size={36} color="#1C398E" />
        </View>
        <Text className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">Welcome to JustKlick</Text>
        <Text className="text-[15px] text-muted-foreground leading-relaxed mb-8">
          Sign in to save favorites, manage your reviews, receive personalized recommendations, and access your full activity history.
        </Text>

        <View className="gap-3">
          <TouchableOpacity 
            onPress={onLoginPress}
            activeOpacity={0.8}
            className="w-full h-14 rounded-[16px] bg-primary flex-row items-center justify-center shadow-md shadow-primary/20"
          >
            <Ionicons name="log-in-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text className="text-primary-foreground font-bold text-[18px] ml-2">Login to your account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guest Benefits Grid */}
      <View className="px-6 mb-10">
        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">
          Login Benefits
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          <BenefitCard icon="heart" title="Save Favorites" subtitle="Quick access to places" color="#ef4444" />
          <BenefitCard icon="star" title="Track Reviews" subtitle="Manage your feedback" color="#f59e0b" />
          <BenefitCard icon="sparkles" title="Personalized" subtitle="Custom recommendations" color="#8b5cf6" />
          <BenefitCard icon="pricetags" title="Exclusive Offers" subtitle="Member-only deals" color="#10b981" />
        </View>
      </View>

      {/* Quick Access Links */}
      <View className="px-6 mb-8">
        <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">
          Quick Access
        </Text>
        <View className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
          <QuickLink icon="compass-outline" title="Explore Categories" onPress={onExplorePress} />
          <QuickLink icon="information-circle-outline" title="About JustKlick" onPress={() => {}} />
          <QuickLink icon="help-buoy-outline" title="Contact Support" onPress={() => {}} />
          <QuickLink icon="document-text-outline" title="Privacy Policy" onPress={() => router.push('/privacy-policy')} />
          <QuickLink icon="shield-checkmark-outline" title="Terms of Use" onPress={() => router.push('/terms-of-use')} />
          <QuickLink icon="share-social-outline" title="Share App" isLast onPress={() => {}} />
        </View>
      </View>

    </ScrollView>
  );
}

function BenefitCard({ icon, title, subtitle, color }: { icon: any, title: string, subtitle: string, color: string }) {
  const { colorScheme } = useTheme();
  return (
    <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm">
      <View className="w-10 h-10 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${color}15` }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-[14px] font-bold text-foreground mb-1">{title}</Text>
      <Text className="text-[11px] font-medium text-muted-foreground leading-tight">{subtitle}</Text>
    </View>
  );
}

function QuickLink({ icon, title, isLast, onPress }: { icon: any, title: string, isLast?: boolean, onPress?: () => void }) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-border' : ''}`}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={22} color={isDark ? '#94A3B8' : '#64748B'} style={{ marginRight: 16 }} />
        <Text className="text-[15px] font-semibold text-foreground ml-3">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}
