import * as React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase.config';

interface ForgotPasswordPageProps {
  theme: any;
  styles: any;
  onBackToLogin: () => void;
}

interface ForgotPasswordState {
  email: string;
  loading: boolean;
  showSuccessModal: boolean;
  showErrorModal: boolean;
}

export class ForgotPasswordPage extends React.Component<ForgotPasswordPageProps, ForgotPasswordState> {
  constructor(props: ForgotPasswordPageProps) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      showSuccessModal: false,
      showErrorModal: false,
    };
  }

  private isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  private handleSendResetLink = async (): Promise<void> => {
    const { email } = this.state;
    
    if (!this.isValidEmail(email)) {
      return;
    }

    this.setState({ loading: true });

    try {
      await sendPasswordResetEmail(auth, email);
      this.setState({ showSuccessModal: true });
    } catch (error) {
      this.setState({ showErrorModal: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  private closeModal = (): void => {
    this.setState({ showSuccessModal: false, showErrorModal: false });
  };

  render(): React.ReactElement {
    const { theme, styles, onBackToLogin } = this.props;
    const { email, loading, showSuccessModal, showErrorModal } = this.state;
    const isEmailValid = this.isValidEmail(email);

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
            value: email,
            onChangeText: (email: string) => this.setState({ email }),
            keyboardType: 'email-address',
            autoCapitalize: 'none'
          }
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: { 
              ...styles.loginButton, 
              backgroundColor: isEmailValid ? theme.primary : '#ccc',
              opacity: loading ? 0.7 : 1
            },
            onPress: this.handleSendResetLink,
            disabled: !isEmailValid || loading
          },
          React.createElement(
            Text,
            { style: styles.buttonText },
            loading ? 'Sending...' : 'Send Reset Link'
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
        ),
        React.createElement(
          Modal,
          {
            visible: showSuccessModal,
            transparent: true,
            animationType: 'fade'
          },
          React.createElement(
            View,
            { style: styles.modalOverlay },
            React.createElement(
              View,
              { style: { ...styles.modalContent, backgroundColor: theme.tertiary } },
              React.createElement(
                Text,
                { style: { ...styles.modalTitle, color: theme.text } },
                'Reset Link Sent'
              ),
              React.createElement(
                Text,
                { style: { ...styles.modalText, color: theme.text } },
                'A password reset link has been sent to your email address.'
              ),
              React.createElement(
                TouchableOpacity,
                {
                  style: { ...styles.modalButton, backgroundColor: theme.primary },
                  onPress: () => {
                    this.closeModal();
                    onBackToLogin();
                  }
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
        React.createElement(
          Modal,
          {
            visible: showErrorModal,
            transparent: true,
            animationType: 'fade'
          },
          React.createElement(
            View,
            { style: styles.modalOverlay },
            React.createElement(
              View,
              { style: { ...styles.modalContent, backgroundColor: theme.tertiary } },
              React.createElement(
                Text,
                { style: { ...styles.modalTitle, color: theme.text } },
                'Error'
              ),
              React.createElement(
                Text,
                { style: { ...styles.modalText, color: theme.text } },
                'Failed to send reset link. Please check your email address and try again.'
              ),
              React.createElement(
                TouchableOpacity,
                {
                  style: { ...styles.modalButton, backgroundColor: theme.primary },
                  onPress: this.closeModal
                },
                React.createElement(
                  Text,
                  { style: { color: '#fff', fontWeight: 'bold' } },
                  'OK'
                )
              )
            )
          )
        )
      )
    );
  }
}