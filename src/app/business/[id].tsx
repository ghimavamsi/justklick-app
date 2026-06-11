import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function BusinessDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Cover Image Placeholder */}
      <View className="h-48 w-full bg-muted justify-center items-center">
        <SymbolView name="photo" size={48} tintColor="#94A3B8" />
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold text-foreground capitalize">{id} Service</Text>
            <Text className="text-sm text-muted-foreground mt-1">123 Business Avenue, City Center</Text>
          </View>
          <View className="bg-primary/10 px-3 py-1 rounded-full flex-row items-center">
            <SymbolView name="star.fill" size={14} tintColor="#E11D48" />
            <Text className="ml-1 text-sm font-bold text-primary">4.8</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-4 pb-4 border-b border-border">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 bg-primary/10 rounded-lg mr-2">
            <SymbolView name="phone.fill" size={18} tintColor="#2563EB" />
            <Text className="ml-2 font-semibold text-primary">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2 bg-secondary/10 rounded-lg ml-2">
            <SymbolView name="mappin" size={18} tintColor="#E11D48" />
            <Text className="ml-2 font-semibold text-secondary">Direction</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="text-lg font-bold text-foreground mb-2">About Us</Text>
          <Text className="text-sm text-muted-foreground leading-6">
            We provide top-notch {id} services with a commitment to excellence and customer satisfaction. Our highly trained professionals are here to help you.
          </Text>
        </View>

        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground">Reviews</Text>
            <TouchableOpacity onPress={() => router.push('/business/reviews')}>
              <Text className="text-sm font-semibold text-primary">View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sample Review */}
          <View className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-foreground">Jane Doe</Text>
              <View className="flex-row">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SymbolView key={i} name="star.fill" size={12} tintColor="#E11D48" />
                ))}
              </View>
            </View>
            <Text className="text-sm text-muted-foreground">Excellent service! Highly recommended to everyone looking for {id} professionals.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
