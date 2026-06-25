import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Keyboard, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing, useAnimatedKeyboard } from 'react-native-reanimated';
import { useLocationStore, LocationData } from '../../store/location-store';
import { useTheme } from '../../hooks/useTheme';
import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../../api/home';

const { height } = Dimensions.get('window');

interface LocationSelectorSheetProps {
  visible: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Bangalore, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
];

export function LocationSelectorSheet({ visible, onClose }: LocationSelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const { setManualLocation, requestPermission, permissionStatus, savedLocations, addSavedLocation, isLoading, fetchCurrentLocation, clearManualLocation } = useLocationStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['locationSearch', debouncedQuery],
    queryFn: () => homeApi.searchByLocation(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);
  
  // Synchronously tracks keyboard height for 120fps native layout
  const keyboard = useAnimatedKeyboard();

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.poly(3)) });
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    } else {
      translateY.value = withTiming(height, { duration: 250, easing: Easing.in(Easing.poly(3)) });
      opacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) });
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    translateY.value = withTiming(height, { duration: 250, easing: Easing.in(Easing.poly(3)) });
    opacity.value = withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) }, () => {
      runOnJS(onClose)();
    });
  };

  const handleSelectLocation = (address: string, lat?: number, lng?: number) => {
    const loc: LocationData = {
      latitude: lat || 0,
      longitude: lng || 0,
      addressString: address,
      shortAddress: address.split(',')[0],
    };
    setManualLocation(loc);
    addSavedLocation(loc);
    handleClose();
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedKeyboardPadding = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View 
          style={[backdropStyle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }]} 
        >
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleClose} />
        </Animated.View>

        <Animated.View 
          style={[
            sheetStyle, 
            { height: height * 0.9, width: '100%' },
            Platform.OS === 'android' ? animatedKeyboardPadding : undefined
          ]}
          className="bg-background rounded-t-[32px] pt-2 shadow-2xl"
        >
          {/* Drag Indicator */}
          <View className="w-12 h-1.5 bg-border rounded-full self-center my-3" />

          <View className="px-6 mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-extrabold text-foreground">Select Location</Text>
            <TouchableOpacity onPress={handleClose} className="bg-muted p-2 rounded-full">
              <Ionicons name="close" size={20} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
          </View>

          <View className="px-6 mb-6">
            <View className="flex-row items-center bg-muted rounded-2xl px-4 py-3 border border-border">
              <Ionicons name="search" size={20} color="#64748B" />
              <TextInput 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search city or neighborhood"
                placeholderTextColor="#64748B"
                className="flex-1 ml-2 text-foreground font-medium text-base"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList 
            data={searchQuery.length > 0 ? searchResults : []}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
            ListEmptyComponent={() => (
              <View>
                {!searchQuery && (
                  <View>
                    <TouchableOpacity 
                      className="flex-row items-center py-4 border-b border-border/50"
                      onPress={() => {
                        // Close the sheet immediately for a snappy UI
                        handleClose();
                        
                        // Clear the manual location so the app defaults back to the current GPS location
                        clearManualLocation();
                        
                        // Run permission check and fetch in the background
                        if (permissionStatus !== 'granted') {
                          requestPermission();
                        } else {
                          fetchCurrentLocation();
                        }
                      }}
                    >
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4 border border-primary/20">
                        <Ionicons name="navigate" size={20} color="#c10007" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-primary mb-0.5">Use Current Location</Text>
                        <Text className="text-xs text-muted-foreground">{isLoading ? 'Locating you...' : 'Using GPS'}</Text>
                      </View>
                    </TouchableOpacity>

                    {savedLocations.length > 0 && (
                      <View className="mt-6 mb-2">
                        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent Locations</Text>
                        {savedLocations.map((locObj, idx) => {
                          const isStr = typeof locObj === 'string';
                          const address = isStr ? locObj : locObj.addressString;
                          const shortTitle = isStr ? locObj.split(',')[0] : (locObj.shortAddress || address.split(',')[0]);
                          const subtitle = isStr ? locObj.split(',')[1]?.trim() : locObj.addressString;
                          const lat = isStr ? 0 : locObj.latitude;
                          const lng = isStr ? 0 : locObj.longitude;
                          return (
                            <TouchableOpacity 
                              key={`saved-${idx}`}
                              className="flex-row items-center py-4 border-b border-border/30"
                              onPress={() => handleSelectLocation(address, lat, lng)}
                            >
                              <View className="w-8 h-8 bg-muted rounded-full items-center justify-center mr-4">
                                <Ionicons name="time-outline" size={16} color={isDark ? '#FFF' : '#000'} />
                              </View>
                              <View className="flex-1 pr-4">
                                <Text className="text-sm font-bold text-foreground mb-0.5" numberOfLines={1}>{shortTitle}</Text>
                                <Text className="text-xs text-muted-foreground" numberOfLines={1}>{subtitle}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                    <View className="mt-6 mb-2">
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Popular Cities</Text>
                    </View>
                    
                    {POPULAR_CITIES.map(city => (
                      <TouchableOpacity 
                        key={city.name}
                        className="flex-row items-center py-4 border-b border-border/30"
                        onPress={() => handleSelectLocation(city.name, city.lat, city.lng)}
                      >
                        <View className="w-8 h-8 bg-muted rounded-full items-center justify-center mr-4">
                          <Ionicons name="location-outline" size={16} color={isDark ? '#FFF' : '#000'} />
                        </View>
                        <View>
                          <Text className="text-sm font-bold text-foreground mb-0.5">{city.name.split(',')[0]}</Text>
                          <Text className="text-xs text-muted-foreground">{city.name.split(',')[1]?.trim()}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {!!searchQuery && searchResults.length === 0 && !isFetching && (
                  <View className="items-center py-8">
                    <Ionicons name="map-outline" size={48} color="#64748B" style={{ opacity: 0.5 }} />
                    <Text className="text-foreground font-semibold text-base mt-4">No locations found</Text>
                    <Text className="text-muted-foreground text-sm mt-1">Try a different search term</Text>
                  </View>
                )}
                {!!searchQuery && isFetching && (
                  <View className="items-center py-8">
                    <Text className="text-muted-foreground font-semibold text-sm">Searching locations...</Text>
                  </View>
                )}
              </View>
            )}
            renderItem={({ item }: { item: { name: string, lat: number, lng: number } }) => (
              <TouchableOpacity 
                className="flex-row items-center py-4 border-b border-border/50"
                onPress={() => handleSelectLocation(item.name, item.lat, item.lng)}
              >
                <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-4">
                  <Ionicons name="location" size={20} color={isDark ? '#FFF' : '#000'} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground mb-0.5">{item.name.split(',')[0]}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {item.name.includes(',') ? item.name.substring(item.name.indexOf(',') + 1).trim() : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
