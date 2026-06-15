import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
}

export function BusinessServicesGrid({ business }: Props) {
  if (!business.services?.length && !business.amenities?.length) return null;

  // Premium, vibrant color palette for icons
  const iconColors = [
    { text: '#3B82F6', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
    { text: '#10B981', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
    { text: '#F59E0B', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800' },
    { text: '#8B5CF6', bg: 'bg-violet-100 dark:bg-violet-900/30', border: 'border-violet-200 dark:border-violet-800' },
    { text: '#E11D48', bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800' },
    { text: '#06B6D4', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-800' },
  ];

  return (
    <View className="px-6 mb-8">
      {/* Services Section */}
      {business.services && business.services.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-extrabold text-foreground mb-4">Top Services</Text>
          <View className="flex-row flex-wrap">
            {business.services.map((service, index) => {
              const color = iconColors[index % iconColors.length];
              return (
                <View 
                  key={service.id}
                  className={`px-4 py-2.5 rounded-full mr-3 mb-3 flex-row items-center shadow-sm border ${color.bg} ${color.border}`}
                >
                  <Ionicons name={service.iconName as any} size={16} color={color.text} style={{ marginRight: 6 }} />
                  <Text className="text-sm font-bold text-foreground">{service.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Amenities Section */}
      {business.amenities && business.amenities.length > 0 && (
        <View>
          <Text className="text-xl font-extrabold text-foreground mb-4">Facilities & Amenities</Text>
          <View className="flex-row flex-wrap">
            {business.amenities.map((amenity, index) => {
              // Offset the color index so amenities start with different colors than services
              const color = iconColors[(index + 3) % iconColors.length];
              return (
                <View 
                  key={amenity.id}
                  className="w-1/2 flex-row items-center mb-5 pr-2"
                >
                  <View className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${color.bg}`}>
                    <Ionicons name={amenity.iconName as any} size={20} color={color.text} />
                  </View>
                  <Text className="text-sm font-bold text-foreground flex-1">{amenity.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
