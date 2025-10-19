import * as React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface RegisterPageProps {
  theme: any;
  styles: any;
  onBackToLogin: () => void;
}

export class RegisterPage extends React.Component<RegisterPageProps> {
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
            placeholder: 'Full Name'
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Email',
            keyboardType: 'email-address',
            autoCapitalize: 'none'
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Password',
            secureTextEntry: true
          }
        ),
        React.createElement(
          TextInput,
          {
            style: { ...styles.input, borderColor: theme.primary },
            placeholder: 'Confirm Password',
            secureTextEntry: true
          }
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { ...styles.loginButton, backgroundColor: theme.primary },
            onPress: () => {}
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            'Register'
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
        )
      )
    );
  }
}