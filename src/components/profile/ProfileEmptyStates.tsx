import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface ProfileEmptyStateProps {
  title: string;
  description: string;
  icon: any;
}

export function ProfileEmptyState({ title, description, icon }: ProfileEmptyStateProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="items-center justify-center py-10 px-6 bg-card rounded-[24px] border border-border shadow-sm mx-6 mb-8">
      <View className="w-16 h-16 rounded-full bg-muted items-center justify-center mb-4">
        <Ionicons name={icon} size={32} color={isDark ? '#94A3B8' : '#64748B'} />
      </View>
      <Text className="text-lg font-bold text-foreground text-center mb-2">{title}</Text>
      <Text className="text-sm text-muted-foreground text-center leading-relaxed">
        {description}
      </Text>
    </View>
  );
}
