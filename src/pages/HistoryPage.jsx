import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { motion } from 'framer-motion';
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
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getExplorerUrl as getExplorerUrlFromUtils } from '../utils/explorer';

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
      return data;
    }
    activityCache.delete(cacheKey);
  }
  
  // Check localStorage for backup cache
  const localCache = localStorage.getItem(cacheKey);
  if (localCache) {
    try {
      const { timestamp, data } = JSON.parse(localCache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
      localStorage.removeItem(cacheKey);
    } catch (error) {
      localStorage.removeItem(cacheKey);
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

// Add animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  show: { 
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      bounce: 0.3
    }
  }
};

export default function HistoryPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [activities, setActivities] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const closeTimeoutRef = useRef(null);
  const { openConnectModal } = useConnectModal();
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  // Add NetworkFilter component
  const NetworkFilter = () => {
    const networks = [
      { id: 'all', label: 'All Networks' },
      { id: 'sepolia', label: 'Sepolia' },
      { id: 'unichain-mainnet', label: 'Unichain Mainnet' },
      { id: 'unichain', label: 'Unichain Testnet' },
      { id: 'polygon', label: 'Polygon' },
      { id: 'moonwalker', label: 'Moonwalker' }
    ];

    const networkCounts = {
      all: activities.length,
      sepolia: activities.filter(a => a.network === 'sepolia' || a.chainId === 11155111).length,
      'unichain-mainnet': activities.filter(a => a.network === 'unichain-mainnet' || a.chainId === 130).length,
      unichain: activities.filter(a => a.network === 'unichain' || a.chainId === 1301).length,
      polygon: activities.filter(a => a.network === 'polygon' || a.chainId === 137).length,
      moonwalker: activities.filter(a => a.network === 'moonwalker' || a.chainId === 1828369849).length
    };

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
          className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none min-w-[160px] flex items-center justify-between"
        >
          <span>{networks.find(n => n.id === selectedNetwork)?.label} ({networkCounts[selectedNetwork]})</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${networkDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {networkDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1a1b1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            {networks.map(network => (
              <button
                key={network.id}
                onClick={() => {
                  setSelectedNetwork(network.id);
                  setNetworkDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150 ${
                  selectedNetwork === network.id ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                }`}
              >
                {network.label} ({networkCounts[network.id]})
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Update the filtering logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (selectedNetwork === 'all') return true;
      return activity.network === selectedNetwork || 
             (selectedNetwork === 'sepolia' && activity.chainId === 11155111) ||
             (selectedNetwork === 'unichain-mainnet' && activity.chainId === 130) ||
             (selectedNetwork === 'unichain' && activity.chainId === 1301) ||
             (selectedNetwork === 'polygon' && activity.chainId === 137) ||
             (selectedNetwork === 'moonwalker' && activity.chainId === 1828369849);
    });
  }, [activities, selectedNetwork]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!account) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        // Check cache first
        const cachedActivities = getCachedActivities(account, chain?.id);
        if (cachedActivities) {
          setActivities(cachedActivities);
          setLoading(false);
          
          // Load fresh data in the background
          loadFreshData();
          return;
        }

        await loadFreshData();
      } catch (error) {
        setLoading(false);
        toast.error('Error loading history');
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
          getTokenDeploymentsByWallet(account),
          getTokenTransfersForAddress(account),
          getNFTTransfersForAddress(account),
          getCollectionsByWallet(account),
          getAllCollections()
        ]);

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
          let tokenDetails = tokenDetailsMap[tx.tokenAddress.toLowerCase()];
          
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

          tokenDetails = tokenDetails || {
            name: 'Unknown Token',
            symbol: 'TOKEN',
            decimals: 18
          };
          
          const formattedAmount = ethers.formatUnits(tx.amount, tokenDetails.decimals);
          
          // Determine the network based on chainId first, then fallback to network field
          let network = 'sepolia';
          let chainId = tx.chainId;
          
          if (chainId === 137 || tx.network === 'polygon') {
            network = 'polygon';
            chainId = 137;
          } else if (chainId === 130 || tx.network === 'unichain-mainnet') {
            network = 'unichain-mainnet';
            chainId = 130;
          } else if (chainId === 1301 || tx.network === 'unichain') {
            network = 'unichain';
            chainId = 1301;
          } else if (chainId === 1828369849 || tx.network === 'moonwalker') {
            network = 'moonwalker';
            chainId = 1828369849;
          } else if (chainId === 11155111 || tx.network === 'sepolia') {
            network = 'sepolia';
            chainId = 11155111;
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
            network,
            chainId,
            transactionHash: tx.transactionHash,
            amount: formattedAmount,
            tokenSymbol: tokenDetails.symbol,
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress
          };
        }));

        // Format token deployments
        const formattedTokenDeployments = deployments.map(token => {
          // Determine network and chainId based on token data
          let network = 'sepolia';
          let chainId = token.chainId;

          if (chainId === 137 || token.chainName?.toLowerCase().includes('polygon')) {
            network = 'polygon';
            chainId = 137;
          } else if (chainId === 130) {
            network = 'unichain-mainnet';
            chainId = 130;
          } else if (chainId === 1301) {
            network = 'unichain';
            chainId = 1301;
          } else if (chainId === 1828369849) {
            network = 'moonwalker';
            chainId = 1828369849;
          } else if (chainId === 11155111) {
            network = 'sepolia';
            chainId = 11155111;
          }

          return {
            id: token.address,
            activityType: 'token_creation',
            timestamp: token.createdAt,
            image: token.logo,
            title: `Created ${token.name}`,
            subtitle: 'Token Creation',
            address: token.address,
            network,
            chainId
          };
        });

        // Get unique token addresses and fetch missing details
        const uniqueTokenAddresses = new Set([
          ...deployments.map(t => t.address.toLowerCase()),
          ...transfers.map(t => t.tokenAddress.toLowerCase())
        ]);

        // Create collections map
        const collectionsMap = new Map(
          collections.map(collection => [collection.contractAddress.toLowerCase(), collection])
        );

        // Format NFT transfers with proper network identification
        const formattedNFTTransfers = transferEvents.map(tx => {
          const collection = collectionsMap.get(tx.contractAddress.toLowerCase());
          let network = collection?.network || 'sepolia';
          let chainId = collection?.chainId;

          // Determine network and chainId based on collection or transaction data
          if (collection?.chainId === 137 || tx.chainId === 137) {
            network = 'polygon';
            chainId = 137;
          } else if (collection?.chainId === 130 || tx.chainId === 130) {
            network = 'unichain-mainnet';
            chainId = 130;
          } else if (collection?.chainId === 1301 || tx.chainId === 1301) {
            network = 'unichain';
            chainId = 1301;
          } else if (collection?.chainId === 1828369849 || tx.chainId === 1828369849) {
            network = 'moonwalker';
            chainId = 1828369849;
          } else if (collection?.chainId === 11155111 || tx.chainId === 11155111) {
            network = 'sepolia';
            chainId = 11155111;
          }

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
            network,
            chainId,
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
              .filter(mint => mint.minterAddress?.toLowerCase() === account.toLowerCase())
              .flatMap(mint => {
                // Determine network and chainId based on collection data
                let network = collection.network || 'sepolia';
                let chainId = collection.chainId;

                if (chainId === 137 || network === 'polygon') {
                  network = 'polygon';
                  chainId = 137;
                } else if (chainId === 130 || network === 'unichain-mainnet') {
                  network = 'unichain-mainnet';
                  chainId = 130;
                } else if (chainId === 1301 || network === 'unichain') {
                  network = 'unichain';
                  chainId = 1301;
                } else if (chainId === 1828369849 || network === 'moonwalker') {
                  network = 'moonwalker';
                  chainId = 1828369849;
                } else if (chainId === 11155111 || network === 'sepolia') {
                  network = 'sepolia';
                  chainId = 11155111;
                }

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
                    network,
                    chainId,
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
                  network,
                  chainId,
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
        const uniqueTransactions = new Set();
        
        const filteredActivities = [
          ...formattedTokenDeployments,
          ...formattedTokenTransfers,
          ...formattedNFTTransfers,
          ...formattedNFTCreations,
          ...allMints,
        ]
        // Only filter out duplicates, don't filter by network
        .filter(activity => {
          if (!activity.transactionHash) return true; // Keep activities without transactionHash
          
          // For NFT mints, create a unique key that includes the token ID
          const txKey = activity.activityType === 'nft_mint' 
            ? `${activity.transactionHash}-${activity.activityType}-${activity.tokenId}`
            : `${activity.transactionHash}-${activity.activityType}`;
          
          if (uniqueTransactions.has(txKey)) {
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
        cacheActivities(account, chain?.id, filteredActivities);
        
        setActivities(filteredActivities);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error('Error loading activity data');
      }
    };

    loadHistory();
  }, [account, chain]);

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

  const getExplorerUrl = (network, chainId) => {
    // Convert network name to chainId if not provided
    const resolvedChainId = chainId || (
      network === 'unichain-mainnet' ? 130 :
      network === 'unichain' ? 1301 :
      network === 'polygon' ? 137 :
      network === 'moonwalker' ? 1828369849 :
      11155111 // Sepolia as default
    );

    // Return the appropriate explorer URL based on chainId
    switch (resolvedChainId) {
      case 130:
        return 'https://mainnet.uniscan.org';
      case 1301:
        return 'https://testnet.uniscan.org';
      case 137:
        return 'https://polygonscan.com';
      case 1828369849:
        return 'https://moonwalker-blockscout.eu-north-2.gateway.fm';
      default:
        return 'https://sepolia.etherscan.io';
    }
  };

  const getNetworkDisplayName = (network, chainId) => {
    // First check chainId as it's more reliable
    if (chainId) {
      switch (chainId) {
        case 130:
          return 'Unichain Mainnet';
        case 1301:
          return 'Unichain Testnet';
        case 137:
          return 'Polygon';
        case 1828369849:
          return 'Moonwalker';
        case 11155111:
          return 'Sepolia';
        default:
          return 'Unknown Network';
      }
    }

    // Fallback to network name if chainId not available
    switch (network) {
      case 'unichain-mainnet':
        return 'Unichain Mainnet';
      case 'unichain':
        return 'Unichain Testnet';
      case 'polygon':
        return 'Polygon';
      case 'moonwalker':
        return 'Moonwalker';
      default:
        return 'Sepolia';
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
      <motion.div 
        key={activity.id}
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        className="relative bg-white dark:bg-[#1a1b1f] rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:border-[#00ffbd] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {/* Image/Logo with fade in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderMedia(activity)}
          </motion.div>

          {/* Content with slide in */}
          <motion.div 
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
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
                  on {getNetworkDisplayName(activity.network, activity.chainId)}
                </span>
              )}

              {/* Add transaction link */}
              {activity.transactionHash && (
                <a
                  href={getExplorerUrlFromUtils(activity.chainId, 'tx', activity.transactionHash)}
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
          </motion.div>
        </div>
      </motion.div>
    );
  };

  if (!isConnected) {
    return (
      <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 rounded-xl">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 mb-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#00ffbd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9l-6 6m0-6l6 6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
            Please connect your wallet to view your activity history. You'll be able to see all your transactions, token transfers, and NFT activities.
          </p>
          <button
            onClick={openConnectModal}
            className="px-6 py-3 bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] flex items-center justify-center"
      >
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#00ffbd] rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#00ffbd] rounded-full opacity-30"></div>
          </div>
          <span className="text-gray-500 dark:text-gray-400">Loading history...</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#0a0b0f] pt-20 px-8 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full overflow-hidden">
        <div className="flex items-center justify-between mb-12 sticky top-4 z-[120]">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Activity History
          </motion.h1>
          <NetworkFilter />
        </div>
        
        {/* Main Container with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mt-8 h-[calc(100%-6rem)] overflow-hidden"
        >
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
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 rounded-xl h-full overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {filteredActivities.length > 0 ? (
                  filteredActivities.map(activity => renderActivityCard(activity))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-gray-500 dark:text-gray-400"
                  >
                    No activity found
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 