import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBusinessDetails } from '../../../hooks/useBusiness';
import { vendorsApi } from '../../../api/vendors';
import { InteractiveStarRating } from '../../../components/reviews/InteractiveStarRating';
import { ReviewTextInput } from '../../../components/reviews/ReviewTextInput';
import { ReviewTipsSheet } from '../../../components/reviews/ReviewTipsSheet';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { data: business, isLoading: isBusinessLoading } = useBusinessDetails(id);

  // Form State
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  // UI State
  const [tipsVisible, setTipsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{rating?: string, review?: string}>({});


  const handleSubmit = async () => {
    const newErrors: {rating?: string, review?: string} = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a star rating before submitting.';
    }
    if (reviewText.trim().length < 20) {
      newErrors.review = 'Review must be at least 20 characters long.';
    }
    if (reviewText.trim().length > 500) {
      newErrors.review = 'Review cannot exceed 500 characters.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Build payload for real API
      const payload = {
        business_id: Number(business?.id || 0),
        rating,
        review: reviewText,
      };

      await vendorsApi.createReview(payload);
      
      // Show Success
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        'Submission Failed',
        error?.response?.data?.detail || 'An error occurred while submitting your review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBusinessLoading || !business) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#1C398E" />
      </View>
    );
  }

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6" style={{ paddingTop: insets.top }}>
        <View className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={60} color="#10B981" />
        </View>
        <Text className="text-3xl font-extrabold text-foreground text-center mb-4">Thank you!</Text>
        <Text className="text-base text-muted-foreground text-center mb-10 leading-6">
          Thank you for sharing your experience. Your review helps others discover trusted businesses.
        </Text>
        <TouchableOpacity 
          className="bg-primary w-full py-4 rounded-xl items-center shadow-sm"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-base">Back to Business</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MAIN FORM SCREEN ---
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      {/* Premium Header */}
      <View 
        className="px-4 pb-4 border-b border-border bg-background z-10"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-muted/50 rounded-full items-center justify-center mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" className="dark:text-white" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-extrabold text-foreground">Write a Review</Text>
            <Text className="text-sm font-medium text-muted-foreground mt-0.5">Help others make better decisions.</Text>
          </View>
        </View>

        {/* Business Preview Card */}
        <View className="flex-row items-center bg-muted/30 p-3 rounded-2xl border border-border">
          <Image 
            source={{ uri: business.coverImage }} 
            style={{ width: 50, height: 50, borderRadius: 12 }} 
            contentFit="cover" 
          />
          <View className="flex-1 ml-3">
            <Text className="text-base font-bold text-foreground mb-0.5">{business.name}</Text>
            <Text className="text-xs text-muted-foreground">{business.location.area}, {business.location.city}</Text>
          </View>
          <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded flex-row items-center border border-amber-200 dark:border-amber-800/50">
            <Text className="text-amber-700 dark:text-amber-400 text-xs font-bold mr-1">{business.rating.toFixed(1)}</Text>
            <Ionicons name="star" size={12} color="#F59E0B" />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      >
        {/* Rating Section */}
        <View className="mb-2">
          <InteractiveStarRating rating={rating} onRatingChange={(val) => { setRating(val); if(errors.rating) setErrors({...errors, rating: undefined}); }} />
          {errors.rating && <Text className="text-destructive text-sm font-medium text-center mt-2">{errors.rating}</Text>}
        </View>

        {/* Text Input Section */}
        <View className="mb-8 mt-2">
          <ReviewTextInput 
            text={reviewText} 
            onChangeText={(text) => { setReviewText(text); if(errors.review) setErrors({...errors, review: undefined}); }} 
            onInfoPress={() => setTipsVisible(true)} 
          />
          {errors.review && <Text className="text-destructive text-sm font-medium ml-1 mt-[-16px] mb-4">{errors.review}</Text>}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          key="submit-review-btn"
          disabled={isSubmitting}
          onPress={handleSubmit}
          className={`w-full py-4 rounded-xl flex-row justify-center items-center ${!isSubmitting ? 'bg-primary shadow-sm' : 'bg-muted'}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" className="mr-2" />
          ) : (
            <Ionicons name="paper-plane" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          )}
          <Text className={`font-bold text-lg ${!isSubmitting ? 'text-white' : 'text-muted-foreground'}`}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ReviewTipsSheet visible={tipsVisible} onClose={() => setTipsVisible(false)} />
    </View>
  );
}
