import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedLocation {
  id: string;
  city: string;
  province: string;
  region: string;
  coords: { latitude: number; longitude: number };
  savedAt: string;
  isDefault?: boolean;
}

const STORAGE_KEY = 'saved_locations';

export class LocationStorage {
  static async saveLocation(location: Omit<SavedLocation, 'id' | 'savedAt'>): Promise<void> {
    try {
      const savedLocation: SavedLocation = {
        ...location,
        id: Date.now().toString(),
        savedAt: new Date().toISOString()
      };

      const existing = await this.getSavedLocations();
      const updated = [...existing, savedLocation];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Failed to save location');
    }
  }

  static async setDefaultLocation(id: string): Promise<void> {
    try {
      const existing = await this.getSavedLocations();
      const updated = existing.map(loc => ({ ...loc, isDefault: loc.id === id }));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Failed to set default location');
    }
  }

  static async getDefaultLocation(): Promise<SavedLocation | null> {
    try {
      const locations = await this.getSavedLocations();
      return locations.find(loc => loc.isDefault) || null;
    } catch {
      return null;
    }
  }

  static async getSavedLocations(): Promise<SavedLocation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async removeLocation(id: string): Promise<void> {
    try {
      const existing = await this.getSavedLocations();
      const updated = existing.filter(loc => loc.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Failed to remove location');
    }
  }
}