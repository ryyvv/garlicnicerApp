import * as React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.8.132:8000';

interface RegisterPageProps {
  theme: any;
  styles: any;
  onBackToLogin: () => void;
}

interface RegisterPageState {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
}

export class RegisterPage extends React.Component<RegisterPageProps, RegisterPageState> {
  constructor(props: RegisterPageProps) {
    super(props);
    this.state = {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false
    };
  }

  private handleRegister = async (): Promise<void> => {
    const { fullname, email, password, confirmPassword } = this.state;

    if (!fullname.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    this.setState({ loading: true });

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Save user data to API
      const userData = {
        fullname: fullname,
        birthday: '2025-11-15T06:32:38.724Z',
        email: email,
        gender: 'Male',
        firebase_uid: firebaseUser.uid
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }

      Alert.alert('Success', 'Account created successfully!');
      this.props.onBackToLogin();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      this.setState({ loading: false });
    }
  };
  render(): React.ReactElement {
    const { theme, styles, onBackToLogin } = this.props;

    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: theme.background } },
      React.createElement(
        View,
        { style: { ...styles.content, justifyContent: 'flex-start', paddingTop: 100 } },
        React.createElement(
          Text,
          { style: { ...styles.title, color: theme.text, marginBottom: 10 } },
          '🧄 Create Account'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text, marginBottom: 40 } },
          'Join the garlic farming community'
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Full Name',
            value: this.state.fullname,
            onChangeText: (text: string) => this.setState({ fullname: text })
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Email',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            value: this.state.email,
            onChangeText: (text: string) => this.setState({ email: text })
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Password',
            secureTextEntry: true,
            value: this.state.password,
            onChangeText: (text: string) => this.setState({ password: text })
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Confirm Password',
            secureTextEntry: true,
            value: this.state.confirmPassword,
            onChangeText: (text: string) => this.setState({ confirmPassword: text })
          }
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { ...styles.loginButton, backgroundColor: theme.primary, opacity: this.state.loading ? 0.7 : 1 },
            onPress: this.handleRegister,
            disabled: this.state.loading
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            this.state.loading ? 'Creating Account...' : 'Register'
          )
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { marginTop: 20 },
            onPress: onBackToLogin
          },
          React.createElement(
            Text,
            { style: { ...styles.description, color: theme.primary } },
            'Already have an account? Login'
          )
        ),
        React.createElement(
          Modal,
          {
            visible: this.state.loading,
            transparent: true,
            animationType: 'fade'
          },
          React.createElement(
            View,
            { style: loadingStyles.overlay },
            React.createElement(
              View,
              { style: { ...loadingStyles.modal, backgroundColor: theme.background } },
              React.createElement(
                ActivityIndicator,
                { size: 'large', color: theme.primary }
              ),
              React.createElement(
                Text,
                { style: { ...loadingStyles.text, color: theme.text } },
                'Creating your account...'
              )
            )
          )
        )
      )
    );
  }
}

const loadingStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center'
  }
});