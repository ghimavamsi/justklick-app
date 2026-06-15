import React from 'react';
import { View, Text, TouchableOpacity, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  business: BusinessDetails;
  onHoursPress?: () => void;
}

export function BusinessOverviewCard({ business, onHoursPress }: Props) {
  const router = useRouter();

  // Dynamic Rating Color Logic
  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: '#10B981', border: 'border-emerald-200 dark:border-emerald-800/50' };
    if (rating >= 3.0) return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', icon: '#F59E0B', border: 'border-amber-200 dark:border-amber-800/50' };
    return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', icon: '#E11D48', border: 'border-rose-200 dark:border-rose-800/50' };
  };

  const ratingColors = getRatingColor(business.rating);
  const yearsOfExp = business.establishedYear ? new Date().getFullYear() - business.establishedYear : null;

  const handleShare = async () => {
    try { await Share.share({ message: `Check out ${business.name} on JustKlick!` }); } catch (e) {}
  };

  const actionButtons = [
    { id: 'call', icon: 'call', label: 'Call', color: '#3B82F6', onPress: () => Linking.openURL(`tel:${business.contact.mobile}`) },
    { id: 'whatsapp', icon: 'logo-whatsapp', label: 'WhatsApp', color: '#10B981', onPress: () => Linking.openURL(`whatsapp://send?phone=${business.contact.mobile}`) },
    { id: 'direction', icon: 'navigate', label: 'Direction', color: '#8B5CF6', onPress: () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(business.name + ', ' + business.location.address)}`) },
    { id: 'share', icon: 'share-social', label: 'Share', color: '#F59E0B', onPress: handleShare },
    { id: 'review', icon: 'star', label: 'Review', color: '#EC4899', onPress: () => router.push('/business/reviews') },
  ];

  return (
    <View className="-mt-6 mx-4 bg-card rounded-[24px] border border-border shadow-sm mb-6 overflow-hidden">
      
      <View className="p-5">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-extrabold text-foreground leading-8">{business.name}</Text>
            <Text className="text-sm font-semibold text-primary mt-1">{business.category}</Text>
          </View>
          
          <View className="items-end">
            {business.isVerified && (
              <View className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded flex-row items-center mb-1">
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold ml-1">VERIFIED</Text>
              </View>
            )}
            {business.isPremium && (
              <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded flex-row items-center">
                <Ionicons name="star" size={10} color="#F59E0B" />
                <Text className="text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase ml-1">PREMIUM</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dynamic Ratings & Reviews */}
        <View className="flex-row items-center mt-1 mb-4">
          <View className={`${ratingColors.bg} px-2 py-1 rounded flex-row items-center mr-2 border ${ratingColors.border}`}>
            <Text className={`${ratingColors.text} text-sm font-bold mr-1`}>{business.rating.toFixed(1)}</Text>
            <Ionicons name="star" size={14} color={ratingColors.icon} />
          </View>
          <Text className="text-sm text-muted-foreground font-medium underline">
            {business.reviewsCount.toLocaleString()} Ratings
          </Text>
        </View>

        {/* Location & Experience Row */}
        <View className="flex-row flex-wrap items-center mb-4">
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons name="location" size={16} color="#64748B" />
            <Text className="text-sm text-foreground font-medium ml-1">
              {business.location.area}, {business.location.city}
            </Text>
          </View>
          {yearsOfExp && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="briefcase" size={16} color="#64748B" />
              <Text className="text-sm text-foreground font-medium ml-1">{yearsOfExp} Years in Business</Text>
            </View>
          )}
        </View>

        {/* Interactive Hours */}
        <TouchableOpacity 
          onPress={onHoursPress}
          className="flex-row items-center justify-between bg-muted/40 p-3 rounded-xl border border-border mt-2"
        >
          <View className="flex-row items-center">
            <Ionicons name="time" size={18} color={business.isOpenNow ? '#10B981' : '#E11D48'} />
            <Text className={`text-sm font-bold ml-2 ${business.isOpenNow ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {business.isOpenNow ? 'Open Now' : 'Closed'}
            </Text>
            <Text className="text-sm text-muted-foreground ml-1">
              • {business.hours[0]?.open === '12:00 AM' && business.hours[0]?.close === '11:59 PM' ? 'Open 24 Hrs' : `Closes at ${business.hours[0]?.close || '10:00 PM'}`}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Action Icon Row (JustDial Style) */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-muted/20 border-t border-border">
        {actionButtons.map((btn) => (
          <TouchableOpacity key={btn.id} onPress={btn.onPress} className="items-center justify-center flex-1">
            <View className="w-12 h-12 rounded-full items-center justify-center mb-1.5" style={{ backgroundColor: `${btn.color}15` }}>
              <Ionicons name={btn.icon as any} size={22} color={btn.color} />
            </View>
            <Text className="text-[11px] font-semibold text-foreground text-center">{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}
