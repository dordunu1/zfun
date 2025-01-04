import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/merchConfig';
import { toast } from 'react-hot-toast';

const MerchAuthContext = createContext();

export function MerchAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

        const userObj = {
          uid: authUser.uid,
          email: authUser.email,
          name: userData.name || null,
          isSeller: userData.isSeller || false,
          sellerId: userData.sellerId || null,
          walletAddress: userData.walletAddress || null,
          createdAt: userData.createdAt || new Date(),
          updatedAt: new Date()
        };

        setUser(userObj);
        setIsAdmin(userData.isAdmin || false);
        setLoading(false);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCartCount = async (userId) => {
    try {
      const q = query(collection(db, 'cart'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      setCartCount(querySnapshot.size);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const updateCartCount = async (userId) => {
    await fetchCartCount(userId);
  };

  const signup = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        email,
        createdAt: new Date().toISOString(),
        isSeller: false,
        isBuyer: true,
      });
      // Remove the immediate sign out
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user profile if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          isSeller: false,
          isBuyer: true,
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        });
        toast.success('Account created successfully!');
      } else {
        toast.success('Welcome back!');
      }
      
      // Remove the immediate sign out
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in cancelled');
      }
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAdmin,
    cartCount,
    updateCartCount
  };

  return (
    <MerchAuthContext.Provider value={value}>
      {!loading && children}
    </MerchAuthContext.Provider>
  );
}

export function useMerchAuth() {
  return useContext(MerchAuthContext);
} 