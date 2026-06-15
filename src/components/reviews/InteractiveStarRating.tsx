import React, { useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RATING_LABELS: Record<number, { text: string, emoji: string, color: string }> = {
  0: { text: 'Tap to rate', emoji: '⭐', color: 'text-muted-foreground' },
  1: { text: 'Terrible', emoji: '😞', color: 'text-rose-500' },
  2: { text: 'Poor', emoji: '😕', color: 'text-orange-500' },
  3: { text: 'Average', emoji: '🙂', color: 'text-amber-500' },
  4: { text: 'Good', emoji: '😊', color: 'text-lime-500' },
  5: { text: 'Excellent', emoji: '🤩', color: 'text-emerald-500' },
};

const Star = ({ selected, onPress }: { selected: boolean; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(
      withTiming(1.3, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={animatedStyle} className="p-2">
        <Ionicons 
          name={selected ? "star" : "star-outline"} 
          size={42} 
          color={selected ? "#F59E0B" : "#CBD5E1"} 
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export function InteractiveStarRating({ rating, onRatingChange }: Props) {
  const currentLabel = RATING_LABELS[Math.floor(rating)] || RATING_LABELS[0];

  return (
    <View className="items-center py-6">
      <View className="flex-row justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            selected={star <= rating} 
            onPress={() => onRatingChange(star)} 
          />
        ))}
      </View>
      
      <Animated.View className="bg-muted/30 px-6 py-2 rounded-full border border-border shadow-sm flex-row items-center">
        <Text className={`text-lg font-extrabold mr-2 ${currentLabel.color}`}>
          {currentLabel.text}
        </Text>
        <Text className="text-xl">{currentLabel.emoji}</Text>
      </Animated.View>
    </View>
  );
}
