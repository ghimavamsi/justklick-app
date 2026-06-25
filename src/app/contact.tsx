import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { dynamicApi } from '../api/dynamic';
import { useTheme } from '../hooks/useTheme';

export default function ContactScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submitMutation = useMutation({
    mutationFn: () => dynamicApi.submitContact({
      full_name: name,
      email,
      phone,
      subject,
      message,
    }),
    onSuccess: () => {
      Alert.alert('Success', 'Your message has been sent successfully. We will get back to you soon.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    },
    onError: (err: any) => {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to send message. Please try again later.');
    }
  });

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Name, Email, Message).');
      return;
    }
    submitMutation.mutate();
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="px-6 pb-4 border-b border-border/50 flex-row items-center bg-background/95 shadow-sm z-50"
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border shadow-sm mr-4"
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-foreground tracking-tight">Contact Us</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <Text className="text-2xl font-bold text-foreground mb-2">Get in Touch</Text>
        <Text className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Have a question or need assistance? Fill out the form below and our support team will reach out to you.
        </Text>

        <View className="bg-card rounded-[24px] p-6 border border-border shadow-sm">
          <View className="mb-4">
            <Text className="text-sm font-bold text-foreground mb-2">Full Name *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-[16px] px-4 h-12 text-foreground"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-bold text-foreground mb-2">Email Address *</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-[16px] px-4 h-12 text-foreground"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-bold text-foreground mb-2">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 9876543210"
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-[16px] px-4 h-12 text-foreground"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-bold text-foreground mb-2">Subject</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="How can we help?"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-[16px] px-4 h-12 text-foreground"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-bold text-foreground mb-2">Message *</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#94A3B8"
              className="bg-background border border-border rounded-[16px] p-4 min-h-[100px] text-foreground"
            />
          </View>

          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={submitMutation.isPending}
            className={`h-14 rounded-full items-center justify-center ${submitMutation.isPending ? 'bg-primary/50' : 'bg-primary'}`}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white font-bold text-[16px]">Send Message</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-8 mb-4">
          <Text className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 ml-1">Other Ways to Reach Us</Text>
          <View className="bg-card rounded-[24px] border border-border shadow-sm p-4">
             <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                  <Ionicons name="mail" size={20} color="#1C398E" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-muted-foreground">Email</Text>
                  <Text className="text-sm font-medium text-foreground">support@justklick.com</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                  <Ionicons name="call" size={20} color="#1C398E" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-muted-foreground">Phone</Text>
                  <Text className="text-sm font-medium text-foreground">+91 9876543210</Text>
                </View>
              </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
