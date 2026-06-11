import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../../store';

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function NotificationPermissionScreen() {
  const router = useRouter();
  const { setNotificationPermission, completeOnboarding } = useAppStore();

  const bellRotate = useSharedValue(-20);
  const card1TranslateY = useSharedValue(50);
  const card2TranslateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Ringing bell animation
    bellRotate.value = withDelay(
      500,
      withSpring(20, { damping: 2, stiffness: 80 }, () => {
        bellRotate.value = withSpring(0);
      })
    );

    opacity.value = withTiming(1, { duration: 800 });
    
    // Stacking cards animation
    card1TranslateY.value = withDelay(800, withSpring(0, { damping: 14 }));
    card2TranslateY.value = withDelay(1000, withSpring(0, { damping: 14 }));
  }, []);

  const finishOnboarding = (status: 'granted' | 'denied') => {
    setNotificationPermission(status);
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      finishOnboarding(status === 'granted' ? 'granted' : 'denied');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong requesting notifications.');
      finishOnboarding('denied');
    }
  };

  const skipPermission = () => {
    finishOnboarding('denied');
  };

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${bellRotate.value}deg` }],
  }));

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card1TranslateY.value }],
    opacity: opacity.value,
  }));

  const card2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: card2TranslateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 bg-white px-8 pt-20 pb-12">
      <View className="flex-1 items-center justify-center">
        
        {/* Animated Premium Illustration */}
        <View className="items-center justify-center mb-12 h-56 w-full">
          
          <Animated.View className="bg-white w-24 h-24 rounded-full shadow-xl items-center justify-center border-8 border-slate-50 z-30" style={bellStyle}>
            <SymbolView name="bell.fill" size={40} tintColor={ACCENT} />
            <View className="absolute top-4 right-5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </Animated.View>

          {/* Floating Cards (Behind Bell) */}
          <Animated.View className="absolute top-4 w-56 bg-white rounded-2xl p-4 shadow-lg border border-slate-100 z-20" style={card1Style}>
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                <SymbolView name="tag.fill" size={14} tintColor={PRIMARY} />
              </View>
              <View>
                <Text className="font-bold text-slate-800 text-sm">Special Offer</Text>
                <Text className="text-slate-400 text-xs">50% off at local spa</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View className="absolute -bottom-2 w-64 bg-slate-50 rounded-2xl p-4 shadow-md border border-slate-200 z-10" style={card2Style}>
            <View className="flex-row items-center gap-3 opacity-60">
               <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
                <SymbolView name="sparkles" size={14} tintColor="#EA580C" />
              </View>
              <View>
                <Text className="font-bold text-slate-800 text-sm">New Business</Text>
                <Text className="text-slate-400 text-xs">Elite Plumbers joined</Text>
              </View>
            </View>
          </Animated.View>

        </View>

        {/* Typography */}
        <Text className="text-3xl font-extrabold text-slate-900 text-center mb-3">
          Stay Updated
        </Text>
        <Text className="text-base text-slate-500 text-center mb-10 px-4 leading-relaxed">
          Get notified about new businesses, exclusive offers, trending services, and personalized recommendations.
        </Text>

        {/* Benefits List */}
        <Animated.View className="w-full gap-4 px-4" style={{ opacity: opacity.value }}>
          <BenefitRow icon="bell.badge.fill" text="New Business Alerts" />
          <BenefitRow icon="ticket.fill" text="Exclusive Local Offers" />
          <BenefitRow icon="flame.fill" text="Trending Services" />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mt-auto pt-4">
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#1C398E] h-14 w-full rounded-full items-center justify-center shadow-lg shadow-[#1C398E]/30"
        >
          <Text className="text-white font-bold text-lg">Allow Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={skipPermission}
          className="h-14 w-full rounded-full items-center justify-center"
        >
          <Text className="text-slate-500 font-semibold text-base">Maybe Later</Text>
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
