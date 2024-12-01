import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, onSnapshot, limit as firestoreLimit } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { ethers } from 'ethers';
import { NFTCollectionABI } from '../abi/NFTCollection';

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
export const db = getFirestore(app);

// Collection references
export const collectionsRef = collection(db, 'collections');
export const tokenDeploymentsRef = collection(db, 'tokenDeployments');
export const mintsRef = collection(db, 'mints');
export const holdersRef = collection(db, 'holders');
export const mintersRef = collection(db, 'minters');
export const volumeRef = collection(db, 'volume');
export const tokenTransfersRef = collection(db, 'tokenTransfers');

export const saveCollection = async (collectionData) => {
  try {
    const { artwork, ...collectionDataWithoutFile } = collectionData;
    
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

    if (filters.network && filters.network !== 'all') {
      if (filters.type && filters.type !== 'all') {
        q = query(q, 
          where('network', '==', filters.network),
          where('type', '==', filters.type),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(q, 
          where('network', '==', filters.network),
          orderBy('createdAt', 'desc')
        );
      }
    } else if (filters.type && filters.type !== 'all') {
      q = query(q, 
        where('type', '==', filters.type),
        orderBy('createdAt', 'desc')
      );
    } else {
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

export const subscribeToCollection = (symbol, callback) => {
  const q = query(collectionsRef, where('symbol', '==', symbol));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data());
    }
  });
};

export const saveTokenDeployment = async (deployment, walletAddress) => {
  try {
    await addDoc(tokenDeploymentsRef, {
      ...deployment,
      creatorAddress: walletAddress.toLowerCase(),
      createdAt: Date.now(),
      type: 'token'
    });
  } catch (error) {
    console.error('Error saving token deployment:', error);
    throw error;
  }
};

export const getTokenDeploymentsByWallet = async (walletAddress) => {
  try {
    const q = query(
      tokenDeploymentsRef,
      where('creatorAddress', '==', walletAddress.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    const deployments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return deployments.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting token deployments:', error);
    throw error;
  }
};

export const getCollectionsByWallet = async (walletAddress) => {
  try {
    const q = query(
      collectionsRef,
      where('creatorAddress', '==', walletAddress.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    const collections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const sortedCollections = collections.sort((a, b) => b.createdAt - a.createdAt);
    console.log('Found collections:', sortedCollections);
    return sortedCollections;
  } catch (error) {
    console.error('Error getting collections:', error);
    throw error;
  }
};

// Analytics Functions
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

// Save mint data when NFT is minted
export const saveMintData = async (mintData) => {
  try {
    console.log('Saving mint data:', mintData);
    // Ensure all fields are strings or have default values
    const sanitizedData = {
      collectionAddress: mintData.collectionAddress || '',
      minterAddress: mintData.minterAddress ? mintData.minterAddress.toLowerCase() : '',
      tokenId: String(mintData.tokenId || '0'),
      quantity: String(mintData.quantity || '1'),
      hash: String(mintData.hash || ''),
      image: String(mintData.image || ''),
      value: String(mintData.value || '0'),
      type: String(mintData.type || 'ERC1155'),
      timestamp: serverTimestamp()
    };

    // Validate required fields
    if (!sanitizedData.collectionAddress || !sanitizedData.minterAddress) {
      throw new Error('Missing required fields in mint data');
    }

    const docRef = await addDoc(mintsRef, sanitizedData);
    console.log('Mint data saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving mint data:', error);
    throw error;
  }
};

// Subscribe to real-time mints
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

export const getTokenDeploymentByAddress = async (address) => {
  try {
    console.log('Searching for token with address:', address);
    
    const q = query(
      tokenDeploymentsRef, 
      where('address', '==', address)  // Use exact address, no toLowerCase()
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      console.log('Found token deployment:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error getting token deployment:', error);
    return null;
  }
};

// Save token transaction
export const saveTokenTransaction = async (transactionData) => {
  try {
    const sanitizedData = {
      fromAddress: transactionData.fromAddress.toLowerCase(),
      toAddress: transactionData.toAddress.toLowerCase(),
      tokenAddress: transactionData.tokenAddress,
      tokenName: transactionData.tokenName,
      tokenSymbol: transactionData.tokenSymbol,
      tokenLogo: transactionData.tokenLogo,
      amount: transactionData.amount,
      network: transactionData.network,
      hash: transactionData.hash,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(tokenTransactionsRef, sanitizedData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving token transaction:', error);
    throw error;
  }
};

// Get token transactions for an address (both sent and received)
export const getTokenTransactions = async (address) => {
  try {
    const sentQuery = query(
      tokenTransactionsRef,
      where('fromAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const receivedQuery = query(
      tokenTransactionsRef,
      where('toAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);

    const sentTransactions = sentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'sent'
    }));

    const receivedTransactions = receivedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      type: 'received'
    }));

    return [...sentTransactions, ...receivedTransactions];
  } catch (error) {
    console.error('Error getting token transactions:', error);
    return [];
  }
};

export const getTokenDetails = async (tokenAddress) => {
  try {
    console.log('Getting token details for:', tokenAddress);
    return await getTokenDeploymentByAddress(tokenAddress);
  } catch (error) {
    console.error('Error getting token details:', error);
    return null;
  }
};

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

// Add function to get NFT balance from Etherscan
const getNFTBalanceFromEtherscan = async (contractAddress, address) => {
  try {
    const response = await fetch(
      `https://api-sepolia.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
    );
    const data = await response.json();
    if (data.status === '1' && data.result) {
      return Number(data.result);
    }
    return 0;
  } catch (error) {
    console.error('Error getting NFT balance from Etherscan:', error);
    return 0;
  }
};

export const getOwnedNFTs = async (address) => {
  try {
    console.log('Getting owned NFTs for address:', address);
    
    // Get all mints where the minter address matches
    const mintsQuery = query(
      mintsRef,
      where('minterAddress', '==', address.toLowerCase())
    );
    
    const mintsSnapshot = await getDocs(mintsQuery);
    const mints = mintsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      mintedAt: doc.data().timestamp?.toDate() || new Date(),
    }));

    console.log('Found mints:', mints.length);

    // Get collection details and balances
    const uniqueCollectionAddresses = [...new Set(mints.map(mint => mint.collectionAddress))];
    const collections = new Map();
    const balances = new Map();

    await Promise.all([
      ...uniqueCollectionAddresses.map(async (collectionAddress) => {
        const collectionQuery = query(
          collectionsRef,
          where('contractAddress', '==', collectionAddress)
        );
        const collectionSnapshot = await getDocs(collectionQuery);
        if (!collectionSnapshot.empty) {
          collections.set(collectionAddress, collectionSnapshot.docs[0].data());
          // Get balance from Etherscan
          const balance = await getNFTBalanceFromEtherscan(collectionAddress, address);
          balances.set(collectionAddress, balance);
        }
      })
    ]);

    // Combine mint data with collection data and balances
    const ownedNFTs = mints.map(mint => {
      const collection = collections.get(mint.collectionAddress) || {};
      const balance = balances.get(mint.collectionAddress) || 0;
      return {
        ...mint,
        ...collection,
        balance,
        name: collection.name || 'Unknown Collection',
        collectionName: collection.name,
        type: collection.type || 'ERC721',
        symbol: collection.symbol,
        artworkType: collection.artworkType || 'image',
        network: collection.network || 'sepolia'
      };
    });

    console.log('Found owned NFTs:', ownedNFTs.length);
    return ownedNFTs;
  } catch (error) {
    console.error('Error getting owned NFTs:', error);
    return [];
  }
}
