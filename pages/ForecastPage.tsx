import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { LocationStorage } from '../utils/LocationStorage';
import { SafeContainer } from '../components/SafeContainer'; 
import { SavedLocation } from '../utils/LocationStorage';
import { ENV } from '../config/env'; 

interface ForecastPageProps {
  theme: any;
  styles: any;
  tabHeight?: number;
}

interface ForecastPageState {
  defaultLocation: any;
  tomorrowForecast: any;
  dailyForecast: any[];
  loading: boolean;
}

export class ForecastPage extends Component<ForecastPageProps, ForecastPageState> {
  constructor(props: ForecastPageProps) {
    super(props);
    this.state = {
      defaultLocation: null,
      tomorrowForecast: null,
      dailyForecast: [],
      loading: true
    };
  }

  async componentDidMount() {
    await this.loadDefaultLocation();
  }

  loadDefaultLocation = async () => {
    try {
      const userId = 'temp_user'; // You may want to get this from auth
      const locations = await LocationStorage.getSavedLocations(userId);
      // console.log('Saved locations:', locations);
      const defaultLoc = locations.find(loc => loc.isDefault);
      // console.log('Default location found:', defaultLoc);
      if (defaultLoc) {
        this.setState({ defaultLocation: defaultLoc });
        await this.fetchForecastData(defaultLoc.coords.latitude, defaultLoc.coords.longitude);
      }
    } catch (error) {
      console.error('Error loading default location:', error);
    }
  };

  fetchForecastData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=6136339949ee4174a8f32030251910&q=${lat},${lon}&days=14&aqi=no&alerts=no`
      );
      const data = await response.json();
      
      // Get tomorrow's forecast
      const tomorrowData = data.forecast.forecastday[1]; // Tomorrow is index 1
      
      // Get daily forecast (14 days)
      const dailyData = data.forecast.forecastday;
      
      this.setState({
        tomorrowForecast: tomorrowData,
        dailyForecast: dailyData,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      this.setState({ loading: false });
    }
  };



  renderTomorrowForecast = () => {
    const { theme, styles } = this.props;
    const { tomorrowForecast } = this.state;
    
    if (!tomorrowForecast) return null;
    
    const currentTemp = Math.round(tomorrowForecast.day.avgtemp_c);
    const condition = tomorrowForecast.day.condition.text;
    
    return (
      <View style={[forecastStyles.tomorrowContainer, { backgroundColor: theme.tertiary }]}>
        <Text style={[forecastStyles.tomorrowTitle, { color: theme.text }]}>Tomorrow</Text>
        <View style={forecastStyles.tomorrowCurrent}>
          <Text style={[forecastStyles.currentTemp, { color: theme.text }]}>{currentTemp}°</Text>
          <Text style={[forecastStyles.condition, { color: theme.text }]}>{condition}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={forecastStyles.hourlyContainer}>
          {tomorrowForecast.hour.map((hour: any, index: number) => {
            const time = new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' });
            return (
              <View key={index} style={forecastStyles.hourlyItem}>
                <Text style={[forecastStyles.hourlyTime, { color: theme.text }]}>{time}</Text>
                <Text style={[forecastStyles.hourlyTemp, { color: theme.text }]}>{Math.round(hour.temp_c)}°</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  renderDailyForecast = () => {
    const { theme } = this.props;
    const { dailyForecast } = this.state;
    
    return (
      <View style={[forecastStyles.dailyContainer, { backgroundColor: theme.tertiary }]}>
        <Text style={[forecastStyles.dailyTitle, { color: theme.text }]}>14-Day Forecast</Text>
        {dailyForecast.map((day: any, index: number) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <View key={index} style={forecastStyles.dailyRow}>
              <Text style={[forecastStyles.dayName, { color: theme.text , fontSize:20}]}>{dayName}</Text>
              <Image 
                source={{ uri: `https:${day.day.condition.icon}` }}
                style={forecastStyles.weatherIcon}
              />
              <Text style={[forecastStyles.dayCondition, { color: theme.text, fontSize:15 }]}>{day.day.condition.text}</Text>
              <Text style={[forecastStyles.dayTemp, { color: theme.text}]}>{Math.round(day.day.mintemp_c)}° / {Math.round(day.day.maxtemp_c)}°</Text>
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const { theme, styles } = this.props;
    const { defaultLocation, loading } = this.state;

    if (loading) {
      return (
        <SafeContainer style={{ backgroundColor: theme.background }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.text }}>Loading forecast...</Text>
          </View>
        </SafeContainer>
      );
    }

    return (
      <SafeContainer style={{ backgroundColor: theme.background }}>
        <ScrollView 
            style={{ flex: 1, backgroundColor: theme.background }}
            contentContainerStyle={{ paddingBottom: this.props.tabHeight || 250 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 24, justifyContent:'center', textAlign: 'center', marginBottom: -15, fontWeight: 'bold', marginTop: 20,color: theme.text }}>Weather Forecast</Text>
          {defaultLocation && (
            <Text style={[styles.description, { color: theme.text, marginBottom: 20 }]}>
              {defaultLocation.name}
            </Text>
          )}
          
          {this.renderTomorrowForecast()}
          {this.renderDailyForecast()}
        </ScrollView>
      </SafeContainer>
    );
  }
}

const forecastStyles = StyleSheet.create({
  tomorrowContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  tomorrowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tomorrowCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 15,
  },
  condition: {
    fontSize: 16,
  },
  hourlyContainer: {
    flexDirection: 'row',
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 10,
  },
  hourlyTime: {
    fontSize: 12,
    marginBottom: 5,
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dailyContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  dayName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  weatherIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  dayCondition: {
    flex: 2,
    fontSize: 14,
    textAlign: 'center',
  },
  dayTemp: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
});