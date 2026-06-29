import { useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
  withRepeat
} from 'react-native-reanimated';
import { useRouter, SplashScreen } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store';
import { useAuthStore } from '../store/auth-store';
import { useUserStore } from '../store/user-store';
import { studentApi } from '../api/student';

const { width, height } = Dimensions.get('window');

// Brand Colors
const PRIMARY = '#203A8A';
const ACCENT = '#c10007';

export default function PremiumSplash() {
  const router = useRouter();
  const { hasSeenOnboarding } = useAppStore();

  // Animation States
  const logoOpacity = useSharedValue(1);
  const logoTranslateY = useSharedValue(0);
  const logoScale = useSharedValue(1);

  const nodesOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  const bottomSectionOpacity = useSharedValue(0);
  const loaderProgress = useSharedValue(0);

  const navigateToNextScreen = () => {
    const currentHasSeenOnboarding = useAppStore.getState().hasSeenOnboarding;
    const currentIsAuthenticated = useAuthStore.getState().isAuthenticated;
    const { isProfileComplete, setProfileComplete } = useUserStore.getState();
    
    if (!currentHasSeenOnboarding) {
      router.replace('/onboarding');
    } else if (!currentIsAuthenticated) {
      router.replace('/(auth)/login');
    } else {
      if (isProfileComplete) {
        router.replace('/(tabs)');
      } else {
        // Fetch profile to make sure
        studentApi.getProfile()
          .then(profile => {
            if (profile && profile.college_code) {
              setProfileComplete(true);
              router.replace('/(tabs)');
            } else {
              setProfileComplete(false);
              router.replace('/(auth)/student-onboarding');
            }
          })
          .catch(() => {
            // TEMPORARILY DISABLED: The backend is returning 401s, which traps the user here.
            // setProfileComplete(false);
            // router.replace('/(auth)/student-onboarding');
            
            // Let them into the app to test UI:
            router.replace('/(tabs)');
          });
      }
    }
  };

  useEffect(() => {
    // Hide native splash screen ONLY when React Native has successfully painted this screen
    SplashScreen.hideAsync();

    // 1. Initial subtle search pulse
    pulseOpacity.value = withTiming(0.15, { duration: 400 });
    pulseScale.value = withRepeat(withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) }), -1, true);

    // 2. Glowing nodes (businesses) gently appear
    nodesOpacity.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }));

    // 3. Tagline & elegant loader appear
    bottomSectionOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    loaderProgress.value = withDelay(500, withTiming(100, { duration: 1200, easing: Easing.inOut(Easing.quad) }));

    // 4. Transition to app
    setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 300 });
      nodesOpacity.value = withTiming(0, { duration: 300 });
      bottomSectionOpacity.value = withTiming(0, { duration: 300 });
      pulseOpacity.value = withTiming(0, { duration: 300 });
      
      setTimeout(() => {
        runOnJS(navigateToNextScreen)();
      }, 350);
    }, 1800);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoTranslateY.value },
      { scale: logoScale.value }
    ],
    alignItems: 'center',
  }));

  const nodesStyle = useAnimatedStyle(() => ({
    opacity: nodesOpacity.value,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    opacity: bottomSectionOpacity.value,
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    width: `${loaderProgress.value}%`,
  }));

  return (
    <View className="flex-1 bg-background items-center justify-center overflow-hidden">
      
      {/* Mesh Gradient Accents */}
      <View className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-primary/15"  />
      <View className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-[#c10007]/15"  />

      {/* Soft Ambient Center Pulse */}
      <Animated.View 
        className="absolute w-64 h-64 rounded-full bg-primary/30" 
        style={pulseStyle} 
      />

      {/* Centerpiece Container */}
      <View className="items-center justify-center h-48 w-full z-10">
        
        {/* The Premium Logo */}
        <Animated.View style={logoStyle}>
          <Text className="text-4xl tracking-[0.10em] font-extrabold text-[#203A8A]">
            Just<Text className="text-[#c10007]">Klick</Text>
          </Text>
          <Text className="text-[11px] uppercase tracking-[0.3em] text-[#64748B] mt-3 font-semibold">
            Discover • Connect • Grow
          </Text>
        </Animated.View>

      </View>

      {/* Glowing Nodes (Connecting Businesses) */}
      <Animated.View style={nodesStyle}>
        <View className="absolute top-[35%] left-[20%] w-2 h-2 rounded-full bg-[#203A8A]/40 shadow-sm shadow-[#203A8A]" />
        <View className="absolute top-[45%] right-[25%] w-3 h-3 rounded-full bg-[#c10007]/30 shadow-sm shadow-[#c10007]" />
        <View className="absolute top-[60%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#203A8A]/50 shadow-sm shadow-[#203A8A]" />
        <View className="absolute top-[38%] right-[15%] w-2 h-2 rounded-full bg-[#203A8A]/40 shadow-sm shadow-[#203A8A]" />
      </Animated.View>

      {/* Bottom Section: Elegant Loader & Version */}
      <Animated.View className="absolute bottom-12 w-full items-center px-12" style={bottomStyle}>
        {/* Premium Line Loader */}
        <View className="w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden mb-6">
          <Animated.View className="h-full bg-[#203A8A] rounded-full" style={loaderStyle} />
        </View>
        <Text className="text-[10px] tracking-widest text-slate-400 font-medium">v1.0.0</Text>
      </Animated.View>

    </View>
  );
}
