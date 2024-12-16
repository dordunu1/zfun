import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getRecentMints, subscribeToMints } from '../../../services/analytics';
import { useParams } from 'react-router-dom';
import { getCollection, getTokenDeploymentByAddress } from '../../../services/firebase';
import { ethers } from 'ethers';
import { ipfsToHttp } from '../../../utils/ipfs';

export default function RecentMints() {
  const [mints, setMints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { symbol } = useParams();
  const [collection, setCollection] = useState(null);
  const [tokenLogos, setTokenLogos] = useState({});
  const [displayLimit, setDisplayLimit] = useState(50);
  const loaderRef = useRef(null);

  // Intersection Observer callback
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loadingMore && hasMore) {
      handleLoadMore();
    }
  }, [loadingMore, hasMore]);

  // Set up the intersection observer
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        const collectionData = await getCollection(symbol);
        console.log('Collection Data:', collectionData);
        setCollection(collectionData);
        
        if (collectionData?.contractAddress) {
          // Initial fetch
          const recentMints = await getRecentMints(collectionData.contractAddress, displayLimit);
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
            setMints(prevMints => {
              // Merge new mints with existing ones, avoiding duplicates
              const existingIds = new Set(prevMints.map(m => m.id));
              const newMints = updatedMints.filter(m => !existingIds.has(m.id));
              return [...newMints, ...prevMints].slice(0, displayLimit);
            });
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        setLoading(false);
      }
    };

    loadCollection();
  }, [symbol, displayLimit]);

  const handleLoadMore = async () => {
    if (!collection?.contractAddress || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const newLimit = displayLimit + 50;
      const moreMints = await getRecentMints(collection.contractAddress, newLimit);
      
      if (moreMints.length === mints.length) {
        setHasMore(false);
      } else {
        setMints(moreMints.map(mint => ({
          ...mint,
          artworkType: collection.artworkType,
          tokenName: collection.name,
          tokenId: mint.tokenId
        })));
        setDisplayLimit(newLimit);
      }
    } catch (error) {
      console.error('Error loading more mints:', error);
      toast.error('Failed to load more mints');
    } finally {
      setLoadingMore(false);
    }
  };

  const formatValue = (value) => {
    try {
      if (!value) return '0';
      
      // For custom tokens, we don't need to convert from Wei
      if (collection?.mintToken?.type === 'custom' || 
          collection?.mintToken?.type === 'usdc' || 
          collection?.mintToken?.type === 'usdt') {
        return parseFloat(value).toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 0
        });
      }
      
      // For native tokens (ETH/MATIC), convert from Wei
      let valueInWei;
      if (typeof value === 'string') {
        const cleanValue = value.replace(/,/g, '');
        try {
          valueInWei = ethers.parseUnits(cleanValue, 'wei');
        } catch {
          valueInWei = ethers.parseEther(cleanValue);
        }
      } else {
        valueInWei = BigInt(value.toString());
      }

      const ethValue = ethers.formatEther(valueInWei);
      const floatValue = parseFloat(ethValue);

      if (isNaN(floatValue)) return '0';
      
      return floatValue.toLocaleString('en-US', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error formatting value:', error, typeof value, value);
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
            e.target.src = '/placeholder.png';
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
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }
    
    return <FaEthereum className="w-6 h-6 text-[#00ffbd]" />;
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!mints.length) {
    return <div className="text-gray-400">No mints yet</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
      <div className="space-y-4">
        <div 
          className="overflow-y-auto" 
          style={{ 
            height: '600px',
            paddingRight: '8px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#00ffbd transparent',
            marginBottom: '-16px'
          }}
          css={`
            &::-webkit-scrollbar {
              width: 4px;
            }
            &::-webkit-scrollbar-track {
              background: transparent;
            }
            &::-webkit-scrollbar-thumb {
              background-color: #00ffbd;
              border-radius: 20px;
            }
          `}
        >
          {mints.map((mint) => (
            <div 
              key={mint.id} 
              className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800 min-h-[100px] hover:border-[#00ffbd] transition-colors duration-200 mb-4 last:mb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {renderMedia(mint)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 dark:text-white font-medium">
                        {mint.quantity}x {mint.tokenName || 'Token'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>by</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(mint.minterAddress);
                            toast.success('Address copied!');
                          }}
                          className="flex items-center gap-1 hover:text-[#00ffbd] transition-colors"
                        >
                          {mint.minterAddress.slice(0, 6)}...{mint.minterAddress.slice(-4)}
                          <BiCopy size={14} />
                        </button>
                      </div>
                      {renderTokenInfo(mint)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-[#00ffbd]">
                    {renderCurrencyLogo()}
                    <span className="font-medium">{formatValue(mint.value)}</span>
                  </div>
                  {renderTimeWithHash(mint)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Hidden loader for infinite scroll */}
          <div 
            ref={loaderRef}
            className="h-0 opacity-0"
            aria-hidden="true"
          />

          {/* Loading Spinner - Moved inside the scroll container */}
          {loadingMore && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 