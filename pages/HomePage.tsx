import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { LocationHeader } from '../components/LocationHeader';
import { WeatherCard, sampleWeatherData } from '../components/WeatherCard';
import { HourlyForecast, sampleHourlyData } from '../components/HourlyForecast';
import { GarlicVarieties, sampleGarlicVarieties } from '../components/GarlicVarieties';
import { ThemeManager, themes, getTheme } from '../components/ThemeManager';
import { LocationSearchPage } from './LocationSearchPage';
import { LocationStorage, SavedLocation } from '../utils/LocationStorage';

interface HomePageProps {
  theme: any;
  styles: any;
  tabHeight?: number;
}

interface HomePageState {
  weatherData: any;
  hourlyForecast: any[];
  municipality: string;
  location: string;
  showLocationSearch: boolean;
  savedLocations: SavedLocation[];
  savedLocationWeatherData: { [key: string]: { weather: any; hourly: any[] } };
  defaultLocation: SavedLocation | null;
}

export class HomePage extends Component<HomePageProps, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      weatherData: null,
      hourlyForecast: [],
      municipality: '',
      location: '',
      showLocationSearch: false,
      savedLocations: [],
      savedLocationWeatherData: {},
      defaultLocation: null
    };
  }

  componentDidMount() {
    this.initializeApp();
  }

  private initializeApp = async (): Promise<void> => {
    try {
      const savedLocations = await LocationStorage.getSavedLocations();
      console.log('Saved locations on app start:', savedLocations);
      
      if (savedLocations.length === 0) {
        console.log('No saved locations - first time user');
        await this.getCurrentLocation();
      } else {
        console.log('Existing user - loading default location');
        await this.loadDefaultLocation();
      }
      
      await this.loadSavedLocations();
    } catch (error) {
      console.log('Error initializing app:', error);
      this.getCurrentLocation();
    }
  };

  private loadDefaultLocation = async (): Promise<void> => {
    try {
      const defaultLocation = await LocationStorage.getDefaultLocation();
      console.log('Loading default location from storage:', defaultLocation);
      if (defaultLocation) {
        console.log('Using default location for main weather display:', defaultLocation.city);
        this.setState({ 
          municipality: defaultLocation.city,
          defaultLocation: defaultLocation
        });
        this.getWeatherData(defaultLocation.coords.latitude, defaultLocation.coords.longitude);
      } else {
        console.log('No default location found, using GPS location');
        this.getCurrentLocation();
      }
    } catch (error) {
      console.log('Error loading default location:', error);
      this.getCurrentLocation();
    }
  };

  private loadSavedLocations = async (): Promise<void> => {
    try {
      const saved = await LocationStorage.getSavedLocations();
      const defaultLocation = await LocationStorage.getDefaultLocation();
      this.setState({ 
        savedLocations: saved,
        defaultLocation: defaultLocation
      });
      this.loadWeatherForSavedLocations(saved);
    } catch (error) {
      console.log('Failed to load saved locations');
    }
  };

  private loadWeatherForSavedLocations = async (locations: SavedLocation[]): Promise<void> => {
    const weatherData: { [key: string]: { weather: any; hourly: any[] } } = {};
    
    for (const location of locations) {
      try {
        const weather = await this.fetchWeatherData(location.coords.latitude, location.coords.longitude);
        weatherData[location.id] = weather;
      } catch (error) {
        console.log(`Failed to load weather for ${location.city}`);
      }
    }
    
    this.setState({ savedLocationWeatherData: weatherData });
  };

  private fetchWeatherData = async (lat: number, lon: number): Promise<{ weather: any; hourly: any[] }> => {
    const apiKey = '6136339949ee4174a8f32030251910';
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&aqi=no&alerts=`);
    const data = await response.json();
    return {
      weather: data.current,
      hourly: data.forecast.forecastday[0].hour
    };
  };

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
        const municipality = addr.city || addr.district || 'Unknown';
        
        this.setState({
          location: locationString,
          municipality
        });
        
        // Save current location as default for first-time users
        console.log('Saving current GPS location as default');
        const currentLocationData = {
          city: municipality,
          province: addr.region || 'Unknown',
          region: addr.country || 'Unknown',
          coords: { latitude, longitude }
        };
        
        await LocationStorage.saveLocation(currentLocationData);
        const savedLocation = await LocationStorage.getSavedLocations();
        if (savedLocation.length > 0) {
          await LocationStorage.setDefaultLocation(savedLocation[0].id);
          console.log('Current GPS location saved as default:', currentLocationData);
        }
      }
      
      this.getWeatherData(latitude, longitude);
    } catch (error) {
      console.log('Location unavailable');
    }
  };

  private getWeatherData = async (lat: number, lon: number): Promise<void> => {
    try {
      const apiKey = '6136339949ee4174a8f32030251910';
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&aqi=no&alerts=`);
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

  private handleLocationPress = (): void => {
    this.setState({ showLocationSearch: true });
  };

  private handleLocationSelect = (location: { city: string; province: string; region: string; coords?: { latitude: number; longitude: number } }): void => {
    this.setState({ 
      municipality: location.city,
      showLocationSearch: false 
    });
    
    if (location.coords) {
      this.getWeatherData(location.coords.latitude, location.coords.longitude);
    }
  };

  private handleBackFromSearch = async (): Promise<void> => {
    this.setState({ showLocationSearch: false });
    // Only reload default location and its weather data for main components
    await this.loadDefaultLocation();
  };

  render() {
    const { theme, styles } = this.props;
    const { weatherData, hourlyForecast, municipality, showLocationSearch, defaultLocation, savedLocations } = this.state;

    if (showLocationSearch) {
      return (
        <LocationSearchPage
          theme={theme}
          onLocationSelect={this.handleLocationSelect}
          onBack={this.handleBackFromSearch}
          onSavedLocationsUpdate={this.loadSavedLocations}
        />
      );
    }

    return (
      <ScrollView 
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={{ paddingBottom: this.props.tabHeight|| 250 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <LocationHeader 
          theme={theme} 
          onLocationPress={this.handleLocationPress}
          defaultLocation={defaultLocation}
        />
        <WeatherCard 
          weatherData={weatherData || sampleWeatherData} 
          theme={theme}
          defaultLocation={defaultLocation}
        />
        <HourlyForecast 
          hourlyData={hourlyForecast.length > 0 ? hourlyForecast : sampleHourlyData} 
          theme={theme}
          defaultLocation={defaultLocation}
        />
        
        <GarlicVarieties varieties={sampleGarlicVarieties} theme={theme} />
      </ScrollView>
    );
  }
}