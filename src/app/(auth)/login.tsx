import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, StatusBar, Image, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../../store/auth-store';
import { useUserStore } from '../../store/user-store';
const { height } = Dimensions.get('window');

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function PremiumLoginScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Animation Values
  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(30);
  
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  // Floating Elements
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const float3 = useSharedValue(0);

  useEffect(() => {
    import('expo-router').then(({ SplashScreen }) => {
      SplashScreen.hideAsync();
    });

    // Initial mount animations
    heroOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    heroTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }));
    contentTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));

    // Continuous floating animations
    float1.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    float2.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    float3.value = withRepeat(withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }]
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));

  const floatStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: float1.value * -15 }]
  }));
  const floatStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: float2.value * -20 }]
  }));
  const floatStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: float3.value * 15 }]
  }));

  const mutation = useMutation({
    mutationFn: (phoneNumber: string) => authApi.sendLoginOtp(phoneNumber),
    onSuccess: (data) => {
      // API call succeeded, navigate to verify OTP screen
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone }
      });
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  });

  const { login } = useAuthStore();
  const { setProfile } = useUserStore();

  const googleMutation = useMutation({
    mutationFn: (data: { idToken: string; user: any }) => authApi.googleLogin(data.idToken),
    onSuccess: (data, variables) => {
      console.log('Google Auth API Success:', data);
      login(data.access, data.refresh);
      
      // Use the actual Google user data returned by the SDK!
      const googleUser = variables.user;
      setProfile({
        id: googleUser.id || 'google_user',
        name: googleUser.name || `${googleUser.givenName || ''} ${googleUser.familyName || ''}`.trim() || 'Google User',
        email: googleUser.email || '',
        phone: '', // Google Auth usually doesn't provide phone numbers
      });
      router.replace('/(tabs)');
    },
    onError: (err: any) => {
      console.log('Google Auth API Error:', err?.response?.status, err?.response?.data);
      setError(err?.response?.data?.message || 'Google Sign-In failed on our server. Please try again.');
    }
  });

  useEffect(() => {
    // Configure Google Sign-In with the Web Client ID provided by the user
    GoogleSignin.configure({
      webClientId: '831597823890-cj7922dosfj6mq44ql15guisi7s7brp1.apps.googleusercontent.com',
      offlineAccess: true, // required to get the idToken/serverAuthCode
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google Sign-In...');
      setError('');
      await GoogleSignin.hasPlayServices();
      
      // Force Google Account Chooser to appear every time (clears remembered account)
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // ignore if already signed out
      }

      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Response:', JSON.stringify(userInfo, null, 2));
      
      if (userInfo.type === 'success' && userInfo.data?.idToken) {
        console.log('Sending ID Token to Backend...');
        // Pass both idToken and the user object to the mutation
        googleMutation.mutate({ 
          idToken: userInfo.data.idToken, 
          user: userInfo.data.user 
        });
      } else if (userInfo.type === 'cancelled') {
        console.log('User cancelled login');
      } else {
        setError('Failed to get identity token from Google. Check terminal logs.');
      }
    } catch (error: any) {
      console.log('Google Sign-In Exception:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Play services not available or outdated.');
      } else {
        setError('An unexpected Google error occurred.');
        console.error(error);
      }
    }
  };

  const handleContinue = () => {
    if (!phone) {
      setError('Please enter your mobile number.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian number.');
      return;
    }
    setError('');
    mutation.mutate(phone);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <KeyboardAwareScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        
        {/* --- HERO AREA (approx 40% height) --- */}
        <Animated.View style={[{ height: height * 0.35 }, heroAnimatedStyle]} className="items-center justify-center pt-10">
          
          {/* Abstract Premium Illustration Container */}
          <View className="w-full h-full items-center justify-center relative">
            
            {/* Background Soft Glow */}
            <View className="absolute w-64 h-64 bg-primary/10 rounded-full"  />

            {/* Central Element */}
            <View className="w-24 h-24 bg-card rounded-[28px] shadow-2xl items-center justify-center border border-border/50 z-20">
              <Ionicons name="search" size={36} color={PRIMARY} />
            </View>

            {/* Floating Badges */}
            <Animated.View className="absolute top-[20%] left-[15%] z-10" style={floatStyle1}>
              <View className="bg-card px-4 py-3 rounded-2xl shadow-lg border border-border flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                <Text className="font-bold text-foreground text-xs">Verified</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute bottom-[20%] right-[12%] z-30" style={floatStyle2}>
              <View className="bg-card p-3 rounded-2xl shadow-xl border border-border flex-row items-center gap-2">
                <View className="flex-row gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Ionicons key={i} name="star" size={12} color="#EAB308" />)}
                </View>
                <Text className="font-bold text-foreground text-xs">5.0</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute top-[50%] right-[20%] z-10" style={floatStyle3}>
              <View className="w-12 h-12 bg-card rounded-full shadow-lg items-center justify-center border border-border/50">
                <Ionicons name="location" size={20} color={ACCENT} />
              </View>
            </Animated.View>

            <Animated.View className="absolute bottom-[40%] left-[10%] z-20" style={floatStyle1}>
               <View className="w-10 h-10 bg-primary rounded-full shadow-lg items-center justify-center border-2 border-background">
                <Ionicons name="business" size={16} color="#FFF" />
              </View>
            </Animated.View>

          </View>
        </Animated.View>

        {/* --- WELCOME & AUTH SECTION (Floating Card) --- */}
        <Animated.View style={[contentAnimatedStyle, { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20 }]} className="bg-card rounded-[32px] mx-8 px-6 pt-12 pb-6 border border-border -mt-12 mb-8 z-50">
          
          <View className="items-center mt-6 mb-8">
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-1">
              Welcome to
            </Text>
            <Text className="text-4xl font-extrabold tracking-tight text-center">
              <Text className="text-[#1C398E]">Just</Text><Text className="text-[#c10007]">Klick</Text>
            </Text>
          </View>

          {/* 1. Primary Option: Google */}
          <TouchableOpacity 
            className="w-full h-14 bg-card rounded-2xl flex-row items-center justify-center shadow-sm border border-border mb-6"
            activeOpacity={0.7}
            onPress={handleGoogleLogin}
            disabled={googleMutation.isPending}
          >
            {googleMutation.isPending ? (
              <ActivityIndicator color={PRIMARY} />
            ) : (
              <>
                <Image 
                  source={require('@/assets/images/google-logo.png')} 
                  style={{ width: 22, height: 22, position: 'absolute', left: 20 }} 
                />
                <Text className="text-[16px] font-bold text-foreground">Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center mb-6 px-4">
            <View className="flex-1 h-[1px] bg-border" />
            <Text className="mx-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Or</Text>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* 2. Secondary Option: Mobile Number */}
          <View className={`w-full bg-muted rounded-[24px] p-5 border ${error ? 'border-destructive/50' : 'border-border/50'} mb-6`}>
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">Mobile Number</Text>
            
            <View className={`flex-row items-center h-14 rounded-xl bg-card border ${error ? 'border-destructive' : 'border-border'} px-4 mb-3 shadow-sm`}>
              <View className="flex-row items-center border-r border-border pr-3 mr-3">
                <Text className="text-[16px] font-bold text-foreground">+91</Text>
                <Ionicons name="chevron-down" size={14} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
              <TextInput 
                className="flex-1 text-lg font-bold text-foreground h-full tracking-wider"
                placeholder="00000 00000"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (error) setError('');
                }}
              />
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={{ color: '#EF4444' }} className="text-xs font-semibold ml-2 mb-4">{error}</Text>
            ) : null}

            <TouchableOpacity 
              className="w-full h-14 rounded-xl bg-primary flex-row items-center justify-center shadow-lg shadow-primary/30 mt-2"
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text className="text-[16px] font-bold text-primary-foreground">Continue with Mobile</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ position: 'absolute', right: 20 }} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* --- REGISTER LINK --- */}
          <View className="flex-row items-center justify-center mb-6">
            <Text className="text-[13px] text-muted-foreground font-medium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.7}>
              <Text className="text-[13px] font-bold text-[#c10007] tracking-wide">Register Here</Text>
            </TouchableOpacity>
          </View>

          {/* --- FOOTER --- */}
          <View className="items-center justify-center mt-auto pb-4">
            <Text className="text-[11px] text-muted-foreground font-medium text-center leading-relaxed px-4">
              By continuing, you agree to our{'\n'}
              <Text className="font-bold text-primary">Terms of Service</Text> and <Text className="font-bold text-primary">Privacy Policy</Text>
            </Text>
          </View>

        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}
