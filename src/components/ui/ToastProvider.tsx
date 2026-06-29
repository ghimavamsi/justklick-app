import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withSequence, 
  withDelay, 
  runOnJS 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToastMessage(message);
    setToastType(type);

    // Reset before animating in
    translateY.value = -150;
    opacity.value = 0;

    // Animate in
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(insets.top + 10, {
      damping: 15,
      stiffness: 150,
    });

    // Auto dismiss after 3.5 seconds
    translateY.value = withDelay(
      3500,
      withTiming(-150, { duration: 400 }, (finished) => {
        if (finished) {
          opacity.value = 0;
          runOnJS(setToastMessage)('');
        }
      })
    );
  }, [insets.top]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
      position: 'absolute',
      top: 0,
      left: 20,
      right: 20,
      zIndex: 9999,
    };
  });

  const getIcon = () => {
    switch (toastType) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      default: return 'information-circle';
    }
  };

  const getColors = () => {
    switch (toastType) {
      case 'success': return { bg: '#10B981', text: '#FFFFFF', iconBg: 'rgba(255,255,255,0.2)' };
      case 'error': return { bg: '#EF4444', text: '#FFFFFF', iconBg: 'rgba(255,255,255,0.2)' };
      default: return { bg: '#3B82F6', text: '#FFFFFF', iconBg: 'rgba(255,255,255,0.2)' };
    }
  };

  const colors = getColors();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {toastMessage !== '' && (
        <Animated.View style={animatedStyle}>
          <View 
            className="flex-row items-center p-4 rounded-[20px] shadow-lg border"
            style={{ 
              backgroundColor: colors.bg, 
              borderColor: 'rgba(255,255,255,0.1)',
              shadowColor: colors.bg,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 10
            }}
          >
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons name={getIcon()} size={24} color="#FFF" />
            </View>
            <Text className="flex-1 text-[15px] font-bold text-white tracking-wide leading-relaxed">
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}
