import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp, onSnapshot, limit as firestoreLimit, doc, setDoc } from 'firebase/firestore';
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
export const poolsRef = collection(db, 'pools');
export const userPoolsRef = collection(db, 'userPools');

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
      firestoreLimit(50)
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
    // Extract metadataUrl from mintData and remove it from the object
    const { metadataUrl, ...sanitizedData } = mintData;

    // Ensure all fields are strings or have default values
    const cleanData = {
      collectionAddress: sanitizedData.collectionAddress || '',
      minterAddress: sanitizedData.minterAddress ? sanitizedData.minterAddress.toLowerCase() : '',
      tokenId: String(sanitizedData.tokenId || '0'),
      quantity: String(sanitizedData.quantity || '1'),
      hash: String(sanitizedData.hash || ''),
      image: String(sanitizedData.image || ''),
      value: String(sanitizedData.value || '0'),
      type: String(sanitizedData.type || 'ERC1155'),
      name: sanitizedData.name || '',
      symbol: sanitizedData.symbol || '',
      artworkType: sanitizedData.artworkType || 'image',
      network: sanitizedData.network || 'sepolia',
      mintPrice: sanitizedData.mintPrice || '0',
      paymentToken: sanitizedData.paymentToken || null,
      timestamp: serverTimestamp()
    };

    // Validate required fields
    if (!cleanData.collectionAddress || !cleanData.minterAddress) {
      throw new Error('Missing required fields in mint data');
    }

    // Save mint data
    const docRef = await addDoc(mintsRef, cleanData);
    console.log('Mint data saved with ID:', docRef.id);

    // Update holders data
    const holderRef = query(
      holdersRef,
      where('collectionAddress', '==', cleanData.collectionAddress),
      where('holderAddress', '==', cleanData.minterAddress)
    );
    
    const holderSnapshot = await getDocs(holderRef);
    const quantity = Number(cleanData.quantity);

    if (holderSnapshot.empty) {
      // Create new holder entry
      await addDoc(holdersRef, {
        collectionAddress: cleanData.collectionAddress,
        holderAddress: cleanData.minterAddress,
        quantity: quantity,
        lastUpdated: serverTimestamp()
      });
    } else {
      // Update existing holder entry
      const holderDoc = holderSnapshot.docs[0];
      const currentQuantity = Number(holderDoc.data().quantity) || 0;
      await updateDoc(holderDoc.ref, {
        quantity: currentQuantity + quantity,
        lastUpdated: serverTimestamp()
      });
    }

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
      firestoreLimit(50)
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

const getNFTBalanceFromContract = async (contractAddress, address) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const collectionQuery = query(
      collection(db, 'collections'),
      where('contractAddress', '==', contractAddress)
    );
    const collectionSnapshot = await getDocs(collectionQuery);
    const collectionData = collectionSnapshot.docs[0]?.data();
    
    if (collectionData?.type === 'ERC1155') {
      // For ERC1155, check balance of token ID 1
      const contract = new ethers.Contract(
        contractAddress,
        ['function balanceOf(address account, uint256 id) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address, 1); // Just check token ID 1
      return Number(balance);
    } else {
      // For ERC721, use standard balanceOf
      const contract = new ethers.Contract(
        contractAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address);
      return Number(balance);
    }
  } catch (error) {
    console.error('Error getting NFT balance from contract:', error);
    return 0;
  }
};

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
      collection(db, 'mints'),
      where('minterAddress', '==', address.toLowerCase())
    );
    
    const mintsSnapshot = await getDocs(mintsQuery);
    const mints = mintsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      mintedAt: doc.data().timestamp?.toDate() || new Date(),
    }));

    console.log('Found mints:', mints.length);

    // Get all collections first
    const collectionsSnapshot = await getDocs(collection(db, 'collections'));
    const collections = new Map();
    
    collectionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.contractAddress) {
        console.log('Collection data from Firebase:', {
          name: data.name,
          address: data.contractAddress,
          mintPrice: data.mintPrice,
          type: data.type
        });
        collections.set(data.contractAddress.toLowerCase(), data);
      }
    });

    // Create NFT entries
    const ownedNFTs = [];
    const processedTokens = new Set(); // Track processed tokens to avoid duplicates
    
    for (const mint of mints) {
      const collection = collections.get(mint.collectionAddress?.toLowerCase());
      console.log('Processing mint for NFT entry:', {
        name: mint.name,
        collection: collection?.name,
        mintPrice: mint.value || collection?.mintPrice,
        type: mint.type,
        balance: mint.balance,
        tokenId: mint.tokenId
      });
      
      if (collection || mint.type === 'ERC1155') {
        const baseEntry = {
          ...mint,
          ...(collection || {}),
          tokenId: mint.tokenId || 1,
          name: mint.name || collection?.name || 'Unknown Collection',
          collectionName: collection?.name || mint.name,
          type: mint.type || collection?.type || 'ERC721',
          symbol: collection?.symbol || mint.symbol,
          artworkType: collection?.artworkType || mint.artworkType || 'image',
          network: collection?.network || mint.network || 'sepolia',
          value: mint.value || collection?.mintPrice || '0', // Use mint.value first
          paymentToken: mint.paymentToken || collection?.paymentToken || null
        };

        const tokenKey = `${baseEntry.collectionAddress}-${baseEntry.tokenId}`;
        
        if (!processedTokens.has(tokenKey)) {
          processedTokens.add(tokenKey);
          if (mint.type === 'ERC1155' && mint.balance > 1) {
            // For ERC1155 with balance > 1, create multiple entries
            for (let i = 0; i < mint.balance; i++) {
              ownedNFTs.push({
                ...baseEntry,
                balance: 1,
                uniqueId: `${tokenKey}-${i}`
              });
            }
          } else {
            // Single entry for ERC721 or ERC1155 with balance 1
            ownedNFTs.push({
              ...baseEntry,
              balance: mint.balance || 1,
              uniqueId: tokenKey
            });
          }
        }
      }
    }

    console.log('Final owned NFTs:', ownedNFTs);
    return ownedNFTs;
    
  } catch (error) {
    console.error('Error getting owned NFTs:', error);
    return [];
  }
};

// Pool Management Functions
export const savePool = async (poolData) => {
  try {
    console.log('Saving pool data:', poolData);
    const { poolAddress } = poolData;
    
    if (!poolAddress) {
      throw new Error('Pool address is required');
    }

    if (!poolData.creatorAddress) {
      throw new Error('Creator address is required');
    }

    // Validate token data before saving
    if (!poolData.token0?.address || !poolData.token1?.address) {
      throw new Error('Token addresses are required');
    }

    // Ensure all required fields are present
    const poolDataToSave = {
      poolAddress: poolAddress,
      creatorAddress: poolData.creatorAddress.toLowerCase(),
      factory: poolData.factory,
      token0: {
        address: poolData.token0.address,
        symbol: poolData.token0.symbol || 'Unknown',
        name: poolData.token0.name || 'Unknown Token',
        decimals: Number(poolData.token0.decimals || 18)
      },
      token1: {
        address: poolData.token1.address,
        symbol: poolData.token1.symbol || 'Unknown',
        name: poolData.token1.name || 'Unknown Token',
        decimals: Number(poolData.token1.decimals || 18)
      },
      reserves: poolData.reserves ? {
        reserve0: String(poolData.reserves.reserve0 || '0'),
        reserve1: String(poolData.reserves.reserve1 || '0')
      } : {
        reserve0: '0',
        reserve1: '0'
      },
      totalLiquidity: '0',
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };

    console.log('Saving pool data to Firestore:', poolDataToSave);
    const poolRef = doc(poolsRef, poolAddress);
    await setDoc(poolRef, poolDataToSave);
    console.log('Pool data saved successfully');

    // Create user pool entry
    const userPoolId = `${poolData.creatorAddress.toLowerCase()}_${poolAddress}`;
    const userPoolData = {
      userAddress: poolData.creatorAddress.toLowerCase(),
      poolAddress,
      lpTokenBalance: '0',
      token0Amount: '0',
      token1Amount: '0',
      lastUpdated: serverTimestamp()
    };

    console.log('Saving user pool data:', userPoolData);
    await setDoc(doc(userPoolsRef, userPoolId), userPoolData);
    console.log('User pool data saved successfully');

    return poolAddress;
  } catch (error) {
    console.error('Error saving pool:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const getPool = async (poolAddress) => {
  try {
    const poolDoc = await getDoc(doc(poolsRef, poolAddress));
    if (poolDoc.exists()) {
      return {
        id: poolDoc.id,
        ...poolDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting pool:', error);
    throw error;
  }
};

export const getUserPools = async (userAddress) => {
  try {
    console.log('Getting pools for user address:', userAddress.toLowerCase());
    
    // First check the pools collection directly for pools created by this user
    console.log('Checking pools collection for pools created by user...');
    const creatorQuery = query(
      poolsRef,
      where('creatorAddress', '==', userAddress.toLowerCase())
    );
    
    const creatorPoolsSnapshot = await getDocs(creatorQuery);
    console.log('Found creator pools:', creatorPoolsSnapshot.size);
    
    const pools = [];
    
    // Add pools where user is creator
    for (const doc of creatorPoolsSnapshot.docs) {
      const poolData = doc.data();
      console.log('Found creator pool:', poolData);
      pools.push({
        ...poolData,
        pairAddress: doc.id,
        source: 'firebase'
      });
    }

    // Then get user pool entries for additional pools where user has liquidity
    const userPoolsQuery = query(
      userPoolsRef,
      where('userAddress', '==', userAddress.toLowerCase())
    );
    
    console.log('Fetching user pools from userPools collection...');
    const userPoolsSnapshot = await getDocs(userPoolsQuery);
    console.log('Found user pool entries:', userPoolsSnapshot.size);
    
    // Add pools where user has liquidity
    for (const userPoolDoc of userPoolsSnapshot.docs) {
      const userPool = userPoolDoc.data();
      console.log('Processing user pool:', userPool);
      
      // Only add if not already in the list
      if (!pools.some(p => p.pairAddress.toLowerCase() === userPool.poolAddress.toLowerCase())) {
        try {
          console.log('Fetching pool data for address:', userPool.poolAddress);
          const poolDocRef = doc(poolsRef, userPool.poolAddress);
          const poolDoc = await getDoc(poolDocRef);
          
          if (poolDoc.exists()) {
            const poolData = poolDoc.data();
            console.log('Found pool data:', poolData);
            
            pools.push({
              ...poolData,
              pairAddress: userPool.poolAddress,
              userLiquidity: {
                lpTokenBalance: userPool.lpTokenBalance || '0',
                token0Amount: userPool.token0Amount || '0',
                token1Amount: userPool.token1Amount || '0'
              },
              source: 'firebase'
            });
          } else {
            console.log('No pool data found for address:', userPool.poolAddress);
          }
        } catch (poolError) {
          console.error('Error fetching pool data:', poolError);
        }
      }
    }
    
    console.log('Total pools found:', pools.length);
    console.log('Returning pools:', pools);
    return pools;
  } catch (error) {
    console.error('Error getting user pools:', error);
    throw error;
  }
};

export const updatePoolReserves = async (poolAddress, reserves) => {
  try {
    const poolRef = doc(poolsRef, poolAddress);
    await updateDoc(poolRef, {
      reserves,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating pool reserves:', error);
    throw error;
  }
};

export const updateUserPoolPosition = async (userAddress, poolAddress, position) => {
  try {
    const userPoolId = `${userAddress.toLowerCase()}_${poolAddress}`;
    await setDoc(doc(userPoolsRef, userPoolId), {
      userAddress: userAddress.toLowerCase(),
      poolAddress,
      ...position,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user pool position:', error);
    throw error;
  }
};
