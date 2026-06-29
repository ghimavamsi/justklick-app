import React from 'react';
import { View, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth-store';
import { useTheme } from '../../hooks/useTheme';
import { studentApi } from '../../api/student';

import { GuestProfileView } from '../../components/profile/GuestProfileView';
import { AuthenticatedProfileView } from '../../components/profile/AuthenticatedProfileView';
import { ProfileSkeletons } from '../../components/profile/ProfileSkeletons';

export default function PremiumProfileScreen() {
  const { isAuthenticated } = useAuthStore();
  const { colorScheme } = useTheme();
  
  // Fetch actual student profile to check completion status
  const { data: studentProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getProfile,
    enabled: isAuthenticated,
    retry: false
  });

  const isLoading = (isAuthenticated && isProfileLoading);

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
      ) : isLoading ? (
        <ProfileSkeletons />
      ) : (
        <AuthenticatedProfileView 
          studentProfile={studentProfile}
          onSettingsPress={() => router.push('/settings' as any)} 
        />
      )}
    </View>
  );
}
