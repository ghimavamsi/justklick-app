import React from 'react';
import { View, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth-store';
import { useTheme } from '../../hooks/useTheme';
import { useProfileDashboard } from '../../hooks/useProfileData';

import { GuestProfileView } from '../../components/profile/GuestProfileView';
import { AuthenticatedProfileView } from '../../components/profile/AuthenticatedProfileView';
import { ProfileSkeletons } from '../../components/profile/ProfileSkeletons';

export default function PremiumProfileScreen() {
  const { isAuthenticated } = useAuthStore();
  const { colorScheme } = useTheme();
  
  // Only fetch data if authenticated
  const { data, isLoading } = useProfileDashboard();

  return (
    <View className="flex-1 bg-background">
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      {!isAuthenticated ? (
        <GuestProfileView 
          onLoginPress={() => router.push('/(auth)/login' as any)} 
          onExplorePress={() => router.push('/(tabs)/search' as any)} 
        />
      ) : isLoading || !data ? (
        <ProfileSkeletons />
      ) : (
        <AuthenticatedProfileView 
          data={data} 
          onSettingsPress={() => router.push('/settings' as any)} 
        />
      )}
    </View>
  );
}
