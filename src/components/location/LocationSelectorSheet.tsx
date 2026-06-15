import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, Keyboard, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing, useAnimatedKeyboard } from 'react-native-reanimated';
import { useLocationStore, LocationData } from '../../store/location-store';
import { useTheme } from '../../hooks/useTheme';

const { height } = Dimensions.get('window');

interface LocationSelectorSheetProps {
  visible: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  'Hyderabad, Telangana',
  'Vijayawada, Andhra Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Bangalore, Karnataka',
  'Chennai, Tamil Nadu',
];

const MOCK_LOCATIONS = [
  ...POPULAR_CITIES,
  // Hyderabad Areas
  'Madhapur, Hyderabad, Telangana',
  'Gachibowli, Hyderabad, Telangana',
  'Banjara Hills, Hyderabad, Telangana',
  'Jubilee Hills, Hyderabad, Telangana',
  'Kondapur, Hyderabad, Telangana',
  'Kukatpally, Hyderabad, Telangana',
  'Ameerpet, Hyderabad, Telangana',
  'Secunderabad, Telangana',
  // Vijayawada Areas
  'Benz Circle, Vijayawada, Andhra Pradesh',
  'Patamata, Vijayawada, Andhra Pradesh',
  'Bhavanipuram, Vijayawada, Andhra Pradesh',
  'Labbipet, Vijayawada, Andhra Pradesh',
  // Bangalore Areas
  'Koramangala, Bangalore, Karnataka',
  'Indiranagar, Bangalore, Karnataka',
  'Whitefield, Bangalore, Karnataka',
];

export function LocationSelectorSheet({ visible, onClose }: LocationSelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  
  const { setManualLocation, requestPermission, permissionStatus, savedLocations, addSavedLocation, isLoading } = useLocationStore();

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

  const handleSelectLocation = (address: string) => {
    const loc: LocationData = {
      latitude: 0,
      longitude: 0,
      addressString: address,
      shortAddress: address.split(',')[0],
    };
    setManualLocation(loc);
    addSavedLocation(address);
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

  const filteredCities = MOCK_LOCATIONS.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

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
                placeholder="Search city, neighborhood, or zip"
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
            data={searchQuery.length > 0 ? filteredCities : []}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
            ListEmptyComponent={() => (
              <View>
                {!searchQuery && (
                  <View>
                    <TouchableOpacity 
                      className="flex-row items-center py-4 border-b border-border/50"
                      onPress={async () => {
                        if (permissionStatus !== 'granted') {
                          await requestPermission();
                        }
                        handleClose();
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
                        {savedLocations.map(loc => (
                          <TouchableOpacity 
                            key={loc}
                            className="flex-row items-center py-3 border-b border-border/30"
                            onPress={() => handleSelectLocation(loc)}
                          >
                            <Ionicons name="time-outline" size={20} color="#64748B" style={{ marginRight: 16 }} />
                            <Text className="text-sm font-medium text-foreground ml-4">{loc}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <View className="mt-6 mb-2">
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Popular Cities</Text>
                    </View>
                    
                    {POPULAR_CITIES.map(loc => (
                      <TouchableOpacity 
                        key={loc}
                        className="flex-row items-center py-4 border-b border-border/30"
                        onPress={() => handleSelectLocation(loc)}
                      >
                        <View className="w-8 h-8 bg-muted rounded-full items-center justify-center mr-4">
                          <Ionicons name="location-outline" size={16} color={isDark ? '#FFF' : '#000'} />
                        </View>
                        <View>
                          <Text className="text-sm font-bold text-foreground mb-0.5">{loc.split(',')[0]}</Text>
                          <Text className="text-xs text-muted-foreground">{loc.split(',')[1].trim()}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {searchQuery && filteredCities.length === 0 && (
                  <View className="items-center py-8">
                    <Ionicons name="map-outline" size={48} color="#64748B" style={{ opacity: 0.5 }} />
                    <Text className="text-foreground font-semibold text-base mt-4">No locations found</Text>
                    <Text className="text-muted-foreground text-sm mt-1">Try a different search term</Text>
                  </View>
                )}
              </View>
            )}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity 
                className="flex-row items-center py-4 border-b border-border/50"
                onPress={() => handleSelectLocation(item)}
              >
                <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-4">
                  <Ionicons name="location" size={20} color={isDark ? '#FFF' : '#000'} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground mb-0.5">{item.split(',')[0]}</Text>
                  <Text className="text-xs text-muted-foreground">{item.split(',')[1].trim()}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
