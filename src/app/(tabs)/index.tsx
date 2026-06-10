import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    { id: '1', name: 'Software', icon: 'laptop-outline', color: 'bg-blue-100', iconColor: '#2563EB' },
    { id: '2', name: 'Coaching', icon: 'school-outline', color: 'bg-orange-100', iconColor: '#EA580C' },
    { id: '3', name: 'Hostels', icon: 'business-outline', color: 'bg-emerald-100', iconColor: '#16A34A' },
    { id: '4', name: 'Overseas', icon: 'earth-outline', color: 'bg-red-100', iconColor: '#E11D48' },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header Section */}
      <View className="px-4 py-6 bg-card rounded-b-3xl shadow-sm">
        <Text className="text-sm font-medium text-muted-foreground">Location</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="location" size={16} color="#E11D48" />
          <Text className="ml-1 text-base font-bold text-foreground">Detecting location...</Text>
          <Ionicons name="chevron-down" size={16} color="#2563EB" className="ml-2" />
        </View>

        {/* Search Bar Placeholder */}
        <TouchableOpacity 
          className="flex-row items-center mt-6 h-12 w-full rounded-full bg-muted px-4"
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search" size={20} color="#64748B" />
          <Text className="ml-2 text-muted-foreground font-medium">Search for services...</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View className="px-4 py-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-foreground">Popular Categories</Text>
          <Text className="text-sm font-semibold text-primary">See All</Text>
        </View>
        
        <View className="flex-row flex-wrap justify-between">
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              className="items-center mb-6 w-1/4"
              onPress={() => router.push(`/business/${cat.name.toLowerCase()}`)}
            >
              <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-2 ${cat.color}`}>
                <Ionicons name={cat.icon as any} size={28} color={cat.iconColor} />
              </View>
              <Text className="text-xs font-semibold text-center text-foreground">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
