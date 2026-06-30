import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { notificationsApi } from '../api/notifications';
import { useAuthStore } from '../store/auth-store';
import { useRouter } from 'expo-router';

// Set how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Only register push notifications if the user is authenticated
    if (!isAuthenticated) return;

    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          console.log('Push token obtained:', token);
          // Send the token to your Django Ninja backend
          notificationsApi.saveDeviceToken({
            token,
            type: Platform.OS, // e.g. "android" or "ios"
          }).then(res => {
            console.log('Token successfully synced with backend:', res);
          }).catch(err => {
            console.error('Failed to sync push token with backend:', err);
          });
        }
      })
      .catch(err => {
        console.error('Failed to register for push notifications:', err);
      });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Foreground notification received:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification 
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received (tapped):', response);
      // Navigate to the notifications screen when a user taps the notification
      router.push('/notifications');
      
      // If your backend sends specific URL paths in the data payload, you can navigate dynamically:
      // const path = response.notification.request.content.data?.url;
      // if (path) router.push(path);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isAuthenticated]);
}

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'custom_sound.wav',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification! User denied permission.');
      return undefined;
    }
    
    try {
      // By using getDevicePushTokenAsync, we get the native FCM or APNs token
      const tokenResponse = await Notifications.getDevicePushTokenAsync();
      token = tokenResponse.data;
    } catch (e) {
      console.error('Failed to get device push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
