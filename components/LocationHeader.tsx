import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { SafeContainer } from './SafeContainer';
import { SavedLocation } from '../utils/LocationStorage';

interface LocationHeaderProps {
  theme: any;
  onLocationPress?: (city: string) => void;
  defaultLocation?: SavedLocation | null;
}

interface LocationHeaderState {
  city: string;
  province: string;
}

export class LocationHeader extends React.Component<LocationHeaderProps, LocationHeaderState> {
  constructor(props: LocationHeaderProps) {
    super(props);
    this.state = { city: 'Quezon City', province: 'NCR' };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  private getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);
      
      if (address.length > 0) {
        const city = address[0].city || address[0].district || 'Unknown';
        const province = address[0].region || 'Unknown';
        this.setState({ city, province });
      }
    } catch (error) {
      this.setState({ city: 'Location unavailable' });
    }
  };

  render(): React.ReactElement {
    const { theme, onLocationPress, defaultLocation } = this.props;
    const { city, province } = this.state;

    // Use default location if available, otherwise use state
    const displayCity = defaultLocation?.city || city;
    const displayProvince = defaultLocation?.province || province;

    return (
      // backgroundColor: theme.background, 
      <View style={{ marginTop: 20,paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onLocationPress?.(displayCity)} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text, textAlign: 'center' }}>
            📍 {displayCity && displayProvince ? `${displayCity}, ${displayProvince}` : 'Getting location...'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}