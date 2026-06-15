import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ReviewTipsSheet({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onClose}
        className="flex-1 justify-end bg-black/60"
      >
        <TouchableWithoutFeedback>
          <View className="bg-background rounded-t-[32px] pt-3 pb-10 px-6 shadow-2xl">
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-muted rounded-full self-center mb-6" />
            
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-extrabold text-foreground">Helpful Review Tips</Text>
              <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-muted rounded-full items-center justify-center">
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* What To Include */}
            <View className="mb-6">
              <Text className="text-base font-bold text-emerald-600 mb-4 uppercase tracking-wider">What To Include</Text>
              <View className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                {[
                  'Service Quality', 
                  'Staff Behaviour', 
                  'Cleanliness', 
                  'Value For Money', 
                  'Facilities', 
                  'Overall Experience'
                ].map((tip, index) => (
                  <View key={index} className="flex-row items-center mb-2.5 last:mb-0">
                    <View className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-800/50 items-center justify-center mr-3">
                      <Ionicons name="checkmark" size={14} color="#10B981" />
                    </View>
                    <Text className="text-base text-foreground font-medium">{tip}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Avoid */}
            <View>
              <Text className="text-base font-bold text-rose-600 mb-4 uppercase tracking-wider">Avoid</Text>
              <View className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-4 border border-rose-100 dark:border-rose-900/30">
                {[
                  'Personal Attacks', 
                  'Offensive Language', 
                  'Fake Information', 
                  'Contact Numbers', 
                  'Promotional Content', 
                  'Spam'
                ].map((tip, index) => (
                  <View key={index} className="flex-row items-center mb-2.5 last:mb-0">
                    <View className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-800/50 items-center justify-center mr-3">
                      <Ionicons name="close" size={14} color="#E11D48" />
                    </View>
                    <Text className="text-base text-foreground font-medium">{tip}</Text>
                  </View>
                ))}
              </View>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
