import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchStore } from '../../../store/search-store';
import { useTheme } from '../../../hooks/useTheme';

export function TypingState() {
  const { query, setQuery, setPhase, setIsFocused, recentSearches } = useSearchStore();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setPhase('results');
    setIsFocused(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'category': return 'business-outline';
      case 'service': return 'briefcase-outline';
      case 'query': return 'search-outline';
      default: return 'search-outline';
    }
  };

  // Only show recent searches that match the current query
  const suggestions = recentSearches
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .map((s, index) => ({ id: `recent-${index}`, text: s, type: 'query' }));

  return (
    <ScrollView 
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
    >
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleSelectSuggestion(item.text)}
          className={`flex-row items-center px-6 py-4 ${index !== suggestions.length - 1 ? 'border-b border-border/50' : ''}`}
        >
          <View className="w-10 h-10 bg-muted rounded-full items-center justify-center mr-4">
            <Ionicons name={getIconForType(item.type)} size={18} color={isDark ? '#FFF' : '#000'} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">
              {item.text}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color="#64748B" style={{ opacity: 0.5 }} />
        </TouchableOpacity>
      ))}

      {suggestions.length === 0 && (
        <TouchableOpacity
          onPress={() => handleSelectSuggestion(query)}
          className="flex-row items-center px-6 py-4"
        >
          <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4 border border-primary/20">
            <Ionicons name="search" size={18} color="#c10007" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">
              Search for "{query}"
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
