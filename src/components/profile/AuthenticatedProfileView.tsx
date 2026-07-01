import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Image, Modal, Linking, Share } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/user-store';
import { useAuthStore } from '../../store/auth-store';
import { useAppStore } from '../../store/app-store';
import { StudentProfileResponse } from '../../types/student.types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { businessesApi } from '../../api/businesses';
import { authApi } from '../../api/auth';

interface AuthenticatedProfileViewProps {
  studentProfile?: StudentProfileResponse;
  onSettingsPress: () => void;
}

export function AuthenticatedProfileView({ studentProfile, onSettingsPress }: AuthenticatedProfileViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colorScheme, changeTheme, themeMode } = useTheme();
  const { profile, clearProfile } = useUserStore();
  const { logout, refreshToken } = useAuthStore();
  
  const { isAuthenticated } = useAuthStore();

  const { data: favorites } = useQuery({
    queryKey: ['savedBusinesses'],
    queryFn: businessesApi.getSavedBusinesses,
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authApi.studentLogout(refreshToken);
        console.log('Successfully logged out from backend');
      }
    } catch (e) {
      console.log('Backend logout failed or token was already invalid', e);
    } finally {
      queryClient.clear(); // Clear all cached queries (favorites, notifications, etc.) to prevent data leak between accounts
      clearProfile();
      // Ensure the user doesn't get sent back to onboarding/permissions after logout
      useAppStore.getState().completeOnboarding();
      useAppStore.getState().completePermissions();
      logout();
      // Explicitly route to login to prevent race conditions with useProtectedRoute
      router.replace('/(auth)/login');
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out JustKlick, the best platform for students! Download the app today: https://play.google.com/store/apps/details?id=placeholder',
      });
    } catch (error) {
      console.log('Error sharing app:', error);
    }
  };
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated Header Styles
  const headerHeight = Math.max(insets.top, 20) + 60;
  
  const headerTitleOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [80, 120], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const avatarScale = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.5], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP);
    return { transform: [{ scale }, { translateY }] };
  });

  // No longer checking isProfileComplete since router guards prevent incomplete profiles from reaching this screen

  return (
    <View className="flex-1 bg-background">
      {/* Sticky Header */}
      <Animated.View style={[{ paddingTop: insets.top, height: headerHeight, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: isDark ? 'rgba(9,9,11,0.95)' : 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
        <View className="px-6 shadow-sm flex-row items-center justify-between h-full w-full">
          <Animated.View style={headerTitleOpacity}>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="person" size={16} color="#1C398E" />
            </View>
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-foreground mr-1">{profile?.name || 'User'}</Text>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            </View>
          </View>
        </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight + 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View className="px-6 items-center mb-8">
          <Animated.View style={avatarScale}>
            <View className="relative mb-4">
              <View className="w-24 h-24 rounded-full bg-primary/5 border-4 border-background items-center justify-center shadow-sm">
                <Ionicons name="person" size={48} color="#1C398E" />
              </View>
              <View className="absolute bottom-0 right-2 bg-background rounded-full p-0.5">
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            </View>
          </Animated.View>
          
          <View className="flex-row items-center mb-1">
            <Text className="text-2xl font-extrabold text-foreground mr-1">{profile?.name || 'JustKlick User'}</Text>
          </View>
          <Text className="text-sm font-medium text-muted-foreground mb-4">{profile?.phone || '9876543210'} • {profile?.email || 'user@example.com'}</Text>

          <TouchableOpacity 
            onPress={() => router.push('/edit-profile')}
            className="bg-primary/10 px-6 py-2 rounded-full border border-primary/20 flex-row items-center"
          >
            <Ionicons name="pencil" size={14} color="#1C398E" style={{ marginRight: 6 }} />
            <Text className="text-[#1C398E] font-bold text-sm">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8 flex-row justify-between">
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/favorites' as any)}
            className="flex-1 items-center bg-card py-4 rounded-[20px] border border-border shadow-sm mx-1 relative"
          >
            <Ionicons name="heart" size={24} color="#ef4444" style={{ marginBottom: 4 }} />
            <Text className="text-[11px] font-bold text-foreground">Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=placeholder')}
            className="flex-1 items-center bg-card py-4 rounded-[20px] border border-border shadow-sm mx-1"
          >
            <Ionicons name="star" size={24} color="#f59e0b" style={{ marginBottom: 4 }} />
            <Text className="text-[11px] font-bold text-foreground">Rate Us</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/contact' as any)}
            className="flex-1 items-center bg-card py-4 rounded-[20px] border border-border shadow-sm mx-1"
          >
            <Ionicons name="chatbubbles" size={24} color="#3b82f6" style={{ marginBottom: 4 }} />
            <Text className="text-[11px] font-bold text-foreground">Contact</Text>
          </TouchableOpacity>
        </View>



        {/* Settings Links */}
        <View className="px-6 mb-8">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Preferences</Text>
          <View className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden mb-4">
            <SettingsRow icon="person-outline" title="Account Details" color="#3b82f6" onPress={() => router.push('/settings' as any)} />
            <SettingsRow icon="share-social-outline" title="Share App" color="#ec4899" isLast onPress={handleShareApp} />
          </View>
        </View>

        {/* Theme Settings Inline */}
        <View className="px-6 mb-10">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Appearance</Text>
          <View className="flex-row items-center justify-between gap-3 bg-card p-2 rounded-[20px] border border-border shadow-sm">
            {/* Theme Settings Inline */}
            <TouchableOpacity 
              onPress={() => changeTheme('light')}
              activeOpacity={0.7}
              className={`flex-1 items-center justify-center py-3 rounded-[16px] border ${themeMode === 'light' ? 'bg-primary border-primary shadow-sm' : 'bg-transparent border-transparent'}`}
            >
              <Ionicons name="sunny" size={20} color={themeMode === 'light' ? '#FFFFFF' : '#64748B'} style={{ marginBottom: 4 }} />
              <Text className={`text-[11px] font-bold ${themeMode === 'light' ? 'text-white' : 'text-muted-foreground'}`}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => changeTheme('dark')}
              activeOpacity={0.7}
              className={`flex-1 items-center justify-center py-3 rounded-[16px] border ${themeMode === 'dark' ? 'bg-primary border-primary shadow-sm' : 'bg-transparent border-transparent'}`}
            >
              <Ionicons name="moon" size={20} color={themeMode === 'dark' ? '#FFFFFF' : '#64748B'} style={{ marginBottom: 4 }} />
              <Text className={`text-[11px] font-bold ${themeMode === 'dark' ? 'text-white' : 'text-muted-foreground'}`}>Dark</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => changeTheme('system')}
              activeOpacity={0.7}
              className={`flex-1 items-center justify-center py-3 rounded-[16px] border ${themeMode === 'system' ? 'bg-primary border-primary shadow-sm' : 'bg-transparent border-transparent'}`}
            >
              <Ionicons name="phone-portrait" size={20} color={themeMode === 'system' ? '#FFFFFF' : '#64748B'} style={{ marginBottom: 4 }} />
              <Text className={`text-[11px] font-bold ${themeMode === 'system' ? 'text-white' : 'text-muted-foreground'}`}>System</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal & Info */}
        <View className="px-6 mb-10">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Legal & Information</Text>
          <View className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
            <SettingsRow icon="document-text-outline" title="Privacy Policy" color="#8b5cf6" onPress={() => router.push('/privacy-policy')} />
            <SettingsRow icon="shield-checkmark-outline" title="Terms of Use" color="#10b981" isLast onPress={() => router.push('/terms-of-use')} />
          </View>
        </View>


        <View className="px-6 gap-3 mb-10">
          <TouchableOpacity 
            onPress={handleLogout}
            className="w-full h-14 rounded-[16px] bg-destructive/10 border border-destructive/20 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text className="text-destructive font-bold text-[16px]">Sign Out</Text>
          </TouchableOpacity>
        </View>

      </Animated.ScrollView>


    </View>
  );
}

// Sub-components

function SettingsRow({ icon, title, color, isLast, onPress }: { icon: any, title: string, color: string, isLast?: boolean, onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center justify-between p-5 ${!isLast ? 'border-b border-border' : ''}`}>
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${color}15` }}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text className="text-[15px] font-bold text-foreground">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}


