import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
  onEnquirePress?: () => void;
}

export function BusinessQuickActions({ business, onEnquirePress }: Props) {
  const insets = useSafeAreaInsets();

  const handleCall = () => Linking.openURL(`tel:${business.contact.mobile}`);
  const handleWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${business.contact.mobile}`);
  const handleDirection = () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(business.name + ', ' + business.location.address)}`);

  return (
    <View 
      className="absolute bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl"
      style={{ paddingBottom: insets.bottom || 16, paddingTop: 12, paddingHorizontal: 12 }}
    >
      <View className="flex-row items-center justify-between">
        
        {/* Call Button */}
        <TouchableOpacity 
          onPress={handleCall}
          className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center mx-1 shadow-sm"
        >
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-1.5">Call</Text>
        </TouchableOpacity>

        {/* WhatsApp Button */}
        <TouchableOpacity 
          onPress={handleWhatsApp}
          className="flex-1 bg-[#25D366] py-3 rounded-xl flex-row items-center justify-center mx-1 shadow-sm"
        >
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-1.5">WhatsApp</Text>
        </TouchableOpacity>

        {/* Directions Button */}
        <TouchableOpacity 
          onPress={handleDirection}
          className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center mx-1 shadow-sm"
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-1.5">Direction</Text>
        </TouchableOpacity>

        {/* Enquire Now Button */}
        <TouchableOpacity 
          onPress={onEnquirePress}
          className="flex-1 py-3 rounded-xl flex-row items-center justify-center mx-1 shadow-sm"
          style={{ backgroundColor: '#F97316' }}
        >
          <Ionicons name="mail" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-sm ml-1.5">Enquire</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
