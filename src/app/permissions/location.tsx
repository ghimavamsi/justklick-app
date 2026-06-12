import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAppStore, useLocationStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { setLocationPermission } = useAppStore();
  const { colorScheme } = useTheme();

  // Animation States
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.15);
  const iconTranslateY = useSharedValue(20);
  const iconOpacity = useSharedValue(0);
  const listOpacity = useSharedValue(0);

  useEffect(() => {
    // Elegant floating entry animation
    iconTranslateY.value = withSpring(0, { damping: 15 });
    iconOpacity.value = withTiming(1, { duration: 800 });
    
    // Background pulse
    pulseScale.value = withRepeat(withTiming(1.6, { duration: 2500 }), -1, true);
    pulseOpacity.value = withRepeat(withTiming(0.05, { duration: 2500 }), -1, true);

    // List fade in
    listOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
  }, []);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted' ? 'granted' : 'denied');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        useLocationStore.getState().setLocation(
          address?.city || address?.subregion || 'Unknown Location',
          {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          }
        );
      }

      // Move to next step regardless
      router.replace('/permissions/notifications');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong requesting location.');
      router.replace('/permissions/notifications');
    }
  };

  const skipPermission = () => {
    setLocationPermission('denied');
    router.replace('/permissions/notifications');
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconTranslateY.value }],
    opacity: iconOpacity.value,
  }));

  const listStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
  }));

  return (
    <View className="flex-1 bg-background px-8 pt-20 pb-12">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <View className="flex-1 items-center justify-center">
        
        {/* Animated Premium Illustration */}
        <Animated.View className="items-center justify-center mb-12 h-48 w-48" style={iconStyle}>
          <Animated.View className="absolute w-48 h-48 bg-primary/20 rounded-full" style={pulseStyle} />
          
          <View className="bg-card w-28 h-28 rounded-full shadow-2xl items-center justify-center border-8 border-background z-10">
            <Ionicons name="location" size={48} color={PRIMARY} />
          </View>

          {/* Floating Accents */}
          <View className="absolute -top-4 right-4 bg-card p-2 rounded-xl shadow-sm border border-border z-20">
            <Ionicons name="globe" size={20} color="#2563EB" />
          </View>
          <View className="absolute bottom-4 -left-4 bg-card p-2 rounded-xl shadow-sm border border-border z-20">
            <Ionicons name="business" size={20} color="#EA580C" />
          </View>
        </Animated.View>

        {/* Typography */}
        <Text className="text-3xl font-extrabold text-foreground text-center mb-3">
          Unlock Nearby Discovery
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-10 px-4 leading-relaxed">
          Allow location access to discover nearby businesses, accurate recommendations, and personalized results.
        </Text>

        {/* Benefits List */}
        <Animated.View className="w-full gap-4 px-4" style={listStyle}>
          <BenefitRow icon="map" text="Find Nearby Businesses" />
          <BenefitRow icon="search" text="Accurate Search Results" />
          <BenefitRow icon="sparkles" text="Personalized Recommendations" />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mt-auto pt-4">
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary h-14 w-full rounded-full flex-row items-center justify-center shadow-lg shadow-primary/30"
        >
          <Text className="text-primary-foreground font-bold text-lg text-center">Enable Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={skipPermission}
          className="h-14 w-full rounded-full flex-row items-center justify-center"
        >
          <Text className="text-muted-foreground font-semibold text-base text-center">Choose Location Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BenefitRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border/50">
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>
      <Text className="text-foreground font-medium text-[15px]">{text}</Text>
    </View>
  );
}
