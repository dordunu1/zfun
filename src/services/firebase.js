import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Collection reference
const collectionsRef = collection(db, 'collections');

export const saveCollection = async (collectionData) => {
  try {
    // Remove the artwork File object and only save the metadata URL
    const { artwork, ...collectionDataWithoutFile } = collectionData;
    
    // Add timestamp and id
    const dataToSave = {
      ...collectionDataWithoutFile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collectionsRef, dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error saving collection:', error);
    throw error;
  }
};

export const getCollection = async (symbol) => {
  try {
    const q = query(collectionsRef, where('symbol', '==', symbol));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Get first matching document
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
};

export const getAllCollections = async (filters = {}) => {
  try {
    let q = collection(db, 'collections');

    // Apply filters using indexes
    if (filters.network && filters.network !== 'all') {
      if (filters.type && filters.type !== 'all') {
        // Use composite index (network + type + date)
        q = query(q, 
          where('network', '==', filters.network),
          where('type', '==', filters.type),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Use network + date index
        q = query(q, 
          where('network', '==', filters.network),
          orderBy('createdAt', 'desc')
        );
      }
    } else if (filters.type && filters.type !== 'all') {
      // Use type + date index
      q = query(q, 
        where('type', '==', filters.type),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Just sort by date
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting collections:', error);
    throw error;
  }
};

// Add this to update minted amounts
export const updateCollectionMinted = async (symbol, newTotalMinted) => {
  try {
    const q = query(collectionsRef, where('symbol', '==', symbol));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        totalMinted: newTotalMinted,
        updatedAt: serverTimestamp()
      });
      
      // Return the updated data
      return {
        ...querySnapshot.docs[0].data(),
        totalMinted: newTotalMinted
      };
    }
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

// Add this new function to get real-time updates
export const subscribeToCollection = (symbol, callback) => {
  const q = query(collectionsRef, where('symbol', '==', symbol));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data());
    }
  });
}; 