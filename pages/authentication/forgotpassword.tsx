import * as React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface ForgotPasswordPageProps {
  theme: any;
  styles: any;
  onBackToLogin: () => void;
}

export class ForgotPasswordPage extends React.Component<ForgotPasswordPageProps> {
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
          '🧄 Reset Password'
        ),
        React.createElement(
          Text,
          { style: { ...styles.description, color: theme.text, marginBottom: 40 } },
          'Enter your email to reset password'
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
          TouchableOpacity,
          {
            style: { ...styles.loginButton, backgroundColor: theme.primary },
            onPress: () => {}
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            'Send Reset Link'
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
            'Back to Login'
          )
        )
      )
    );
  }
}