import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth-store';
import { FavoritesGuestView } from '../../components/favorites/FavoritesGuestView';
import { FavoritesAuthView } from '../../components/favorites/FavoritesAuthView';
import { useTheme } from '../../hooks/useTheme';

export default function FavoritesScreen() {
  const { isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();
  const { themeMode } = useTheme();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {isAuthenticated ? <FavoritesAuthView /> : <FavoritesGuestView />}
    </View>
  );
}
// Force TS re-evaluation
