import React, { useState, useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getTokenDeploymentsByWallet, 
  getCollectionsByWallet, 
  getRecentMints, 
  getAllCollections,
  getCollection,
  getTokenDetails
} from '../services/firebase';
import { getTokenTransfersForAddress, trackTokenTransfers, getNFTTransfersForAddress, trackNFTTransfers } from '../services/tokenTransfers';
import { ipfsToHttp } from '../utils/ipfs';
import { ethers } from 'ethers';

// Memory cache for activities
const CACHE_DURATION = 30000; // 30 seconds
const activityCache = new Map();

// Helper function to get cached data
const getCachedActivities = (address, chainId) => {
  const cacheKey = `${address}-${chainId}`;
  const cachedData = activityCache.get(cacheKey);
  
  if (cachedData) {
    const { timestamp, data } = cachedData;
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Using cached activities');
      return data;
    }
    // Cache expired, remove it
    activityCache.delete(cacheKey);
  }
  
  // Check localStorage for backup cache
  const localCache = localStorage.getItem(cacheKey);
  if (localCache) {
    try {
      const { timestamp, data } = JSON.parse(localCache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using localStorage cached activities');
        return data;
      }
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error parsing localStorage cache:', error);
    }
  }
  
  return null;
};

// Helper function to cache activities
const cacheActivities = (address, chainId, activities) => {
  const cacheKey = `${address}-${chainId}`;
  const cacheData = {
    timestamp: Date.now(),
    data: activities
  };
  
  // Update memory cache
  activityCache.set(cacheKey, cacheData);
  
  // Update localStorage cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      if (!address) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Loading history for address:', address);

        // Check cache first
        const cachedActivities = getCachedActivities(address, chain?.id);
        if (cachedActivities) {
          setActivities(cachedActivities);
          setLoading(false);
          
          // Load fresh data in the background
          loadFreshData();
          return;
        }

        await loadFreshData();
      } catch (error) {
        console.error('Error loading history:', error);
        setLoading(false);
      }
    };

    const loadFreshData = async () => {
      try {
        // Load all data in parallel
        const [
          deployments, 
          transfers, 
          transferEvents,
          collections,
          allCollectionsData
        ] = await Promise.all([
          getTokenDeploymentsByWallet(address),
          getTokenTransfersForAddress(address),
          getNFTTransfersForAddress(address),
          getCollectionsByWallet(address),
          getAllCollections()
        ]);

        console.log('Token deployments loaded:', deployments);
        console.log('Token transfers loaded:', transfers);
        console.log('NFT transfers loaded:', transferEvents);
        
        // Create token details map first
        const tokenDetailsMap = deployments.reduce((acc, token) => {
          acc[token.address.toLowerCase()] = {
            name: token.name,
            symbol: token.symbol,
            logo: token.logo,
            decimals: token.decimals || 18
          };
          return acc;
        }, {});

        // Format token transfers
        const formattedTokenTransfers = await Promise.all(transfers.map(async tx => {
          // First check if token details exist in the map (for deployed tokens)
          let tokenDetails = tokenDetailsMap[tx.tokenAddress.toLowerCase()];
          
          // If not in map, fetch from Firebase (for non-deployed tokens)
          if (!tokenDetails) {
            const fetchedDetails = await getTokenDetails(tx.tokenAddress);
            if (fetchedDetails) {
              tokenDetails = {
                name: fetchedDetails.name,
                symbol: fetchedDetails.symbol,
                logo: fetchedDetails.logo,
                decimals: fetchedDetails.decimals || 18
              };
            }
          }

          // Fallback if still no details
          tokenDetails = tokenDetails || {
            name: 'Unknown Token',
            symbol: 'TOKEN',
            decimals: 18
          };
          
          const formattedAmount = ethers.formatUnits(tx.amount, tokenDetails.decimals);
          
          // Determine the network based on the transaction's chain ID or network field
          let network = 'sepolia'; // default
          if (tx.chainId === 1301 || tx.network === 'unichain') {
            network = 'unichain';
          } else if (tx.chainId === 137 || tx.network === 'polygon') {
            network = 'polygon';
          } else if (tx.chainId === 11155111 || tx.network === 'sepolia') {
            network = 'sepolia';
          }
          
          return {
            id: tx.transactionHash,
            activityType: 'token_transaction',
            timestamp: tx.timestamp,
            image: tokenDetails.logo,
            title: tx.type === 'sent' 
              ? `Sent ${formattedAmount} ${tokenDetails.symbol}`
              : `Received ${formattedAmount} ${tokenDetails.symbol}`,
            subtitle: tx.type === 'sent'
              ? `To ${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(-4)}`
              : `From ${tx.fromAddress.slice(0, 6)}...${tx.fromAddress.slice(-4)}`,
            address: tx.tokenAddress,
            network: network,
            transactionHash: tx.transactionHash,
            amount: formattedAmount,
            tokenSymbol: tokenDetails.symbol,
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            chainId: tx.chainId
          };
        }));

        // Format token deployments
        const formattedTokenDeployments = deployments.map(token => ({
          id: token.address,
          activityType: 'token_creation',
          timestamp: token.createdAt,
          image: token.logo,
          title: `Created ${token.name}`,
          subtitle: 'Token Creation',
          address: token.address,
          network: token.chainId === 1301 ? 'unichain' : token.chainName?.toLowerCase().includes('polygon') ? 'polygon' : 'sepolia',
          chainId: token.chainId
        }));

        // Get unique token addresses and fetch missing details
        const uniqueTokenAddresses = new Set([
          ...deployments.map(t => t.address.toLowerCase()),
          ...transfers.map(t => t.tokenAddress.toLowerCase())
        ]);

        // Create collections map
        const collectionsMap = new Map(
          collections.map(collection => [collection.contractAddress.toLowerCase(), collection])
        );

        // Format NFT transfers
        const formattedNFTTransfers = transferEvents.map(tx => {
          const collection = collectionsMap.get(tx.contractAddress.toLowerCase());
          return {
            id: `${tx.transactionHash}-${tx.tokenId}`,
            activityType: 'nft_transfer',
            timestamp: tx.timestamp,
            image: collection?.previewUrl || '/placeholder.png',
            title: tx.type === 'sent'
              ? `Sent ${collection?.name || 'NFT'} #${tx.tokenId}`
              : `Received ${collection?.name || 'NFT'} #${tx.tokenId}`,
            subtitle: tx.type === 'sent'
              ? `To ${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(-4)}`
              : `From ${tx.fromAddress.slice(0, 6)}...${tx.fromAddress.slice(-4)}`,
            address: tx.contractAddress,
            network: collection?.network || (chain?.id === 1301 ? 'unichain' : 'sepolia'),
            symbol: collection?.symbol,
            artworkType: collection?.artworkType,
            tokenId: tx.tokenId,
            amount: tx.amount,
            transactionHash: tx.transactionHash
          };
        });

        // Format NFT creations
        const formattedNFTCreations = collections.map(collection => ({
          id: collection.contractAddress,
          activityType: 'nft_creation',
          timestamp: collection.createdAt,
          image: collection.previewUrl,
          title: `Created ${collection.name}`,
          subtitle: 'NFT Collection',
          address: collection.contractAddress,
          network: collection.network,
          chainId: collection.chainId,
          symbol: collection.symbol
        }));

        // Process mints in parallel
        const allMints = (await Promise.all(
          allCollectionsData.map(async (collection) => {
            const mints = await getRecentMints(collection.contractAddress);
            return mints
              .filter(mint => mint.minterAddress?.toLowerCase() === address.toLowerCase())
              .flatMap(mint => {
                // Handle multiple mints in a single transaction
                const quantity = parseInt(mint.quantity || '1');
                if (quantity > 1) {
                  return Array(quantity).fill().map((_, index) => ({
                    id: `${mint.id || `${collection.contractAddress}-${mint.tokenId}`}-${index}`,
                    activityType: 'nft_mint',
                    timestamp: mint.timestamp,
                    image: mint.image || collection.previewUrl,
                    title: `Minted ${collection.name} #${parseInt(mint.tokenId) + index}`,
                    subtitle: `NFT Mint #${parseInt(mint.tokenId) + index}`,
                    address: collection.contractAddress,
                    network: collection.network,
                    symbol: collection.symbol,
                    artworkType: collection.artworkType,
                    transactionHash: mint.hash,
                    quantity: quantity,
                    tokenId: String(parseInt(mint.tokenId) + index)
                  }));
                }
                
                // Single mint
                return [{
                  id: mint.id || `${collection.contractAddress}-${mint.tokenId}`,
                  activityType: 'nft_mint',
                  timestamp: mint.timestamp,
                  image: mint.image || collection.previewUrl,
                  title: `Minted ${collection.name} #${mint.tokenId}`,
                  subtitle: `NFT Mint #${mint.tokenId}`,
                  address: collection.contractAddress,
                  network: collection.network,
                  symbol: collection.symbol,
                  artworkType: collection.artworkType,
                  transactionHash: mint.hash,
                  quantity: 1,
                  tokenId: mint.tokenId
                }];
              });
          })
        )).flat();

        // Filter and sort activities
        const currentNetwork = chain?.id === 1301 ? 'unichain' : chain?.id === 11155111 ? 'sepolia' : null;
        const uniqueTransactions = new Set();
        
        const filteredActivities = [
          ...formattedTokenDeployments,
          ...formattedTokenTransfers,
          ...formattedNFTTransfers,
          ...formattedNFTCreations,
          ...allMints,
        ]
        .filter(activity => {
          // If activity has chainId, use that for filtering
          if (activity.chainId) {
            return activity.chainId === chain?.id;
          }
          // Fallback to network name matching
          return activity.network === currentNetwork;
        })
        // Filter out duplicate transactions, but keep multiple mints from same transaction
        .filter(activity => {
          if (!activity.transactionHash) return true; // Keep activities without transactionHash
          
          // For NFT mints, create a unique key that includes the token ID
          const txKey = activity.activityType === 'nft_mint' 
            ? `${activity.transactionHash}-${activity.activityType}-${activity.tokenId}`
            : `${activity.transactionHash}-${activity.activityType}`;
          
          if (uniqueTransactions.has(txKey)) {
            console.log('Duplicate transaction found, skipping:', txKey);
            return false;
          }
          
          uniqueTransactions.add(txKey);
          return true;
        })
        .sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? 
            a.timestamp.getTime() : 
            typeof a.timestamp === 'number' ?
              a.timestamp :
              typeof a.timestamp === 'string' ? 
                new Date(a.timestamp).getTime() : 
                0;
          const timeB = b.timestamp instanceof Date ? 
            b.timestamp.getTime() : 
            typeof b.timestamp === 'number' ?
              b.timestamp :
              typeof b.timestamp === 'string' ? 
                new Date(b.timestamp).getTime() : 
                0;
          return timeB - timeA;
        });

        // Cache the results before setting state
        cacheActivities(address, chain?.id, filteredActivities);
        
        setActivities(filteredActivities);
        setLoading(false);
      } catch (error) {
        console.error('Error loading fresh data:', error);
        setLoading(false);
      }
    };

    loadHistory();
  }, [address, chain]);

  const renderMedia = (activity) => {
    const imageUrl = ipfsToHttp(activity.image);

    if (activity.artworkType === 'video') {
      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/5 dark:bg-black/20">
          <video
            src={imageUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      );
    }

    return (
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/5 dark:bg-black/20">
        <img
          src={imageUrl}
          alt={activity.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png';
          }}
        />
      </div>
    );
  };

  const getExplorerUrl = (network) => {
    switch (network) {
      case 'unichain':
        return 'https://unichain-sepolia.blockscout.com';
      case 'polygon':
        return 'https://polygonscan.com';
      default:
        return 'https://sepolia.etherscan.io';
    }
  };

  const renderActivityCard = (activity) => {
    // Parse the timestamp, handling all possible formats
    const getTimestamp = (timestamp) => {
      if (timestamp instanceof Date) return timestamp;
      if (typeof timestamp === 'number') return new Date(timestamp);
      if (timestamp?.seconds) return new Date(timestamp.seconds * 1000);
      if (typeof timestamp === 'string') return new Date(timestamp);
      return new Date();
    };

    const timestamp = getTimestamp(activity.timestamp);
    const isNFTActivity = activity.activityType === 'nft_creation' || activity.activityType === 'nft_mint';
    const isTokenTransaction = activity.activityType === 'token_transaction';

    // Get tag color based on activity type
    const getTagColor = () => {
      switch (activity.activityType) {
        case 'token_creation':
          return 'bg-purple-500/10 text-purple-500';
        case 'token_transaction':
          return 'bg-blue-500/10 text-blue-500';
        case 'nft_creation':
          return 'bg-pink-500/10 text-pink-500';
        case 'nft_mint':
          return 'bg-green-500/10 text-green-500';
        default:
          return 'bg-gray-500/10 text-gray-500';
      }
    };

    // Get tag text based on activity type
    const getTagText = () => {
      switch (activity.activityType) {
        case 'token_creation':
          return 'Token Creation';
        case 'token_transaction':
          return 'Token Transfer';
        case 'nft_creation':
          return 'NFT Collection';
        case 'nft_mint':
          return 'NFT Mint';
        default:
          return 'Transaction';
      }
    };

    return (
      <div 
        key={activity.id} 
        className="relative bg-white dark:bg-[#1a1b1f] rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:border-[#00ffbd] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {/* Image/Logo */}
          {renderMedia(activity)}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isNFTActivity ? (
                  <button
                    onClick={() => navigate(`/collection/${activity.symbol}`)}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-[#00ffbd] dark:hover:text-[#00ffbd] transition-colors truncate"
                  >
                    {activity.title}
                  </button>
                ) : (
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h3>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${getTagColor()}`}>
                  {getTagText()}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.subtitle}
              </span>
              
              {activity.network && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  on {activity.network === 'polygon' ? 'Polygon' : activity.network === 'unichain' ? 'Unichain' : 'Sepolia'}
                </span>
              )}

              {/* Add transaction link */}
              {activity.transactionHash && (
                <a
                  href={`${getExplorerUrl(activity.network)}/tx/${activity.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-[#00ffbd] transition-colors"
                >
                  <span>View Transaction</span>
                  <BiCopy 
                    size={12} 
                    className="ml-1 cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(activity.transactionHash);
                      toast.success('Transaction hash copied!');
                    }} 
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!address) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Connect your wallet to view history
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#00ffbd] rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#00ffbd] rounded-full opacity-30"></div>
          </div>
          <span className="text-gray-500 dark:text-gray-400">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Activity History
        </h1>

        {/* Main Container with L-shape corners and glowing dots */}
        <div className="relative">
          {/* L-shaped corners */}
          <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
            <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>

          {/* Glowing dots in corners */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

          {/* Three dots in top right */}
          <div className="absolute top-3 right-3 flex gap-1 z-20">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 rounded-xl">
            <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map(activity => renderActivityCard(activity))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No activity found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 