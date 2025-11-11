import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserStorage {
  static async getUserUid(): Promise<string | null> {
    const savedCredentials = await AsyncStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { userUid } = JSON.parse(savedCredentials);
      return userUid || null;
    }
    return null;
  }
}