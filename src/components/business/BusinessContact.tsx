import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
}

export function BusinessLocationSection({ business }: Props) {
  return (
    <View className="px-6 mb-8">
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-foreground mb-4">Location</Text>
        <TouchableOpacity 
          className="bg-card p-4 rounded-2xl border border-border flex-row items-start shadow-sm"
          onPress={() => {
            const query = encodeURIComponent(`${business.name}, ${business.location.address}`);
            Linking.openURL(`https://maps.google.com/?q=${query}`);
          }}
        >
          <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3 mt-1">
            <Ionicons name="location" size={20} color="#E11D48" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground mb-1">{business.name}</Text>
            <Text className="text-sm text-muted-foreground leading-5">
              {business.location.address},{'\n'}
              {business.location.area}, {business.location.city},{'\n'}
              {business.location.state} - {business.location.pincode}
            </Text>
            <Text className="text-primary font-bold text-sm mt-2">Get Directions →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function BusinessContactSection({ business }: Props) {
  return (
    <View className="px-6 mb-8">
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-foreground mb-4">Contact Info</Text>
        {(!business.contact.mobile && !business.contact.email && !business.contact.website) ? (
          <Text className="text-muted-foreground text-sm italic">No contact information available.</Text>
        ) : (
          <View className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            
            {!!business.contact.mobile && (
              <TouchableOpacity 
                className="flex-row items-center p-4 border-b border-border/50"
                onPress={() => Linking.openURL(`tel:${business.contact.mobile}`)}
              >
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                  <Ionicons name="call" size={18} color="#1C398E" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground font-medium mb-0.5">Mobile Number</Text>
                  <Text className="text-base font-bold text-foreground">{business.contact.mobile}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}

            {!!business.contact.email && (
              <TouchableOpacity 
                className="flex-row items-center p-4 border-b border-border/50"
                onPress={() => Linking.openURL(`mailto:${business.contact.email}`)}
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="mail" size={18} color="#1C398E" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground font-medium mb-0.5">Email Address</Text>
                <Text className="text-base font-bold text-foreground">{business.contact.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {business.contact.website && (
            <TouchableOpacity 
              className="flex-row items-center p-4"
              onPress={() => Linking.openURL(`https://${business.contact.website}`)}
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="globe" size={18} color="#1C398E" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground font-medium mb-0.5">Website</Text>
                <Text className="text-base font-bold text-foreground">{business.contact.website}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}

          </View>
        )}
      </View>

    </View>
  );
}
