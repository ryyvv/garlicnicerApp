import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import { getAuth } from 'firebase/auth';

export interface SavedLocation {
  id: string;
  city: string;
  province: string;
  region: string;
  coords: { latitude: number; longitude: number };
  savedAt: string;
  isDefault?: boolean;
  user_id: string;
}

const STORAGE_KEY = 'saved_locations';

export class LocationStorage {
  static async saveLocation(location: Omit<SavedLocation, 'id' | 'savedAt'>, userId: string): Promise<void> {
    try {
      const savedLocation: SavedLocation = {
        ...location,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        user_id: userId
      };

      const existing = await this.getSavedLocations(userId);
      const updated = [...existing, savedLocation];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(await this.getAllLocations().then(all => all.filter(loc => loc.user_id !== userId).concat(updated))));
    } catch (error) {
      throw new Error('Failed to save location');
    }
  }

   static async fetchlocatio(location: Omit<SavedLocation, 'id' | 'savedAt'>, userId: string): Promise<void> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const userResponse = await fetch(`${ENV.API_BASE_URL}/api/v1/users/users/firebase_id/${user?.uid}`);
      const userData = await userResponse.json();

      const savedLocation: SavedLocation = {
        ...location,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
        user_id: userId
      };

      const existing = await this.getSavedLocations(userId);
      const updated = [...existing, savedLocation];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(await this.getAllLocations().then(all => all.filter(loc => loc.user_id !== userId).concat(updated))));
    } catch (error) {
      throw new Error('Failed to save location');
    }
  }

   
  static async setDefaultLocation(id: string, userId: string): Promise<void> {
    try {
      const allLocations = await this.getAllLocations();
      const updated = allLocations.map(loc => ({ 
        ...loc, 
        isDefault: loc.user_id === userId ? loc.id === id : loc.isDefault 
      }));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Failed to set default location');
    }
  }

  static async getDefaultLocation(userId: string): Promise<SavedLocation | null> {
    try {
      const locations = await this.getSavedLocations(userId);
      return locations.find(loc => loc.isDefault) || null;
    } catch {
      return null;
    }
  }

  static async getSavedLocations(userId: string): Promise<SavedLocation[]> {
    try {
      const allLocations = await this.getAllLocations();
      return allLocations.filter(loc => loc.user_id === userId);
    } catch {
      return [];
    }
  }

  private static async getAllLocations(): Promise<SavedLocation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static async removeLocation(id: string, userId: string): Promise<void> {
    try {
      const allLocations = await this.getAllLocations();
      const updated = allLocations.filter(loc => !(loc.id === id && loc.user_id === userId));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      throw new Error('Failed to remove location');
    }
  }
}