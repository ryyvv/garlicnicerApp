import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Alert } from 'react-native';
import * as Location from 'expo-location';

interface LocationData {
  barangay: string;
  city: string;
  province: string;
  region: string;
  coordinates: string;
}

interface LocationPickerProps {
  onLocationChange?: (location: LocationData) => void;
  theme: any;
}

interface LocationPickerState {
  location: LocationData | null;
  loading: boolean;
}

interface LocationPickerStyles {
  container: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  locationText: TextStyle;
  locationContainer: ViewStyle;
}

class LocationPicker extends React.Component<LocationPickerProps, LocationPickerState> {
  private readonly styles: LocationPickerStyles;

  constructor(props: LocationPickerProps) {
    super(props);
    this.state = {
      location: null,
      loading: false,
    };

    this.styles = StyleSheet.create({
      container: {
        width: '100%',
      } as ViewStyle,
      button: {
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
      } as ViewStyle,
      buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      } as TextStyle,
      locationText: {
        fontSize: 12,
        marginBottom: 5,
      } as TextStyle,
      locationContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
      } as ViewStyle,
    });
  }

  private getCurrentLocation = async (): Promise<void> => {
    this.setState({ loading: true });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const locationData: LocationData = {
          barangay: address.district || address.subregion || 'Unknown',
          city: address.city || address.subregion || 'Unknown',
          province: address.region || 'Unknown',
          region: this.getRegionFromProvince(address.region || ''),
          coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };

        this.setState({ location: locationData });
        this.props.onLocationChange?.(locationData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    } finally {
      this.setState({ loading: false });
    }
  };

  private getRegionFromProvince = (province: string): string => {
    const regionMap: { [key: string]: string } = {
      'Metro Manila': 'NCR',
      'Rizal': 'Region IV-A',
      'Cavite': 'Region IV-A',
      'Laguna': 'Region IV-A',
      'Batangas': 'Region IV-A',
      'Quezon': 'Region IV-A',
      'Bulacan': 'Region III',
      'Pampanga': 'Region III',
      'Tarlac': 'Region III',
      'Nueva Ecija': 'Region III',
      'Bataan': 'Region III',
      'Zambales': 'Region III',
      'Aurora': 'Region III',
    };
    return regionMap[province] || 'Unknown Region';
  };

  public render(): React.ReactElement {
    const { theme } = this.props;
    const { location, loading } = this.state;

    return React.createElement(
      View,
      { style: this.styles.container },
      React.createElement(
        TouchableOpacity,
        {
          style: { ...this.styles.button, backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 },
          onPress: this.getCurrentLocation,
          disabled: loading,
        },
        React.createElement(
          Text,
          { style: this.styles.buttonText },
          loading ? 'Getting Location...' : '📍 Get Current Location'
        )
      ),
      location ? React.createElement(
        View,
        { style: this.styles.locationContainer },
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, fontWeight: 'bold', color: theme.text } },
          'Current Location:'
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, color: theme.text } },
          `Barangay: ${location.barangay}`
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, color: theme.text } },
          `City/Municipality: ${location.city}`
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, color: theme.text } },
          `Province: ${location.province}`
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, color: theme.text } },
          `Region: ${location.region}`
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.locationText, color: '#666', fontSize: 10 } },
          `Coordinates: ${location.coordinates}`
        )
      ) : null
    );
  }
}

export default LocationPicker;