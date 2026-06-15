import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBusinessDetails } from '../../../hooks/useBusiness';
import { businessDetailsService } from '../../../api/mock/business.mock';
import { InteractiveStarRating } from '../../../components/reviews/InteractiveStarRating';
import { DynamicReviewTags } from '../../../components/reviews/DynamicReviewTags';
import { ReviewTextInput } from '../../../components/reviews/ReviewTextInput';
import { PhotoUploadSection } from '../../../components/reviews/PhotoUploadSection';
import { ReviewTipsSheet } from '../../../components/reviews/ReviewTipsSheet';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { data: business, isLoading: isBusinessLoading } = useBusinessDetails(id);

  // Form State
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  // UI State
  const [tipsVisible, setTipsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const isFormValid = rating > 0 && reviewText.length >= 20 && reviewText.length <= 500;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    try {
      // Build payload
      const payload = {
        businessId: id,
        rating,
        tags: selectedTags,
        text: reviewText,
        images,
        isAnonymous,
        wouldRecommend
      };

      await businessDetailsService.submitBusinessReview(payload);
      
      // Show Success
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
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
        <InteractiveStarRating rating={rating} onRatingChange={setRating} />

        {/* Tags Section */}
        {rating > 0 && (
          <DynamicReviewTags 
            category={business.category} 
            selectedTags={selectedTags} 
            onToggleTag={toggleTag} 
          />
        )}

        {/* Text Input Section */}
        <ReviewTextInput 
          text={reviewText} 
          onChangeText={setReviewText} 
          onInfoPress={() => setTipsVisible(true)} 
        />

        {/* Photo Upload Section */}
        <PhotoUploadSection images={images} onImagesChange={setImages} />

        {/* Recommendation Question */}
        <View className="mb-8">
          <Text className="text-base font-extrabold text-foreground mb-4">Would you recommend this business?</Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => setWouldRecommend(true)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border mr-2 ${wouldRecommend === true ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500' : 'bg-card border-border'}`}
            >
              <Text className="text-xl mr-2">👍</Text>
              <Text className={`font-bold ${wouldRecommend === true ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>Yes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setWouldRecommend(false)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ml-2 ${wouldRecommend === false ? 'bg-rose-100 dark:bg-rose-900/30 border-rose-500' : 'bg-card border-border'}`}
            >
              <Text className="text-xl mr-2">👎</Text>
              <Text className={`font-bold ${wouldRecommend === false ? 'text-rose-700 dark:text-rose-400' : 'text-foreground'}`}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Anonymous Option */}
        <TouchableOpacity 
          onPress={() => setIsAnonymous(!isAnonymous)}
          className="flex-row items-center mb-8 bg-card p-4 rounded-2xl border border-border"
        >
          <View className={`w-6 h-6 rounded border mr-3 items-center justify-center ${isAnonymous ? 'bg-primary border-primary' : 'bg-transparent border-slate-300 dark:border-slate-600'}`}>
            {isAnonymous && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground">Post Anonymously</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">Your name will be hidden from public view</Text>
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity 
          disabled={!isFormValid || isSubmitting}
          onPress={handleSubmit}
          className={`w-full py-4 rounded-xl flex-row justify-center items-center ${isFormValid && !isSubmitting ? 'bg-primary shadow-sm' : 'bg-muted'}`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" className="mr-2" />
          ) : (
            <Ionicons name="paper-plane" size={20} color={isFormValid ? "#FFFFFF" : "#94A3B8"} style={{ marginRight: 8 }} />
          )}
          <Text className={`font-bold text-lg ${isFormValid ? 'text-white' : 'text-muted-foreground'}`}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ReviewTipsSheet visible={tipsVisible} onClose={() => setTipsVisible(false)} />
    </View>
  );
}
