import * as React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

interface ForecastPageProps {
  theme: any;
  styles: any;
}

export class ForecastPage extends React.Component<ForecastPageProps> {
  render(): React.ReactElement {
    const { theme, styles } = this.props;

    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: theme.background } },
      React.createElement(
        View,
        { style: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 } },
        React.createElement(
          Text,
          { style: { ...styles.title, color: theme.text } },
          '🌤️ Forecast'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text } },
          'Weather forecast and farming recommendations'
        )
      )
    );
  }
}