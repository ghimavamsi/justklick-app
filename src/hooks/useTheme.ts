import { useEffect } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useThemeStore, ThemeMode } from '../store/theme-store';

export function useTheme() {
  const { colorScheme: nwColorScheme, setColorScheme } = useNativeWindColorScheme();
  const deviceTheme = useDeviceColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();

  useEffect(() => {
    // Sync NativeWind colorScheme with our Zustand store on mount and when themeMode changes
    if (themeMode === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, setColorScheme]);

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    if (mode === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(mode);
    }
  };

  const resolvedColorScheme = nwColorScheme ?? deviceTheme ?? 'light';

  return {
    themeMode,
    colorScheme: resolvedColorScheme,
    changeTheme,
    isReady: true,
  };
}
