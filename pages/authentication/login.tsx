import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LoginState {
  email: string;
  password: string;
  showErrorModal: boolean;
  emailError: boolean;
  passwordError: boolean;
  showPassword: boolean;
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

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showErrorModal: false,
      emailError: false,
      passwordError: false,
      showPassword: false,
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

  private handleLogin = (): void => {
    const { email, password } = this.state;
    const isEmailFormatValid = this.isValidEmail(email);
    const isEmailValid = email === 'admin@garlic.com' && isEmailFormatValid;
    const isPasswordValid = password === 'garlic123';
    
    if (isEmailValid && isPasswordValid) {
      this.setState({ emailError: false, passwordError: false });
      this.props.onLogin();
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

  private clearEmail = (): void => {
    this.setState({ email: '', emailError: false });
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
}

export default Login;