import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';

const EDUCATION_LEVELS = [
  'High School',
  'Diploma',
  'Bachelors Degree',
  'Masters Degree',
  'Doctorate (PhD)',
  'Other'
];

export default function RegisterScreen() {
  const router = useRouter();
  const [eduModalVisible, setEduModalVisible] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState('');

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-card border-b border-border/50 shadow-sm z-10 flex-row items-center">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-background items-center justify-center shadow-sm border border-border/50"
          onPress={() => router.back()}
        >
          <SymbolView name="chevron.left" size={20} tintColor="#A0A0A0" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground ml-4">Create Account</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground tracking-tight mb-2">Join JustKlick</Text>
          <Text className="text-base text-muted-foreground">Fill in your details below to get started.</Text>
        </View>

        <View className="gap-5">
          {/* Full Name */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center h-14 rounded-2xl bg-input/40 border border-border/80 px-4">
              <SymbolView name="person.fill" size={18} tintColor="#A0A0A0" style={{ marginRight: 12 }} />
              <TextInput 
                className="flex-1 text-base font-medium text-foreground h-full"
                placeholder="John Doe"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Mobile Number</Text>
            <View className="flex-row items-center h-14 rounded-2xl bg-input/40 border border-border/80 px-4">
              <View className="flex-row items-center border-r border-border pr-3 mr-3">
                <Text className="text-base font-medium text-foreground">+91</Text>
                <SymbolView name="chevron.down" size={14} tintColor="#A0A0A0" style={{ marginLeft: 4 }} />
              </View>
              <TextInput 
                className="flex-1 text-base font-medium text-foreground h-full"
                placeholder="00000 00000"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Email ID */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center h-14 rounded-2xl bg-input/40 border border-border/80 px-4">
              <SymbolView name="envelope.fill" size={18} tintColor="#A0A0A0" style={{ marginRight: 12 }} />
              <TextInput 
                className="flex-1 text-base font-medium text-foreground h-full"
                placeholder="john@example.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Education Level (Selector) */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2 ml-1">Education Level</Text>
            <TouchableOpacity 
              className="flex-row items-center justify-between h-14 rounded-2xl bg-input/40 border border-border/80 px-4 active:opacity-70"
              onPress={() => setEduModalVisible(true)}
            >
              <View className="flex-row items-center">
                <SymbolView name="graduationcap.fill" size={18} tintColor="#A0A0A0" style={{ marginRight: 12 }} />
                <Text className={`text-base font-medium ${selectedEdu ? 'text-foreground' : 'text-[#A0A0A0]'}`}>
                  {selectedEdu || "Select Education Level"}
                </Text>
              </View>
              <SymbolView name="chevron.down" size={18} tintColor="#A0A0A0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Action */}
        <TouchableOpacity 
          className="w-full h-14 rounded-2xl bg-[#E60000] items-center justify-center shadow-lg shadow-[#E60000]/30 active:opacity-80 active:scale-[0.98] transition-transform mt-10"
          onPress={() => router.push('/(auth)/verify-otp')}
        >
          <Text className="text-lg font-bold text-white">Register</Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row justify-center items-center">
          <Text className="text-sm text-muted-foreground">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm font-bold text-[#E60000]">Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Beautiful Bottom Sheet Simulator for Education Level */}
      <Modal
        visible={eduModalVisible}
        transparent={true}
        animationType="slide"
      >
        <Pressable 
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setEduModalVisible(false)}
        >
          <Pressable className="bg-card rounded-t-3xl pt-2 pb-8 px-6 shadow-xl border-t border-border/50">
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-border rounded-full self-center mb-6 mt-2" />
            
            <Text className="text-xl font-bold text-foreground mb-6">Select Education Level</Text>
            
            <View className="gap-2">
              {EDUCATION_LEVELS.map((level, idx) => (
                <TouchableOpacity 
                  key={idx}
                  className={`flex-row items-center justify-between p-4 rounded-2xl border ${selectedEdu === level ? 'border-[#E60000] bg-[#E60000]/10' : 'border-border/40 bg-input/30'}`}
                  onPress={() => {
                    setSelectedEdu(level);
                    setEduModalVisible(false);
                  }}
                >
                  <Text className={`text-base font-medium ${selectedEdu === level ? 'text-[#E60000]' : 'text-foreground'}`}>
                    {level}
                  </Text>
                  {selectedEdu === level && (
                    <SymbolView name="checkmark.circle.fill" size={20} tintColor="#E60000" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}
