import React, { useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

const { width, height } = Dimensions.get('window');

// Brand Colors
const PRIMARY = '#1C398E';
const ACCENT = '#c10007';

const ONBOARDING_DATA = [
  {
    title: 'Your Study Abroad Journey',
    description: 'Find trusted overseas consultants, coaching centers, hostels, and hospitals to simplify your international education.',
  },
  {
    title: 'Verified Student Reviews',
    description: 'Explore authentic ratings, student experiences, and detailed reviews for consultants and coaching centers before deciding.',
  },
  {
    title: 'Connect Instantly',
    description: 'Send enquiries, call consultants, send WhatsApp messages, and save your favorite student services effortlessly.',
  },
  {
    title: 'Everything A Student Needs',
    description: 'Overseas consultants, student housing, visa services, and coaching centers—all localized and verified in one platform.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  const goToNextPage = (index: number) => {
    if (index === ONBOARDING_DATA.length - 1) {
      router.push('/permissions/location' as any);
    } else {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {ONBOARDING_DATA.map((page, index) => (
          <View key={index} style={{ width, height }} className="items-center px-8">
            
            {/* The Custom Programmatic Illustration Container */}
            <View className="flex-1 w-full items-center justify-center pt-10">
              <Illustration index={index} scrollOffset={scrollOffset} />
            </View>

            {/* The Content & Controls */}
            <View className="h-1/3 w-full justify-start items-center pb-12">
              <Text className="text-3xl font-extrabold text-foreground text-center mb-4 leading-tight">
                {page.title}
              </Text>
              <Text className="text-[15px] font-medium text-muted-foreground text-center leading-relaxed px-2">
                {page.description}
              </Text>
            </View>

            {/* Pagination & Next Button */}
            <View className="absolute bottom-12 w-full flex-row justify-between items-center px-8">
              {/* Pagination Dots */}
              <View className="flex-row gap-2">
                {ONBOARDING_DATA.map((_, i) => {
                  const dotStyle = useAnimatedStyle(() => {
                    const isActive = interpolate(
                      scrollOffset.value,
                      [(i - 1) * width, i * width, (i + 1) * width],
                      [0, 1, 0],
                      Extrapolation.CLAMP
                    );
                    return {
                      width: 8 + isActive * 16,
                      backgroundColor: isActive ? PRIMARY : '#E2E8F0',
                    };
                  });
                  return <Animated.View key={i} className="h-2 rounded-full" style={dotStyle} />;
                })}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                onPress={() => goToNextPage(index)}
                className="bg-[#1C398E] h-14 px-8 rounded-full items-center justify-center shadow-md shadow-[#1C398E]/30"
              >
                <Text className="text-white font-bold text-base">
                  {index === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

// ----------------------------------------------------
// Custom Programmatic Illustrations
// ----------------------------------------------------
function Illustration({ index, scrollOffset }: { index: number; scrollOffset: SharedValue<number> }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Helper for Parallax effect
  const useParallax = (outputRange: number[]) => useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(scrollOffset.value, inputRange, outputRange, Extrapolation.CLAMP)
    }, {
      scale: interpolate(scrollOffset.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP)
    }],
    opacity: interpolate(scrollOffset.value, inputRange, [0, 1, 0], Extrapolation.CLAMP)
  }));

  if (index === 0) return <Screen1Illustration useParallax={useParallax} />;
  if (index === 1) return <Screen2Illustration useParallax={useParallax} />;
  if (index === 2) return <Screen3Illustration useParallax={useParallax} />;
  if (index === 3) return <Screen4Illustration useParallax={useParallax} />;
  return null;
}

// Screen 1: Discover Local Businesses (Nodes connected via lines)
function Screen1Illustration({ useParallax }: { useParallax: (range: number[]) => any }) {
  const centerStyle = useParallax([50, 0, -50]);
  const node1Style = useParallax([80, 0, -80]);
  const node2Style = useParallax([-80, 0, 80]);
  const node3Style = useParallax([100, 0, -100]);

  return (
    <View className="w-full h-full items-center justify-center">
      {/* Central Node */}
      <Animated.View className="w-24 h-24 rounded-full bg-[#1C398E]/10 items-center justify-center border-4 border-white shadow-xl z-10" style={centerStyle}>
        <SymbolView name="mappin.and.ellipse" size={40} tintColor={PRIMARY} />
      </Animated.View>
      
      {/* Floating Category Badges */}
      <Animated.View className="absolute top-[20%] left-[10%] bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex-row items-center gap-2" style={node1Style}>
        <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
          <SymbolView name="globe" size={16} tintColor="#EA580C" />
        </View>
        <Text className="font-bold text-slate-700">Consultants</Text>
      </Animated.View>

      <Animated.View className="absolute bottom-[30%] right-[5%] bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex-row items-center gap-2" style={node2Style}>
        <View className="w-8 h-8 rounded-full bg-emerald-100 items-center justify-center">
          <SymbolView name="book.closed.fill" size={16} tintColor="#16A34A" />
        </View>
        <Text className="font-bold text-slate-700">Coaching</Text>
      </Animated.View>

      <Animated.View className="absolute top-[50%] left-[0%] bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex-row items-center gap-2" style={node3Style}>
        <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
          <SymbolView name="building.2.fill" size={16} tintColor="#2563EB" />
        </View>
        <Text className="font-bold text-slate-700">Hostels</Text>
      </Animated.View>
    </View>
  );
}

// Screen 2: Reviews You Can Trust (Floating Profile Cards)
function Screen2Illustration({ useParallax }: { useParallax: (range: number[]) => any }) {
  const card1Style = useParallax([100, 0, -100]);
  const card2Style = useParallax([150, 0, -150]);

  return (
    <View className="w-full h-full items-center justify-center">
      <Animated.View className="w-72 bg-white rounded-3xl p-5 shadow-lg border border-slate-100 absolute z-10 top-[20%] -rotate-6" style={card1Style}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-slate-200 items-center justify-center">
              <SymbolView name="person.fill" size={24} tintColor="#94A3B8" />
            </View>
            <View>
              <Text className="font-bold text-slate-800 text-lg">Apex Overseas</Text>
              <View className="flex-row items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => <SymbolView key={i} name="star.fill" size={12} tintColor="#EAB308" />)}
              </View>
            </View>
          </View>
          <SymbolView name="checkmark.seal.fill" size={24} tintColor={PRIMARY} />
        </View>
        <Text className="text-slate-500 text-sm leading-5">"Excellent guidance! They helped me get my study visa in just 2 weeks."</Text>
      </Animated.View>

      <Animated.View className="w-64 bg-white rounded-3xl p-5 shadow-xl border border-slate-100 absolute z-20 bottom-[25%] right-0 rotate-3" style={card2Style}>
         <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-full bg-slate-200 items-center justify-center">
              <SymbolView name="person.fill" size={20} tintColor="#94A3B8" />
            </View>
            <View>
              <Text className="font-bold text-slate-800">Sarah M.</Text>
              <Text className="text-xs text-slate-400">2 days ago</Text>
            </View>
          </View>
          <Text className="text-slate-600 font-medium">★★★★★ Incredible experience.</Text>
      </Animated.View>
    </View>
  );
}

// Screen 3: Connect Faster
function Screen3Illustration({ useParallax }: { useParallax: (range: number[]) => any }) {
  const centerCard = useParallax([50, 0, -50]);
  const icon1 = useParallax([120, 0, -120]);
  const icon2 = useParallax([-100, 0, 100]);
  const icon3 = useParallax([140, 0, -140]);

  return (
    <View className="w-full h-full items-center justify-center">
      <Animated.View className="w-48 h-64 bg-white rounded-[32px] shadow-xl border border-slate-100 items-center justify-center z-10" style={centerCard}>
        <View className="w-20 h-20 rounded-2xl bg-[#1C398E]/10 items-center justify-center mb-4">
          <SymbolView name="building.columns.fill" size={40} tintColor={PRIMARY} />
        </View>
        <Text className="font-bold text-xl text-slate-800 text-center px-2">Global Ed</Text>
        <Text className="text-slate-400 text-sm mt-1">Study Abroad</Text>
      </Animated.View>

      <Animated.View className="absolute top-[25%] right-[15%] w-16 h-16 bg-[#1C398E] rounded-full shadow-lg items-center justify-center border-4 border-white z-20" style={icon1}>
        <SymbolView name="phone.fill" size={24} tintColor="#FFF" />
      </Animated.View>

      <Animated.View className="absolute bottom-[30%] left-[10%] w-16 h-16 bg-[#c10007] rounded-full shadow-lg items-center justify-center border-4 border-white z-20" style={icon2}>
        <SymbolView name="paperplane.fill" size={24} tintColor="#FFF" />
      </Animated.View>

      <Animated.View className="absolute top-[40%] left-[5%] w-14 h-14 bg-slate-800 rounded-full shadow-lg items-center justify-center border-4 border-white z-20" style={icon3}>
        <SymbolView name="bookmark.fill" size={20} tintColor="#FFF" />
      </Animated.View>
    </View>
  );
}

// Screen 4: Everything Near You
function Screen4Illustration({ useParallax }: { useParallax: (range: number[]) => any }) {
  const mapStyle = useParallax([40, 0, -40]);
  const pin1 = useParallax([150, 0, -150]);
  const pin2 = useParallax([-100, 0, 100]);

  return (
    <View className="w-full h-full items-center justify-center">
      {/* Isometric Map Base */}
      <Animated.View className="w-72 h-72 bg-slate-100 rounded-full items-center justify-center border-8 border-white shadow-xl" style={mapStyle}>
        {/* Decorative Grid Lines */}
        <View className="w-full h-[1px] bg-white absolute top-1/3" />
        <View className="w-full h-[1px] bg-white absolute top-2/3" />
        <View className="h-full w-[1px] bg-white absolute left-1/3" />
        <View className="h-full w-[1px] bg-white absolute left-2/3" />
        
        {/* Central Pulse */}
        <View className="w-32 h-32 rounded-full bg-[#1C398E]/10 absolute items-center justify-center">
          <View className="w-4 h-4 rounded-full bg={PRIMARY} shadow-sm shadow={PRIMARY}" />
        </View>
      </Animated.View>

      <Animated.View className="absolute top-[25%] right-[20%] items-center" style={pin1}>
        <View className="bg-white px-3 py-1 rounded-full shadow-sm mb-1"><Text className="text-xs font-bold text-slate-600">Consultant</Text></View>
        <SymbolView name="mappin.circle.fill" size={32} tintColor={ACCENT} />
      </Animated.View>

      <Animated.View className="absolute bottom-[35%] left-[20%] items-center" style={pin2}>
        <View className="bg-white px-3 py-1 rounded-full shadow-sm mb-1"><Text className="text-xs font-bold text-slate-600">Hostel</Text></View>
        <SymbolView name="mappin.circle.fill" size={32} tintColor={PRIMARY} />
      </Animated.View>
    </View>
  );
}
