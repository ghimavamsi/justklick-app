import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface LocationState {
  currentCity: string | null;
  coordinates: { lat: number; lng: number } | null;
  savedLocations: string[];
  setLocation: (city: string, coordinates?: { lat: number; lng: number }) => void;
  addSavedLocation: (city: string) => void;
  removeSavedLocation: (city: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentCity: null,
      coordinates: null,
      savedLocations: [],
      setLocation: (city, coordinates) => set({ currentCity: city, ...(coordinates && { coordinates }) }),
      addSavedLocation: (city) =>
        set((state) => ({
          savedLocations: state.savedLocations.includes(city)
            ? state.savedLocations
            : [...state.savedLocations, city],
        })),
      removeSavedLocation: (city) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter((loc) => loc !== city),
        })),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
