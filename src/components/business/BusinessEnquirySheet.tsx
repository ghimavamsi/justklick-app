import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { vendorsApi } from '../../api/vendors';
import { BusinessDetails } from '../../types/business.types';

interface Props {
  visible: boolean;
  onClose: () => void;
  business: BusinessDetails;
}

export function BusinessEnquirySheet({ visible, onClose, business }: Props) {
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const isEmailValid = emailRegex.test(email.trim());
  const isPhoneValid = phoneRegex.test(phone.trim());

  const isFormValid = name.trim().length > 0 && isEmailValid && isPhoneValid && message.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    try {
      const result = await vendorsApi.submitLead({
        business_id: Number(business.id),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim() || 'General Enquiry',
        message: message.trim()
      });

      if (result.success !== false) {
        setShowSuccess(true);
      } else {
        Alert.alert('Submission Failed', result.message || 'Something went wrong.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setShowSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <View className="flex-1 bg-black/60 justify-end">
          <TouchableOpacity 
            className="absolute inset-0" 
            activeOpacity={1} 
            onPress={onClose} 
          />
          
          <View 
            className="bg-background rounded-t-[32px] w-full"
            style={{ paddingBottom: insets.bottom || 24, maxHeight: '90%' }}
          >
            {/* Handle Bar */}
            <View className="items-center py-3">
              <View className="w-12 h-1.5 bg-border rounded-full" />
            </View>

            <KeyboardAwareScrollView 
              enableOnAndroid={true}
              extraScrollHeight={Platform.OS === 'ios' ? 20 : 120}
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
            >
              
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-extrabold text-foreground">{showSuccess ? 'Success' : 'Enquire Now'}</Text>
                <TouchableOpacity onPress={showSuccess ? handleResetAndClose : onClose} className="w-8 h-8 bg-muted rounded-full items-center justify-center">
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              {!showSuccess ? (
                <>
                  <Text className="text-sm text-muted-foreground mb-6">
                    Send a direct message to {business.name}.
                  </Text>

                  <View className="flex-col gap-4">
                {/* Name */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-1.5">Full Name <Text className="text-red-500">*</Text></Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#94A3B8"
                    className="w-full bg-card px-4 py-3.5 rounded-xl border border-border text-foreground font-medium"
                  />
                </View>

                {/* Email */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-1.5">Email Address <Text className="text-red-500">*</Text></Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full bg-card px-4 py-3.5 rounded-xl border border-border text-foreground font-medium"
                  />
                </View>

                {/* Phone */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-1.5">Phone Number <Text className="text-red-500">*</Text></Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    className={`w-full bg-card px-4 py-3.5 rounded-xl border ${phone.length > 0 && !isPhoneValid ? 'border-red-500' : 'border-border'} text-foreground font-medium`}
                  />
                  {phone.length > 0 && !isPhoneValid && (
                    <Text className="text-xs text-red-500 mt-1">Please enter a valid 10-digit phone number</Text>
                  )}
                </View>

                {/* Subject */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-1.5">Subject</Text>
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="E.g. Pricing Query, Booking"
                    placeholderTextColor="#94A3B8"
                    className="w-full bg-card px-4 py-3.5 rounded-xl border border-border text-foreground font-medium"
                  />
                </View>

                {/* Message */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-1.5">Message <Text className="text-red-500">*</Text></Text>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="How can they help you?"
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    style={{ height: 100 }}
                    className="w-full bg-card px-4 py-3.5 rounded-xl border border-border text-foreground font-medium"
                  />
                </View>
              </View>

              <TouchableOpacity 
                disabled={!isFormValid || isSubmitting}
                onPress={handleSubmit}
                className={`w-full py-4 rounded-xl flex-row justify-center items-center mt-8 ${isFormValid && !isSubmitting ? 'bg-primary shadow-sm' : 'bg-muted'}`}
                style={isFormValid && !isSubmitting ? { backgroundColor: '#F97316' } : undefined}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" className="mr-2" />
                ) : (
                  <Ionicons name="paper-plane" size={20} color={isFormValid ? "#FFFFFF" : "#94A3B8"} style={{ marginRight: 8 }} />
                )}
                <Text className={`font-bold text-lg ${isFormValid ? 'text-white' : 'text-muted-foreground'}`}>
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </Text>
              </TouchableOpacity>
              </>
              ) : (
                <View className="py-8 items-center justify-center">
                  <View className="w-20 h-20 bg-green-500/10 rounded-full items-center justify-center mb-6">
                    <Ionicons name="checkmark-circle" size={48} color="#22C55E" />
                  </View>
                  <Text className="text-xl font-bold text-foreground mb-2 text-center">Enquiry Sent!</Text>
                  <Text className="text-muted-foreground text-center mb-8 px-4 leading-relaxed">
                    Thank you for your interest. {business.name} will review your message and get back to you shortly.
                  </Text>
                  <TouchableOpacity 
                    onPress={handleResetAndClose}
                    className="w-full py-4 rounded-xl flex-row justify-center items-center bg-primary shadow-sm"
                    style={{ backgroundColor: '#F97316' }}
                  >
                    <Text className="font-bold text-lg text-white">Done</Text>
                  </TouchableOpacity>
                </View>
              )}

            </KeyboardAwareScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}
