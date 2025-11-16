import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const GARLIC_PLANTS_KEY = 'garlicPlants';
import { ENV } from '../config/env';

export interface GarlicPlantData {
  id: string;
  userUid: string | null;
  title: string;
  varietyName: string;
  dateSetup: string;
  alreadyPlanted: boolean;
  datePlanted: string;
  location: string;
  imageFilename: string;
  imageUri?: string;
  status: string;
  synced?: boolean;
}

export class GarlicPlantStorage {
  static async saveGarlicPlant(garlicData: GarlicPlantData): Promise<void> {
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.isConnected) {
      // Online: Upload to server
      try {
        await this.uploadToServer(garlicData);
        garlicData.synced = true;
      } catch (error) {
        console.error('Failed to upload to server:', error);
        garlicData.synced = false;
        await this.saveToLocal(garlicData);
      }
    } else {
      // Offline: Save locally
      garlicData.synced = false;
      await this.saveToLocal(garlicData);
    }
  }

  private static async saveToLocal(garlicData: GarlicPlantData): Promise<void> {
    const existingData = await AsyncStorage.getItem(GARLIC_PLANTS_KEY);
    const garlicPlants = existingData ? JSON.parse(existingData) : [];
    garlicPlants.push(garlicData);
    await AsyncStorage.setItem(GARLIC_PLANTS_KEY, JSON.stringify(garlicPlants));
    console.log('Offline data saved:', garlicData);
    console.log('All offline garlic plants:', garlicPlants);
  }

  private static async uploadToServer(garlicData: GarlicPlantData): Promise<void> {
    const response = await fetch( `${ENV.API_BASE_URL}/garlic-plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(garlicData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  static async syncPendingData(): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    const existingData = await AsyncStorage.getItem(GARLIC_PLANTS_KEY);
    if (!existingData) return;

    const garlicPlants: GarlicPlantData[] = JSON.parse(existingData);
    const unsyncedPlants = garlicPlants.filter(plant => !plant.synced);

    for (const plant of unsyncedPlants) {
      try {
        await this.uploadToServer(plant);
        plant.synced = true;
      } catch (error) {
        console.error('Failed to sync plant:', plant.id, error);
      }
    }

    await AsyncStorage.setItem(GARLIC_PLANTS_KEY, JSON.stringify(garlicPlants));
  }
}