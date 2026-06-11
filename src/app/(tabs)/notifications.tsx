import { View, Text } from 'react-native';

export default function NotificationsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-xl font-bold text-foreground mb-2">Notifications</Text>
      <Text className="text-sm text-muted-foreground text-center">You&apos;re all caught up! No new notifications.</Text>
    </View>
  );
}
