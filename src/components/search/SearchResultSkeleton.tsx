import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function SearchResultSkeleton() {
  return (
    <View className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm mb-6">
      {/* Image Carousel Skeleton */}
      <Skeleton style={{ height: 200, width: '100%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
      
      {/* Content Area Skeleton */}
      <View className="p-4">
        {/* Title & Rating */}
        <View className="flex-row justify-between items-center mb-2">
          <Skeleton style={{ height: 26, width: '65%' }} />
          <Skeleton style={{ height: 24, width: '15%' }} />
        </View>
        
        {/* Reviews Count */}
        <Skeleton style={{ height: 14, width: '25%', marginBottom: 16 }} />

        {/* Address */}
        <View className="flex-row items-center mb-3">
          <Skeleton style={{ height: 16, width: 16, borderRadius: 8, marginRight: 8 }} />
          <Skeleton style={{ height: 16, width: '80%' }} />
        </View>

        {/* Experience & Timings */}
        <View className="flex-row items-center mb-5">
          <Skeleton style={{ height: 16, width: '30%', marginRight: 16 }} />
          <Skeleton style={{ height: 16, width: '35%' }} />
        </View>

        {/* Divider */}
        <View className="h-px bg-border w-full mb-4" />

        {/* Action Buttons Row Skeleton */}
        <View className="flex-row items-center justify-between">
          <Skeleton style={{ height: 36, flex: 1, marginRight: 8 }} />
          <Skeleton style={{ height: 36, flex: 1, marginRight: 8 }} />
          <Skeleton style={{ height: 36, flex: 1, marginRight: 8 }} />
          <View className="flex-row items-center">
            <Skeleton style={{ height: 40, width: 40, borderRadius: 20, marginRight: 8 }} />
            <Skeleton style={{ height: 40, width: 40, borderRadius: 20 }} />
          </View>
        </View>
      </View>
    </View>
  );
}
