import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BusinessReviewsScreen() {
  const reviews = [
    { id: '1', name: 'Jane Doe', rating: 5, comment: 'Excellent service! Highly recommended.' },
    { id: '2', name: 'John Smith', rating: 4, comment: 'Very good experience overall.' },
    { id: '3', name: 'Alice Johnson', rating: 5, comment: 'Will definitely come back.' },
  ];

  return (
    <View className="flex-1 bg-background p-4">
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card p-4 rounded-xl border border-border shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-foreground">{item.name}</Text>
              <View className="flex-row">
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i} 
                    name={i < item.rating ? "star" : "star-outline"} 
                    size={14} 
                    color="#E11D48" 
                  />
                ))}
              </View>
            </View>
            <Text className="text-sm text-muted-foreground">{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}
