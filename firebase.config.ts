import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjTzjQaILD-Lrkyw3Hdl2JRXNOXqsV51w",
  authDomain: "nicer-garlic-app.firebaseapp.com",
  projectId: "nicer-garlic-app",
  storageBucket: "nicer-garlic-app.appspot.com",
  messagingSenderId: "648624765084",
  appId: "1:648624765084:web:f7055f8747b0b1c0b1d559"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;