import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { LocationStorage, SavedLocation } from '../utils/LocationStorage';

interface LocationSearchProps {
  theme: any;
  onLocationSelect: (location: { city: string; province: string; region: string; coords?: { latitude: number; longitude: number } }) => void;
  onBack: () => void;
  onSavedLocationsUpdate?: () => void;
}

interface LocationSearchState {
  searchText: string;
  searchResults: Array<{
    city: string;
    province: string;
    region: string;
    coords?: { latitude: number; longitude: number };
  }>;
  savedLocations: SavedLocation[];
  isSearching: boolean;
  dropdownVisible: string | null;
}

export class LocationSearchPage extends Component<LocationSearchProps, LocationSearchState> {
  constructor(props: LocationSearchProps) {
    super(props);
    this.state = {
      searchText: '',
      searchResults: [],
      savedLocations: [],
      isSearching: false,
      dropdownVisible: null
    };
  }

  componentDidMount() {
    this.loadSavedLocations();
  }

  private loadSavedLocations = async (): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const saved = await LocationStorage.getSavedLocations(userId);
      this.setState({ savedLocations: saved });
    } catch (error) {
      console.log('Failed to load saved locations');
    }
  };

  private searchLocation = async (query: string): Promise<void> => {
    if (query.length < 2) {
      this.setState({ searchResults: [] });
      return;
    }

    this.setState({ isSearching: true });

    try {
      const results = await Location.geocodeAsync(query);
      const locationResults = await Promise.all(
        results.slice(0, 10).map(async (result) => {
          try {
            const address = await Location.reverseGeocodeAsync({
              latitude: result.latitude,
              longitude: result.longitude
            });
            
            if (address.length > 0) {
              const addr = address[0];
              return {
                city: addr.city || addr.district || 'Unknown',
                province: addr.region || 'Unknown',
                region: addr.country || 'Unknown',
                coords: { latitude: result.latitude, longitude: result.longitude }
              };
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const validResults = locationResults.filter(result => result !== null);
      this.setState({ searchResults: validResults, isSearching: false });
    } catch (error) {
      this.setState({ isSearching: false });
      Alert.alert('Error', 'Unable to search locations. Please try again.');
    }
  };

  private handleLocationSelect = (location: any): void => {
    this.props.onLocationSelect(location);
    this.props.onBack();
  };

  private isLocationAlreadySaved = (location: any): boolean => {
    return this.state.savedLocations.some(saved => 
      saved.city === location.city && 
      saved.province === location.province &&
      saved.coords.latitude.toFixed(6) === location.coords.latitude.toFixed(6) &&
      saved.coords.longitude.toFixed(6) === location.coords.longitude.toFixed(6)
    );
  };

  private saveLocation = async (location: any): Promise<void> => {
    if (this.isLocationAlreadySaved(location)) {
      Alert.alert('Info', 'Location is already saved!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const savedLocations = await LocationStorage.getSavedLocations(userId);
      const isFirstLocation = savedLocations.length === 0;
      
      await LocationStorage.saveLocation(location, userId);
      
      if (isFirstLocation) {
        const newSavedLocations = await LocationStorage.getSavedLocations(userId);
        if (newSavedLocations.length > 0) {
          await LocationStorage.setDefaultLocation(newSavedLocations[0].id, userId);
          console.log('First saved location set as default:', location);
        }
      }
      
      await this.loadSavedLocations();
      this.props.onSavedLocationsUpdate?.();
      this.setState({ searchText: '', searchResults: [] });
      Alert.alert('Success', 'Location saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save location');
    }
  };

  private removeSavedLocation = async (id: string): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      await LocationStorage.removeLocation(id, userId);
      this.loadSavedLocations();
      this.setState({ dropdownVisible: null });
    } catch (error) {
      Alert.alert('Error', 'Failed to remove location');
    }
  };

  private setAsDefault = async (location: SavedLocation): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      await LocationStorage.setDefaultLocation(location.id, userId);
      console.log('Default location set:', location);
      const defaultLocation = await LocationStorage.getDefaultLocation(userId);
      console.log('Default location from storage:', defaultLocation);
      this.loadSavedLocations();
      this.handleLocationSelect(location);
      this.setState({ dropdownVisible: null });
    } catch (error) {
      Alert.alert('Error', 'Failed to set default location');
    }
  };

  private toggleDropdown = (id: string): void => {
    this.setState({ dropdownVisible: this.state.dropdownVisible === id ? null : id });
  };

  private deleteAllExceptDefault = async (): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const locationsToDelete = this.state.savedLocations.filter(location => !location.isDefault);
      
      for (const location of locationsToDelete) {
        await LocationStorage.removeLocation(location.id, userId);
      }
      
      this.loadSavedLocations();
      this.props.onSavedLocationsUpdate?.();
      Alert.alert('Success', 'All locations deleted except default');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete locations');
    }
  };

  private syncLocationsToDatabase = async (): Promise<void> => {
    try {
      console.log('Starting sync process...');
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.8.132:8000';
      console.log('API_BASE_URL:', API_BASE_URL);
      
      // Get user data from API
      console.log('Fetching user data for:', user.uid);
      const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/users/firebase_id/${user.uid}`);
      const userData = await userResponse.json();
      console.log('User data:', userData);
      
      if (!userData || !userData.id) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      // Get existing plant locations from database for this user
      console.log('Fetching existing locations for user:', userData.id);
      const existingResponse = await fetch(`${API_BASE_URL}/api/v1/users/plant_location/${userData.id}`);
      
      if (!existingResponse.ok) {
        console.log('Failed to fetch existing locations:', existingResponse.status);
        Alert.alert('Error', 'Failed to fetch existing locations');
        return;
      }
      
      const existingLocations = await existingResponse.json();
      console.log('Existing locations:', existingLocations);
      console.log('Saved locations to sync:', this.state.savedLocations);
      
      // Bidirectional sync: both local to database AND database to local
      let syncedToDbCount = 0;
      let syncedToLocalCount = 0;
      
      // 1. Sync database locations to local storage (locations that exist in DB but not locally)
      const locationsToSyncToLocal = existingLocations.filter((dbLocation: any) => {
        return !this.state.savedLocations.some(savedLocation => 
          savedLocation.city === dbLocation.city &&
          savedLocation.province === dbLocation.province &&
          Math.abs(savedLocation.coords.latitude - dbLocation.latitude) < 0.000001 &&
          Math.abs(savedLocation.coords.longitude - dbLocation.longitude) < 0.000001
        );
      });
      
      console.log('Locations to sync to local:', locationsToSyncToLocal);
      
      for (const dbLocation of locationsToSyncToLocal) {
        try {
          const locationData = {
            city: dbLocation.city,
            province: dbLocation.province,
            region: dbLocation.region,
            coords: {
              latitude: dbLocation.latitude,
              longitude: dbLocation.longitude
            },
            user_id: user.uid
          };
          
          await LocationStorage.saveLocation(locationData, user.uid);
          syncedToLocalCount++;
        } catch (error) {
          console.log('Failed to save location locally:', dbLocation.city, error);
        }
      }
      
      // 2. Sync local locations to database (locations that exist locally but not in DB)
      const locationsToSyncToDb = this.state.savedLocations.filter(savedLocation => {
        return !existingLocations.some((dbLocation: any) => 
          dbLocation.city === savedLocation.city &&
          dbLocation.province === savedLocation.province &&
          Math.abs(dbLocation.latitude - savedLocation.coords.latitude) < 0.000001 &&
          Math.abs(dbLocation.longitude - savedLocation.coords.longitude) < 0.000001 &&
          dbLocation.user_id === userData.id
        );
      });

      console.log('Locations to sync to database:', locationsToSyncToDb);

      for (const location of locationsToSyncToDb) {
        try {
          const plantLocationData = {
            region: location.region,
            province: location.province,
            city: location.city,
            barangay: 'Unknown',
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            user_id: userData.id
          };

          console.log('Syncing location to database:', plantLocationData);

          const response = await fetch(`${API_BASE_URL}/api/v1/users/plant_location/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(plantLocationData)
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log('Location synced to database successfully:', responseData);
            syncedToDbCount++;
          } else {
            const errorText = await response.text();
            console.log('Failed to sync location to database:', response.status, errorText);
          }
        } catch (error) {
          console.log('Failed to sync location to database:', location.city, error);
        }
      }
      
      // Update UI if locations were synced to local storage
      if (syncedToLocalCount > 0) {
        const newSavedLocations = await LocationStorage.getSavedLocations(user.uid);
        if (newSavedLocations.length > 0 && !newSavedLocations.some(loc => loc.isDefault)) {
          await LocationStorage.setDefaultLocation(newSavedLocations[0].id, user.uid);
        }
        await this.loadSavedLocations();
        this.props.onSavedLocationsUpdate?.();
      }
      
      // Show sync results
      if (syncedToDbCount === 0 && syncedToLocalCount === 0) {
        Alert.alert('Info', 'All locations are already synced');
      } else {
        const message = [];
        if (syncedToDbCount > 0) message.push(`${syncedToDbCount} to database`);
        if (syncedToLocalCount > 0) message.push(`${syncedToLocalCount} to local storage`);
        Alert.alert('Success', `Synced ${message.join(' and ')}`);
      }
      
      console.log('Sync completed. To DB:', syncedToDbCount, 'To Local:', syncedToLocalCount);
    } catch (error) {
      console.log('Sync error:', error);
      Alert.alert('Error', 'Failed to sync locations');
    }
  };

  render() {
    const { theme, onBack } = this.props;
    const { searchText, searchResults, savedLocations, isSearching } = this.state;

    const matchingSavedLocations = searchText.length >= 2 
      ? savedLocations.filter(saved => 
          saved.city.toLowerCase().includes(searchText.toLowerCase()) ||
          saved.province.toLowerCase().includes(searchText.toLowerCase()) ||
          saved.region.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

    const filteredSavedLocations = searchText.length >= 2 
      ? (matchingSavedLocations.length > 0 ? matchingSavedLocations : savedLocations)
      : savedLocations;

    // Sort to put default location first
    const sortedSavedLocations = filteredSavedLocations.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });

    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 60, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>Search Location</Text>
        </View>

        <TextInput
          style={{
            backgroundColor: theme.cardBackground || '#f0f0f0',
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            color: theme.text,
            marginBottom: 20
          }}
          placeholder="Enter city, municipality, or province"
          placeholderTextColor={theme.secondaryText || '#666'}
          value={searchText}
          onChangeText={(text) => {
            this.setState({ searchText: text });
            this.searchLocation(text);
          }}
          autoFocus
        />

        {filteredSavedLocations.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                Saved Locations
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6
                  }}
                  onPress={this.syncLocationsToDatabase}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Sync</Text>
                </TouchableOpacity>
                {filteredSavedLocations.length > 1 && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#FF3B30',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6
                    }}
                    onPress={this.deleteAllExceptDefault}
                  >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Delete All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {sortedSavedLocations.map((item) => (
              <View
                key={item.id}
                style={{
                  borderLeftWidth: item.isDefault ? 5 : 0,
                  borderLeftColor: item.isDefault ? '#4CAF50' : 'transparent',
                  backgroundColor: theme.cardBackground || '#f0f0f0',
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                    {item.city}
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.secondaryText, marginTop: 2 }}>
                    {item.province}, {item.region}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.secondaryText, marginTop: 4 }}>
                    {item.coords.latitude.toFixed(6)}, {item.coords.longitude.toFixed(6)}
                  </Text>
                </View>
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.cardBackground || '#e0e0e0',
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10
                    }}
                    onPress={() => this.toggleDropdown(item.id)}
                  >
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>⋮</Text>
                  </TouchableOpacity>
                  {this.state.dropdownVisible === item.id && (
                    <View style={{
                      position: 'absolute',
                      top: 35,
                      right: 0,
                      backgroundColor: theme.cardBackground || '#f0f0f0',
                      borderRadius: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                      zIndex: 1000
                    }}>
                      <TouchableOpacity
                        style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border || '#e0e0e0' }}
                        onPress={() => this.setAsDefault(item)}
                      >
                        <Text style={{ color: theme.text, fontSize: 14 }}>Set as Default</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ padding: 12 }}
                        onPress={() => this.removeSavedLocation(item.id)}
                      >
                        <Text style={{ color: '#FF3B30', fontSize: 14 }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {isSearching && (
          <Text style={{ color: theme.secondaryText, textAlign: 'center', marginVertical: 20 }}>
            Searching...
          </Text>
        )}

        {searchResults.filter(item => !this.isLocationAlreadySaved(item)).length > 0 && (
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 10 }}>
            Search List
          </Text>
        )}

        <FlatList
          data={searchResults.filter(item => !this.isLocationAlreadySaved(item))}
          keyExtractor={(item, index) => `${item.city}-${item.province}-${index}`}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: theme.cardBackground || '#f0f0f0',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.handleLocationSelect(item)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
                  {item.city}
                </Text>
                <Text style={{ fontSize: 14, color: theme.secondaryText, marginTop: 2 }}>
                  {item.province}, {item.region}
                </Text>
                {item.coords && (
                  <Text style={{ fontSize: 12, color: theme.secondaryText, marginTop: 4 }}>
                    {item.coords.latitude.toFixed(6)}, {item.coords.longitude.toFixed(6)}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.primary || '#007AFF',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10
                }}
                onPress={() => this.saveLocation(item)}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}