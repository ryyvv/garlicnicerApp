import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Image, TextInput, Modal, Animated, PermissionsAndroid, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

interface AppState {
  isLoading: boolean;
  currentPage: number;
  selectedTheme: number;
  showThemeDropdown: boolean;
  showLogin: boolean;
  showDashboard: boolean;
  email: string;
  password: string;
  showErrorModal: boolean;
  emailError: boolean;
  passwordError: boolean;
  activeTab: number;
  hasSeenOnboarding: boolean;
  showPassword: boolean;
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
}

class App extends React.Component<{}, AppState> {
  private readonly styles: AppStyles;
  private readonly themes: any;
  private emailShakeAnimation: Animated.Value;
  private passwordShakeAnimation: Animated.Value;

  constructor(props: {}) {
    super(props);
    this.state = {
      isLoading: true,
      currentPage: 0,
      selectedTheme: 1,
      showThemeDropdown: false,
      showLogin: false,
      showDashboard: false,
      email: '',
      password: '',
      showErrorModal: false,
      emailError: false,
      passwordError: false,
      activeTab: 0,
      hasSeenOnboarding: false,
      showPassword: false,
      location: '',
    };

    this.emailShakeAnimation = new Animated.Value(0);
    this.passwordShakeAnimation = new Animated.Value(0);

    this.themes = {
      1: {
        primary: '#B0DB9C',
        secondary: '#CAE8BD',
        tertiary: '#DDF6D2',
        background: '#ECFAE5',
        text: '#5D8736',
      },
      2: {
        primary: '#5D8736',
        secondary: '#809D3C',
        tertiary: '#A9C46C',
        background: '#F4FFC3',
        text: '#5D8736',
      },
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
      splashContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      } as ViewStyle,
      splashIcon: {
        width: 450,
        height: 450,
      },
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
        marginBottom: 5,
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
    });
  }

  public async componentDidMount(): Promise<void> {
    await SplashScreen.preventAutoHideAsync();
    const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
    setTimeout(() => {
      this.setState({ 
        isLoading: false, 
        hasSeenOnboarding: hasSeenOnboarding === 'true',
        showLogin: hasSeenOnboarding === 'true'
      });
      SplashScreen.hideAsync();
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
    return this.themes[this.state.selectedTheme];
  };

  private handleLogin = (): void => {
    const { email, password } = this.state;
    const isEmailFormatValid = this.isValidEmail(email);
    const isEmailValid = email === 'admin@garlic.com' && isEmailFormatValid;
    const isPasswordValid = password === 'garlic123';
    
    if (isEmailValid && isPasswordValid) {
      this.setState({ showDashboard: true, emailError: false, passwordError: false });
      this.requestLocationPermission();
    } else {
      this.setState({ 
        emailError: !isEmailValid, 
        passwordError: !isPasswordValid 
      });
      
      if (!isEmailValid) {
        this.shakeInput(this.emailShakeAnimation);
      }
      if (!isPasswordValid) {
        this.shakeInput(this.passwordShakeAnimation);
      }
    }
  };

  private closeErrorModal = (): void => {
    this.setState({ showErrorModal: false });
  };

  private shakeInput = (animation: Animated.Value): void => {
    animation.setValue(0);
    Animated.sequence([
      Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  private selectTab = (tabIndex: number): void => {
    this.setState({ activeTab: tabIndex });
  };

  private handleLogout = (): void => {
    this.setState({ 
      showDashboard: false, 
      showLogin: true, 
      email: '', 
      password: '', 
      activeTab: 0 
    });
  };

  private clearEmail = (): void => {
    this.setState({ email: '', emailError: false });
  };

  private togglePasswordVisibility = (): void => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  private isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  private requestLocationPermission = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } else {
      this.getCurrentLocation();
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

  private renderEyeIcon = (visible: boolean): React.ReactElement => {
    return React.createElement(
      Svg,
      { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      visible
        ? React.createElement(Path, {
            stroke: '#999',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          })
        : React.createElement(Path, {
            stroke: '#999',
            strokeWidth: 1.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            d: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
          })
    );
  };

  private renderXIcon = (): React.ReactElement => {
    return React.createElement(
      Svg,
      { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
      React.createElement(Path, {
        d: 'M6 18L18 6M6 6l12 12',
        stroke: '#999',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      })
    );
  };

  private renderTabContent(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    const { activeTab } = this.state;

    switch (activeTab) {
      case 0:
        return React.createElement(
          View,
          { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
          React.createElement(
            Text,
            { style: { ...this.styles.title, color: currentTheme.text } },
            '🏠 Home'
          ),
          React.createElement(
            Text,
            { style: { ...this.styles.description, color: currentTheme.text } },
            'Welcome to your garlic farming dashboard!'
          )
        );
      case 1:
        return React.createElement(
          View,
          { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
          React.createElement(
            Text,
            { style: { ...this.styles.title, color: currentTheme.text } },
            '🌤️ Forecast'
          ),
          React.createElement(
            Text,
            { style: { ...this.styles.description, color: currentTheme.text } },
            'Weather forecast and farming recommendations'
          )
        );
      case 2:
        return React.createElement(
          View,
          { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
          React.createElement(
            Text,
            { style: { ...this.styles.title, color: currentTheme.text } },
            '🧄 Garlic List'
          ),
          React.createElement(
            Text,
            { style: { ...this.styles.description, color: currentTheme.text } },
            'Manage your garlic varieties and crops'
          )
        );
      case 3:
        return React.createElement(
          View,
          { style: { flex: 1, alignItems: 'center', justifyContent: 'center' } },
          React.createElement(
            Text,
            { style: { ...this.styles.title, color: currentTheme.text } },
            '👤 Account'
          ),
          React.createElement(
            Text,
            { style: { ...this.styles.description, color: currentTheme.text } },
            'Profile settings and account management'
          ),
          React.createElement(
            View,
            { style: { marginTop: 30, width: '80%' } },
            React.createElement(
              Text,
              { style: { ...this.styles.description, color: currentTheme.text, marginBottom: 10 } },
              'Theme'
            ),
            React.createElement(
              TouchableOpacity,
              {
                style: { ...this.styles.input, borderColor: currentTheme.primary, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
                onPress: this.toggleThemeDropdown
              },
              React.createElement(
                Text,
                { style: { color: currentTheme.text } },
                this.state.selectedTheme === 1 ? 'Green Theme' : 'Nature Theme'
              ),
              React.createElement(
                Text,
                { style: { color: currentTheme.text } },
                '▼'
              )
            ),
            this.state.showThemeDropdown ? React.createElement(
              View,
              { style: { ...this.styles.themeDropdown, position: 'relative', top: 0, right: 0, width: '100%' } },
              React.createElement(
                TouchableOpacity,
                {
                  style: { ...this.styles.themeOption, backgroundColor: this.state.selectedTheme === 1 ? currentTheme.tertiary : 'transparent' },
                  onPress: () => this.selectTheme(1)
                },
                React.createElement(
                  Text,
                  { style: { ...this.styles.themeText, fontWeight: this.state.selectedTheme === 1 ? 'bold' : 'normal' } },
                  'Green Theme'
                )
              ),
              React.createElement(
                TouchableOpacity,
                {
                  style: { ...this.styles.themeOption, borderBottomWidth: 0, backgroundColor: this.state.selectedTheme === 2 ? currentTheme.tertiary : 'transparent' },
                  onPress: () => this.selectTheme(2)
                },
                React.createElement(
                  Text,
                  { style: { ...this.styles.themeText, fontWeight: this.state.selectedTheme === 2 ? 'bold' : 'normal' } },
                  'Nature Theme'
                )
              )
            ) : null
          ),
          React.createElement(
            View,
            { style: { marginTop: 20, width: '80%' } },
            React.createElement(
              Text,
              { style: { ...this.styles.description, color: currentTheme.text, marginBottom: 10 } },
              'Current Location'
            ),
            React.createElement(
              View,
              { style: { flexDirection: 'row', alignItems: 'center' } },
              React.createElement(
                TextInput,
                {
                  style: { ...this.styles.input, flex: 1, marginRight: 10, marginBottom: 0 },
                  placeholder: 'Latitude, Longitude',
                  value: this.state.location,
                  editable: false
                }
              ),
              React.createElement(
                TouchableOpacity,
                {
                  style: { ...this.styles.button, backgroundColor: currentTheme.primary, paddingHorizontal: 15, paddingVertical: 12 },
                  onPress: this.getCurrentLocation
                },
                React.createElement(
                  Text,
                  { style: { ...this.styles.buttonText, fontSize: 12 } },
                  'Get Location'
                )
              )
            )
          ),
          React.createElement(
            TouchableOpacity,
            {
              style: { ...this.styles.loginButton, backgroundColor: '#ff4444', marginTop: 30 },
              onPress: this.handleLogout
            },
            React.createElement(
              Text,
              { style: this.styles.buttonText },
              'Logout'
            )
          )
        );
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
      this.renderTabContent(),
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
    return React.createElement(
      View,
      { style: this.styles.splashContainer },
      React.createElement(
        View,
        { style: this.styles.content },
        React.createElement(
          Image,
          { 
            source: require('./assets/res/drawable-xhdpi/splashscreen_image.png'),
            style: this.styles.splashIcon,
            resizeMode: 'contain'
          }
        ),
        React.createElement(StatusBar, { style: 'dark' })
      )
    );
  }

  private renderLogin(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    
    return React.createElement(
      View,
      { style: { ...this.styles.container, backgroundColor: currentTheme.background } },
      React.createElement(
        View,
        { style: { ...this.styles.content, justifyContent: 'flex-start', paddingTop: 100 } },
        React.createElement(
          Text,
          { style: { ...this.styles.title, color: currentTheme.text, marginBottom: 10 } },
          '🧄 Welcome Back!'
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.description, color: currentTheme.text, marginBottom: 40 } },
          'Please login to continue'
        ),
        React.createElement(
          View,
          { style: this.styles.inputContainer },
          React.createElement(
            Animated.View,
            { style: { transform: [{ translateX: this.emailShakeAnimation }] } },
            React.createElement(
              View,
              { style: this.styles.inputWrapper },
              React.createElement(
                TextInput,
                {
                  style: { 
                    ...this.styles.input, 
                    borderColor: this.state.emailError ? '#ff4444' : currentTheme.primary,
                    paddingRight: this.state.email ? 45 : 15
                  },
                  placeholder: 'Email',
                  value: this.state.email,
                  onChangeText: (email: string) => this.setState({ email, emailError: false }),
                  keyboardType: 'email-address',
                  autoCapitalize: 'none'
                }
              ),
              this.state.email ? React.createElement(
                TouchableOpacity,
                {
                  style: this.styles.inputIcon,
                  onPress: this.clearEmail
                },
                this.renderXIcon()
              ) : null
            )
          ),
          this.state.emailError ? React.createElement(
            Text,
            { style: this.styles.errorLabel },
            !this.isValidEmail(this.state.email) && this.state.email ? 'Invalid email format' : 'Email not found'
          ) : null
        ),
        React.createElement(
          View,
          { style: this.styles.inputContainer },
          React.createElement(
            Animated.View,
            { style: { transform: [{ translateX: this.passwordShakeAnimation }] } },
            React.createElement(
              View,
              { style: this.styles.inputWrapper },
              React.createElement(
                TextInput,
                {
                  style: { 
                    ...this.styles.input, 
                    borderColor: this.state.passwordError ? '#ff4444' : currentTheme.primary,
                    paddingRight: 45
                  },
                  placeholder: 'Password',
                  value: this.state.password,
                  onChangeText: (password: string) => this.setState({ password, passwordError: false }),
                  secureTextEntry: !this.state.showPassword
                }
              ),
              React.createElement(
                TouchableOpacity,
                {
                  style: this.styles.inputIcon,
                  onPress: this.togglePasswordVisibility
                },
                React.createElement(
                  Text,
                  { style: { fontSize: 18, color: '#999' } },
                  this.state.showPassword ? '👁' : '👁‍🗨'
                )
              )
            )
          ),
          this.state.passwordError ? React.createElement(
            Text,
            { style: this.styles.errorLabel },
            'Password does not match'
          ) : null
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { ...this.styles.loginButton, backgroundColor: currentTheme.primary },
            onPress: this.handleLogin
          },
          React.createElement(
            Text,
            { style: this.styles.buttonText },
            'Login'
          )
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.description, marginTop: 20, fontSize: 12 } },
          'Demo: admin@garlic.com / garlic123'
        )
      ),
      React.createElement(
        Modal,
        {
          visible: this.state.showErrorModal,
          transparent: true,
          animationType: 'fade'
        },
        React.createElement(
          View,
          { style: this.styles.modalOverlay },
          React.createElement(
            View,
            { style: { ...this.styles.modalContent, backgroundColor: currentTheme.tertiary } },
            React.createElement(
              Text,
              { style: { ...this.styles.modalTitle, color: currentTheme.text } },
              'Login Failed'
            ),
            React.createElement(
              Text,
              { style: { ...this.styles.modalText, color: currentTheme.text } },
              'Invalid email or password. Please try again.'
            ),
            React.createElement(
              TouchableOpacity,
              {
                style: { ...this.styles.modalButton, backgroundColor: currentTheme.primary },
                onPress: this.closeErrorModal
              },
              React.createElement(
                Text,
                { style: { color: '#fff', fontWeight: 'bold' } },
                'OK'
              )
            )
          )
        )
      ),
      React.createElement(StatusBar, { style: 'auto' })
    );
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

  public render(): React.ReactElement {
    if (this.state.isLoading) {
      return this.renderSplash();
    }

    if (this.state.showDashboard) {
      return this.renderDashboard();
    }

    if (this.state.showLogin || this.state.hasSeenOnboarding) {
      return this.renderLogin();
    }

    return this.renderOnboarding();
  }
}

export default App;