import { mintsRef, holdersRef, mintersRef, volumeRef } from './firebase';
import { collection, query, where, orderBy, limit as firestoreLimit, onSnapshot, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Chain-specific Alchemy URLs
const ALCHEMY_URLS = {
  'ethereum': 'https://eth-mainnet.g.alchemy.com/v2/',
  'sepolia': 'https://eth-sepolia.g.alchemy.com/v2/',
  'polygon': 'https://polygon-mainnet.g.alchemy.com/v2/',
  'mumbai': 'https://polygon-mumbai.g.alchemy.com/v2/',
  'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/',
  'optimism': 'https://opt-mainnet.g.alchemy.com/v2/',
};

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

// Get top holders for a collection using Alchemy API
export const getTopHolders = async (collectionAddress, maxResults = 50, network = 'sepolia') => {
  try {
    // Map network name to Alchemy URL key
    const networkKey = network === 'unichain' ? 'unichain' : 
                      network === 'polygon' ? 'polygon' : 'sepolia';
    
    // Get the correct Alchemy URL for the network
    const baseUrl = ALCHEMY_URLS[networkKey];
    if (!baseUrl) {
      console.warn('Unsupported network for Alchemy:', network);
      return fallbackToFirebase(collectionAddress, maxResults);
    }

    // Use Alchemy API to get holders
    const alchemyUrl = `${baseUrl}${ALCHEMY_API_KEY}/getOwnersForCollection?contractAddress=${collectionAddress}&withTokenBalances=true`;
    
    const response = await fetch(alchemyUrl);
    const data = await response.json();
    
    if (data.owners) {
      // Transform Alchemy data into our format
      const holders = data.owners
        .map(owner => ({
          holderAddress: owner.ownerAddress,
          quantity: owner.tokenBalances.reduce((sum, token) => sum + Number(token.balance), 0),
          lastUpdated: new Date()
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, maxResults);

      // Cache the data in Firebase
      await updateHoldersCache(collectionAddress, holders);

      return holders;
    }

    return fallbackToFirebase(collectionAddress, maxResults);
  } catch (error) {
    console.error('Error getting top holders:', error);
    return fallbackToFirebase(collectionAddress, maxResults);
  }
};

// Helper function to update holders cache in Firebase
const updateHoldersCache = async (collectionAddress, holders) => {
  try {
    for (const holder of holders) {
      const holderRef = query(
        holdersRef,
        where('collectionAddress', '==', collectionAddress),
        where('holderAddress', '==', holder.holderAddress)
      );
      
      const holderSnapshot = await getDocs(holderRef);
      
      if (holderSnapshot.empty) {
        await addDoc(holdersRef, {
          collectionAddress,
          holderAddress: holder.holderAddress,
          quantity: holder.quantity,
          lastUpdated: serverTimestamp()
        });
      } else {
        // Update existing holder data if it's outdated
        const holderDoc = holderSnapshot.docs[0];
        const lastUpdated = holderDoc.data().lastUpdated?.toDate();
        if (!lastUpdated || (new Date() - lastUpdated) > 5 * 60 * 1000) { // 5 minutes cache
          await holderDoc.ref.update({
            quantity: holder.quantity,
            lastUpdated: serverTimestamp()
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating holders cache:', error);
  }
};

// Helper function for Firebase fallback
const fallbackToFirebase = async (collectionAddress, maxResults) => {
  console.log('Falling back to Firebase holders data');
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
  