import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy, BiX } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getRecentMints, subscribeToMints } from '../../../services/analytics';
import { useParams } from 'react-router-dom';
import { getCollection, getTokenDeploymentByAddress } from '../../../services/firebase';
import { ethers } from 'ethers';
import { ipfsToHttp } from '../../../utils/ipfs';

export default function RecentMints() {
  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { symbol } = useParams();
  const [collection, setCollection] = useState(null);
  const [tokenLogos, setTokenLogos] = useState({});  // Cache for token logos

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const collectionData = await getCollection(symbol);
        console.log('Collection Data:', collectionData);
        setCollection(collectionData);
        
        if (collectionData?.contractAddress) {
          // Initial fetch
          const recentMints = await getRecentMints(collectionData.contractAddress);
          console.log('Recent mints data:', recentMints);

          // Get token deployment data for the payment token
          if (collectionData.mintToken?.address) {
            const tokenAddress = collectionData.mintToken.address;
            console.log('Looking for token deployment:', {
              address: tokenAddress
            });
            
            const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
            console.log('Token Deployment Result:', tokenDeployment);
            
            if (tokenDeployment?.logo) {
              setTokenLogos(prev => ({
                ...prev,
                [tokenAddress]: tokenDeployment.logo
              }));
            }
          }

          setMints(recentMints.map(mint => ({
            ...mint,
            artworkType: collectionData.artworkType,
            tokenName: collectionData.name,
            tokenId: mint.tokenId
          })));
          setLoading(false);

          // Subscribe to real-time updates
          const unsubscribe = subscribeToMints(collectionData.contractAddress, (updatedMints) => {
            console.log('Subscription update - mints:', updatedMints);
            setMints(updatedMints.map(mint => ({
              ...mint,
              artworkType: collectionData.artworkType,
              tokenName: collectionData.name,
              tokenId: mint.tokenId
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

  const renderTokenInfo = (mint) => {
    console.log('Rendering token info for mint:', mint);
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <a
          href={`${mint.network === 'polygon' ? 'https://polygonscan.com' : 'https://sepolia.etherscan.io'}/token/${mint.collectionAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00ffbd] transition-colors"
        >
          token id
        </a>
      </div>
    );
  };

  const renderTimeWithHash = (mint) => {
    return (
      <div className="text-sm text-gray-400">
        <a
          href={`${mint.network === 'polygon' ? 'https://polygonscan.com' : 'https://sepolia.etherscan.io'}/tx/${mint.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00ffbd] transition-colors"
        >
          {mint.timestamp ? formatDistanceToNow(mint.timestamp, { addSuffix: true }) : 'Just now'}
        </a>
      </div>
    );
  };

  // Add this new function to render the currency logo
  const renderCurrencyLogo = () => {
    const tokenAddress = collection?.mintToken?.address;
    const logoUrl = tokenLogos[tokenAddress];
    
    console.log('Currency Logo Render:', {
      tokenAddress,
      hasLogo: Boolean(logoUrl),
      logoUrl
    });

    if (tokenAddress && logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Token"
          className="w-4 h-4 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }
    
    return <FaEthereum className="w-4 h-4" />;
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!mints.length) {
    return <div className="text-gray-400">No mints yet</div>;
  }

  return (
    <div className="h-[400px] md:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-4">
        {mints.map((mint) => (
          <div 
            key={mint.id} 
            className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800 min-h-[100px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderMedia(mint)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {mint.quantity}x {mint.tokenName || 'Token'}
                    </span>
                  </div>
                  <div className="flex flex-col">
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
                    {renderTokenInfo(mint)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {renderCurrencyLogo()}
                  <span>{formatValue(mint.value)}</span>
                </div>
                {renderTimeWithHash(mint)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 