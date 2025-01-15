import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Determine if we're running locally
const isDevelopment = window.location.hostname === 'localhost';

const firebaseConfig = {
  apiKey: "AIzaSyADTuh7W2jR3iCVo3nmDXUEVcCoM92szTg",
  authDomain: isDevelopment ? "merch-store-581c9.firebaseapp.com" : "auth.token-factory.xyz",
  projectId: "merch-store-581c9",
  storageBucket: "merch-store-581c9.firebasestorage.app",
  messagingSenderId: "946488133747",
  appId: "1:946488133747:web:1cefa3eab5250023218206",
  measurementId: "G-JKNYX3PJWD"
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