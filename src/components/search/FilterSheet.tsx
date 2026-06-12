import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, PanResponder, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { useSearchStore } from '../../store/search-store';
import { FILTERS, SUBCATEGORIES } from '../../api/mock/search.mock';
import { useTheme } from '../../hooks/useTheme';

const { height } = Dimensions.get('window');

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function FilterSheet({ visible, onClose }: FilterSheetProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { activeFilters, setFilter, query, activeSubcategory, setActiveSubcategory } = useSearchStore();

  const matchingKey = Object.keys(SUBCATEGORIES).find(key => query.toLowerCase().includes(key));
  const availableSubcategories = matchingKey ? SUBCATEGORIES[matchingKey] : [];

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.poly(3)) });
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    }
  }, [visible]);

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 250, easing: Easing.in(Easing.poly(3)) });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.value = gestureState.dy;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
        }
      },
    })
  ).current;

  const toggleFilter = (filterId: string) => {
    if (filterId === 'sort_distance' && !activeFilters['sort_distance']) {
      setFilter('sort_rating', false);
    }
    if (filterId === 'sort_rating' && !activeFilters['sort_rating']) {
      setFilter('sort_distance', false);
    }
    setFilter(filterId, !activeFilters[filterId]);
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  const sortFilters = FILTERS.filter(f => f.id.startsWith('sort_'));
  const quickFilters = FILTERS.filter(f => !f.id.startsWith('sort_'));

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <View className="flex-1 justify-end">
        <Animated.View 
          style={[backdropStyle, { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }]} 
        >
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={handleClose} />
        </Animated.View>

        <Animated.View 
          style={[sheetStyle, { maxHeight: height * 0.85 }]}
          className="bg-background rounded-t-[32px] w-full pt-2 pb-6 shadow-2xl flex-shrink"
        >
          <View {...panResponder.panHandlers} className="w-full bg-transparent">
            {/* Drag Handle */}
            <View className="items-center mb-4 mt-2">
              <View className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
            </View>

            <View className="px-6 pb-4 border-b border-border mb-2 flex-row justify-between items-center">
              <Text className="text-xl font-extrabold text-foreground tracking-tight">Sort & Filters</Text>
              <TouchableOpacity onPress={handleClose} className="p-1">
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="px-6 flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {/* Sort By Section */}
            <View className="mt-4 mb-6">
              <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Sort By</Text>
              <View className="flex-row flex-wrap">
                {sortFilters.map((filter) => {
                  const isActive = !!activeFilters[filter.id];
                  return (
                    <TouchableOpacity
                      key={filter.id}
                      onPress={() => toggleFilter(filter.id)}
                      className={`flex-row items-center mb-3 mr-3 px-4 py-2.5 rounded-xl border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-card border-border'}`}
                    >
                      {filter.icon && (
                        <Ionicons name={filter.icon as any} size={18} color={isActive ? '#c10007' : filter.color} style={{ marginRight: 8 }} />
                      )}
                      <Text className={`font-semibold text-[14px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                        {filter.label.replace('Sort: ', '')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quick Filters Section */}
            <View className="mb-6">
              <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Popular Filters</Text>
              <View className="flex-row flex-wrap">
                {quickFilters.map((filter) => {
                  const isActive = !!activeFilters[filter.id];
                  return (
                    <TouchableOpacity
                      key={filter.id}
                      onPress={() => toggleFilter(filter.id)}
                      className={`flex-row items-center mb-3 mr-3 px-4 py-2.5 rounded-xl border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-card border-border'}`}
                    >
                      {filter.icon && (
                        <Ionicons name={filter.icon as any} size={18} color={isActive ? '#c10007' : filter.color} style={{ marginRight: 8 }} />
                      )}
                      <Text className={`font-semibold text-[14px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Specific Section */}
            {matchingKey && availableSubcategories.length > 0 ? (
              <View className="mb-6">
                <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {matchingKey.charAt(0).toUpperCase() + matchingKey.slice(1)} Amenities
                </Text>
                <View className="flex-row flex-wrap">
                  {availableSubcategories.map((subcatObj) => {
                    const subcat = subcatObj.name;
                    const isActive = activeSubcategory === subcat;
                    return (
                      <TouchableOpacity
                        key={subcat}
                        onPress={() => setActiveSubcategory(isActive ? null : subcat)}
                        className={`flex-row items-center mb-3 mr-3 px-4 py-2.5 rounded-xl border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-card border-border'}`}
                      >
                        <Ionicons name={subcatObj.icon as any} size={18} color={isActive ? '#c10007' : subcatObj.color} style={{ marginRight: 8 }} />
                        <Text className={`font-semibold text-[14px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                          {subcat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              Object.entries(SUBCATEGORIES).map(([category, amenities]) => (
                <View key={category} className="mb-6">
                  <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {category.charAt(0).toUpperCase() + category.slice(1)} Amenities
                  </Text>
                  <View className="flex-row flex-wrap">
                    {amenities.map((subcatObj) => {
                      const subcat = subcatObj.name;
                      const isActive = activeSubcategory === subcat;
                      return (
                        <TouchableOpacity
                          key={subcat}
                          onPress={() => setActiveSubcategory(isActive ? null : subcat)}
                          className={`flex-row items-center mb-3 mr-3 px-4 py-2.5 rounded-xl border shadow-sm ${isActive ? 'bg-[#c10007]/10 border-[#c10007]' : 'bg-card border-border'}`}
                        >
                          <Ionicons name={subcatObj.icon as any} size={18} color={isActive ? '#c10007' : subcatObj.color} style={{ marginRight: 8 }} />
                          <Text className={`font-semibold text-[14px] ${isActive ? 'text-[#c10007]' : 'text-foreground'}`}>
                            {subcat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))
            )}

          </ScrollView>

          {/* Fixed Footer Buttons */}
          <View className="px-6 pt-4 border-t border-border flex-row">
            <TouchableOpacity 
              className="flex-1 py-3 rounded-xl border border-border items-center justify-center mr-3"
              onPress={() => {
                // Clear all filters
                Object.keys(activeFilters).forEach(key => setFilter(key, false));
                setActiveSubcategory(null);
              }}
            >
              <Text className="font-bold text-foreground">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-[2] py-3 rounded-xl items-center justify-center bg-[#c10007]"
              onPress={handleClose}
            >
              <Text className="font-bold text-white">Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
