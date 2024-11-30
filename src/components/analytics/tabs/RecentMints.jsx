import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getRecentMints, subscribeToMints } from '../../../services/analytics';
import { useParams } from 'react-router-dom';
import { getCollection } from '../../../services/firebase';
import { ethers } from 'ethers';
import { ipfsToHttp } from '../../../utils/ipfs';

export default function RecentMints() {
  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { symbol } = useParams();
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const collectionData = await getCollection(symbol);
        setCollection(collectionData);
        
        if (collectionData?.contractAddress) {
          // Initial fetch
          const recentMints = await getRecentMints(collectionData.contractAddress);
          setMints(recentMints.map(mint => ({
            ...mint,
            artworkType: collectionData.artworkType // Add artwork type to each mint
          })));
          setLoading(false);

          // Subscribe to real-time updates
          const unsubscribe = subscribeToMints(collectionData.contractAddress, (updatedMints) => {
            console.log('Received mints update:', updatedMints);
            setMints(updatedMints.map(mint => ({
              ...mint,
              artworkType: collectionData.artworkType
            })));
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        setLoading(false);
      }
    };

    loadCollection();
  }, [symbol]);

  const formatValue = (value) => {
    try {
      return ethers.formatEther(
        typeof value === 'string' ? value : value.toString()
      );
    } catch (error) {
      console.error('Error formatting value:', error);
      return '0';
    }
  };

  const renderMedia = (mint) => {
    const imageUrl = ipfsToHttp(mint.image);

    if (mint.artworkType === 'video') {
      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black">
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
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black">
        <img
          src={imageUrl}
          alt="NFT"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png'; // Add a placeholder image in your public folder
          }}
        />
      </div>
    );
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!mints.length) {
    return <div className="text-gray-400">No mints yet</div>;
  }

  return (
    <div className="space-y-4">
      {mints.map((mint) => (
        <div 
          key={mint.id} 
          className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {renderMedia(mint)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {mint.quantity}x Token #{mint.tokenId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>by</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(mint.minterAddress);
                      toast.success('Address copied!');
                    }}
                    className="flex items-center gap-1 hover:text-[#00ffbd]"
                  >
                    {mint.minterAddress.slice(0, 6)}...{mint.minterAddress.slice(-4)}
                    <BiCopy size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[#00ffbd]">
                <FaEthereum />
                <span>{formatValue(mint.value)}</span>
              </div>
              <div className="text-sm text-gray-400">
                {mint.timestamp ? formatDistanceToNow(mint.timestamp, { addSuffix: true }) : 'Just now'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 