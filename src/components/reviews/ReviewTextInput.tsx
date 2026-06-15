import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  text: string;
  onChangeText: (text: string) => void;
  onInfoPress: () => void;
}

const MIN_CHARS = 20;
const MAX_CHARS = 500;

export function ReviewTextInput({ text, onChangeText, onInfoPress }: Props) {
  const { colorScheme } = useTheme();
  const charCount = text.length;
  
  const isOverLimit = charCount > MAX_CHARS;
  const isUnderLimit = charCount > 0 && charCount < MIN_CHARS;
  
  let counterColor = 'text-muted-foreground';
  if (isOverLimit || isUnderLimit) {
    counterColor = 'text-rose-500 font-bold';
  } else if (charCount >= MIN_CHARS) {
    counterColor = 'text-emerald-500 font-bold';
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-extrabold text-foreground">Tell us about your experience</Text>
        <TouchableOpacity onPress={onInfoPress} className="p-1">
          <Ionicons name="information-circle-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View className={`bg-card rounded-2xl border ${isOverLimit ? 'border-rose-500' : 'border-border'} overflow-hidden shadow-sm`}>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Share what you liked, what could be improved, and any details that might help other users."
          placeholderTextColor="#94A3B8"
          value={text}
          onChangeText={onChangeText}
          style={{ 
            height: 150, 
            padding: 16, 
            fontSize: 16, 
            color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
            lineHeight: 24
          }}
        />
        
        {/* Character Counter & Progress Bar */}
        <View className="flex-row justify-between items-center px-4 py-3 bg-muted/30 border-t border-border">
          <View className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mr-4">
            <View 
              className={`h-full rounded-full ${isOverLimit ? 'bg-rose-500' : (isUnderLimit ? 'bg-amber-500' : 'bg-emerald-500')}`} 
              style={{ width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%` }} 
            />
          </View>
          <Text className={`text-xs ${counterColor}`}>
            {charCount} / {MAX_CHARS}
          </Text>
        </View>
      </View>
      
      {isUnderLimit && (
        <Text className="text-rose-500 text-xs font-medium mt-2 ml-1">
          Please enter at least {MIN_CHARS} characters for a helpful review.
        </Text>
      )}
    </View>
  );
}
