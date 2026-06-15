import React, { useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Platform, Dimensions, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing, withRepeat } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSearchStore } from '../../store/search-store';
import { useTheme } from '../../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

import { useLocationStore } from '../../store/location-store';

const { width: screenWidth } = Dimensions.get('window');

export function SearchHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const { query, setQuery, phase, setPhase, isFocused, setIsFocused } = useSearchStore();
  const { manualLocation, currentLocation } = useLocationStore();
  const activeLocation = manualLocation || currentLocation;
  const inputRef = useRef<TextInput>(null);

  // Rest of the code up to the TextInput...
  const focusAnim = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 300, easing: Easing.out(Easing.exp) });
    
    if (isFocused) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [isFocused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'idle') {
        inputRef.current?.focus();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    if (isFocused || phase !== 'idle') {
      inputRef.current?.blur();
      setQuery('');
      setPhase('idle');
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    if (query.trim().length > 0) {
      setPhase('results');
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const backButtonContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: 1,
      transform: [{ translateX: 0 }],
    };
  });

  const searchBarStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [{ scale: 1 }],
    };
  });

  const rotatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View 
      style={{ paddingTop: Math.max(insets.top, 20) }}
      className="bg-background z-50 shadow-sm border-b border-border pb-4 px-4"
    >
      <View className="flex-row items-center mt-2">
        
        {/* Back Button */}
        <Animated.View style={[backButtonContainerStyle, { marginRight: 12 }]}>
          <TouchableOpacity 
            onPress={handleBack}
            className="w-10 h-10 rounded-full items-center justify-center bg-muted"
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search Input Wrapper */}
        <Animated.View style={searchBarStyle}>
          <View 
            style={{ 
              height: 54,
              width: '100%',
              borderRadius: 999, 
              overflow: 'hidden', 
              padding: isFocused ? 1.5 : 0,
              position: 'relative',
              justifyContent: 'center',
            }}
          >
            {/* Spinning Gradient Background Layer */}
            {isFocused && (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: screenWidth * 2,
                    height: screenWidth * 2,
                    left: -screenWidth / 2,
                    top: -screenWidth / 2 + 27,
                  },
                  rotatingStyle,
                ]}
              >
                <LinearGradient
                  colors={['#c10007', '#1C398E', '#c10007']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            )}

            {/* Actual Input Container (Sits on top) */}
            <View 
              style={{ flex: 1 }} 
              className={`flex-row items-center px-4 rounded-full ${isFocused ? 'bg-background' : 'bg-muted border border-border'}`}
            >
              <Ionicons 
                name="search" 
                size={20} 
                color={isFocused ? (isDark ? '#FFF' : '#000') : '#64748B'} 
              />
              
              <View className="flex-1 ml-3 justify-center">
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="search"
                  placeholder="Search businesses, restaurants and more..."
                  placeholderTextColor="#64748B"
                  className="text-base text-foreground font-bold p-0 m-0"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    paddingVertical: 0,
                    textAlignVertical: 'center',
                    includeFontPadding: false
                  }}
                />
                
                {(!isFocused && phase === 'results' && activeLocation) && (
                  <Text 
                    className="text-[10px] text-muted-foreground font-semibold" 
                    numberOfLines={1}
                    style={{ marginTop: -6, includeFontPadding: false }}
                  >
                    in {activeLocation.shortAddress}
                  </Text>
                )}
              </View>

              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} className="ml-2">
                  <Ionicons name="close-circle" size={20} color="#64748B" />
                </TouchableOpacity>
              )}
              
            </View>
          </View>
        </Animated.View>

        {/* Share Button */}
        <TouchableOpacity className="w-10 h-10 rounded-full items-center justify-center bg-muted ml-3 border border-border">
          <Ionicons name="share-social-outline" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>

      </View>
    </View>
  );
}
