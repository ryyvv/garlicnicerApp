import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomePage } from '../pages/HomePage';
import { ForecastPage } from '../pages/ForecastPage';
import { GarlicListPage } from '../pages/GarlicListPage';
import { AccountPage } from '../pages/AccountPage';
import { LocationSearchPage } from '../pages/LocationSearchPage';
import Login from '../pages/authentication/login';
import SplashScreen from '../pages/splash/SplashScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  theme: any;
  styles: any;
  selectedTheme: number;
  onSelectTheme: (themeId: number) => void;
  onLogout: () => void;
}

function TabNavigator({ theme, styles, selectedTheme, onSelectTheme, onLogout }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tertiary,
          borderTopColor: theme.primary + '20',
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      >
        {(props) => <HomePage {...props} theme={theme} styles={styles} />}
      </Tab.Screen>
      <Tab.Screen
        name="Forecast"
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌤️</Text>,
        }}
      >
        {(props) => <ForecastPage {...props} theme={theme} styles={styles} />}
      </Tab.Screen>
      <Tab.Screen
        name="Garlic List"
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧄</Text>,
        }}
      >
        {(props) => <GarlicListPage {...props} theme={theme} styles={styles} />}
      </Tab.Screen>
      <Tab.Screen
        name="Account"
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      >
        {(props) => (
          <AccountPage
            {...props}
            theme={theme}
            styles={styles}
            selectedTheme={selectedTheme}
            onSelectTheme={onSelectTheme}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  theme: any;
  styles: any;
  selectedTheme: number;
  onSelectTheme: (themeId: number) => void;
  onLogout: () => void;
  onLogin: () => void;
  isLoading: boolean;
  showLogin: boolean;
  showDashboard: boolean;
}

export function AppNavigator({
  theme,
  styles,
  selectedTheme,
  onSelectTheme,
  onLogout,
  onLogin,
  isLoading,
  showLogin,
  showDashboard,
}: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : showDashboard ? (
          <>
            <Stack.Screen name="Main">
              {(props) => (
                <TabNavigator
                  {...props}
                  theme={theme}
                  styles={styles}
                  selectedTheme={selectedTheme}
                  onSelectTheme={onSelectTheme}
                  onLogout={onLogout}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="LocationSearch">
              {(props) => <LocationSearchPage {...props} theme={theme} styles={styles} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login">
            {(props) => <Login {...props} onLogin={onLogin} selectedTheme={selectedTheme} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}