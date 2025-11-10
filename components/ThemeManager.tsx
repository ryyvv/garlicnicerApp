export const themes = {
  1: {
    name: 'Light-green Theme',
    background: '#f0f8f0',
    primary: '#388E3C',
    secondary: '#fbfbfbff',
    tertiary: '#ffffffff',
    text: '#17681bff',
    accent: '#bcf4bfff'
  },
  2: {
    name: 'Green Theme',
    background: '#e8f5e8',
    primary: '#388E3C',
    secondary: '#66BB6A',
    tertiary: '#A5D6A7',
    text: '#1B5E20',
    accent: '#4CAF50'
  },
  3: {
    name: 'Nature Theme',
    background: '#f1f8e9',
    primary: '#689F38',
    secondary: '#8BC34A',
    tertiary: '#DCEDC8',
    text: '#33691E',
    accent: '#9CCC65'
  }
};

export const getTheme = (themeId: number) => {
  const theme = themes[themeId as keyof typeof themes];
  return theme ? { ...theme } : { ...themes[1] };
};

export const getThemeName = (themeId: number) => {
  return getTheme(themeId).name;
};

export const getThemeBackground = (themeId: number) => {
  return getTheme(themeId).background;
};

export const getThemePrimary = (themeId: number) => {
  return getTheme(themeId).primary;
};

export const getThemeSecondary = (themeId: number) => {
  return getTheme(themeId).secondary;
};

export const getThemeTertiary = (themeId: number) => {
  return getTheme(themeId).tertiary;
};

export const getThemeText = (themeId: number) => {
  return getTheme(themeId).text;
};

export const getThemeAccent = (themeId: number) => {
  return getTheme(themeId).accent;
};

export const getAllThemeProperties = (themeId: number) => {
  const theme = themes[themeId as keyof typeof themes];
  return theme ? { ...theme } : { ...themes[1] };
};

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeManagerProps {
  selectedTheme: number;
  onSelectTheme?: (themeId: number) => void;
  theme: any;
  styles: any;
  themesData?: typeof themes;
}

interface ThemeManagerState {
  showDropdown: boolean;
}

export class ThemeManager extends Component<ThemeManagerProps, ThemeManagerState> {
  constructor(props: ThemeManagerProps) {
    super(props);
    this.state = { showDropdown: false };
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  selectTheme = async (themeId: number) => {
    try {
      await AsyncStorage.setItem('selectedTheme', themeId.toString());
      if (this.props.onSelectTheme) {
        this.props.onSelectTheme(themeId);
      }
      this.setState({ showDropdown: false });
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  static getStoredTheme = async (): Promise<number> => {
    try {
      const storedTheme = await AsyncStorage.getItem('selectedTheme');
      return storedTheme ? parseInt(storedTheme) : 1;
    } catch (error) {
      return 1;
    }
  };

  render() {
    const { selectedTheme, theme, styles, themesData = themes } = this.props;
    const { showDropdown } = this.state;

    return (
      <View style={{ width: '100%' }}>
        <Text style={{ ...styles.description, color: theme.text, marginBottom: 10 }}>
          Theme
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: theme.background,
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2
          }}
          onPress={this.toggleDropdown}
        >
          <Text style={{ color: theme.text, fontSize: 16 }}>
            {getThemeName(selectedTheme)}
          </Text>
          <Text style={{ color: theme.text, fontSize: 12 }}>
            {showDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {showDropdown && (
          <View style={{
            backgroundColor: theme.background,
            borderWidth: 1,
            borderColor: theme.primary,
            borderRadius: 8,
            marginTop: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4
          }}>
            {Object.keys(themesData).map((themeId, index) => {
              const id = parseInt(themeId);
              console.log('Rendering theme:', id, themesData[id as keyof typeof themesData].name);
              return (
                <TouchableOpacity
                  key={id}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: selectedTheme === id ? theme.tertiary : 'transparent',
                    borderBottomWidth: index === Object.keys(themesData).length - 1 ? 0 : 1,
                    borderBottomColor: theme.primary + '20'
                  }}
                  onPress={() => this.selectTheme(id)}
                >
                  <Text style={{
                    color: theme.text,
                    fontSize: 16,
                    fontWeight: selectedTheme === id ? 'bold' : 'normal'
                  }}>
                    {themesData[id as keyof typeof themesData].name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  }
}