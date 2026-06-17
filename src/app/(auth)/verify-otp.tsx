import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { useAuthStore } from '../../store/auth-store';
import { useUserStore } from '../../store/user-store';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/auth';

const { height } = Dimensions.get('window');

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

export default function PremiumVerifyOTPScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { login } = useAuthStore();
  const { setProfile } = useUserStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);

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

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

  const handleOtpChange = (value: string, index: number) => {
    if (error) setError('');

    // Production-ready: Handle pasting a full 6-digit code or auto-fill
    if (value.length === 6) {
      const newOtp = value.split('').slice(0, 6);
      setOtp(newOtp);
      inputs.current[5]?.focus();
      return;
    }

    // Normal logic: Extract the last typed character in case of fast typing
    const digit = value.length > 0 ? value.slice(-1) : '';

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input if a digit was entered
    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const { phone, type, firstName, lastName, email } = useLocalSearchParams<{ 
    phone: string, 
    type?: string, 
    firstName?: string, 
    lastName?: string, 
    email?: string 
  }>();

  const mutation = useMutation({
    mutationFn: (fullOtp: string) => {
      if (type === 'register') {
        return authApi.studentRegister(firstName || '', lastName || '', email || '', phone, fullOtp);
      }
      return authApi.studentLogin(phone, fullOtp);
    },
    onSuccess: (data: any) => {
      // Backend might return 200 OK but with success: false in the JSON body
      if (data.success === false) {
        setError(data.message || 'Login failed on our server. Please try again.');
        return;
      }

      // Handle both "access" and "access_token" variations from the backend
      const accessToken = data.access || data.access_token;
      const refreshToken = data.refresh || data.refresh_token;

      if (!accessToken) {
        setError('Received invalid authentication token from the server.');
        return;
      }

      // Authenticate with real JWT tokens
      login(accessToken, refreshToken);
      
      // Update local profile representation
      setProfile({
        id: 'user_from_api',
        name: type === 'register' ? `${firstName} ${lastName}`.trim() : 'Student',
        email: email || '',
        phone: phone,
      });

      // Navigate based on auth type
      if (type === 'register') {
        router.replace('/(auth)/student-onboarding');
      } else {
        router.replace('/(tabs)/index' as any); // Force navigate to the Home tab
      }
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  });

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    if (!phone) {
      setError('Phone number is missing. Please go back and try again.');
      return;
    }
    setError('');
    mutation.mutate(fullOtp);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background" 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        className="absolute top-12 left-6 z-50 w-10 h-10 bg-card rounded-full items-center justify-center shadow-md border border-border"
      >
        <Ionicons name="arrow-back" size={20} color={PRIMARY} />
      </TouchableOpacity>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* --- HERO AREA --- */}
        <Animated.View style={[{ height: height * 0.4 }, heroAnimatedStyle]} className="items-center justify-center pt-10">
          <View className="w-full h-full items-center justify-center relative">
            <View className="absolute w-64 h-64 bg-[#c10007]/5 rounded-full"  />
            
            <View className="w-24 h-24 bg-card rounded-[28px] shadow-2xl items-center justify-center border border-border/50 z-20">
              <Ionicons name="chatbubble-ellipses" size={36} color={ACCENT} />
            </View>

            <Animated.View className="absolute top-[20%] left-[15%] z-10" style={floatStyle1}>
              <View className="bg-card px-4 py-3 rounded-2xl shadow-lg border border-border flex-row items-center gap-2">
                <Ionicons name="lock-closed" size={18} color="#16A34A" />
                <Text className="font-bold text-foreground text-xs">Secure</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute bottom-[20%] right-[12%] z-30" style={floatStyle2}>
              <View className="bg-card p-3 rounded-2xl shadow-xl border border-border flex-row items-center gap-2">
                <Ionicons name="shield-checkmark" size={16} color={PRIMARY} />
                <Text className="font-bold text-foreground text-xs">Verified</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute top-[50%] right-[20%] z-10" style={floatStyle3}>
              <View className="w-12 h-12 bg-card rounded-full shadow-lg items-center justify-center border border-border/50">
                <Ionicons name="phone-portrait" size={20} color="#EAB308" />
              </View>
            </Animated.View>

          </View>
        </Animated.View>

        {/* --- OTP VERIFICATION SECTION (Floating Card) --- */}
        <Animated.View 
          style={[contentAnimatedStyle, { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20 }]} 
          className="bg-card rounded-[32px] mx-8 px-6 pt-10 pb-8 border border-border -mt-16 mb-8 z-50"
        >
          
          <View className="items-center mt-2 mb-8 px-2">
            <Text className="text-4xl font-extrabold tracking-tight text-center text-foreground mb-2">
              Verify Code
            </Text>
            <Text className="text-[13px] font-medium text-muted-foreground text-center leading-relaxed">
              We've sent a 6-digit verification code to your mobile number.
            </Text>
          </View>

          <View className="w-full bg-muted rounded-[24px] p-6 border border-border/50 mb-6">
            
            {/* OTP Input Container */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 8 }}>
              {otp.map((digit, index) => (
                <View 
                  key={index} 
                  style={{ width: '14%', aspectRatio: 0.8 }}
                  className={`rounded-[8px] bg-card border ${digit ? 'border-primary' : 'border-border'} shadow-sm items-center justify-center`}
                >
                  <TextInput
                    ref={(ref) => { inputs.current[index] = ref; }}
                    className={`w-full h-full text-center text-xl font-black ${digit ? 'text-primary' : 'text-foreground'} pb-1`}
                    keyboardType="number-pad"
                    maxLength={6} // Allows pasting full code
                    textContentType="oneTimeCode" // iOS Auto-fill
                    autoComplete="sms-otp" // Android Auto-fill
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={{ color: '#EF4444' }} className="text-xs font-semibold text-center mt-4">{error}</Text>
            ) : null}

          </View>

          {/* Resend Timer */}
          <View className="flex-row items-center justify-center mb-8">
            <Text className="text-[13px] text-muted-foreground font-medium">Didn't receive the code? </Text>
            {timer > 0 ? (
              <Text className="text-[13px] font-bold text-muted-foreground tracking-wide">Wait {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(30)} activeOpacity={0.7}>
                <Text className="text-[13px] font-bold text-[#c10007] tracking-wide">Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            className="w-full h-14 rounded-xl bg-primary flex-row items-center justify-center shadow-lg shadow-primary/30"
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text className="text-[16px] font-bold text-primary-foreground">Verify & Proceed</Text>
                <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ position: 'absolute', right: 20 }} />
              </>
            )}
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
}
