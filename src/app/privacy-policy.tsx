import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when you create an account, update your profile, use our services, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.',
      icon: 'document-text-outline' as const,
      color: '#3b82f6'
    },
    {
      title: 'How We Use Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, develop new ones, and protect JustKlick and our users. We may also use this information to offer you tailored content, like giving you more relevant search results.',
      icon: 'analytics-outline' as const,
      color: '#8b5cf6'
    },
    {
      title: 'Information Sharing',
      content: 'We do not share your personal information with companies, organizations, or individuals outside of JustKlick except in the following cases: with your consent, for legal reasons, or to protect our users and services.',
      icon: 'share-social-outline' as const,
      color: '#10b981'
    },
    {
      title: 'Data Security',
      content: 'We work hard to protect JustKlick and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use encryption to keep your data private while in transit.',
      icon: 'shield-checkmark-outline' as const,
      color: '#f59e0b'
    }
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="px-6 pb-4 bg-card border-b border-border shadow-sm flex-row items-center"
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted items-center justify-center border border-border"
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <View className="flex-1 ml-4">
          <Text className="text-xl font-extrabold text-foreground tracking-tight">Privacy Policy</Text>
          <Text className="text-xs font-medium text-muted-foreground">Last updated: June 2026</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <View className="w-16 h-16 rounded-[20px] bg-primary/10 items-center justify-center mb-6 border border-primary/20">
            <Ionicons name="shield-half" size={32} color="#1C398E" />
          </View>
          <Text className="text-3xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
            Your Privacy Matters to Us
          </Text>
          <Text className="text-[16px] text-muted-foreground leading-relaxed">
            At JustKlick, we are committed to protecting your personal information and your right to privacy. This policy outlines how we handle your data to provide you with the best possible experience.
          </Text>
        </View>

        <View className="gap-6">
          {sections.map((section, index) => (
            <View key={index} className="bg-card p-6 rounded-[24px] border border-border shadow-sm">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${section.color}15` }}>
                  <Ionicons name={section.icon} size={20} color={section.color} />
                </View>
                <Text className="text-lg font-bold text-foreground flex-1">{section.title}</Text>
              </View>
              <Text className="text-[15px] text-muted-foreground leading-relaxed">
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-10 p-6 bg-muted rounded-[24px] border border-border items-center">
          <Text className="text-foreground font-bold mb-2">Have questions about your privacy?</Text>
          <Text className="text-muted-foreground text-center text-sm mb-4">
            Our support team is here to help you understand how we protect your data.
          </Text>
          <TouchableOpacity className="bg-primary px-6 py-3 rounded-full flex-row items-center">
            <Ionicons name="mail-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-[15px]">Contact Privacy Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
