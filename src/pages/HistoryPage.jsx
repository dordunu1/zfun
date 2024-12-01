import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
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

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
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

        // Load token deployments and get their details
        const tokenDeployments = await getTokenDeploymentsByWallet(address);
        console.log('Token deployments loaded:', tokenDeployments);
        
        // Create token details map first
        const tokenDetailsMap = tokenDeployments.reduce((acc, token) => {
          acc[token.address.toLowerCase()] = {
            name: token.name,
            symbol: token.symbol,
            logo: token.logo,
            decimals: token.decimals || 18
          };
          return acc;
        }, {});
        
        // Initialize token transfer tracking for all tokens
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log('Initializing transfer tracking for tokens:', tokenDeployments.map(t => t.address));
        await Promise.all(tokenDeployments.map(token => 
          trackTokenTransfers(token.address, provider).catch(error => 
            console.error(`Error tracking transfers for token ${token.address}:`, error)
          )
        ));
        console.log('Transfer tracking initialized for all tokens');
        
        // Load token transfers
        const tokenTransfers = await getTokenTransfersForAddress(address);
        console.log('Token transfers loaded:', tokenTransfers);
        
        const formattedTokenTransfers = await Promise.all(tokenTransfers.map(async tx => {
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
            network: 'sepolia',
            transactionHash: tx.transactionHash,
            amount: formattedAmount,
            tokenSymbol: tokenDetails.symbol,
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress
          };
        }));
        console.log('Formatted token transfers:', formattedTokenTransfers);

        const formattedTokenDeployments = tokenDeployments.map(token => ({
          id: token.address,
          activityType: 'token_creation',
          timestamp: token.createdAt,
          image: token.logo,
          title: `Created ${token.name}`,
          subtitle: 'Token Creation',
          address: token.address,
          network: token.chainName?.toLowerCase().includes('polygon') ? 'polygon' : 'sepolia'
        }));
        console.log('Formatted token deployments:', formattedTokenDeployments);

        // Get unique token addresses from both deployments and transfers
        const uniqueTokenAddresses = new Set([
          ...tokenDeployments.map(t => t.address.toLowerCase()),
          ...tokenTransfers.map(t => t.tokenAddress.toLowerCase())
        ]);
        
        // Fetch details for tokens that weren't deployed by this wallet
        const missingTokenAddresses = Array.from(uniqueTokenAddresses)
          .filter(address => !tokenDetailsMap[address]);

        await Promise.all(missingTokenAddresses.map(async (tokenAddress) => {
          try {
            const tokenDetails = await getTokenDetails(tokenAddress);
            if (tokenDetails) {
              tokenDetailsMap[tokenAddress] = {
                name: tokenDetails.name,
                symbol: tokenDetails.symbol,
                logo: tokenDetails.logo,
                decimals: tokenDetails.decimals || 18
              };
            }
          } catch (error) {
            console.error(`Error fetching details for token ${tokenAddress}:`, error);
          }
        }));

        console.log('Token details map created:', tokenDetailsMap);

        // Load NFT collections
        const nftCollections = await getCollectionsByWallet(address);
        console.log('NFT collections loaded:', nftCollections);

        // Initialize NFT transfer tracking
        await Promise.all(nftCollections.map(nft => 
          trackNFTTransfers(nft.contractAddress, nft.type, provider).catch(error => 
            console.error(`Error tracking transfers for NFT ${nft.contractAddress}:`, error)
          )
        ));
        console.log('NFT transfer tracking initialized');

        const formattedNFTDeployments = nftCollections.map(nft => ({
          id: nft.contractAddress,
          activityType: 'nft_creation',
          timestamp: nft.createdAt,
          image: nft.previewUrl,
          title: `Created ${nft.name}`,
          subtitle: 'Collection Creation',
          address: nft.contractAddress,
          network: nft.network,
          symbol: nft.symbol,
          artworkType: nft.artworkType
        }));

        // Load NFT transfers
        const nftTransfers = await getNFTTransfersForAddress(address);
        console.log('NFT transfers loaded:', nftTransfers);

        // Create a map of collection addresses to their details
        const collectionsMap = new Map();
        for (const nft of nftCollections) {
          collectionsMap.set(nft.contractAddress.toLowerCase(), nft);
        }

        // Load any missing collections for NFT transfers
        const missingCollections = nftTransfers
          .filter(tx => !collectionsMap.has(tx.contractAddress.toLowerCase()))
          .map(tx => tx.contractAddress.toLowerCase());
        
        const uniqueMissingCollections = [...new Set(missingCollections)];
        
        await Promise.all(uniqueMissingCollections.map(async (contractAddress) => {
          try {
            const collection = await getCollection(contractAddress);
            if (collection) {
              collectionsMap.set(contractAddress, collection);
            }
          } catch (error) {
            console.error(`Error loading collection ${contractAddress}:`, error);
          }
        }));

        const formattedNFTTransfers = nftTransfers.map(tx => {
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
            network: collection?.network || 'sepolia',
            symbol: collection?.symbol,
            artworkType: collection?.artworkType,
            tokenId: tx.tokenId,
            amount: tx.amount,
            transactionHash: tx.transactionHash
          };
        });

        // Load NFT mints
        const allCollections = await getAllCollections();
        console.log('All collections:', allCollections);

        const mintsPromises = allCollections.map(async (collection) => {
          console.log('Checking mints for collection:', collection.name);
          const mints = await getRecentMints(collection.contractAddress);
          console.log('Mints for collection:', collection.name, mints);
          
          return mints
            .filter(mint => mint.minterAddress?.toLowerCase() === address.toLowerCase())
            .map(mint => ({
              id: mint.id || `${collection.contractAddress}-${mint.tokenId}`,
              activityType: 'nft_mint',
              timestamp: mint.timestamp,
              image: mint.image || collection.previewUrl,
              title: `Minted ${collection.name}`,
              subtitle: `NFT Mint #${mint.tokenId}`,
              address: collection.contractAddress,
              network: collection.network,
              symbol: collection.symbol,
              artworkType: collection.artworkType
            }));
        });

        const allMints = (await Promise.all(mintsPromises)).flat();
        console.log('All mints for address:', allMints);

        // Combine and sort all activities
        const allActivities = [
          ...formattedTokenDeployments,
          ...formattedTokenTransfers,
          ...formattedNFTDeployments,
          ...formattedNFTTransfers,
          ...allMints,
        ].sort((a, b) => {
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

        console.log('Final activities:', allActivities);
        setActivities(allActivities);
        setLoading(false);
      } catch (error) {
        console.error('Error loading history:', error);
        setLoading(false);
      }
    };

    loadHistory();
  }, [address]);

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
                  on {activity.network === 'polygon' ? 'Polygon' : 'Sepolia'}
                </span>
              )}

              {/* Add transaction link */}
              {isTokenTransaction && activity.transactionHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${activity.transactionHash}`}
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