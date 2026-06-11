import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    { id: '1', name: 'Software', icon: 'laptopcomputer', color: 'bg-blue-100', iconColor: '#2563EB' },
    { id: '2', name: 'Coaching', icon: 'graduationcap', color: 'bg-orange-100', iconColor: '#EA580C' },
    { id: '3', name: 'Hostels', icon: 'building', color: 'bg-emerald-100', iconColor: '#16A34A' },
    { id: '4', name: 'Overseas', icon: 'globe', color: 'bg-red-100', iconColor: '#E11D48' },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header Section */}
      <View className="px-4 py-6 bg-card rounded-b-3xl shadow-sm">
        <Text className="text-sm font-medium text-muted-foreground">Location</Text>
        <View className="flex-row items-center mt-1">
          <SymbolView name="mappin" size={16} tintColor="#E11D48" />
          <Text className="ml-1 text-base font-bold text-foreground">Detecting location...</Text>
          <SymbolView name="chevron.down" size={16} tintColor="#2563EB" style={{ marginLeft: 8 }} />
        </View>

        {/* Search Bar Placeholder */}
        <TouchableOpacity 
          className="flex-row items-center mt-6 h-12 w-full rounded-full bg-muted px-4"
          onPress={() => router.push('/(tabs)/search')}
        >
          <SymbolView name="magnifyingglass" size={20} tintColor="#64748B" />
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
                <SymbolView name={cat.icon as any} size={28} tintColor={cat.iconColor} />
              </View>
              <Text className="text-xs font-semibold text-center text-foreground">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
