import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '../../../store/location-store';
import { useTheme } from '../../../hooks/useTheme';

interface LocationPermissionStateProps {
  onOpenManualSelector: () => void;
}

export function LocationPermissionState({ onOpenManualSelector }: LocationPermissionStateProps) {
  const { permissionStatus, requestPermission, isLoading } = useLocationStore();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const isBlocked = permissionStatus === 'blocked';

  return (
    <View className="flex-1 items-center justify-center p-8 bg-background">
      {/* Elegant Illustration Placeholder */}
      <View className="w-32 h-32 rounded-full bg-primary/10 items-center justify-center mb-8 border border-primary/20">
        <Ionicons name="location" size={64} color="#c10007" />
        <View className="absolute bottom-4 right-4 bg-background rounded-full p-1 border border-border">
          <Ionicons name={isBlocked ? "lock-closed" : "sparkles"} size={20} color={isBlocked ? "#64748B" : "#F59E0B"} />
        </View>
      </View>

      <Text className="text-2xl font-extrabold text-foreground text-center mb-3">
        {isBlocked ? 'Location Access Disabled' : 'Personalize Your Discovery'}
      </Text>
      
      <Text className="text-base text-muted-foreground text-center mb-10 leading-relaxed px-4">
        {isBlocked 
          ? 'Location access is permanently disabled in your device settings. Please enable it to find nearby businesses, or choose your location manually.'
          : 'Enable location access to instantly discover top-rated businesses, services, and categories precisely around you.'}
      </Text>

      <View className="w-full space-y-4">
        {isBlocked ? (
          <TouchableOpacity 
            onPress={handleOpenSettings}
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-lg">Open Device Settings</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={requestPermission}
            disabled={isLoading}
            className="w-full bg-primary py-4 rounded-2xl items-center shadow-lg shadow-primary/30 flex-row justify-center"
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text className="text-white font-bold text-lg">Requesting...</Text>
            ) : (
              <>
                <Ionicons name="navigate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg">Enable Location</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={onOpenManualSelector}
          className="w-full py-4 rounded-2xl items-center border border-border bg-card mt-3"
          activeOpacity={0.7}
        >
          <Text className="text-foreground font-semibold text-base">Choose Location Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
