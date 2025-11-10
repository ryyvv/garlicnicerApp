import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
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
      const saved = await LocationStorage.getSavedLocations();
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
      const savedLocations = await LocationStorage.getSavedLocations();
      const isFirstLocation = savedLocations.length === 0;
      
      await LocationStorage.saveLocation(location);
      
      if (isFirstLocation) {
        const newSavedLocations = await LocationStorage.getSavedLocations();
        if (newSavedLocations.length > 0) {
          await LocationStorage.setDefaultLocation(newSavedLocations[0].id);
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
      await LocationStorage.removeLocation(id);
      this.loadSavedLocations();
      this.setState({ dropdownVisible: null });
    } catch (error) {
      Alert.alert('Error', 'Failed to remove location');
    }
  };

  private setAsDefault = async (location: SavedLocation): Promise<void> => {
    try {
      await LocationStorage.setDefaultLocation(location.id);
      console.log('Default location set:', location);
      const defaultLocation = await LocationStorage.getDefaultLocation();
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
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 10 }}>
              Saved Locations
            </Text>
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