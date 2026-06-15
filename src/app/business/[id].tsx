import React, { useState, useRef } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { useBusinessDetails, useBusinessReviews, useSimilarBusinesses } from '../../hooks/useBusiness';
import { BusinessDetailsSkeleton } from '../../components/business/BusinessDetailsSkeleton';
import { BusinessHeader } from '../../components/business/BusinessHeader';
import { BusinessHeroGallery } from '../../components/business/BusinessHeroGallery';
import { BusinessOverviewCard } from '../../components/business/BusinessOverviewCard';
import { BusinessInfoSection } from '../../components/business/BusinessInfoSection';
import { BusinessServicesGrid } from '../../components/business/BusinessServicesGrid';
import { BusinessContact } from '../../components/business/BusinessContact';
import { BusinessReviewDashboard } from '../../components/business/BusinessReviewDashboard';
import { BusinessReviewList } from '../../components/business/BusinessReviewList';
import { BusinessCarousel } from '../../components/business/BusinessCarousel';
import { BusinessQuickActions } from '../../components/business/BusinessQuickActions';
import { BusinessHoursSheet } from '../../components/business/BusinessHoursSheet';
import { StickyTabBar, TABS } from '../../components/business/StickyTabBar';

const { width } = Dimensions.get('window');

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const { data: business, isLoading: isBusinessLoading } = useBusinessDetails(id);
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(id);
  const { data: similarBusinesses, isLoading: isSimilarLoading } = useSimilarBusinesses(id);

  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [hoursSheetVisible, setHoursSheetVisible] = useState(false);
  
  const sectionRefs = useRef<Record<string, number>>({});
  const HEADER_HEIGHT = (insets.top || 44) + 60;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Scroll the tab bar to the docked position so the new content is visible from the top
    scrollViewRef.current?.scrollTo({ 
      y: width - HEADER_HEIGHT, 
      animated: true 
    });
  };

  // This style manages the floating sticky tab bar perfectly without ScrollView gaps
  const floatingTabBarStyle = useAnimatedStyle(() => {
    // Show sticky tab bar when we scroll past the hero gallery
    const isPastHero = scrollY.value >= width - HEADER_HEIGHT;
    return {
      position: 'absolute',
      top: HEADER_HEIGHT,
      left: 0,
      right: 0,
      zIndex: 40,
      opacity: isPastHero ? 1 : 0,
      transform: [{ translateY: isPastHero ? 0 : -500 }]
    };
  });

  if (isBusinessLoading || !business) return <BusinessDetailsSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <BusinessHeader business={business} scrollY={scrollY} />
      
      {/* Absolute Floating Tab Bar */}
      <Animated.View style={floatingTabBarStyle} className="bg-background border-b border-border shadow-sm">
        <StickyTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </Animated.View>

      <Animated.ScrollView 
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, minHeight: Dimensions.get('window').height * 1.5 }}
      >
        <BusinessHeroGallery images={business.gallery || [business.coverImage]} scrollY={scrollY} />
        
        {/* Inline Tab Bar */}
        <View className="bg-background z-10 relative border-b border-border shadow-sm mb-4">
          <StickyTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </View>

        {/* --- OVERVIEW TAB --- */}
        {(activeTab === 'Overview') && (
          <View key="tab-overview">
            <BusinessOverviewCard 
              business={business} 
              onHoursPress={() => setHoursSheetVisible(true)}
            />
            <BusinessInfoSection business={business} />
            <BusinessContact business={business} />
            <BusinessServicesGrid business={business} />
            <BusinessReviewDashboard business={business} />
            {!isReviewsLoading && reviews && <BusinessReviewList reviews={reviews} />}
            {!isSimilarLoading && similarBusinesses && (
              <BusinessCarousel title="Similar Businesses" businesses={similarBusinesses} />
            )}
          </View>
        )}

        {/* --- SERVICES TAB --- */}
        {(activeTab === 'Services') && (
          <View key="tab-services" className="pt-2">
            <BusinessServicesGrid business={business} />
          </View>
        )}

        {/* --- PHOTOS TAB --- */}
        {(activeTab === 'Photos') && (
          <View key="tab-photos" className="p-4 flex-row flex-wrap justify-between">
            {business.gallery?.map((img, index) => (
              <Image 
                key={index} 
                source={{ uri: img }} 
                style={{ width: '48%', height: 150, borderRadius: 12, marginBottom: 16 }}
                contentFit="cover"
                transition={200}
              />
            ))}
          </View>
        )}

        {/* --- REVIEWS TAB --- */}
        {(activeTab === 'Reviews') && (
          <View key="tab-reviews" className="pt-2">
            <BusinessReviewDashboard business={business} />
            {!isReviewsLoading && reviews && <BusinessReviewList reviews={reviews} />}
          </View>
        )}

        {/* --- SIMILAR TAB --- */}
        {(activeTab === 'Similar') && (
          <View key="tab-similar" className="pt-2">
            {!isSimilarLoading && similarBusinesses && (
              <BusinessCarousel title="Similar Businesses" businesses={similarBusinesses} />
            )}
          </View>
        )}

      </Animated.ScrollView>

      <BusinessQuickActions business={business} />

      {/* Bottom Sheet for Weekly Timings */}
      <BusinessHoursSheet 
        visible={hoursSheetVisible} 
        onClose={() => setHoursSheetVisible(false)} 
        hours={business.hours || []} 
      />
    </View>
  );
}
