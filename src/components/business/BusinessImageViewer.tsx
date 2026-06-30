import React from 'react';
import { Modal, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export function BusinessImageViewer({ visible, imageUrl, onClose }: Props) {
  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1">
          {/* Header Close Button */}
          <View className="flex-row justify-end p-4 z-50">
            <TouchableOpacity 
              onPress={onClose} 
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Full Screen Image */}
          <View className="flex-1 justify-center items-center pb-12">
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
              transition={200}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
