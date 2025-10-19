import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase.config';

WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  theme: any;
  disabled?: boolean;
}

interface GoogleSignInStyles {
  button: ViewStyle;
  buttonText: TextStyle;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError, theme, disabled }) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
    } as ViewStyle,
    buttonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 10,
    } as TextStyle,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken);
      }
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(null, accessToken);
      await signInWithCredential(auth, credential);
      onSuccess();
    } catch (error: any) {
      onError(error.message || 'Google sign-in failed');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { opacity: disabled ? 0.5 : 1 }]}
      onPress={() => promptAsync()}
      disabled={disabled || !request}
    >
      <Text style={styles.buttonText}>🔍 Continue with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignIn;