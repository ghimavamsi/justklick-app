import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const TABS = ['Overview', 'Services', 'Photos', 'Reviews', 'Similar'];

export function StickyTabBar({ activeTab, onTabPress }: Props) {
  return (
    <View className="bg-background py-3">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <View key={`tab-${tab}`}>
              <TouchableOpacity 
                onPress={() => onTabPress(tab)}
                className={`mr-3 px-5 py-2.5 rounded-full border ${isActive ? 'bg-primary border-primary shadow-sm' : 'bg-card border-border'}`}
              >
                <Text className={`text-sm ${isActive ? 'font-bold text-white' : 'font-semibold text-muted-foreground'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
