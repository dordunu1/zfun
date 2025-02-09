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

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
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
      
      return {
        ...querySnapshot.docs[0].data(),
        totalMinted: newTotalMinted
      };
    }
  } catch (error) {
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
    if (!deployment.chainId || !deployment.chainName) {
      throw new Error('chainId and chainName are required for token deployment');
    }

    await addDoc(tokenDeploymentsRef, {
      ...deployment,
      creatorAddress: walletAddress.toLowerCase(),
      createdAt: Date.now(),
      type: 'token',
      chainId: deployment.chainId,
      chainName: deployment.chainName
    });
  } catch (error) {
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
    return collections.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
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
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    return [];
  }
};

// Save mint data when NFT is minted
export const saveMintData = async (mintData) => {
  try {
    const { metadataUrl, ...sanitizedData } = mintData;

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

    if (!cleanData.collectionAddress || !cleanData.minterAddress) {
      throw new Error('Missing required fields in mint data');
    }

    const docRef = await addDoc(mintsRef, cleanData);

    const holderRef = query(
      holdersRef,
      where('collectionAddress', '==', cleanData.collectionAddress),
      where('holderAddress', '==', cleanData.minterAddress)
    );
    
    const holderSnapshot = await getDocs(holderRef);
    const quantity = Number(cleanData.quantity);

    if (holderSnapshot.empty) {
      await addDoc(holdersRef, {
        collectionAddress: cleanData.collectionAddress,
        holderAddress: cleanData.minterAddress,
        quantity: quantity,
        lastUpdated: serverTimestamp()
      });
    } else {
      const holderDoc = holderSnapshot.docs[0];
      const currentQuantity = Number(holderDoc.data().quantity) || 0;
      await updateDoc(holderDoc.ref, {
        quantity: currentQuantity + quantity,
        lastUpdated: serverTimestamp()
      });
    }

    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Subscribe to real-time mints
export const subscribeToMints = (collectionAddress, callback) => {
  if (!collectionAddress) {
    return () => {};
  }

  try {
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
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      callback(mints);
    }, (error) => {
      callback([]);
    });
  } catch (error) {
    callback([]);
    return () => {};
  }
};

export const getTokenDeploymentByAddress = async (address) => {
  try {
    const q = query(
      tokenDeploymentsRef, 
      where('address', '==', address)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
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
    return [];
  }
};

export const getTokenDetails = async (tokenAddress) => {
  try {
    return await getTokenDeploymentByAddress(tokenAddress);
  } catch (error) {
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
      const contract = new ethers.Contract(
        contractAddress,
        ['function balanceOf(address account, uint256 id) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address, 1);
      return Number(balance);
    } else {
      const contract = new ethers.Contract(
        contractAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address);
      return Number(balance);
    }
  } catch (error) {
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
    return 0;
  }
};

export const getOwnedNFTs = async (address) => {
  try {
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

    const collectionsSnapshot = await getDocs(collection(db, 'collections'));
    const collections = new Map();
    
    collectionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.contractAddress) {
        collections.set(data.contractAddress.toLowerCase(), data);
      }
    });

    const ownedNFTs = [];
    const processedTokens = new Set();
    
    for (const mint of mints) {
      const collection = collections.get(mint.collectionAddress?.toLowerCase());
      
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
          value: mint.value || collection?.mintPrice || '0',
          paymentToken: mint.paymentToken || collection?.paymentToken || null
        };

        const tokenKey = `${baseEntry.collectionAddress}-${baseEntry.tokenId}`;
        
        if (!processedTokens.has(tokenKey)) {
          processedTokens.add(tokenKey);
          if (mint.type === 'ERC1155' && mint.balance > 1) {
            for (let i = 0; i < mint.balance; i++) {
              ownedNFTs.push({
                ...baseEntry,
                balance: 1,
                uniqueId: `${tokenKey}-${i}`
              });
            }
          } else {
            ownedNFTs.push({
              ...baseEntry,
              balance: mint.balance || 1,
              uniqueId: tokenKey
            });
          }
        }
      }
    }

    return ownedNFTs;
  } catch (error) {
    return [];
  }
};

// Pool Management Functions
export const savePool = async (poolData) => {
  try {
    const { poolAddress } = poolData;
    
    if (!poolAddress) {
      throw new Error('Pool address is required');
    }

    if (!poolData.creatorAddress) {
      throw new Error('Creator address is required');
    }

    if (!poolData.token0?.address || !poolData.token1?.address) {
      throw new Error('Token addresses are required');
    }

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

    const poolRef = doc(poolsRef, poolAddress);
    await setDoc(poolRef, poolDataToSave);

    const userPoolId = `${poolData.creatorAddress.toLowerCase()}_${poolAddress}`;
    const userPoolData = {
      userAddress: poolData.creatorAddress.toLowerCase(),
      poolAddress,
      lpTokenBalance: '0',
      token0Amount: '0',
      token1Amount: '0',
      lastUpdated: serverTimestamp()
    };

    await setDoc(doc(userPoolsRef, userPoolId), userPoolData);

    return poolAddress;
  } catch (error) {
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
    throw error;
  }
};

export const getUserPools = async (userAddress) => {
  try {
    const creatorQuery = query(
      poolsRef,
      where('creatorAddress', '==', userAddress.toLowerCase())
    );
    
    const creatorPoolsSnapshot = await getDocs(creatorQuery);
    const pools = [];
    
    for (const doc of creatorPoolsSnapshot.docs) {
      const poolData = doc.data();
      pools.push({
        ...poolData,
        pairAddress: doc.id,
        source: 'firebase'
      });
    }

    const userPoolsQuery = query(
      userPoolsRef,
      where('userAddress', '==', userAddress.toLowerCase())
    );
    
    const userPoolsSnapshot = await getDocs(userPoolsQuery);
    
    for (const userPoolDoc of userPoolsSnapshot.docs) {
      const userPool = userPoolDoc.data();
      
      if (!pools.some(p => p.pairAddress.toLowerCase() === userPool.poolAddress.toLowerCase())) {
        try {
          const poolDocRef = doc(poolsRef, userPool.poolAddress);
          const poolDoc = await getDoc(poolDocRef);
          
          if (poolDoc.exists()) {
            const poolData = poolDoc.data();
            
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
          }
        } catch (poolError) {
          // Silent fail for individual pool errors
        }
      }
    }
    
    return pools;
  } catch (error) {
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
    throw error;
  }
};

export const getAllTokenDeployments = async () => {
  try {
    const q = query(
      tokenDeploymentsRef,
      where('type', '==', 'token'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    return [];
  }
};
