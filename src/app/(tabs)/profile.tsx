import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export default function PremiumProfileScreen() {
  const router = useRouter();
  const { themeMode, colorScheme, changeTheme } = useTheme();

  const ThemeButton = ({ mode, icon, label }: { mode: 'light' | 'dark' | 'system', icon: any, label: string }) => {
    const isActive = themeMode === mode;
    return (
      <TouchableOpacity 
        onPress={() => changeTheme(mode)}
        activeOpacity={0.7}
        className={`flex-1 items-center justify-center py-3 rounded-xl border ${
          isActive 
            ? 'bg-primary border-primary shadow-md shadow-primary/20' 
            : 'bg-card border-border'
        }`}
      >
        <Ionicons 
          name={icon} 
          size={20} 
          color={isActive ? '#FFFFFF' : (colorScheme === 'dark' ? '#A1A1AA' : '#64748B')} 
          style={{ marginBottom: 4 }}
        />
        <Text className={`text-xs font-bold ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colorScheme === 'dark' ? '#09090b' : '#FAFAFA'} 
      />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 60 : 40 }}
      >
        
        {/* Header Section */}
        <View className="px-6 mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-extrabold tracking-tight text-foreground">
            Profile
          </Text>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center shadow-sm"
          >
            <Ionicons name="settings-outline" size={20} color={colorScheme === 'dark' ? '#FFFFFF' : '#1e293b'} />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View className="mx-6 bg-card rounded-[24px] p-6 border border-border shadow-sm mb-8 items-center">
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4 border-4 border-background">
            <Text className="text-3xl font-bold text-primary">JD</Text>
          </View>
          <Text className="text-xl font-bold text-foreground mb-1">John Doe</Text>
          <Text className="text-sm font-medium text-muted-foreground mb-6">john.doe@example.com</Text>
          
          <View className="flex-row items-center justify-center w-full gap-4">
            <View className="flex-1 bg-background rounded-xl p-3 items-center border border-border">
              <Text className="text-lg font-bold text-foreground">12</Text>
              <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Reviews</Text>
            </View>
            <View className="flex-1 bg-background rounded-xl p-3 items-center border border-border">
              <Text className="text-lg font-bold text-foreground">4</Text>
              <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Saved</Text>
            </View>
          </View>
        </View>

        {/* Theme Settings Section */}
        <View className="mx-6 mb-8">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">
            Appearance
          </Text>
          <View className="flex-row items-center justify-between gap-3 bg-card p-2 rounded-[20px] border border-border shadow-sm">
            <ThemeButton mode="light" icon="sunny" label="Light" />
            <ThemeButton mode="dark" icon="moon" label="Dark" />
            <ThemeButton mode="system" icon="phone-portrait" label="System" />
          </View>
        </View>

        {/* Settings Links */}
        <View className="mx-6 bg-card rounded-[24px] border border-border overflow-hidden shadow-sm mb-8">
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-border">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-500/10 items-center justify-center mr-4">
                <Ionicons name="person-outline" size={16} color="#3b82f6" />
              </View>
              <Text className="text-[15px] font-bold text-foreground">Personal Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-border">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-green-500/10 items-center justify-center mr-4">
                <Ionicons name="shield-checkmark-outline" size={16} color="#22c55e" />
              </View>
              <Text className="text-[15px] font-bold text-foreground">Security & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-purple-500/10 items-center justify-center mr-4">
                <Ionicons name="notifications-outline" size={16} color="#a855f7" />
              </View>
              <Text className="text-[15px] font-bold text-foreground">Push Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mx-6">
          <TouchableOpacity 
            className="w-full h-14 rounded-xl bg-destructive/10 flex-row items-center justify-center border border-destructive/20"
            activeOpacity={0.7}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 8 }} />
            <Text className="text-[15px] font-bold text-destructive">Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
