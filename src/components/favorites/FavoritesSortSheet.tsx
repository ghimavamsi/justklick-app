import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { id: 'newest', label: 'Recently Added', icon: 'time-outline' },
  { id: 'highest_rated', label: 'Highest Rated', icon: 'star-outline' },
  { id: 'nearest', label: 'Nearest to Me', icon: 'location-outline' },
];

export function FavoritesSortSheet({ visible, onClose, currentSort, onSortChange }: Props) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View 
          entering={FadeIn.duration(200)} 
          className="absolute inset-0"
        >
          <Pressable 
            className="flex-1 bg-black/40" 
            onPress={onClose} 
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          className="bg-card rounded-t-[32px] pt-4 pb-8 shadow-lg"
        >
          {/* Handle bar */}
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 rounded-full bg-border" />
          </View>

          <View className="px-6 mb-4">
            <Text className="text-xl font-extrabold text-foreground mb-1">Sort Favorites</Text>
            <Text className="text-sm text-muted-foreground">Choose how to order your collection</Text>
          </View>

          <View className="px-4">
            {SORT_OPTIONS.map((option) => {
              const isActive = currentSort === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    onSortChange(option.id);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between p-4 rounded-[16px] mb-2 ${
                    isActive ? 'bg-primary/10' : 'bg-transparent'
                  }`}
                >
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={isActive ? '#1C398E' : (isDark ? '#94A3B8' : '#64748B')} 
                      style={{ marginRight: 12 }} 
                    />
                    <Text className={`text-base font-bold ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`}>
                      {option.label}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={24} color="#1C398E" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
