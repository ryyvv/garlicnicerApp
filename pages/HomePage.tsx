import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { LocationHeader } from '../components/LocationHeader';
import { WeatherCard, sampleWeatherData } from '../components/WeatherCard';
import { HourlyForecast, sampleHourlyData } from '../components/HourlyForecast';
import { GarlicVarieties, sampleGarlicVarieties } from '../components/GarlicVarieties';
import { ThemeManager, themes, getTheme } from '../components/ThemeManager';
import { LocationSearchPage } from './LocationSearchPage';
import { LocationStorage, SavedLocation } from '../utils/LocationStorage';
const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.8.132:8000';
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
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const savedLocations = await LocationStorage.getSavedLocations(userId);
      
      if (savedLocations.length === 0) {
        await this.getCurrentLocationAndSave();
      } else {
        await this.loadDefaultLocation();
      }
      
      await this.loadSavedLocations();
    } catch (error) {
      console.log('Error initializing app:', error);
      this.getCurrentLocationAndSave();
    }
  };

  private loadDefaultLocation = async (): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const defaultLocation = await LocationStorage.getDefaultLocation(userId);
      if (defaultLocation) {
        this.setState({ 
          municipality: defaultLocation.city,
          defaultLocation: defaultLocation
        });
        this.getWeatherData(defaultLocation.coords.latitude, defaultLocation.coords.longitude);
      } else {
        console.log('No default location found, using GPS location');
        this.getCurrentLocationAndSave();
      }
    } catch (error) {
      console.log('Error loading default location:', error);
      this.getCurrentLocationAndSave();
    }
  };

  private loadSavedLocations = async (): Promise<void> => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user?.uid || 'temp_user';
      
      const saved = await LocationStorage.getSavedLocations(userId);
      const defaultLocation = await LocationStorage.getDefaultLocation(userId);
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

  private checkNetworkConnectivity = async (): Promise<boolean> => {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  private getCurrentLocationAndSave = async (): Promise<void> => {
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
        
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user?.uid || 'temp_user';
        
        const currentLocationData = {
          city: municipality,
          province: addr.region || 'Unknown',
          region: addr.country || 'Unknown',
          coords: { latitude, longitude },
          user_id: userId
        };
        
        // Check network connectivity
        const isOnline = await this.checkNetworkConnectivity();
        console.log("isOnline :", isOnline)
        
        if (isOnline){
          // Online - save to both API and local storage
          console.log('Starting to save location data to API and local storage...');
          
          try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (user) {
              // Get user data from API
              const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/users/firebase_id/${user.uid}`);
              const userData = await userResponse.json();
              console.log("userData: ", userData)
              
              if (userData && userData.id) {
                // Save to API
                const plantLocationData = {
                  region: addr.country || 'Unknown',
                  province: addr.region || 'Unknown',
                  city: municipality,
                  barangay: addr.district || 'Unknown',
                  latitude: latitude,
                  longitude: longitude,
                  user_id: userData.id
                };
                
                console.log('Sending plant location data:', plantLocationData);
                console.log('API URL:', `${API_BASE_URL}/api/v1/users/plant_location/`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const apiResponse = await fetch(`${API_BASE_URL}/api/v1/users/plant_location/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(plantLocationData),
                  signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (apiResponse.ok) {
                  const responseData = await apiResponse.json();
                  console.log('API save completed successfully:', responseData);
                } else {
                  const errorText = await apiResponse.text();
                  console.log('API save failed with status:', apiResponse.status, 'Error:', errorText);
                }
              }
            }
          } catch (apiError) {
            console.log('API save failed, continuing with local storage:', apiError);
          }
          
          // Save to local storage
          await LocationStorage.saveLocation(currentLocationData, userId);
          const savedLocation = await LocationStorage.getSavedLocations(userId);
          if (savedLocation.length > 0) {
            await LocationStorage.setDefaultLocation(savedLocation[0].id, userId);
          }
          console.log('Local storage save completed successfully');
        }
        else {
           // Offline - save to local storage only
          await LocationStorage.saveLocation(currentLocationData, userId);
          const savedLocation = await LocationStorage.getSavedLocations(userId);
          if (savedLocation.length > 0) {
            await LocationStorage.setDefaultLocation(savedLocation[0].id, userId);
          }
        }
      }
      
      this.getWeatherData(latitude, longitude);
    } catch (error) {
      console.log('Location unavailable');
    }
  };

  private getCurrentLocation = async (): Promise<{ city: string; province: string; region: string; coords?: { latitude: number; longitude: number } } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const addr = address[0];
        return {
          city: addr.city || addr.district || 'Unknown',
          province: addr.region || 'Unknown',
          region: addr.country || 'Unknown',
          coords: { latitude, longitude }
        };
      }
      return null;
    } catch (error) {
      console.log('Location unavailable');
      return null;
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