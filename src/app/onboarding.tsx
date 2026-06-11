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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

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
  const { colorScheme } = useTheme();
  const scrollOffset = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  const goToNextPage = (index: number) => {
    if (index === ONBOARDING_DATA.length - 1) {
      router.replace('/permissions/location');
    } else {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
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
                {ONBOARDING_DATA.map((_, i) => (
                  <PaginationDot key={i} i={i} scrollOffset={scrollOffset} />
                ))}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                onPress={() => goToNextPage(index)}
                className="bg-primary h-14 px-8 rounded-full items-center justify-center shadow-md shadow-primary/30"
              >
                <Text className="text-primary-foreground font-bold text-base">
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

function PaginationDot({ i, scrollOffset }: { i: number; scrollOffset: SharedValue<number> }) {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = interpolate(
      scrollOffset.value,
      [(i - 1) * width, i * width, (i + 1) * width],
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return {
      width: 8 + isActive * 16,
      backgroundColor: isActive ? PRIMARY : '#64748B',
      opacity: isActive ? 1 : 0.4
    };
  });
  return <Animated.View className="h-2 rounded-full" style={dotStyle} />;
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
      <Animated.View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center border-4 border-background shadow-xl z-10" style={centerStyle}>
        <Ionicons name="location" size={40} color={PRIMARY} />
      </Animated.View>
      
      {/* Floating Category Badges */}
      <Animated.View className="absolute top-[20%] left-[10%] bg-card px-4 py-3 rounded-2xl shadow-sm border border-border flex-row items-center gap-2" style={node1Style}>
        <View className="w-8 h-8 rounded-full bg-[#EA580C]/20 items-center justify-center">
          <Ionicons name="globe" size={16} color="#EA580C" />
        </View>
        <Text className="font-bold text-foreground">Consultants</Text>
      </Animated.View>

      <Animated.View className="absolute bottom-[30%] right-[5%] bg-card px-4 py-3 rounded-2xl shadow-sm border border-border flex-row items-center gap-2" style={node2Style}>
        <View className="w-8 h-8 rounded-full bg-[#16A34A]/20 items-center justify-center">
          <Ionicons name="book" size={16} color="#16A34A" />
        </View>
        <Text className="font-bold text-foreground">Coaching</Text>
      </Animated.View>

      <Animated.View className="absolute top-[50%] left-[0%] bg-card px-4 py-3 rounded-2xl shadow-sm border border-border flex-row items-center gap-2" style={node3Style}>
        <View className="w-8 h-8 rounded-full bg-[#2563EB]/20 items-center justify-center">
          <Ionicons name="business" size={16} color="#2563EB" />
        </View>
        <Text className="font-bold text-foreground">Hostels</Text>
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
      <Animated.View className="w-72 bg-card rounded-3xl p-5 shadow-lg border border-border absolute z-10 top-[20%] -rotate-6" style={card1Style}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-muted items-center justify-center border border-border/50">
              <Ionicons name="person" size={24} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-bold text-foreground text-lg">Apex Overseas</Text>
              <View className="flex-row items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => <Ionicons key={i} name="star" size={12} color="#EAB308" />)}
              </View>
            </View>
          </View>
          <Ionicons name="checkmark-circle" size={24} color={PRIMARY} />
        </View>
        <Text className="text-muted-foreground text-sm leading-5">&quot;Excellent guidance! They helped me get my study visa in just 2 weeks.&quot;</Text>
      </Animated.View>

      <Animated.View className="w-64 bg-card rounded-3xl p-5 shadow-xl border border-border absolute z-20 bottom-[25%] right-0 rotate-3" style={card2Style}>
         <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border/50">
              <Ionicons name="person" size={20} color="#94A3B8" />
            </View>
            <View>
              <Text className="font-bold text-foreground">Sarah M.</Text>
              <Text className="text-xs text-muted-foreground">2 days ago</Text>
            </View>
          </View>
          <Text className="text-muted-foreground font-medium">★★★★★ Incredible experience.</Text>
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
      <Animated.View className="w-48 h-64 bg-card rounded-[32px] shadow-xl border border-border items-center justify-center z-10" style={centerCard}>
        <View className="w-20 h-20 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <Ionicons name="home" size={40} color={PRIMARY} />
        </View>
        <Text className="font-bold text-xl text-foreground text-center px-2">Global Ed</Text>
        <Text className="text-muted-foreground text-sm mt-1">Study Abroad</Text>
      </Animated.View>

      <Animated.View className="absolute top-[25%] right-[15%] w-16 h-16 bg-primary rounded-full shadow-lg items-center justify-center border-4 border-background z-20" style={icon1}>
        <Ionicons name="call" size={24} color="#FFF" />
      </Animated.View>

      <Animated.View className="absolute bottom-[30%] left-[10%] w-16 h-16 bg-accent rounded-full shadow-lg items-center justify-center border-4 border-background z-20" style={icon2}>
        <Ionicons name="paper-plane" size={24} color="#FFF" />
      </Animated.View>

      <Animated.View className="absolute top-[40%] left-[5%] w-14 h-14 bg-foreground rounded-full shadow-lg items-center justify-center border-4 border-background z-20" style={icon3}>
        <Ionicons name="bookmark" size={20} color={useTheme().colorScheme === 'dark' ? '#000' : '#FFF'} />
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
      <Animated.View className="w-72 h-72 bg-muted rounded-full items-center justify-center border-8 border-background shadow-xl" style={mapStyle}>
        {/* Decorative Grid Lines */}
        <View className="w-full h-[1px] bg-background absolute top-1/3" />
        <View className="w-full h-[1px] bg-background absolute top-2/3" />
        <View className="h-full w-[1px] bg-background absolute left-1/3" />
        <View className="h-full w-[1px] bg-background absolute left-2/3" />
        
        {/* Central Pulse */}
        <View className="w-32 h-32 rounded-full bg-primary/10 absolute items-center justify-center border border-primary/20">
          <View className="w-4 h-4 rounded-full bg-primary shadow-sm shadow-primary" />
        </View>
      </Animated.View>

      <Animated.View className="absolute top-[25%] right-[20%] items-center" style={pin1}>
        <View className="bg-card px-3 py-1 rounded-full shadow-sm mb-1 border border-border/50"><Text className="text-xs font-bold text-muted-foreground">Consultant</Text></View>
        <Ionicons name="location" size={32} color={ACCENT} />
      </Animated.View>

      <Animated.View className="absolute bottom-[35%] left-[20%] items-center" style={pin2}>
        <View className="bg-card px-3 py-1 rounded-full shadow-sm mb-1 border border-border/50"><Text className="text-xs font-bold text-muted-foreground">Hostel</Text></View>
        <Ionicons name="location" size={32} color={PRIMARY} />
      </Animated.View>
    </View>
  );
}
