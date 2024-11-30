import { mintsRef, holdersRef, mintersRef, volumeRef } from './firebase';
import { collection, query, where, orderBy, limit as firestoreLimit, onSnapshot, getDocs } from 'firebase/firestore';

// Get ETH price (mock for Sepolia testnet)
export const getEthPrice = async () => {
  return 2000; // Mock price for testing
};

export const getRecentMints = async (collectionAddress) => {
  try {
    const q = query(
      mintsRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('timestamp', 'desc'),
      firestoreLimit(10)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to JS Date
    }));
  } catch (error) {
    console.error('Error getting recent mints:', error);
    return [];
  }
};

// Get top holders for a collection
export const getTopHolders = async (collectionAddress, maxResults = 10) => {
  try {
    const q = query(
      holdersRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('quantity', 'desc'),
      firestoreLimit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting top holders:', error);
    return [];
  }
};

// Get chad minters (frequent minters)
export const getChadMinters = async (collectionAddress, maxResults = 10) => {
  try {
    const q = query(
      mintersRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('totalMinted', 'desc'),
      firestoreLimit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting chad minters:', error);
    return [];
  }
};

// Get volume metrics
export const getVolumeMetrics = async (collectionAddress, timeRange = '7d') => {
  try {
    const ranges = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      'all': 365
    };

    const days = ranges[timeRange];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      volumeRef,
      where('collectionAddress', '==', collectionAddress),
      where('timestamp', '>=', startDate),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting volume metrics:', error);
    return [];
  }
};

export const subscribeToMints = (collectionAddress, callback) => {
  if (!collectionAddress) {
    console.error('Collection address is required');
    return () => {};
  }

  try {
    console.log('Setting up mints subscription for:', collectionAddress);
    const q = query(
      mintsRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('timestamp', 'desc'),
      firestoreLimit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const mints = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() // Convert Firestore timestamp to JS Date
      }));
      
      console.log('Real-time mints update:', mints.length);
      callback(mints);
    }, (error) => {
      console.error('Error in mints subscription:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up mints subscription:', error);
    callback([]);
    return () => {};
  }
};
  