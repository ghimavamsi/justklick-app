import React from 'react';
import { View, Animated as RNAnimated, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../../types/notification.types';
import { NotificationCard } from './NotificationCard';
import { useMarkNotificationRead, useDeleteNotification } from '../../hooks/useNotifications';

interface SwipeableNotificationRowProps {
  notification: NotificationItem;
  onPress: (notification: NotificationItem) => void;
}

export function SwipeableNotificationRow({ notification, onPress }: SwipeableNotificationRowProps) {
  const { mutate: markAsRead } = useMarkNotificationRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const renderRightActions = (progress: RNAnimated.AnimatedInterpolation<number>, dragX: RNAnimated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View className="flex-row items-center w-32 justify-end">
        {!notification.is_read && (
          <TouchableOpacity 
            onPress={() => markAsRead(String(notification.id))}
            className="w-16 h-full items-center justify-center bg-blue-500"
          >
            <RNAnimated.View style={{ transform: [{ scale }] }}>
              <Ionicons name="checkmark-done" size={24} color="#FFF" />
            </RNAnimated.View>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={() => deleteNotif(String(notification.id))}
          className="w-16 h-full items-center justify-center bg-rose-600"
        >
          <RNAnimated.View style={{ transform: [{ scale }] }}>
            <Ionicons name="trash" size={24} color="#FFF" />
          </RNAnimated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2} rightThreshold={40}>
      <NotificationCard notification={notification} onPress={onPress} />
    </Swipeable>
  );
}
