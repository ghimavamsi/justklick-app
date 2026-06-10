import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <View className="w-24 h-24 rounded-full bg-muted items-center justify-center mb-4 border-2 border-primary/20">
        <Text className="text-3xl font-bold text-primary">U</Text>
      </View>
      <Text className="text-xl font-bold text-foreground mb-1">User Profile</Text>
      <Text className="text-sm text-muted-foreground mb-8">user@example.com</Text>

      <TouchableOpacity 
        className="w-full max-w-xs rounded-xl bg-secondary py-4 items-center justify-center shadow-md shadow-secondary/20 active:opacity-80"
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text className="text-base font-semibold text-secondary-foreground">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
