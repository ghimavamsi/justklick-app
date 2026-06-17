import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function TermsOfUseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using JustKlick, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.',
      icon: 'checkmark-circle-outline' as const,
      color: '#3b82f6'
    },
    {
      title: 'User Responsibilities',
      content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account and password, and you agree to accept responsibility for all activities that occur under your account.',
      icon: 'person-outline' as const,
      color: '#8b5cf6'
    },
    {
      title: 'Content Guidelines',
      content: 'Users may post reviews, comments, and other content as long as it is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties.',
      icon: 'chatbubble-ellipses-outline' as const,
      color: '#10b981'
    },
    {
      title: 'Termination',
      content: 'We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive.',
      icon: 'warning-outline' as const,
      color: '#ef4444'
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
          <Text className="text-xl font-extrabold text-foreground tracking-tight">Terms of Use</Text>
          <Text className="text-xs font-medium text-muted-foreground">Effective: June 2026</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <View className="w-16 h-16 rounded-[20px] bg-primary/10 items-center justify-center mb-6 border border-primary/20">
            <Ionicons name="document-text" size={32} color="#1C398E" />
          </View>
          <Text className="text-3xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
            Terms of Service
          </Text>
          <Text className="text-[16px] text-muted-foreground leading-relaxed">
            Please read these terms and conditions carefully before using the JustKlick mobile application. These terms govern your use of our platform and services.
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

        <View className="mt-10 p-6 bg-muted rounded-[24px] border border-border">
          <Text className="text-foreground font-bold mb-4 text-center">Agreement Acknowledgment</Text>
          <Text className="text-muted-foreground text-center text-sm leading-relaxed">
            By continuing to use JustKlick, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
