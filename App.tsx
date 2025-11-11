import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Image, TextInput, Modal, Animated, PermissionsAndroid, Platform, Alert } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import Login from './pages/authentication/login';
import SplashScreen from './pages/splash/SplashScreen';
import NetworkStatus from './components/NetworkStatus';
import LocationPicker from './components/LocationPicker';
import LocationDisplay from './components/LocationDisplay';
import { SafeContainer } from './components/SafeContainer';
import { HomePage } from './pages/HomePage';
import { ForecastPage } from './pages/ForecastPage';
import { GarlicListPage } from './pages/GarlicListPage';
import { AccountPage } from './pages/AccountPage';
import { themes, getTheme } from './components/ThemeManager';

interface AppState {
  isLoading: boolean;
  currentPage: number;
  selectedTheme: number;
  showThemeDropdown: boolean;
  showLogin: boolean;
  showDashboard: boolean;
  activeTab: number;
  hasSeenOnboarding: boolean;
  location: string;
}

interface AppStyles {
  container: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  skipButton: ViewStyle;
  skipText: TextStyle;
  pageIndicator: ViewStyle;
  dot: ViewStyle;
  activeDot: ViewStyle;
  splashContainer: ViewStyle;
  splashIcon: any;
  themeSelector: ViewStyle;
  themeButton: ViewStyle;
  themeDropdown: ViewStyle;
  themeOption: ViewStyle;
  themeText: TextStyle;
  tabText: TextStyle;
  tabContainer: ViewStyle;
  tab: ViewStyle;
  input: ViewStyle;
  loginButton: ViewStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  modalText: TextStyle;
  modalButton: ViewStyle;
  errorLabel: TextStyle;
  inputContainer: ViewStyle;
  inputWrapper: ViewStyle;
  inputIcon: ViewStyle;
}

class App extends React.Component<{}, AppState> {
  private readonly styles: AppStyles;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      currentPage: 0,
      selectedTheme: 1,
      showThemeDropdown: false,
      showLogin: false,
      showDashboard: false,
      activeTab: 0,
      hasSeenOnboarding: false,
      location: '',
    };

    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      } as ViewStyle,
      content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
      } as ViewStyle,
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      } as TextStyle,
      description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
      } as TextStyle,
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 50,
      } as ViewStyle,
      button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
      } as ViewStyle,
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      } as TextStyle,
      skipButton: {
        paddingHorizontal: 20,
        paddingVertical: 15,
      } as ViewStyle,
      skipText: {
        color: '#666',
        fontSize: 16,
      } as TextStyle,
      pageIndicator: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 120,
        alignSelf: 'center',
        alignItems: 'center',
      } as ViewStyle,
      dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
      } as ViewStyle,
      activeDot: {
        backgroundColor: '#007AFF',
      } as ViewStyle,

      themeSelector: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1000,
      } as ViewStyle,
      themeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
      } as ViewStyle,
      themeDropdown: {
        position: 'absolute',
        top: 35,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 120,
      } as ViewStyle,
      themeOption: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      } as ViewStyle,
      themeText: {
        fontSize: 14,
        color: '#333',
      } as TextStyle,
      input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
      } as ViewStyle,
      loginButton: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      } as ViewStyle,
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      } as ViewStyle,
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
      } as ViewStyle,
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      } as TextStyle,
      modalText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
      } as TextStyle,
      modalButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      } as ViewStyle,
      errorLabel: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        marginLeft: 5,
      } as TextStyle,
      inputContainer: {
        width: '100%',
      } as ViewStyle,
      tabContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 10,
        paddingBottom: 30,
      } as ViewStyle,
      tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
      } as ViewStyle,
      tabText: {
        fontSize: 12,
        marginTop: 4,
      } as TextStyle,
      inputWrapper: {
        position: 'relative',
        width: '100%',
      } as ViewStyle,
      inputIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
      } as ViewStyle,
      splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECFAE5',
      } as ViewStyle,
      splashIcon: {
        width: 120,
        height: 120,
      } as ViewStyle,
    });
  }

  public async componentDidMount(): Promise<void> {
    await ExpoSplashScreen.preventAutoHideAsync();
    await this.requestLocationPermission();
    const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
    setTimeout(() => {
      this.setState({ 
        isLoading: false, 
        hasSeenOnboarding: hasSeenOnboarding === 'true',
        showLogin: hasSeenOnboarding === 'true'
      });
      ExpoSplashScreen.hideAsync();
    }, 2000);
  }

  private readonly pages = [
    {
      title: 'Weather Forecast Advisory',
      description: 'Get real-time weather updates and farming recommendations for optimal garlic cultivation.',
      emoji: '🌤️',
    },
    {
      title: 'Pest & Disease Detection',
      description: 'Capture and upload garlic plant images for AI-powered pest and disease identification.',
      emoji: '🔍',
    },
    {
      title: 'Smart Farming Guide',
      description: 'Weather-based watering, fertilizer, and pesticide recommendations with step-by-step instructions.',
      emoji: '🌱',
    },
  ];

  private handleNext = async (): Promise<void> => {
    if (this.state.currentPage < this.pages.length - 1) {
      this.setState({ currentPage: this.state.currentPage + 1 });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      this.setState({ showLogin: true, hasSeenOnboarding: true });
    }
  };

  private handlePrevious = (): void => {
    if (this.state.currentPage > 0) {
      this.setState({ currentPage: this.state.currentPage - 1 });
    }
  };

  private handleSkip = (): void => {
    this.setState({ currentPage: this.pages.length - 1 });
  };

  private toggleThemeDropdown = (): void => {
    this.setState({ showThemeDropdown: !this.state.showThemeDropdown });
  };

  private selectTheme = (themeId: number): void => {
    this.setState({ selectedTheme: themeId, showThemeDropdown: false });
  };

  private getCurrentTheme = () => {
    return getTheme(this.state.selectedTheme);
  };

  private handleLogin = async (): Promise<void> => {
    await this.requestLocationPermission();
    this.setState({ showDashboard: true });
  };

  private selectTab = (tabIndex: number): void => {
    this.setState({ activeTab: tabIndex });
  };

  private handleLogout = (): void => {
    this.setState({ 
      showDashboard: false, 
      showLogin: true, 
      activeTab: 0 
    });
  };

  private requestLocationPermission = async (): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show weather data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getCurrentLocation();
        }
      } else {
        this.getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  private getCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          this.setState({ location: locationString });
        },
        (error) => {
          this.setState({ location: 'Location unavailable' });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      this.setState({ location: 'Geolocation not supported' });
    }
  };





  private renderThemeSelector(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    
    return React.createElement(
      View,
      { style: this.styles.themeSelector },
      React.createElement(
        TouchableOpacity,
        { 
          style: { ...this.styles.themeButton, backgroundColor: currentTheme.primary },
          onPress: this.toggleThemeDropdown 
        },
        React.createElement(
          Text,
          { style: { color: '#fff', fontSize: 12 } },
          '🎨'
        )
      ),
      this.state.showThemeDropdown
        ? React.createElement(
            View,
            { style: this.styles.themeDropdown },
            React.createElement(
              TouchableOpacity,
              { 
                style: this.styles.themeOption,
                onPress: () => this.selectTheme(1)
              },
              React.createElement(
                Text,
                { style: this.styles.themeText },
                'Green Theme'
              )
            ),
            React.createElement(
              TouchableOpacity,
              { 
                style: { ...this.styles.themeOption, borderBottomWidth: 0 },
                onPress: () => this.selectTheme(2)
              },
              React.createElement(
                Text,
                { style: this.styles.themeText },
                'Nature Theme'
              )
            )
          )
        : null
    );
  };

  private renderSplash(): React.ReactElement {
    return React.createElement(SplashScreen);
  }

  private renderLogin(): React.ReactElement {
    return React.createElement(Login, {
      onLogin: this.handleLogin,
      selectedTheme: this.state.selectedTheme
    });
  }

  private renderOnboarding(): React.ReactElement {
    const currentPageData = this.pages[this.state.currentPage];
    const currentTheme = this.getCurrentTheme();
    
    return React.createElement(
      View,
      { style: { ...this.styles.container, backgroundColor: currentTheme.background } },
      this.renderThemeSelector(),
      React.createElement(
        View,
        { style: this.styles.content },
        React.createElement(
          Text,
          { style: { ...this.styles.title, color: currentTheme.text } },
          currentPageData.title
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.description, color: currentTheme.text } },
          currentPageData.description
        )
      ),
      React.createElement(
        View,
        { style: this.styles.pageIndicator },
        ...this.pages.map((_, index) =>
          React.createElement(View, {
            key: index,
            style: [
              this.styles.dot,
              index === this.state.currentPage ? { ...this.styles.activeDot, backgroundColor: currentTheme.primary } : null,
            ],
          })
        )
      ),
      React.createElement(
        View,
        { style: this.styles.buttonContainer },
        this.state.currentPage > 0
          ? React.createElement(
              TouchableOpacity,
              { style: this.styles.skipButton, onPress: this.handlePrevious },
              React.createElement(
                Text,
                { style: this.styles.skipText },
                'Previous'
              )
            )
          : React.createElement(
              TouchableOpacity,
              { style: this.styles.skipButton, onPress: this.handleSkip },
              React.createElement(
                Text,
                { style: this.styles.skipText },
                'Skip'
              )
            ),
        React.createElement(
          TouchableOpacity,
          { style: { ...this.styles.button, backgroundColor: currentTheme.primary }, onPress: this.handleNext },
          React.createElement(
            Text,
            { style: this.styles.buttonText },
            this.state.currentPage === this.pages.length - 1 ? 'Get Started' : 'Next'
          )
        )
      ),
      React.createElement(StatusBar, { style: 'auto' })
    );
  }

  private renderTabContent(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    const { activeTab } = this.state;
    const tabHeight = 10 * 2 + 30 + 60;

    switch (activeTab) {
      case 0:
        return React.createElement(HomePage, {
          theme: currentTheme,
          styles: this.styles,
          tabHeight: tabHeight
        });
      case 1:
        return React.createElement(ForecastPage, {
          theme: currentTheme,
          styles: this.styles,
          tabHeight: tabHeight
        });
      case 2:
        return React.createElement(GarlicListPage, {
          theme: currentTheme,
          styles: this.styles
        });
      case 3:
        return React.createElement(AccountPage, {
          theme: currentTheme,
          styles: this.styles,
          selectedTheme: this.state.selectedTheme,
          onSelectTheme: this.selectTheme,
          onLogout: this.handleLogout
        });
      default:
        return React.createElement(View);
    }
  }

  private renderDashboard(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    const tabs = [
      { icon: '🏠', label: 'Home' },
      { icon: '🌤️', label: 'Forecast' },
      { icon: '🧄', label: 'Garlic List' },
      { icon: '👤', label: 'Account' }
    ];
    
    return React.createElement(
      View,
      { style: { ...this.styles.container, backgroundColor: currentTheme.background } },
      React.createElement(
        View,
        { style: { flex: 1 } },
        this.renderTabContent()
      ),
      React.createElement(
        View,
        { style: { ...this.styles.tabContainer, backgroundColor: currentTheme.tertiary } },
        ...tabs.map((tab, index) =>
          React.createElement(
            TouchableOpacity,
            {
              key: index,
              style: this.styles.tab,
              onPress: () => this.selectTab(index)
            },
            React.createElement(
              Text,
              { style: { fontSize: 20 } },
              tab.icon
            ),
            React.createElement(
              Text,
              { 
                style: { 
                  ...this.styles.tabText, 
                  color: this.state.activeTab === index ? currentTheme.primary : currentTheme.text 
                } 
              },
              tab.label
            )
          )
        )
      ),
      React.createElement(StatusBar, { style: 'auto' })
    );
  }

  public render(): React.ReactElement {
    let mainContent;
    
    if (this.state.isLoading) {
      mainContent = this.renderSplash();
    } else if (this.state.showDashboard) {
      mainContent = this.renderDashboard();
    } else if (this.state.showLogin || this.state.hasSeenOnboarding) {
      mainContent = this.renderLogin();
    } else {
      mainContent = this.renderOnboarding();
    }

    return React.createElement(
      SafeContainer,
      { 
        children: [
          React.createElement(React.Fragment, { key: 'main' }, mainContent),
          React.createElement(NetworkStatus, { key: 'network' })
        ]
      }
    );
  }
}

export default App;