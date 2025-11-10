import React, { Component, createRef } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';

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




interface HourlyForecastProps {
  hourlyData: any[];
  theme: any;
  defaultLocation?: any;
  compact?: boolean;
}

export class HourlyForecast extends Component<HourlyForecastProps> {
  private scrollViewRef = createRef<ScrollView>();
  private currentHour = new Date().getHours();

  getSortedHourlyData = () => {
    const { hourlyData } = this.props;
    const currentIndex = hourlyData.findIndex(hour => 
      new Date(hour.time).getHours() === this.currentHour
    );
    
    if (currentIndex === -1) return hourlyData;
    
    return [
      ...hourlyData.slice(currentIndex),
      ...hourlyData.slice(0, currentIndex)
    ];
  };

  formatTime = (timeString: string, isFirst: boolean) => {
    if (isFirst) return 'Now';
    const hour = new Date(timeString).getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  
  // getIconNumber = (iconUrl: string) => {
  //   const match = iconUrl.match(/(\d+)\.png/);
  //     console.log("match: ",match)
      
  //   if (match && match[1]) {
  //     // console.log("match: ",match)
  //     // console.log("Matching: ",match[1])
  //     return match[1];
  //   }
  // };

  // Helper function to map icon number or name to imported images
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

  return png116; // Default case
};


  generateAccessToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };


  render() {
    const { theme } = this.props;
    const sortedHourlyData = this.getSortedHourlyData();

    return (
      <View style={{ marginTop: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15, paddingHorizontal: 20 }}>
          Hourly Forecast
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ paddingLeft: 20 }}
        >
          {sortedHourlyData.map((hour: any, index: number) => {
            const isFirst = index === 0;
            const count = index + 1;
            console.log(count);
            return (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  marginRight: 10,
                  marginBottom: 15,
                  padding: 12,
                  backgroundColor: isFirst ? theme.primary : theme.tertiary,
                  borderRadius: 12,
                  minWidth: 80,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 3
                }}
              >
                <Text style={{ 
                  fontSize: 12, 
                  color: isFirst ? '#fff' : theme.text, 
                  opacity: isFirst ? 1 : 0.7, 
                  marginBottom: 8 
                }}>
                  {this.formatTime(hour.time, isFirst)}
                </Text>
              <Image
                source={this.getIconImage(hour.condition.icon)}
                style={{ width: '100%', height: 40 }}
              />
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: 'bold', 
                  color: isFirst ? '#fff' : theme.text 
                }}>
                  {hour.temp_c}°C
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const now = new Date();
export const sampleHourlyData = Array.from({ length: 24 }, (_, i) => {
  const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
  const hourOfDay = hour.getHours();
  const isNight = hourOfDay < 6 || hourOfDay >= 18;
  const dayNight = isNight ? 'night' : 'day';
  return {
    time: hour.toISOString(),
    condition: { icon: `//cdn.weatherapi.com/weather/64x64/${dayNight}/116.png` },
    temp_c: Math.round(20 + Math.random() * 15)
  };
});