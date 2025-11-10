import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { ThemeManager, themes, getTheme } from '../components/ThemeManager';

interface AccountPageProps {
  theme: any;
  styles: any;
  selectedTheme: number;
  onSelectTheme: (themeId: number) => void;
  onLogout: () => void;
}

interface AccountPageState {
  location: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
  currentTheme: any;
}



export class AccountPage extends Component<AccountPageProps, AccountPageState> {
  constructor(props: AccountPageProps) {
    super(props);
    this.state = {
      location: '',
      barangay: '',
      municipality: '',
      province: '',
      region: '',
      currentTheme: getTheme(props.selectedTheme)
    };
  }

  private getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        this.setState({ location: 'Permission denied' });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const addr = address[0];
        this.setState({
          location: locationString,
          barangay: addr.district || '',
          municipality: addr.city || '',
          province: addr.region || '',
          region: addr.country || ''
        });
      } else {
        this.setState({ location: locationString });
      }
    } catch (error) {
      this.setState({ location: 'Location unavailable' });
    }
  };

  render() {
    const { theme, styles, selectedTheme, onSelectTheme, onLogout } = this.props;
    const { location, barangay, municipality, province, region } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ ...styles.title, color: theme.text }}>
            👤 Account
          </Text>
          <Text style={{ ...styles.description, color: theme.text }}>
            Profile settings and account management
          </Text>
          
          <View style={{ marginTop: 30 }}>
            <ThemeManager
              selectedTheme={selectedTheme}
              onSelectTheme={(themeId) => {
                this.setState({ currentTheme: getTheme(themeId) });
                onSelectTheme(themeId);
              }}
              theme={this.state.currentTheme}
              styles={styles}
              themesData={themes}
            />
          </View>

          <View style={{ marginTop: 20, width: '100%' }}>
            <Text style={{ ...styles.description, color: theme.text, marginBottom: 10 }}>
              Current Location
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <TextInput
                style={{ ...styles.input, flex: 1, marginRight: 10, marginBottom: 0 }}
                placeholder="Latitude, Longitude"
                value={location}
                editable={false}
              />
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: theme.primary, paddingHorizontal: 15, paddingVertical: 12 }}
                onPress={this.getCurrentLocation}
              >
                <Text style={{ ...styles.buttonText, fontSize: 12 }}>
                  Get Location
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={{ ...styles.input, marginBottom: 10 }}
              placeholder="Barangay"
              value={barangay}
              onChangeText={(barangay: string) => this.setState({ barangay })}
            />
            <TextInput
              style={{ ...styles.input, marginBottom: 10 }}
              placeholder="Municipality"
              value={municipality}
              onChangeText={(municipality: string) => this.setState({ municipality })}
            />
            <TextInput
              style={{ ...styles.input, marginBottom: 10 }}
              placeholder="Province"
              value={province}
              onChangeText={(province: string) => this.setState({ province })}
            />
            <TextInput
              style={{ ...styles.input, marginBottom: 0 }}
              placeholder="Region"
              value={region}
              onChangeText={(region: string) => this.setState({ region })}
            />
          </View>

          <TouchableOpacity
            style={{ ...styles.loginButton, backgroundColor: '#ff4444', marginTop: 30 }}
            onPress={onLogout}
          >
            <Text style={styles.buttonText}>
              Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}