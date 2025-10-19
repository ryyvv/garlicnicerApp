# Google Sign-In Setup

## Required Configuration

1. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials

2. **Update GoogleSignIn.tsx:**
   Replace placeholder client IDs in `/components/GoogleSignIn.tsx`:
   ```typescript
   const [request, response, promptAsync] = Google.useAuthRequest({
     expoClientId: 'YOUR_EXPO_CLIENT_ID',
     iosClientId: 'YOUR_IOS_CLIENT_ID', 
     androidClientId: 'YOUR_ANDROID_CLIENT_ID',
     webClientId: 'YOUR_WEB_CLIENT_ID',
   });
   ```

3. **Firebase Console:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Google provider
   - Add your Web client ID from Google Cloud Console

4. **Install Dependencies:**
   ```bash
   npm install
   ```

## Features Added

- Google Sign-In button in login component
- Works for both login and sign-up flows
- Disabled during offline mode
- Integrated with Firebase Authentication
- Minimal UI matching your theme