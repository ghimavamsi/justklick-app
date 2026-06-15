import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
}

export function BusinessInfoSection({ business }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="px-6 mb-8">
      <Text className="text-xl font-extrabold text-foreground mb-3">About Business</Text>
      
      <View className="bg-muted/30 p-4 rounded-[20px] border border-border">
        {business.establishedYear && (
          <View className="flex-row items-center mb-3">
            <View className="bg-primary/10 px-2.5 py-1 rounded-md">
              <Text className="text-primary text-xs font-bold">EST. {business.establishedYear}</Text>
            </View>
            <Text className="text-sm font-medium text-muted-foreground ml-3">
              {new Date().getFullYear() - business.establishedYear} Years of Experience
            </Text>
          </View>
        )}

        <Text 
          className="text-base text-foreground leading-6"
          numberOfLines={expanded ? undefined : 3}
        >
          {business.about || business.description}
        </Text>

        {(business.about || business.description)?.length > 120 && (
          <TouchableOpacity 
            onPress={() => setExpanded(!expanded)}
            className="mt-2"
          >
            <Text className="text-primary font-bold text-sm">
              {expanded ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
