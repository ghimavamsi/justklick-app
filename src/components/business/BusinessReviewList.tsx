import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Review } from '../../types/business.types';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Props {
  reviews: Review[];
}

export function BusinessReviewList({ reviews }: Props) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!reviews || reviews.length === 0) {
    return (
      <View className="px-6 mb-8 items-center py-6">
        <Ionicons name="chatbubbles-outline" size={48} color="#CBD5E1" />
        <Text className="text-base font-bold text-foreground mt-4">No reviews yet</Text>
        <Text className="text-sm text-muted-foreground text-center mt-1 mb-4">
          Be the first to share your experience with this business.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-6 mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-extrabold text-foreground">Customer Experiences</Text>
        <TouchableOpacity onPress={() => router.push('/business/reviews')}>
          <Text className="text-sm font-bold text-primary">View All</Text>
        </TouchableOpacity>
      </View>

      {reviews.map((review, index) => (
        <View 
          key={review.id} 
          className={`py-5 ${index !== reviews.length - 1 ? 'border-b border-border/50' : ''}`}
        >
          {/* Review Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              {review.authorImage ? (
                <Image source={{ uri: review.authorImage }} className="w-10 h-10 rounded-full mr-3" />
              ) : (
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <Text className="text-primary font-bold text-lg">{review.authorName.charAt(0)}</Text>
                </View>
              )}
              <View>
                <Text className="text-base font-bold text-foreground">{review.authorName}</Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-muted-foreground font-medium mr-2">{review.date}</Text>
                  {review.isVerified && (
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                      <Text className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons 
                  key={star} 
                  name={star <= Math.round(review.rating) ? "star" : "star-outline"} 
                  size={12} 
                  color="#F59E0B" 
                />
              ))}
            </View>
          </View>

          {/* Review Text */}
          <Text className="text-base text-foreground leading-6 mb-3">{review.text}</Text>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <View className="flex-row mb-3">
              {review.images.map((img, i) => (
                <Image key={i} source={{ uri: img }} className="w-20 h-20 rounded-xl mr-2" />
              ))}
            </View>
          )}

          {/* Review Actions */}
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center mr-4 border border-border px-3 py-1.5 rounded-full">
              <Ionicons name="thumbs-up-outline" size={14} color="#64748B" />
              <Text className="text-xs font-semibold text-muted-foreground ml-1.5">Helpful ({review.helpfulCount})</Text>
            </TouchableOpacity>
          </View>

          {/* Business Response */}
          {review.businessResponse && (
            <View className="mt-4 bg-muted/50 p-4 rounded-xl border-l-4 border-l-primary">
              <Text className="text-sm font-bold text-foreground mb-1">Response from Owner</Text>
              <Text className="text-sm text-muted-foreground">{review.businessResponse}</Text>
            </View>
          )}
        </View>
      ))}

    </View>
  );
}
