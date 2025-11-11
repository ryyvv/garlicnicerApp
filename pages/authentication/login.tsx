import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import GoogleSignIn from '../../components/GoogleSignIn';
import { ForgotPasswordPage } from './forgotpassword';
import { RegisterPage } from './register';

interface LoginState {
  email: string;
  password: string;
  showErrorModal: boolean;
  emailError: boolean;
  passwordError: boolean;
  showPassword: boolean;
  isSignUp: boolean;
  loading: boolean;
  isOffline: boolean;
  rememberMe: boolean;
  currentView: 'login' | 'register' | 'forgotPassword';
}

interface LoginProps {
  onLogin: () => void;
  selectedTheme: number;
}

interface LoginStyles {
  container: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  input: ViewStyle;
  loginButton: ViewStyle;
  buttonText: TextStyle;
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

class Login extends React.Component<LoginProps, LoginState> {
  private readonly styles: LoginStyles;
  private readonly themes: any;
  private emailShakeAnimation: Animated.Value;
  private passwordShakeAnimation: Animated.Value;
  private netInfoUnsubscribe?: () => void;

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showErrorModal: false,
      emailError: false,
      passwordError: false,
      showPassword: false,
      isSignUp: false,
      loading: false,
      isOffline: false,
      rememberMe: false,
      currentView: 'login',
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
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      } as TextStyle,
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

  private getCurrentTheme = () => {
    return this.themes[this.props.selectedTheme];
  };

  public async componentDidMount(): Promise<void> {
    const netInfo = await NetInfo.fetch();
    this.setState({ isOffline: !netInfo.isConnected });
    
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      this.setState({ isOffline: !state.isConnected });
    });

    const savedCredentials = await AsyncStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { email } = JSON.parse(savedCredentials);
      this.setState({ email, rememberMe: true });
    }
  }

  public componentWillUnmount(): void {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
    }
  }

  private handleLogin = async (): Promise<void> => {
    const { email, password, isSignUp, isOffline, rememberMe } = this.state;
    
    if (!this.isValidEmail(email) || !password) {
      const emailError = !this.isValidEmail(email);
      const passwordError = !password;
      this.setState({ emailError, passwordError });
      
      if (emailError) {
        this.shakeInput(this.emailShakeAnimation);
      }
      if (passwordError) {
        this.shakeInput(this.passwordShakeAnimation);
      }
      return;
    }

    if (isOffline && !isSignUp) {
      const savedCredentials = await AsyncStorage.getItem('savedCredentials');
      if (savedCredentials) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        if (email === savedEmail && password === savedPassword) {
          this.props.onLogin();
          return;
        }
      }
      this.setState({ emailError: true, passwordError: true, showErrorModal: true });
      this.shakeInput(this.emailShakeAnimation);
      this.shakeInput(this.passwordShakeAnimation);
      return;
    }

    if (isOffline && isSignUp) {
      this.setState({ emailError: true, passwordError: true, showErrorModal: true });
      this.shakeInput(this.emailShakeAnimation);
      this.shakeInput(this.passwordShakeAnimation);
      return;
    }

    this.setState({ loading: true, emailError: false, passwordError: false });

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const userUid = userCredential.user.uid;
      console.log('User UID:', userUid);
      
      if (rememberMe) {
        await AsyncStorage.setItem('savedCredentials', JSON.stringify({ email, password, userUid }));
      }
      
      this.props.onLogin();
    } catch (error: any) {
      this.setState({ emailError: true, passwordError: true, showErrorModal: true });
      this.shakeInput(this.emailShakeAnimation);
      this.shakeInput(this.passwordShakeAnimation);
    } finally {
      this.setState({ loading: false });
    }
  };

  private closeErrorModal = (): void => {
    this.setState({ showErrorModal: false });
  };

  private handleGoogleSuccess = (): void => {
    this.props.onLogin();
  };

  private handleGoogleError = (error: string): void => {
    this.setState({ showErrorModal: true });
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

  private clearEmail = (): void => {
    this.setState({ email: '', emailError: false });
  };

  private clearSavedCredentials = async (): Promise<void> => {
    await AsyncStorage.removeItem('savedCredentials');
    this.setState({ rememberMe: false, email: '', password: '' });
  };

  private togglePasswordVisibility = (): void => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  private isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  public render(): React.ReactElement {
    const currentTheme = this.getCurrentTheme();
    
    if (this.state.currentView === 'forgotPassword') {
      return React.createElement(ForgotPasswordPage, {
        theme: currentTheme,
        styles: this.styles,
        onBackToLogin: () => this.setState({ currentView: 'login' })
      });
    }
    
    if (this.state.currentView === 'register') {
      return React.createElement(RegisterPage, {
        theme: currentTheme,
        styles: this.styles,
        onBackToLogin: () => this.setState({ currentView: 'login' })
      });
    }
    
    return React.createElement(
      View,
      { style: { ...this.styles.container, backgroundColor: currentTheme.background } },
      React.createElement(
        View,
        { style: { ...this.styles.content, justifyContent: 'flex-start', paddingTop: 100 } },
        React.createElement(
          Text,
          { style: { ...this.styles.title, color: currentTheme.text, marginBottom: 10 } },
          this.state.isSignUp ? '🧄 Create Account!' : '🧄 Welcome Back!'
        ),
        React.createElement(
          Text,
          { style: { ...this.styles.description, color: currentTheme.text, marginBottom: 40 } },
          this.state.isSignUp ? 'Create your account to continue' : 'Please login to continue'
        ),
        this.state.isOffline ? React.createElement(
          View,
          {
            style: {
              backgroundColor: '#FFF3CD',
              borderColor: '#FFEAA7',
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              width: '100%'
            }
          },
          React.createElement(
            Text,
            {
              style: {
                color: '#856404',
                fontSize: 14,
                textAlign: 'center',
                fontWeight: 'bold'
              }
            },
            this.state.isSignUp 
              ? '⚠️ Offline Mode: Cannot create new accounts'
              : '⚠️ Offline Mode: Using saved credentials only'
          )
        ) : null,
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
                  this.state.showPassword ? '👁' : '👁🗨'
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
        !this.state.isSignUp ? React.createElement(
          View,
          {
            style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, width: '100%' }
          },
          React.createElement(
            TouchableOpacity,
            {
              style: { flexDirection: 'row', alignItems: 'center' },
              onPress: () => this.setState({ rememberMe: !this.state.rememberMe })
            },
            React.createElement(
              View,
              {
                style: {
                  width: 20,
                  height: 20,
                  borderWidth: 2,
                  borderColor: currentTheme.primary,
                  marginRight: 8,
                  backgroundColor: this.state.rememberMe ? currentTheme.primary : 'transparent'
                }
              },
              this.state.rememberMe ? React.createElement(
                Text,
                { style: { color: '#fff', fontSize: 12, textAlign: 'center' } },
                '✓'
              ) : null
            ),
            React.createElement(
              Text,
              { style: { fontSize: 14, color: currentTheme.text } },
              'Remember me'
            )
          ),
          React.createElement(
            TouchableOpacity,
            {
              onPress: () => this.setState({ currentView: 'forgotPassword' })
            },
            React.createElement(
              Text,
              { style: { fontSize: 14, color: currentTheme.primary } },
              'Forgot password?'
            )
          )
        ) : null,
        React.createElement(
          TouchableOpacity,
          {
            style: { ...this.styles.loginButton, backgroundColor: currentTheme.primary, opacity: this.state.loading ? 0.7 : 1 },
            onPress: this.handleLogin,
            disabled: this.state.loading
          },
          React.createElement(
            Text,
            { style: this.styles.buttonText },
            this.state.loading ? 'Loading...' : (this.state.isSignUp ? 'Sign Up' : 'Login')
          )
        ),
        React.createElement(GoogleSignIn, {
          onSuccess: this.handleGoogleSuccess,
          onError: this.handleGoogleError,
          theme: currentTheme,
          disabled: this.state.loading || this.state.isOffline
        }),
        React.createElement(
          TouchableOpacity,
          {
            style: { marginTop: 15 },
            onPress: () => this.setState({ currentView: this.state.isSignUp ? 'login' : 'register' })
          },
          React.createElement(
            Text,
            { style: { ...this.styles.description, fontSize: 14, color: currentTheme.primary } },
            this.state.isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'
          )
        ),

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
              this.state.isOffline 
                ? (this.state.isSignUp 
                  ? 'Cannot create account while offline. Please check your internet connection.' 
                  : 'Invalid offline credentials or no saved credentials found.')
                : 'Invalid email or password. Please try again.'
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
}

export default Login;