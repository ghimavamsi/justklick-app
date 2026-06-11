import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as Location from 'expo-location';
import { useAppStore } from '../../store';

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { setLocationPermission } = useAppStore();

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
      
      // Move to next step regardless
      router.push('/permissions/notifications' as any);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong requesting location.');
      router.push('/permissions/notifications' as any);
    }
  };

  const skipPermission = () => {
    setLocationPermission('denied');
    router.push('/permissions/notifications' as any);
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
    <View className="flex-1 bg-white px-8 pt-20 pb-12">
      <View className="flex-1 items-center justify-center">
        
        {/* Animated Premium Illustration */}
        <Animated.View className="items-center justify-center mb-12 h-48 w-48" style={iconStyle}>
          <Animated.View className="absolute w-48 h-48 bg-[#1C398E] rounded-full" style={[pulseStyle, { filter: 'blur(30px)' }]} />
          
          <View className="bg-white w-28 h-28 rounded-full shadow-2xl items-center justify-center border-8 border-slate-50 z-10">
            <SymbolView name="location.fill" size={48} tintColor={PRIMARY} />
          </View>

          {/* Floating Accents */}
          <View className="absolute -top-4 right-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100 z-20">
            <SymbolView name="globe" size={20} tintColor="#2563EB" />
          </View>
          <View className="absolute bottom-4 -left-4 bg-white p-2 rounded-xl shadow-sm border border-slate-100 z-20">
            <SymbolView name="building.columns.fill" size={20} tintColor="#EA580C" />
          </View>
        </Animated.View>

        {/* Typography */}
        <Text className="text-3xl font-extrabold text-slate-900 text-center mb-3">
          Unlock Nearby Discovery
        </Text>
        <Text className="text-base text-slate-500 text-center mb-10 px-4 leading-relaxed">
          Allow location access to discover nearby businesses, accurate recommendations, and personalized results.
        </Text>

        {/* Benefits List */}
        <Animated.View className="w-full gap-4 px-4" style={listStyle}>
          <BenefitRow icon="map.fill" text="Find Nearby Businesses" />
          <BenefitRow icon="location.magnifyingglass" text="Accurate Search Results" />
          <BenefitRow icon="sparkles" text="Personalized Recommendations" />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mt-auto pt-4">
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#1C398E] h-14 w-full rounded-full items-center justify-center shadow-lg shadow-[#1C398E]/30"
        >
          <Text className="text-white font-bold text-lg">Enable Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={skipPermission}
          className="h-14 w-full rounded-full items-center justify-center"
        >
          <Text className="text-slate-500 font-semibold text-base">Choose Location Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BenefitRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
        <SymbolView name={icon as any} size={18} tintColor={PRIMARY} />
      </View>
      <Text className="text-slate-700 font-medium text-[15px]">{text}</Text>
    </View>
  );
}
