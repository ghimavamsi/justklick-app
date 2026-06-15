import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessHours } from '../../types/business.types';

interface Props {
  visible: boolean;
  onClose: () => void;
  hours: BusinessHours[];
}

export function BusinessHoursSheet({ visible, onClose, hours }: Props) {
  if (!hours || hours.length === 0) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableWithoutFeedback>
          <View className="bg-background rounded-t-3xl pt-2 pb-8 px-6 shadow-2xl">
            {/* Drag Handle */}
            <View className="w-12 h-1.5 bg-muted rounded-full self-center mb-6" />
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-extrabold text-foreground">Weekly Timings</Text>
              <TouchableOpacity onPress={onClose} className="w-8 h-8 bg-muted rounded-full items-center justify-center">
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="bg-card rounded-2xl border border-border overflow-hidden">
              {hours.map((hour, idx) => {
                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === hour.day;
                
                return (
                  <View 
                    key={idx} 
                    className={`flex-row justify-between items-center p-4 ${idx !== hours.length - 1 ? 'border-b border-border/50' : ''} ${isToday ? 'bg-primary/5' : ''}`}
                  >
                    <View className="flex-row items-center">
                      {isToday && <View className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />}
                      <Text className={`text-base ${isToday ? 'font-bold text-primary' : 'font-medium text-foreground'}`}>
                        {hour.day} {isToday && '(Today)'}
                      </Text>
                    </View>
                    
                    <Text className={`text-base ${hour.isClosed ? 'font-bold text-rose-500' : (isToday ? 'font-bold text-primary' : 'font-semibold text-muted-foreground')}`}>
                      {hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
