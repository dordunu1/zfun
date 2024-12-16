import { mintsRef, holdersRef, mintersRef, volumeRef } from './firebase';
import { collection, query, where, orderBy, limit as firestoreLimit, onSnapshot, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Get ETH price (mock for Sepolia testnet)
export const getEthPrice = async () => {
  return 2000; // Mock price for testing
};

export const getRecentMints = async (collectionAddress, maxResults = 50) => {
  try {
    const q = query(
      mintsRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('timestamp', 'desc'),
      firestoreLimit(maxResults)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        tokenId: data.tokenId.toString().replace(/[^0-9]/g, ''), // Clean tokenId when retrieving
        timestamp: data.timestamp?.toDate()
      };
    });
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
  try {
    const q = query(
      mintsRef,
      where('collectionAddress', '==', collectionAddress),
      orderBy('timestamp', 'desc'),
      firestoreLimit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const mints = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          tokenId: data.tokenId?.toString() || '0', // Preserve the original token ID
          timestamp: data.timestamp?.toDate()
        };
      });
      
      console.log('Real-time mints update:', mints.length);
      callback(mints);
    });
  } catch (error) {
    console.error('Error in mints subscription:', error);
    callback([]);
    return () => {};
  }
};

export const saveMintData = async (mintData) => {
  try {
    // Store the tokenId as-is without cleaning
    const docRef = await addDoc(mintsRef, {
      ...mintData,
      timestamp: serverTimestamp()
    });
    
    return docRef;
  } catch (error) {
    console.error('Error saving mint data:', error);
    throw error;
  }
};
  