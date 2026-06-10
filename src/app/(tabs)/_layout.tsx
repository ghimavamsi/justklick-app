import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  
  // These values should ideally come from our tailwind theme, but for tabs we use hex
  const tintColor = '#2563EB'; // Primary Blue
  const inactiveTintColor = '#64748B'; // Muted Foreground

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#1E293B' : '#E2E8F0',
          backgroundColor: colorScheme === 'dark' ? '#0B1120' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#0B1120' : '#FFFFFF',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#F8FAFC' : '#020617',
          fontFamily: 'PlusJakartaSans-Bold',
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans-Medium',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Updates',
          tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
