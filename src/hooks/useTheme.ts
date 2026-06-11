import { useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
const THEME_STORAGE_KEY = '@app_theme_mode';

export function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const deviceTheme = useDeviceColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load persisted theme on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeMode(savedTheme);
          setColorScheme(savedTheme);
        } else {
          setThemeMode('system');
          setColorScheme(deviceTheme || 'light');
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, [deviceTheme]);

  // Sync native system changes if mode is 'system'
  useEffect(() => {
    if (isReady && themeMode === 'system') {
      setColorScheme(deviceTheme || 'light');
    }
  }, [deviceTheme, themeMode, isReady]);

  const changeTheme = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      if (mode === 'system') {
        setColorScheme(deviceTheme || 'light');
        await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        setColorScheme(mode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  return {
    themeMode,
    colorScheme,
    changeTheme,
    isReady,
  };
}
