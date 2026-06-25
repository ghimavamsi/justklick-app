import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import * as Location from 'expo-location';
import { homeApi } from '../api/home';
import { Alert, Linking } from 'react-native';

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'blocked';

export interface LocationData {
  latitude: number;
  longitude: number;
  addressString: string;
  shortAddress: string; // e.g. "Vijayawada"
}

interface LocationState {
  permissionStatus: PermissionStatus;
  currentLocation: LocationData | null;
  manualLocation: LocationData | null;
  savedLocations: any[]; // Store objects but allow legacy strings
  isLoading: boolean;
  error: string | null;

  // Actions
  checkPermission: () => Promise<void>;
  requestPermission: () => Promise<void>;
  fetchCurrentLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  clearManualLocation: () => void;
  addSavedLocation: (location: LocationData) => void;
  removeSavedLocation: (address: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      permissionStatus: 'undetermined',
      currentLocation: null,
      manualLocation: null,
      savedLocations: [],
      isLoading: false,
      error: null,

      checkPermission: async () => {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          
          let internalStatus: PermissionStatus = 'undetermined';
          if (status === 'granted') internalStatus = 'granted';
          else if (status === 'denied') internalStatus = 'denied';
          
          set({ permissionStatus: internalStatus });
          
          if (internalStatus === 'granted') {
            await get().fetchCurrentLocation();
          }
        } catch (error) {
          console.error('Error checking location permission:', error);
        }
      },

      requestPermission: async () => {
        set({ isLoading: true, error: null });
        try {
          const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
          
          let internalStatus: PermissionStatus = 'undetermined';
          if (status === 'granted') {
            internalStatus = 'granted';
          } else if (!canAskAgain) {
            internalStatus = 'blocked';
            // Show alert to direct user to settings since we can't show system prompt
            Alert.alert(
              'Permission Required',
              'Location permission is required to use this feature. Please enable it in your app settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
              ]
            );
          } else {
            internalStatus = 'denied';
          }

          set({ permissionStatus: internalStatus, isLoading: false });

          if (internalStatus === 'granted') {
            await get().fetchCurrentLocation();
          }
        } catch (error) {
          set({ error: 'Failed to request permissions', isLoading: false });
        }
      },

      fetchCurrentLocation: async () => {
        set({ isLoading: true, error: null });
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          let geocode = null;
          try {
            geocode = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          } catch (geocodeError) {
            console.error('Expo reverse geocoding failed:', geocodeError);
          }

          if (geocode && geocode.length > 0) {
            const place = geocode[0];
            const addressParts = [];
            if (place.street || place.name) addressParts.push(place.street || place.name);
            if (place.district || place.city) addressParts.push(place.district || place.city);
            if (place.region) addressParts.push(place.region);

            const addressString = addressParts.filter(Boolean).join(', ');
            const shortAddress = place.district || place.subregion || place.street || place.name || place.city || 'Current Location';

            set({
              currentLocation: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                addressString: addressString || 'Current Location',
                shortAddress: shortAddress,
              },
              isLoading: false,
            });
          } else {
            // Fallback to coordinates if reverse geocoding completely fails
            set({
              currentLocation: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                addressString: 'Current Location',
                shortAddress: 'Current Location',
              },
              error: 'Reverse geocoding failed, using coordinates directly',
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Location fetch failed completely:', error);
          set({ error: 'Failed to fetch location', isLoading: false });
        }
      },

      setManualLocation: (location) => {
        set({ manualLocation: location });
      },

      clearManualLocation: () => {
        set({ manualLocation: null });
      },

      addSavedLocation: (location) =>
        set((state) => {
          const locStr = location.addressString;
          const filtered = state.savedLocations.filter((loc) => 
            (typeof loc === 'string' ? loc : loc.addressString) !== locStr
          );
          return { savedLocations: [location, ...filtered].slice(0, 5) };
        }),

      removeSavedLocation: (address) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter((loc) => 
            (typeof loc === 'string' ? loc : loc.addressString) !== address
          ),
        })),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist manual locations and saved locations (don't persist transient GPS or loading states)
      partialize: (state) => ({
        manualLocation: state.manualLocation,
        savedLocations: state.savedLocations,
        permissionStatus: state.permissionStatus,
      }),
    }
  )
);
