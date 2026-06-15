import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { NotificationSummary } from '../../types/notification.types';

interface NotificationSummaryCardProps {
  summary: NotificationSummary;
}

export function NotificationSummaryCard({ summary }: NotificationSummaryCardProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  if (summary.unreadCount === 0) {
    return (
      <View className="px-5 mb-6">
        <View className="bg-card rounded-2xl p-5 border border-border flex-row items-center justify-between shadow-sm">
          <View className="flex-1 pr-4">
            <Text className="text-base font-extrabold text-foreground mb-1">You're All Caught Up!</Text>
            <Text className="text-xs text-muted-foreground font-medium leading-relaxed">{summary.insightText}</Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-muted items-center justify-center border border-border/50">
            <Ionicons name="checkmark-done" size={24} color="#10B981" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="px-5 mb-6">
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a'] : ['#E0E7FF', '#F1F5F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-5 border shadow-sm flex-row items-center justify-between"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(28, 57, 142, 0.1)' }}
      >
        <View className="flex-1 pr-4">
          <Text className="text-base font-extrabold mb-1 text-[#1C398E] dark:text-blue-300">
            {summary.unreadCount} New Updates
          </Text>
          <Text className="text-xs text-muted-foreground font-medium leading-relaxed dark:text-slate-400">
            {summary.insightText}
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 items-center justify-center shadow-sm">
          <Ionicons name="notifications-circle" size={32} color="#c10007" />
        </View>
      </LinearGradient>
    </View>
  );
}
