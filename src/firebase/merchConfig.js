import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Determine if we're running locally
const isDevelopment = window.location.hostname === 'localhost';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_MERCH_FIREBASE_API_KEY,
  authDomain: isDevelopment ? import.meta.env.VITE_MERCH_FIREBASE_AUTH_DOMAIN : "auth.token-factory.xyz",
  projectId: import.meta.env.VITE_MERCH_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_MERCH_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MERCH_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_MERCH_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MERCH_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig, 'merchStore');
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  auth_type: 'reauthenticate'
});

auth.useDeviceLanguage();

export { auth, db, storage, analytics, googleProvider }; 