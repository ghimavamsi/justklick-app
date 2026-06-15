import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  category: string;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const POSITIVE_TAGS = ['Clean', 'Friendly Staff', 'Good Service', 'Great Food', 'Affordable', 'Professional', 'Comfortable', 'Quick Response', 'Verified Information', 'Good Facilities', 'Safe Location', 'Value For Money', 'Helpful Staff', 'Excellent Hospitality', 'Quality Service'];
const IMPROVEMENT_TAGS = ['Long Wait Time', 'High Pricing', 'Poor Service', 'Incorrect Information', 'Needs Improvement', 'Limited Facilities', 'Unresponsive', 'Crowded', 'Not Recommended'];

const SMART_CATEGORIES: Record<string, string[]> = {
  'PG & Hostel': ['Clean Rooms', 'Food Quality', 'Security', 'WiFi', 'Location', 'Maintenance', 'Management', 'Comfort'],
  'Hotel': ['Room Quality', 'Food', 'Hospitality', 'Cleanliness', 'Location', 'Amenities', 'Comfort'],
  'Hospital': ['Doctors', 'Staff', 'Facilities', 'Waiting Time', 'Treatment', 'Cleanliness', 'Emergency Care', 'Management'],
};

export function DynamicReviewTags({ category, selectedTags, onToggleTag }: Props) {
  // If we have smart tags for this category, use them, otherwise use the generic positive tags.
  const tagsToDisplay = SMART_CATEGORIES[category] || POSITIVE_TAGS;

  return (
    <View className="mb-6">
      <Text className="text-base font-extrabold text-foreground mb-3">What stood out to you?</Text>
      <View className="flex-row flex-wrap">
        {tagsToDisplay.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => onToggleTag(tag)}
              className={`mr-3 mb-3 px-4 py-2 rounded-full border ${
                isSelected 
                  ? 'bg-primary border-primary shadow-sm' 
                  : 'bg-card border-border'
              }`}
            >
              <Text className={`text-sm ${isSelected ? 'font-bold text-white' : 'font-medium text-foreground'}`}>
                {isSelected ? '✓ ' : ''}{tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
