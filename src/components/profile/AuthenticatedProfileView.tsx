import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/user-store';
import { useAuthStore } from '../../store/auth-store';
import { ProfileDashboardData, ProfileActivityItem } from '../../types/profile.types';
import { StudentProfileResponse } from '../../types/student.types';

interface AuthenticatedProfileViewProps {
  data: ProfileDashboardData;
  studentProfile?: StudentProfileResponse;
  onSettingsPress: () => void;
}

export function AuthenticatedProfileView({ data, studentProfile, onSettingsPress }: AuthenticatedProfileViewProps) {
  const router = useRouter();
  const { colorScheme, changeTheme, themeMode } = useTheme();
  const { profile, clearProfile } = useUserStore();
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    clearProfile();
    logout();
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

  // Determine if profile is incomplete
  const isProfileComplete = studentProfile && studentProfile.college_code && studentProfile.course;

  return (
    <View className="flex-1 bg-background">
      {/* Sticky Header */}
      <Animated.View style={[{ paddingTop: insets.top, height: headerHeight, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: isDark ? 'rgba(9,9,11,0.95)' : 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
        <View className="px-6 shadow-sm flex-row items-center justify-between h-full w-full">
          <Animated.View style={headerTitleOpacity}>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
              <Text className="text-primary-foreground font-bold text-xs">{profile?.name?.substring(0,2).toUpperCase() || 'JK'}</Text>
            </View>
            <Text className="text-lg font-bold text-foreground">{profile?.name || 'User'}</Text>
          </View>
        </Animated.View>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border"
          onPress={onSettingsPress}
        >
          <Ionicons name="settings-outline" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
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
              <View className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background items-center justify-center shadow-sm">
                <Text className="text-3xl font-extrabold text-primary">
                  {profile?.name?.substring(0,2).toUpperCase() || 'JK'}
                </Text>
              </View>
            </View>
          </Animated.View>
          
          <Text className="text-2xl font-extrabold text-foreground mb-1">{profile?.name || 'JustKlick User'}</Text>
          <Text className="text-sm font-medium text-muted-foreground mb-4">{profile?.phone || '9876543210'} • {profile?.email || 'user@example.com'}</Text>

          <TouchableOpacity 
            onPress={() => router.push('/edit-profile')}
            className="bg-primary/10 px-6 py-2 rounded-full border border-primary/20 flex-row items-center"
          >
            <Ionicons name="pencil" size={14} color="#1C398E" style={{ marginRight: 6 }} />
            <Text className="text-[#1C398E] font-bold text-sm">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Completion Prompt */}
        {!isProfileComplete && (
          <View className="px-6 mb-8">
            <View className="bg-[#c10007]/10 p-5 rounded-3xl border border-[#c10007]/20 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-[#c10007] font-bold text-lg mb-1">Profile Incomplete</Text>
                <Text className="text-muted-foreground text-xs leading-relaxed">Fill out your academic and career details to get personalized recommendations and unlock all features.</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/edit-profile')}
                className="bg-[#c10007] h-12 px-5 rounded-full items-center justify-center shadow-md shadow-[#c10007]/30"
              >
                <Text className="text-white font-bold text-sm">Complete Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dashboard Stats */}
        <View className="px-6 mb-8">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">My Dashboard</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            <StatCard icon="heart" title="Favorites" value={data.statistics.favoritesCount} color="#ef4444" />
            <StatCard icon="star" title="Reviews" value={data.statistics.reviewsCount} color="#f59e0b" />
            <StatCard icon="eye" title="Viewed" value={data.statistics.viewsCount} color="#3b82f6" />
            <StatCard icon="pricetags" title="Offers" value={data.statistics.offersClaimed} color="#10b981" />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-8">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Recent Activity</Text>
            <TouchableOpacity><Text className="text-sm font-bold text-primary">View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
            {data.recentActivity.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Settings Links */}
        <View className="px-6 mb-8">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Preferences</Text>
          <View className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden mb-4">
            <SettingsRow icon="person-outline" title="Account Details" color="#3b82f6" />
            <SettingsRow icon="notifications-outline" title="Notification Preferences" color="#a855f7" />
            <SettingsRow icon="location-outline" title="Location Settings" color="#10b981" isLast />
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

        {/* Support & Logout */}
        <View className="px-6 gap-3">
          <TouchableOpacity className="w-full h-14 rounded-[16px] bg-card border border-border flex-row items-center justify-center shadow-sm">
            <Ionicons name="help-buoy-outline" size={20} color={isDark ? '#FFF' : '#000'} style={{ marginRight: 8 }} />
            <Text className="text-foreground font-bold text-[16px]">Help & Support</Text>
          </TouchableOpacity>
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

function StatCard({ icon, title, value, color }: { icon: any, title: string, value: number, color: string }) {
  return (
    <View className="w-[48%] bg-card rounded-[20px] p-4 border border-border shadow-sm flex-row items-center">
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}15` }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text className="text-xl font-extrabold text-foreground">{value}</Text>
        <Text className="text-[11px] font-bold text-muted-foreground uppercase">{title}</Text>
      </View>
    </View>
  );
}

function ActivityCard({ item }: { item: ProfileActivityItem }) {
  return (
    <View className="w-64 bg-card rounded-[20px] p-3 border border-border shadow-sm flex-row items-center">
      <Image source={{ uri: item.imageUrl }} className="w-14 h-14 rounded-[12px] bg-muted mr-3" />
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground mb-0.5" numberOfLines={1}>{item.title}</Text>
        <Text className="text-xs text-muted-foreground font-medium mb-1" numberOfLines={1}>{item.subtitle}</Text>
        <Text className="text-[10px] font-bold text-muted-foreground uppercase">{item.timestamp}</Text>
      </View>
    </View>
  );
}

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


