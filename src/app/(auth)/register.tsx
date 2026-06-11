import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, StatusBar, Modal, Pressable } from 'react-native';
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

const { height } = Dimensions.get('window');

const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Bachelors Degree',
  'Masters Degree',
  'Doctorate (PhD)',
  'Other'
];

export default function PremiumRegisterScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [eduModalVisible, setEduModalVisible] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState('');
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

  const handleRegister = () => {
    if (!fullName.trim() || fullName.length < 2) {
      setError('Please enter a valid full name.');
      return;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian number.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!selectedEdu) {
      setError('Please select your education level.');
      return;
    }
    setError('');
    router.push('/(auth)/verify-otp');
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        className="absolute top-12 left-6 z-50 w-10 h-10 bg-card rounded-full items-center justify-center shadow-md border border-border"
      >
        <Ionicons name="arrow-back" size={20} color={PRIMARY} />
      </TouchableOpacity>

      <KeyboardAwareScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        
        {/* --- HERO AREA --- */}
        <Animated.View style={[{ height: height * 0.35 }, heroAnimatedStyle]} className="items-center justify-center pt-10">
          <View className="w-full h-full items-center justify-center relative">
            <View className="absolute w-64 h-64 bg-primary/10 rounded-full" style={{ filter: 'blur(40px)' }} />
            <View className="w-24 h-24 bg-card rounded-[28px] shadow-2xl items-center justify-center border border-border/50 z-20">
              <Ionicons name="person-add" size={36} color={PRIMARY} />
            </View>

            <Animated.View className="absolute top-[20%] left-[15%] z-10" style={floatStyle1}>
              <View className="bg-card px-4 py-3 rounded-2xl shadow-lg border border-border flex-row items-center gap-2">
                <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
                <Text className="font-bold text-foreground text-xs">Secure</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute bottom-[20%] right-[12%] z-30" style={floatStyle2}>
              <View className="bg-card p-3 rounded-2xl shadow-xl border border-border flex-row items-center gap-2">
                <View className="flex-row gap-0.5">
                  <Ionicons name="rocket" size={16} color={ACCENT} />
                </View>
                <Text className="font-bold text-foreground text-xs">Fast</Text>
              </View>
            </Animated.View>

            <Animated.View className="absolute top-[50%] right-[20%] z-10" style={floatStyle3}>
              <View className="w-12 h-12 bg-card rounded-full shadow-lg items-center justify-center border border-border/50">
                <Ionicons name="star" size={20} color="#EAB308" />
              </View>
            </Animated.View>

            <Animated.View className="absolute bottom-[40%] left-[10%] z-20" style={floatStyle1}>
               <View className="w-10 h-10 bg-primary rounded-full shadow-lg items-center justify-center border-2 border-background">
                <Ionicons name="business" size={16} color="#FFF" />
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* --- REGISTRATION SECTION (Floating Card) --- */}
        <Animated.View 
          style={[contentAnimatedStyle, { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20 }]} 
          className="bg-card rounded-[32px] mx-8 px-6 pt-10 pb-6 border border-border -mt-12 mb-8 z-50"
        >
          
          <View className="items-center mt-2 mb-6">
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center mb-1">
              Join
            </Text>
            <Text className="text-4xl font-extrabold tracking-tight text-center">
              <Text className="text-[#1C398E]">Just</Text><Text className="text-[#c10007]">Klick</Text>
            </Text>
          </View>

          <View className={`w-full bg-muted rounded-[24px] p-5 border ${error ? 'border-destructive/50' : 'border-border/50'} mb-6`}>
            
            {/* Full Name */}
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1 mt-1">Full Name</Text>
            <View className="flex-row items-center h-12 rounded-xl bg-card border border-border px-4 mb-4 shadow-sm">
              <Ionicons name="person" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput 
                className="flex-1 text-base font-bold text-foreground h-full"
                placeholder="John Doe"
                placeholderTextColor="#64748B"
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val);
                  if (error) setError('');
                }}
              />
            </View>

            {/* Mobile Number */}
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">Mobile Number</Text>
            <View className="flex-row items-center h-12 rounded-xl bg-card border border-border px-4 mb-4 shadow-sm">
              <View className="flex-row items-center border-r border-border pr-3 mr-3">
                <Text className="text-[15px] font-bold text-foreground">+91</Text>
                <Ionicons name="chevron-down" size={12} color="#94A3B8" style={{ marginLeft: 6 }} />
              </View>
              <TextInput 
                className="flex-1 text-base font-bold text-foreground h-full tracking-wider"
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

            {/* Email Address */}
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center h-12 rounded-xl bg-card border border-border px-4 mb-4 shadow-sm">
              <Ionicons name="mail" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput 
                className="flex-1 text-base font-bold text-foreground h-full"
                placeholder="john@example.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (error) setError('');
                }}
              />
            </View>

            {/* Education Level */}
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">Education Level</Text>
            <TouchableOpacity 
              className="flex-row items-center justify-between h-12 rounded-xl bg-card border border-border px-4 mb-4 shadow-sm active:opacity-70"
              onPress={() => setEduModalVisible(true)}
            >
              <View className="flex-row items-center">
                <Ionicons name="school" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                <Text className={`text-base font-bold ${selectedEdu ? 'text-foreground' : 'text-[#64748B]'}`}>
                  {selectedEdu || "Select Education Level"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Error Message */}
            {error ? (
              <Text style={{ color: '#EF4444' }} className="text-xs font-semibold ml-2 mb-4">{error}</Text>
            ) : null}

            <TouchableOpacity 
              className="w-full h-14 rounded-xl bg-[#c10007] flex-row items-center justify-center shadow-lg shadow-[#c10007]/30 mt-2"
              activeOpacity={0.8}
              onPress={handleRegister}
            >
              <Text className="text-[16px] font-bold text-white">Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ position: 'absolute', right: 20 }} />
            </TouchableOpacity>
          </View>

          {/* --- LOGIN LINK --- */}
          <View className="flex-row items-center justify-center mb-4">
            <Text className="text-[13px] text-muted-foreground font-medium">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text className="text-[13px] font-bold text-[#1C398E] tracking-wide">Log In Here</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </KeyboardAwareScrollView>

      {/* Education Level Modal */}
      <Modal
        visible={eduModalVisible}
        transparent={true}
        animationType="slide"
      >
        <Pressable 
          className="flex-1 bg-black/60 justify-end"
          onPress={() => setEduModalVisible(false)}
        >
          <Pressable className="bg-card rounded-t-[32px] pt-2 pb-10 px-6 shadow-2xl">
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-border rounded-full self-center mb-6 mt-3" />
            
            <Text className="text-xl font-bold text-foreground mb-6 px-2">Select Education Level</Text>
            
            <View className="gap-3">
              {EDUCATION_LEVELS.map((level, idx) => (
                <TouchableOpacity 
                  key={idx}
                  className={`flex-row items-center justify-between p-4 rounded-2xl border ${selectedEdu === level ? 'border-primary bg-primary/10' : 'border-border bg-muted'}`}
                  onPress={() => {
                    setSelectedEdu(level);
                    if (error) setError('');
                    setEduModalVisible(false);
                  }}
                >
                  <Text className={`text-base font-bold ${selectedEdu === level ? 'text-primary' : 'text-foreground'}`}>
                    {level}
                  </Text>
                  {selectedEdu === level && (
                    <Ionicons name="checkmark-circle" size={22} color={PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}
