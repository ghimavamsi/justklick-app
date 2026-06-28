import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSearchStore } from '../../../store/search-store';
import { useTheme } from '../../../hooks/useTheme';
import { useCategorySearch } from '../../../hooks/useCategoryExplore';
import { useSearchAPI } from '../../../hooks/useSearchAPI';

export function TypingState() {
  const { query, setQuery, setPhase, setIsFocused, recentSearches } = useSearchStore();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  // Fetch category suggestions matching the query
  const { data: categoryData } = useCategorySearch(query);
  
  // Fetch business suggestions matching the query
  const { data: businessData } = useSearchAPI(query, null);

  const handleSelectSuggestion = (text: string, type: string, slug?: string) => {
    if (type === 'category' && slug) {
      setIsFocused(false);
      router.push(`/categories/${slug}`);
    } else if (type === 'business' && slug) {
      setIsFocused(false);
      router.push(`/business/${slug}`);
    } else {
      setQuery(text);
      setPhase('results');
      setIsFocused(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'category': return 'business-outline';
      case 'business': return 'storefront-outline';
      case 'service': return 'briefcase-outline';
      case 'query': return 'search-outline';
      default: return 'search-outline';
    }
  };

  // Combine categories and recent searches
  const catSuggestions = (categoryData || []).slice(0, 3).map((c: any) => ({
    id: `cat-${c.id}`,
    text: c.name,
    type: 'category',
    slug: c.id // useCategoryExplore maps the text slug into c.id
  }));

  const businessSuggestions = (businessData || [])
    .slice(0, 5)
    .filter((b: any) => b?.name?.toLowerCase().includes(query.toLowerCase()))
    .map((b: any) => ({
      id: `bus-${b.id}`,
      text: b.name,
      type: 'business',
      slug: b.slug
    }));

  const recentSuggestions = recentSearches
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .filter(s => !catSuggestions.find(c => c.text.toLowerCase() === s.toLowerCase())) // prevent duplicates
    .filter(s => !businessSuggestions.find(b => b.text.toLowerCase() === s.toLowerCase()))
    .map((s, index) => ({ id: `recent-${index}`, text: s, type: 'query' }));

  // Limit total suggestions
  const suggestions = [...catSuggestions, ...businessSuggestions, ...recentSuggestions].slice(0, 10);

  return (
    <ScrollView 
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
    >
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleSelectSuggestion(item.text, item.type, item.slug)}
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
          onPress={() => handleSelectSuggestion(query, 'query')}
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
