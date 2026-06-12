import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  
  // These values should ideally come from our tailwind theme, but for tabs we use hex
  const tintColor = '#E60000'; // JustKlick Red
  const inactiveTintColor = '#A0A0A0'; // Muted Foreground

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#27272a' : '#e4e4e7',
          backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#fafafa' : '#09090b',
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
          headerShown: false,
          tabBarIcon: ({ color }) => <SymbolView name="house.fill" size={24} tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <SymbolView name="magnifyingglass" size={24} tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Updates',
          tabBarIcon: ({ color }) => <SymbolView name="bell.fill" size={24} tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <SymbolView name="person.fill" size={24} tintColor={color} />,
        }}
      />
    </Tabs>
  );
}
