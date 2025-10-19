import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';

interface SplashScreenStyles {
  splashContainer: ViewStyle;
  content: ViewStyle;
  splashIcon: any;
}

class SplashScreen extends React.Component {
  private readonly styles: SplashScreenStyles;

  constructor(props: {}) {
    super(props);

    this.styles = StyleSheet.create({
      splashContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      } as ViewStyle,
      content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
      } as ViewStyle,
      splashIcon: {
        width: 450,
        height: 450,
      },
    });
  }

  public render(): React.ReactElement {
    return React.createElement(
      View,
      { style: this.styles.splashContainer },
      React.createElement(
        View,
        { style: this.styles.content },
        React.createElement(
          Image,
          { 
            source: require('../../assets/res/drawable-xhdpi/splashscreen_image.png'),
            style: this.styles.splashIcon,
            resizeMode: 'contain'
          }
        ),
        React.createElement(StatusBar, { style: 'dark' })
      )
    );
  }
}

export default SplashScreen;