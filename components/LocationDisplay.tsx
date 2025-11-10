import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Alert } from 'react-native';
import * as Location from 'expo-location';

interface LocationData {
  city: string;
  province: string;
  coordinates: string;
}

interface LocationDisplayProps {
  onLocationPress?: (location: LocationData) => void;
  theme: any;
}

interface LocationDisplayState {
  location: LocationData | null;
  loading: boolean;
}

interface LocationDisplayStyles {
  container: ViewStyle;
  locationButton: ViewStyle;
  cityText: TextStyle;
  provinceText: TextStyle;
  loadingText: TextStyle;
}

class LocationDisplay extends React.Component<LocationDisplayProps, LocationDisplayState> {
  private readonly styles: LocationDisplayStyles;

  constructor(props: LocationDisplayProps) {
    super(props);
    this.state = {
      location: null,
      loading: false,
    };

    this.styles = StyleSheet.create({
      container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
      } as ViewStyle,
      locationButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      } as ViewStyle,
      cityText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
      } as TextStyle,
      provinceText: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
      } as TextStyle,
      loadingText: {
        fontSize: 16,
        textAlign: 'center',
      } as TextStyle,
    });
  }

  public async componentDidMount(): Promise<void> {
    await this.getCurrentLocation();
  }

  private getCurrentLocation = async (): Promise<void> => {
    this.setState({ loading: true });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        this.setState({ loading: false });
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
          city: address.city || address.subregion || 'Unknown City',
          province: address.region || 'Unknown Province',
          coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };

        this.setState({ location: locationData, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
      this.setState({ loading: false });
    }
  };

  private handleLocationPress = (): void => {
    const { location } = this.state;
    if (location) {
      this.props.onLocationPress?.(location);
    } else {
      this.getCurrentLocation();
    }
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
          style: {
            ...this.styles.locationButton,
            backgroundColor: theme.tertiary,
            borderColor: theme.primary,
            borderWidth: 1,
          },
          onPress: this.handleLocationPress,
          activeOpacity: 0.8,
        },
        loading
          ? React.createElement(
              Text,
              { style: { ...this.styles.loadingText, color: theme.text } },
              '📍 Getting location...'
            )
          : location
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                Text,
                { style: { ...this.styles.cityText, color: theme.text } },
                `📍 ${location.city}`
              ),
              React.createElement(
                Text,
                { style: { ...this.styles.provinceText, color: theme.text } },
                location.province
              )
            )
          : React.createElement(
              Text,
              { style: { ...this.styles.loadingText, color: theme.text } },
              '📍 Tap to get location'
            )
      )
    );
  }
}

export default LocationDisplay;