import * as React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

interface HomePageProps {
  theme: any;
  styles: any;
}

interface HomePageState {
  weatherData: any;
  hourlyForecast: any[];
  municipality: string;
  location: string;
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      weatherData: null,
      hourlyForecast: [],
      municipality: '',
      location: ''
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  private getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
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
          municipality: addr.city || addr.district || ''
        });
      }
      
      this.getWeatherData(latitude, longitude);
    } catch (error) {
      console.log('Location unavailable');
    }
  };

  private getWeatherData = async (lat: number, lon: number): Promise<void> => {
    try {
      const apiKey = '6136339949ee4174a8f32030251910';
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&aqi=no&alerts=no`);
      const data = await response.json();
      
      this.setState({
        weatherData: data.current,
        hourlyForecast: data.forecast.forecastday[0].hour
      });
    } catch (error) {
      console.log('Weather data unavailable');
    }
  };

  private formatDate = (): string => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  };
  render(): React.ReactElement {
    const { theme, styles } = this.props;
    const { weatherData, hourlyForecast, municipality } = this.state;

    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: theme.background } },
      React.createElement(
        ScrollView,
        { style: { flex: 1, padding: 20 } },
        React.createElement(
          Text,
          { style: { ...styles.title, color: theme.text, textAlign: 'left', marginBottom: 5 } },
          municipality || 'Location'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text, marginBottom: 20, fontSize: 14 } },
          this.formatDate()
        ),
        weatherData ? [
          React.createElement(
            View,
            { key: 'weather-main', style: { alignItems: 'center', marginBottom: 20 } },
            React.createElement(
              Image,
              {
                source: { uri: `https:${weatherData.condition.icon}` },
                style: { width: 80, height: 80, marginBottom: 10 }
              }
            ),
            React.createElement(
              Text,
              { style: { ...styles.title, color: theme.text, fontSize: 20, marginBottom: 5 } },
              weatherData.condition.text
            )
          ),
          React.createElement(
            View,
            { key: 'weather-stats', style: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 } },
            React.createElement(
              View,
              { style: { alignItems: 'center' } },
              React.createElement(
                Text,
                { style: { ...styles.description, color: theme.text, fontSize: 12 } },
                'Temperature'
              ),
              React.createElement(
                Text,
                { style: { ...styles.title, color: theme.text, fontSize: 18 } },
                `${weatherData.temp_c}°C`
              )
            ),
            React.createElement(
              View,
              { style: { alignItems: 'center' } },
              React.createElement(
                Text,
                { style: { ...styles.description, color: theme.text, fontSize: 12 } },
                'Wind'
              ),
              React.createElement(
                Text,
                { style: { ...styles.title, color: theme.text, fontSize: 18 } },
                `${weatherData.wind_kph} km/h`
              )
            ),
            React.createElement(
              View,
              { style: { alignItems: 'center' } },
              React.createElement(
                Text,
                { style: { ...styles.description, color: theme.text, fontSize: 12 } },
                'Humidity'
              ),
              React.createElement(
                Text,
                { style: { ...styles.title, color: theme.text, fontSize: 18 } },
                `${weatherData.humidity}%`
              )
            )
          ),
          React.createElement(
            Text,
            { key: 'hourly-title', style: { ...styles.title, color: theme.text, fontSize: 18, marginBottom: 15 } },
            'Hourly Forecast'
          ),
          React.createElement(
            ScrollView,
            { key: 'hourly-scroll', horizontal: true, showsHorizontalScrollIndicator: false },
            ...hourlyForecast.map((hour: any, index: number) =>
              React.createElement(
                View,
                {
                  key: index,
                  style: {
                    alignItems: 'center',
                    marginRight: 15,
                    padding: 10,
                    backgroundColor: theme.tertiary,
                    borderRadius: 8,
                    minWidth: 70
                  }
                },
                React.createElement(
                  Text,
                  { style: { ...styles.description, color: theme.text, fontSize: 12, marginBottom: 5 } },
                  new Date(hour.time).getHours() + ':00'
                ),
                React.createElement(
                  Image,
                  {
                    source: { uri: `https:${hour.condition.icon}` },
                    style: { width: 40, height: 40, marginBottom: 5 }
                  }
                ),
                React.createElement(
                  Text,
                  { style: { ...styles.title, color: theme.text, fontSize: 14 } },
                  `${hour.temp_c}°C`
                )
              )
            )
          )
        ] : React.createElement(
          TouchableOpacity,
          {
            style: { ...styles.loginButton, backgroundColor: theme.primary },
            onPress: this.getCurrentLocation
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            'Get Weather Data'
          )
        )
      )
    );
  }
}