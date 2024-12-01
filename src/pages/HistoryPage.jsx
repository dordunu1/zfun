import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getTokenDeploymentsByWallet, getCollectionsByWallet, getRecentMints } from '../services/firebase';
import { ipfsToHttp } from '../utils/ipfs';

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const loadHistory = async () => {
      if (!address) {
        setActivities([]);
        setLoading(false);
        return;
      }

      try {
        // Load token deployments
        const tokenDeployments = await getTokenDeploymentsByWallet(address);
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

        // Load NFT collections
        const nftCollections = await getCollectionsByWallet(address);
        const formattedNFTDeployments = nftCollections.map(nft => ({
          id: nft.contractAddress,
          activityType: 'nft_creation',
          timestamp: nft.createdAt,
          image: nft.previewUrl,
          title: `Created ${nft.name}`,
          subtitle: 'Collection Creation',
          address: nft.contractAddress,
          network: nft.network
        }));

        // Load NFT mints for each collection
        const mintsPromises = nftCollections.map(async (collection) => {
          const mints = await getRecentMints(collection.contractAddress);
          return mints.map(mint => ({
            id: mint.id || `${collection.contractAddress}-${mint.tokenId}`,
            activityType: 'nft_mint',
            timestamp: mint.timestamp,
            image: mint.image || collection.previewUrl,
            title: `Minted ${collection.name}`,
            subtitle: `NFT Mint #${mint.tokenId}`,
            address: collection.contractAddress,
            network: collection.network
          }));
        });

        const allMints = (await Promise.all(mintsPromises)).flat();

        // Combine and sort all activities
        const allActivities = [
          ...formattedTokenDeployments,
          ...formattedNFTDeployments,
          ...allMints,
        ].sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeB - timeA;
        });

        setActivities(allActivities);
        setLoading(false);
      } catch (error) {
        console.error('Error loading history:', error);
        setLoading(false);
      }
    };

    loadHistory();
  }, [address]);

  const renderActivityCard = (activity) => {
    const imageUrl = ipfsToHttp(activity.image);
    const timestamp = activity.timestamp instanceof Date ? activity.timestamp : new Date(activity.timestamp);

    return (
      <div 
        key={activity.id} 
        className="relative bg-white dark:bg-[#1a1b1f] rounded-xl p-3 border border-gray-100 dark:border-gray-800 hover:border-[#00ffbd] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {/* Image/Logo */}
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.title}
              </h3>
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
            </div>

            {/* Contract Address */}
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activity.address);
                  toast.success('Address copied!');
                }}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-[#00ffbd] transition-colors"
              >
                {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
                <BiCopy size={12} />
              </button>
            </div>
          </div>

          {/* Activity Type Badge */}
          <div className="px-2 py-1 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {activity.activityType === 'token_creation' ? 'Token' : 
             activity.activityType === 'nft_creation' ? 'NFT' : 'Mint'}
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
      <div className="p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading history...
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