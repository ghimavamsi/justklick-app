import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
}

const RatingBar = ({ stars, count, total }: { stars: number, count: number, total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className="flex-row items-center mb-1.5">
      <Text className="text-sm font-bold text-muted-foreground w-4">{stars}</Text>
      <Ionicons name="star" size={12} color="#F59E0B" style={{ marginRight: 8 }} />
      <View className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <Animated.View style={[animatedStyle, { backgroundColor: '#F59E0B', height: '100%' }]} />
      </View>
    </View>
  );
};

export function BusinessReviewDashboard({ business }: Props) {
  const router = useRouter();
  const summary = business.ratingSummary;
  const totalReviews = business.reviewsCount;

  return (
    <View className="px-6 mb-6">
      <Text className="text-xl font-extrabold text-foreground mb-4">Reviews & Ratings</Text>
      
      <View className="bg-card p-5 rounded-2xl border border-border shadow-sm flex-row items-center">
        
        {/* Left Side: Overall Rating */}
        <View className="items-center justify-center mr-6 border-r border-border/50 pr-6 py-2">
          <Text className="text-4xl font-extrabold text-foreground mb-1">{business.rating}</Text>
          <View className="flex-row mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons 
                key={star} 
                name={star <= Math.round(business.rating) ? "star" : "star-outline"} 
                size={14} 
                color="#F59E0B" 
              />
            ))}
          </View>
          <Text className="text-xs font-medium text-muted-foreground">{totalReviews.toLocaleString()} reviews</Text>
        </View>

        {/* Right Side: Rating Bars */}
        <View className="flex-1">
          <RatingBar stars={5} count={summary['5']} total={totalReviews} />
          <RatingBar stars={4} count={summary['4']} total={totalReviews} />
          <RatingBar stars={3} count={summary['3']} total={totalReviews} />
          <RatingBar stars={2} count={summary['2']} total={totalReviews} />
          <RatingBar stars={1} count={summary['1']} total={totalReviews} />
        </View>
      </View>

      {/* Write a Review Button */}
      <TouchableOpacity 
        className="mt-4 w-full bg-primary py-3.5 rounded-xl flex-row justify-center items-center shadow-sm"
        onPress={() => router.push(`/business/${business.id}/write-review`)}
      >
        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text className="text-white font-bold text-base flex-shrink-0">Write a Review</Text>
      </TouchableOpacity>
    </View>
  );
}
