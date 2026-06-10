import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <View className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg">
        <Text className="mb-2 text-center text-3xl font-bold text-foreground">Create Account</Text>
        <Text className="mb-8 text-center text-sm text-muted-foreground">Sign up to get started</Text>
        
        {/* Placeholders for Inputs */}
        <View className="mb-4 h-12 w-full rounded-lg border border-border bg-input/50 px-4 justify-center">
          <Text className="text-muted-foreground">Full Name</Text>
        </View>
        <View className="mb-4 h-12 w-full rounded-lg border border-border bg-input/50 px-4 justify-center">
          <Text className="text-muted-foreground">Email</Text>
        </View>
        <View className="mb-6 h-12 w-full rounded-lg border border-border bg-input/50 px-4 justify-center">
          <Text className="text-muted-foreground">Password</Text>
        </View>

        <TouchableOpacity 
          className="w-full rounded-xl bg-primary py-4 items-center justify-center shadow-md shadow-primary/20 active:opacity-80"
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-base font-semibold text-primary-foreground">Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-4 w-full items-center justify-center py-2"
          onPress={() => router.back()}
        >
          <Text className="text-sm font-medium text-primary">Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
