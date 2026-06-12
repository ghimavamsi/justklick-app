import React, { useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocationStore } from '../../store/location-store';
import { useSearchStore } from '../../store/search-store';
import { LocationPermissionState } from '../../components/search/states/LocationPermissionState';
import { LocationSelectorSheet } from '../../components/location/LocationSelectorSheet';
import { SearchHeader } from '../../components/search/SearchHeader';
import { EmptyState } from '../../components/search/states/EmptyState';
import { TypingState } from '../../components/search/states/TypingState';
import { ResultsState } from '../../components/search/states/ResultsState';

export default function SearchScreen() {
  const { permissionStatus, currentLocation, manualLocation, checkPermission } = useLocationStore();
  const { phase, isFocused } = useSearchStore();
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);

  useEffect(() => {
    if (permissionStatus === 'undetermined') {
      checkPermission();
    }
  }, []);

  const activeLocation = manualLocation || currentLocation;
  const hasValidLocation = !!activeLocation;
  const isPermissionDeniedOrBlocked = permissionStatus === 'denied' || permissionStatus === 'blocked';

  // Render the correct state component based on phase
  const renderSearchState = () => {
    switch (phase) {
      case 'idle':
        return <EmptyState />;
      case 'typing':
        return <TypingState />;
      case 'results':
        return <ResultsState />;
      default:
        return <EmptyState />;
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 
        If the user has not granted permission and hasn't manually selected a location,
        we show the permission state.
      */}
      {!hasValidLocation && isPermissionDeniedOrBlocked ? (
        <LocationPermissionState onOpenManualSelector={() => setIsSelectorVisible(true)} />
      ) : (
        <View className="flex-1 bg-background">
          <SearchHeader />
          <View 
            className="flex-1"
            onTouchStart={() => {
              if (isFocused) Keyboard.dismiss();
            }}
          >
            {renderSearchState()}
          </View>
        </View>
      )}

      {/* Global Location Selector Bottom Sheet */}
      <LocationSelectorSheet 
        visible={isSelectorVisible} 
        onClose={() => setIsSelectorVisible(false)} 
      />
    </KeyboardAvoidingView>
  );
}
