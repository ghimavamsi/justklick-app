import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function NotificationPermissionScreen() {
  const router = useRouter();
  const { setNotificationPermission, completeOnboarding } = useAppStore();
  const { colorScheme } = useTheme();

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
    <View className="flex-1 bg-background px-8 pt-20 pb-12">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      <View className="flex-1 items-center justify-center">
        
        {/* Animated Premium Illustration */}
        <View className="items-center justify-center mb-12 h-56 w-full">
          
          <Animated.View className="bg-card w-24 h-24 rounded-full shadow-xl items-center justify-center border-8 border-background z-30" style={bellStyle}>
            <Ionicons name="notifications" size={40} color={ACCENT} />
            <View className="absolute top-4 right-5 w-3 h-3 bg-red-500 rounded-full border-2 border-card" />
          </Animated.View>

          {/* Floating Cards (Behind Bell) */}
          <Animated.View className="absolute top-4 w-56 bg-card rounded-2xl p-4 shadow-lg border border-border z-20" style={card1Style}>
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center">
                <Ionicons name="pricetag" size={14} color={PRIMARY} />
              </View>
              <View>
                <Text className="font-bold text-foreground text-sm">Special Offer</Text>
                <Text className="text-muted-foreground text-xs">50% off at local spa</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View className="absolute -bottom-2 w-64 bg-muted rounded-2xl p-4 shadow-md border border-border z-10" style={card2Style}>
            <View className="flex-row items-center gap-3 opacity-60">
               <View className="w-8 h-8 rounded-full bg-[#EA580C]/20 items-center justify-center">
                <Ionicons name="sparkles" size={14} color="#EA580C" />
              </View>
              <View>
                <Text className="font-bold text-foreground text-sm">New Business</Text>
                <Text className="text-muted-foreground text-xs">Elite Plumbers joined</Text>
              </View>
            </View>
          </Animated.View>

        </View>

        {/* Typography */}
        <Text className="text-3xl font-extrabold text-foreground text-center mb-3">
          Stay Updated
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-10 px-4 leading-relaxed">
          Get notified about new businesses, exclusive offers, trending services, and personalized recommendations.
        </Text>

        {/* Benefits List */}
        <Animated.View className="w-full gap-4 px-4" style={useAnimatedStyle(() => ({ opacity: opacity.value }))}>
          <BenefitRow icon="notifications" text="New Business Alerts" />
          <BenefitRow icon="ticket" text="Exclusive Local Offers" />
          <BenefitRow icon="flame" text="Trending Services" />
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mt-auto pt-4">
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary h-14 w-full rounded-full flex-row items-center justify-center shadow-lg shadow-primary/30"
        >
          <Text className="text-primary-foreground font-bold text-lg text-center">Allow Notifications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={skipPermission}
          className="h-14 w-full rounded-full flex-row items-center justify-center"
        >
          <Text className="text-muted-foreground font-semibold text-base text-center">Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BenefitRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="w-10 h-10 rounded-full bg-muted border border-border/50 items-center justify-center">
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>
      <Text className="text-foreground font-medium text-[15px]">{text}</Text>
    </View>
  );
}
