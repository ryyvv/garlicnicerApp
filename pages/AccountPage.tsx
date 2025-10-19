import * as React from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

interface AccountPageProps {
  theme: any;
  styles: any;
  selectedTheme: number;
  onSelectTheme: (themeId: number) => void;
  onLogout: () => void;
}

interface AccountPageState {
  showThemeDropdown: boolean;
  location: string;
  barangay: string;
  municipality: string;
  province: string;
  region: string;
}

export class AccountPage extends React.Component<AccountPageProps, AccountPageState> {
  constructor(props: AccountPageProps) {
    super(props);
    this.state = {
      showThemeDropdown: false,
      location: '',
      barangay: '',
      municipality: '',
      province: '',
      region: ''
    };
  }

  private toggleThemeDropdown = (): void => {
    this.setState({ showThemeDropdown: !this.state.showThemeDropdown });
  };

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

  render(): React.ReactElement {
    const { theme, styles, selectedTheme, onSelectTheme, onLogout } = this.props;
    const { showThemeDropdown, location, barangay, municipality, province, region } = this.state;

    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: theme.background } },
      React.createElement(
        ScrollView,
        { style: { flex: 1, padding: 20 } },
        React.createElement(
          Text,
          { style: { ...styles.title, color: theme.text } },
          '👤 Account'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text } },
          'Profile settings and account management'
        ),
        React.createElement(
          View,
          { style: { marginTop: 30, width: '100%' } },
          React.createElement(
            Text,
            { style: { ...styles.description, color: theme.text, marginBottom: 10 } },
            'Theme'
          ),
          React.createElement(
            TouchableOpacity,
            {
              style: { ...styles.input, borderColor: theme.primary, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
              onPress: this.toggleThemeDropdown
            },
            React.createElement(
              Text,
              { style: { color: theme.text } },
              selectedTheme === 1 ? 'Green Theme' : 'Nature Theme'
            ),
            React.createElement(
              Text,
              { style: { color: theme.text } },
              '▼'
            )
          ),
          showThemeDropdown ? React.createElement(
            View,
            { style: { ...styles.themeDropdown, position: 'relative', top: 0, right: 0, width: '100%' } },
            React.createElement(
              TouchableOpacity,
              {
                style: { ...styles.themeOption, backgroundColor: selectedTheme === 1 ? theme.tertiary : 'transparent' },
                onPress: () => onSelectTheme(1)
              },
              React.createElement(
                Text,
                { style: { ...styles.themeText, fontWeight: selectedTheme === 1 ? 'bold' : 'normal' } },
                'Green Theme'
              )
            ),
            React.createElement(
              TouchableOpacity,
              {
                style: { ...styles.themeOption, borderBottomWidth: 0, backgroundColor: selectedTheme === 2 ? theme.tertiary : 'transparent' },
                onPress: () => onSelectTheme(2)
              },
              React.createElement(
                Text,
                { style: { ...styles.themeText, fontWeight: selectedTheme === 2 ? 'bold' : 'normal' } },
                'Nature Theme'
              )
            )
          ) : null
        ),
        React.createElement(
          View,
          { style: { marginTop: 20, width: '100%' } },
          React.createElement(
            Text,
            { style: { ...styles.description, color: theme.text, marginBottom: 10 } },
            'Current Location'
          ),
          React.createElement(
            View,
            { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 } },
            React.createElement(
              TextInput,
              {
                style: { ...styles.input, flex: 1, marginRight: 10, marginBottom: 0 },
                placeholder: 'Latitude, Longitude',
                value: location,
                editable: false
              }
            ),
            React.createElement(
              TouchableOpacity,
              {
                style: { ...styles.button, backgroundColor: theme.primary, paddingHorizontal: 15, paddingVertical: 12 },
                onPress: this.getCurrentLocation
              },
              React.createElement(
                Text,
                { style: { ...styles.buttonText, fontSize: 12 } },
                'Get Location'
              )
            )
          ),
          React.createElement(
            TextInput,
            {
              style: { ...styles.input, marginBottom: 10 },
              placeholder: 'Barangay',
              value: barangay,
              onChangeText: (barangay: string) => this.setState({ barangay })
            }
          ),
          React.createElement(
            TextInput,
            {
              style: { ...styles.input, marginBottom: 10 },
              placeholder: 'Municipality',
              value: municipality,
              onChangeText: (municipality: string) => this.setState({ municipality })
            }
          ),
          React.createElement(
            TextInput,
            {
              style: { ...styles.input, marginBottom: 10 },
              placeholder: 'Province',
              value: province,
              onChangeText: (province: string) => this.setState({ province })
            }
          ),
          React.createElement(
            TextInput,
            {
              style: { ...styles.input, marginBottom: 0 },
              placeholder: 'Region',
              value: region,
              onChangeText: (region: string) => this.setState({ region })
            }
          )
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { ...styles.loginButton, backgroundColor: '#ff4444', marginTop: 30 },
            onPress: onLogout
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            'Logout'
          )
        )
      )
    );
  }
}