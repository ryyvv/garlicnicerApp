import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';


import png1000 from '../assets/weathericon/1000.png';
import png1003 from '../assets/weathericon/1003.png';
import png1006 from '../assets/weathericon/1006.png';
import png1009 from '../assets/weathericon/1009.png';
import png1063 from '../assets/weathericon/1063.png';
import png1087 from '../assets/weathericon/1087.png';
import png1135 from '../assets/weathericon/1135.png';
import png1150 from '../assets/weathericon/1150.png';
import png1153 from '../assets/weathericon/1153.png';
import png116 from '../assets/weathericon/116.png';
import png1171 from '../assets/weathericon/1171.png';
import png1180 from '../assets/weathericon/1180.png';
import png1183 from '../assets/weathericon/1183.png';
import png1186 from '../assets/weathericon/1186.png';
import png1189 from '../assets/weathericon/1189.png';
import png1193 from '../assets/weathericon/1193.png';
import png1195 from '../assets/weathericon/1195.png';
import png1198 from '../assets/weathericon/1198.png';
import png1201 from '../assets/weathericon/1201.png';
import png1240 from '../assets/weathericon/1240.png';
import png1243 from '../assets/weathericon/1243.png';
import png1246 from '../assets/weathericon/1246.png';
import png1249 from '../assets/weathericon/1249.png';
import png1273 from '../assets/weathericon/1273.png';
import png1276 from '../assets/weathericon/1276.png';
import Cloudheavyrain from '../assets/weathericon/Cloudheavyrain.png';
import CloudHeavyrainthunder from '../assets/weathericon/CloudHeavyrainthunder.png';
import CloudThunder from '../assets/weathericon/CloudThunder.png';


interface WeatherData {
  condition: {
    text: string;
    icon: string;
  };
  temp_c: number;
  wind_kph: number;
  humidity: number;
}

interface WeatherCardProps {
  weatherData: WeatherData;
  theme: any;
  defaultLocation?: any;
  compact?: boolean;
}

export class WeatherCard extends Component<WeatherCardProps> {
  getIconImage = (iconUrl: string) => {
  console.log("iconUrl: ", iconUrl)
  
  const match = iconUrl.match(/(\d+)\.png/); // Match numbers in icon URLs
  if (match && match[1]) {
    // Return the imported image based on the matched icon number
    switch (match[1]) {
      case '1000': return png1000;
      case '1003': return png1003;
      case '1006': return png1006;
      case '1009': return png1009;
      case '1063': return png1063;
      case '1087': return png1087;
      case '1135': return png1135;
      case '1150': return png1150;
      case '1153': return png1153;
      case '116': return png116;
      case '1171': return png1171;
      case '1180': return png1180;
      case '1183': return png1183;
      case '1186': return png1186;
      case '1189': return png1189;
      case '1193': return png1193;
      case '1195': return png1195;
      case '1198': return png1198;
      case '1201': return png1201;
      case '1240': return png1240;
      case '1243': return png1243;
      case '1246': return png1246;
      case '1249': return png1249;
      case '1273': return png1273;
      case '1276': return png1276;
      default: return png116; // Return default image if no match
    }
  }

  // Handle special cases (like Cloud icons)
  // if (iconUrl.includes('Cloudheavyrain')) return Cloudheavyrain;
  // if (iconUrl.includes('CloudHeavyrainthunder')) return CloudHeavyrainthunder;
  // if (iconUrl.includes('CloudThunder')) return CloudThunder;

  // return png116; // Default case
};

  render() {
    const { weatherData, theme } = this.props;

    return (
      <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
        <Image
          source={this.getIconImage(weatherData.condition.icon)}
          // source={{ uri: `https:${weatherData.condition.icon}` }}
          style={{ 
            width: '100%', 
            height: 250, 
            alignSelf: 'center', 
            zIndex: 10, 
            position: 'relative',
            marginBottom: -100
          }}
        />
        <View
          style={{
            backgroundColor: theme.tertiary,
            borderRadius: 16,
            padding: 20,
            paddingTop: 120,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            zIndex: 1
          }}
        >
        <Text
          style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, textAlign: 'center', marginBottom: 20 }}
        >
          {weatherData.condition.text}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>Ave. Temp</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{weatherData.temp_c}°</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>Wind</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{weatherData.wind_kph}kph</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>Humidity</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>{weatherData.humidity}%</Text>
          </View>
        </View>
        </View>
      </View>
    );
  }
}

const currentHour = new Date().getHours();
const isNight = currentHour < 6 || currentHour >= 18;
const dayNight = isNight ? 'night' : 'day';

export const sampleWeatherData: WeatherData = {
  condition: {
    text: 'Partly Cloudy',
    icon: `//cdn.weatherapi.com/weather/64x64/${dayNight}/116.png`
  },
  temp_c: 28,
  wind_kph: 28,
  humidity: 65
};