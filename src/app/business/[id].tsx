import React, { useState, useRef } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useBusinessDetails, useBusinessReviews, useSimilarBusinesses } from '../../hooks/useBusiness';
import { BusinessDetailsSkeleton } from '../../components/business/BusinessDetailsSkeleton';
import { BusinessHeader } from '../../components/business/BusinessHeader';
import { BusinessHeroGallery } from '../../components/business/BusinessHeroGallery';
import { BusinessOverviewCard } from '../../components/business/BusinessOverviewCard';
import { BusinessInfoSection } from '../../components/business/BusinessInfoSection';
import { BusinessServicesGrid } from '../../components/business/BusinessServicesGrid';
import { BusinessLocationSection, BusinessContactSection } from '../../components/business/BusinessContact';
import { BusinessReviewDashboard } from '../../components/business/BusinessReviewDashboard';
import { BusinessReviewList } from '../../components/business/BusinessReviewList';
import { BusinessCarousel } from '../../components/business/BusinessCarousel';
import { BusinessQuickActions } from '../../components/business/BusinessQuickActions';
import { BusinessHoursSheet } from '../../components/business/BusinessHoursSheet';
import { BusinessEnquirySheet } from '../../components/business/BusinessEnquirySheet';
import ImageViewing from 'react-native-image-viewing';
import { StickyTabBar, TABS } from '../../components/business/StickyTabBar';

const { width } = Dimensions.get('window');

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  
  const { data: business, isLoading: isBusinessLoading } = useBusinessDetails(id);
  const { data: reviews, isLoading: isReviewsLoading } = useBusinessReviews(business?.id || '');
  const { data: similarBusinesses, isLoading: isSimilarLoading } = useSimilarBusinesses(business?.id || '');

  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [hoursSheetVisible, setHoursSheetVisible] = useState(false);
  const [enquirySheetVisible, setEnquirySheetVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);
  
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
          <View key="tab-overview" className="pt-2">
            <BusinessOverviewCard 
              business={business} 
              onHoursPress={() => setHoursSheetVisible(true)}
            />
            <BusinessInfoSection business={business} />
            <BusinessLocationSection business={business} />
            <BusinessReviewDashboard business={business} />
            {!isReviewsLoading && reviews && <BusinessReviewList reviews={reviews} />}
            <BusinessContactSection business={business} />
          </View>
        )}

        {/* --- GALLERY TAB --- */}
        {(activeTab === 'Gallery') && (
          <View key="tab-pics" className="p-4 flex-row flex-wrap justify-between">
            {business.gallery?.length ? business.gallery.map((img, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => {
                  setImageViewerIndex(index);
                  setImageViewerVisible(true);
                }}
                style={{ width: '48%', height: 150, marginBottom: 16 }}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: img }} 
                  style={{ width: '100%', height: '100%', borderRadius: 12 }}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            )) : (
              <Text className="text-muted-foreground w-full text-center py-8">No photos available.</Text>
            )}
          </View>
        )}

        {/* --- ABOUT TAB --- */}
        {(activeTab === 'About') && (
          <View key="tab-about" className="pt-2">
            <BusinessInfoSection business={business} />
          </View>
        )}

        {/* --- LOCATION TAB --- */}
        {(activeTab === 'Location') && (
          <View key="tab-location" className="pt-2">
            <BusinessLocationSection business={business} />
          </View>
        )}

        {/* --- REVIEWS TAB --- */}
        {(activeTab === 'Reviews') && (
          <View key="tab-reviews" className="pt-2">
            <BusinessReviewDashboard business={business} />
            {!isReviewsLoading && reviews && <BusinessReviewList reviews={reviews} />}
          </View>
        )}

        {/* --- CONTACT TAB --- */}
        {(activeTab === 'Contact') && (
          <View key="tab-contact" className="pt-2">
            <BusinessContactSection business={business} />
          </View>
        )}
      </Animated.ScrollView>

      <BusinessQuickActions business={business} onEnquirePress={() => setEnquirySheetVisible(true)} />

      {/* Bottom Sheet for Weekly Timings */}
      <BusinessHoursSheet 
        visible={hoursSheetVisible} 
        onClose={() => setHoursSheetVisible(false)} 
        hours={business.hours || []} 
      />

      {/* Bottom Sheet for Enquiry */}
      <BusinessEnquirySheet 
        visible={enquirySheetVisible} 
        onClose={() => setEnquirySheetVisible(false)} 
        business={business} 
      />

      {/* Full Screen Image Viewer */}
      <ImageViewing
        images={business.gallery?.map(uri => ({ uri })) || []}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        HeaderComponent={({ imageIndex }) => (
          <View style={{ marginTop: insets.top || 40, alignItems: 'flex-end', paddingHorizontal: 20 }}>
            <TouchableOpacity 
              onPress={() => setImageViewerVisible(false)} 
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
