import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Share, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, Extrapolation, SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
  scrollY: SharedValue<number>;
}

export function BusinessHeader({ business, scrollY }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const [menuVisible, setMenuVisible] = useState(false);

  const HEADER_HEIGHT = (insets.top || 44) + 60;
  const SCROLL_DISTANCE = 200;

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_DISTANCE], [0, 1], Extrapolation.CLAMP);
    return { opacity, backgroundColor: isDark ? '#0B1120' : '#FFFFFF' };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollY.value, [SCROLL_DISTANCE - 50, SCROLL_DISTANCE], [-20, 0], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [SCROLL_DISTANCE - 20, SCROLL_DISTANCE], [0, 1], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateX }] };
  });

  const iconBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_DISTANCE / 2], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${business.name} on JustKlick!` });
    } catch (error) {
      console.log(error);
    }
  };

  const renderDropdownMenu = () => (
    <Modal visible={menuVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        <View className="flex-1">
          <View 
            className="absolute right-4 bg-card rounded-xl shadow-xl border border-border overflow-hidden w-48"
            style={{ top: HEADER_HEIGHT - 10 }}
          >
            {[
              { icon: 'star-outline', label: 'Write a Review' },
              { icon: 'camera-outline', label: 'Add photo' },
              { icon: 'call-outline', label: 'Call now' },
              { icon: 'warning-outline', label: 'Report error' },
              { icon: 'create-outline', label: 'Suggest an edit' },
            ].map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                className={`flex-row items-center px-4 py-3 ${idx !== 4 ? 'border-b border-border/50' : ''}`}
                onPress={() => {
                  setMenuVisible(false);
                  if (item.label === 'Write a Review') {
                    router.push(`/business/${business.id}/write-review`);
                  }
                }}
              >
                <Ionicons name={item.icon as any} size={18} color={isDark ? '#E2E8F0' : '#475569'} />
                <Text className="text-foreground ml-3 text-sm font-medium">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <>
      <View 
        className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top || 44, height: HEADER_HEIGHT }}
      >
        <Animated.View style={[animatedBackgroundStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]} className="border-b border-border shadow-sm" />

        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full z-10">
          <Animated.View style={iconBackgroundStyle} className="absolute inset-0 bg-black/40 rounded-full" />
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>

        {/* Title slides in from the left next to the back button */}
        <Animated.View style={[animatedTitleStyle]} className="flex-1 items-start pl-3 z-10">
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>{business.name}</Text>
        </Animated.View>

        <View className="flex-row items-center z-10">
          <TouchableOpacity onPress={handleShare} className="w-10 h-10 items-center justify-center rounded-full mr-1">
            <Animated.View style={iconBackgroundStyle} className="absolute inset-0 bg-black/40 rounded-full" />
            <Ionicons name="share-social-outline" size={22} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(true)} className="w-10 h-10 items-center justify-center rounded-full">
            <Animated.View style={iconBackgroundStyle} className="absolute inset-0 bg-black/40 rounded-full" />
            <Ionicons name="ellipsis-vertical" size={22} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {renderDropdownMenu()}
    </>
  );
}
