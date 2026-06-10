import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function BusinessLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  const headerBg = isDark ? '#0B1120' : '#FFFFFF';
  const headerText = isDark ? '#F8FAFC' : '#020617';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBg },
        headerTitleStyle: { color: headerText, fontFamily: 'PlusJakartaSans-Bold' },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color={headerText} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Business Details' }} />
      <Stack.Screen name="reviews" options={{ title: 'All Reviews' }} />
    </Stack>
  );
}
