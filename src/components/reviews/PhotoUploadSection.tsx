import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const MAX_PHOTOS = 5;

export function PhotoUploadSection({ images, onImagesChange }: Props) {
  
  const handleUploadPress = async () => {
    if (images.length >= MAX_PHOTOS) {
      Alert.alert('Limit Reached', `You can only upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    Alert.alert(
      'Add Photo',
      'Choose a photo source',
      [
        { text: 'Take Photo', onPress: openCamera },
        { text: 'Choose from Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const checkPermissions = async (type: 'camera' | 'gallery') => {
    let status;
    if (type === 'camera') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      status = cameraStatus;
    } else {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = galleryStatus;
    }

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        `We need permission to access your ${type} to upload photos.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await checkPermissions('camera');
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const openGallery = async () => {
    const hasPermission = await checkPermissions('gallery');
    if (!hasPermission) return;

    // Remaining slots
    const remainingSlots = MAX_PHOTOS - images.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map(a => a.uri);
      onImagesChange([...images, ...newUris].slice(0, MAX_PHOTOS));
    }
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-base font-extrabold text-foreground">Add Photos (Optional)</Text>
        <Text className="text-sm font-semibold text-muted-foreground">{images.length}/{MAX_PHOTOS}</Text>
      </View>
      
      <Text className="text-sm text-muted-foreground mb-4">
        Upload photos of the business, facilities, services, or your experience.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        
        {/* Add Button */}
        {images.length < MAX_PHOTOS && (
          <TouchableOpacity 
            onPress={handleUploadPress}
            className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-2xl items-center justify-center mr-4"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mb-1">
              <Ionicons name="camera" size={20} color="#1C398E" />
            </View>
            <Text className="text-xs font-bold text-primary">Add</Text>
          </TouchableOpacity>
        )}

        {/* Selected Images */}
        {images.map((uri, index) => (
          <View key={index} className="w-24 h-24 mr-4 relative">
            <Image 
              source={{ uri }} 
              style={{ width: '100%', height: '100%', borderRadius: 16 }} 
              contentFit="cover" 
            />
            
            {/* Remove Button Overlay */}
            <TouchableOpacity 
              onPress={() => removeImage(index)}
              className="absolute top-1 right-1 bg-rose-500 w-6 h-6 rounded-full items-center justify-center border-2 border-background shadow-sm"
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
