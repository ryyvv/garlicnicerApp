import React, { Component } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';

interface ForecastPageProps {
  theme: any;
  styles: any;
}

export class ForecastPage extends Component<ForecastPageProps> {
  render() {
    const { theme, styles } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <Text style={{ ...styles.title, color: theme.text }}>
            🌤️ Weather Forecast
          </Text>
          <Text style={{ ...styles.description, color: theme.text }}>
            Weather forecast and farming recommendations
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}