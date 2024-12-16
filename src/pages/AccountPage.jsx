import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { getOwnedNFTs } from '../services/firebase';
import { ipfsToHttp } from '../utils/ipfs';
import { FaEthereum } from 'react-icons/fa';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function AccountPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [tokenLogos, setTokenLogos] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
  });

  // Function to get token details from Firebase
  const getTokenDetails = async (tokenAddress) => {
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      return { symbol: 'ETH', logo: null };
    }

    try {
      const tokenQuery = query(
        collection(db, 'tokenDeployments'),
        where('address', '==', tokenAddress.toLowerCase())
      );
      const tokenSnapshot = await getDocs(tokenQuery);
      
      if (!tokenSnapshot.empty) {
        const tokenData = tokenSnapshot.docs[0].data();
        return {
          symbol: tokenData.symbol || 'Unknown',
          logo: tokenData.logo || null
        };
      }
      return { symbol: 'ETH', logo: null };
    } catch (error) {
      console.error('Error getting token details:', error);
      return { symbol: 'ETH', logo: null };
    }
  };

  useEffect(() => {
    const loadNFTs = async () => {
      if (!address) {
        setNfts([]);
        setLoading(false);
        return;
      }

      try {
        const ownedNFTs = await getOwnedNFTs(address);
        // Filter NFTs based on current chain
        const filteredNFTs = ownedNFTs.filter(nft => {
          if (chain?.id === 11155111) { // Sepolia
            return nft.network === 'sepolia';
          }
          return false;
        });

        // Get token logos for each NFT's minting token
        const logos = {};
        await Promise.all(
          filteredNFTs.map(async (nft) => {
            if (nft.mintToken?.address) {
              const tokenDetails = await getTokenDetails(nft.mintToken.address);
              if (tokenDetails.logo) {
                logos[nft.mintToken.address] = tokenDetails.logo;
              }
            }
          })
        );
        setTokenLogos(logos);
        setNfts(filteredNFTs);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [address, chain]);

  const formatMintPrice = (price, nft) => {
    if (!price) return '0';
    try {
      // For custom tokens, we don't need to convert from Wei
      if (nft?.mintToken?.type === 'custom' || 
          nft?.mintToken?.type === 'usdc' || 
          nft?.mintToken?.type === 'usdt') {
        return parseFloat(price).toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 0
        });
      }

      // For native tokens (ETH/MATIC), convert from Wei
      let valueInWei;
      if (typeof price === 'string') {
        const cleanValue = price.replace(/,/g, '');
        try {
          valueInWei = ethers.parseUnits(cleanValue, 'wei');
        } catch {
          valueInWei = ethers.parseEther(cleanValue);
        }
      } else {
        valueInWei = BigInt(price.toString());
      }

      const ethValue = ethers.formatEther(valueInWei);
      const floatValue = parseFloat(ethValue);

      if (isNaN(floatValue)) return '0';
      
      return floatValue.toLocaleString('en-US', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error formatting price:', error);
      return price?.toString() || '0';
    }
  };

  // Filter NFTs based on type
  const filteredNFTs = useMemo(() => {
    return nfts.filter(nft => {
      if (filters.type !== 'all' && nft.type !== filters.type) return false;
      return true;
    });
  }, [nfts, filters]);

  // Filter controls UI
  const FilterControls = () => {
    const typeCount = {
      all: nfts.length,
      ERC721: nfts.filter(nft => nft.type === 'ERC721').length,
      ERC1155: nfts.filter(nft => nft.type === 'ERC1155').length
    };

    return (
      <div className="flex gap-4 mb-6">
        <select
          value={filters.type}
          onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
          className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
        >
          <option value="all">All Types ({typeCount.all})</option>
          <option value="ERC721">ERC721 ({typeCount.ERC721})</option>
          <option value="ERC1155">ERC1155 ({typeCount.ERC1155})</option>
        </select>
      </div>
    );
  };

  const renderNFTCard = (nft) => {
    const imageUrl = ipfsToHttp(nft.image || nft.previewUrl);
    const displayName = nft.name?.replace(/ #0$/, '');

    return (
      <div key={`${nft.contractAddress}-${nft.tokenId}`} className="block">
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
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] h-[340px]">
            {/* Image section */}
            <div className="relative h-[180px] w-full overflow-hidden">
              <div className="absolute inset-0">
                {nft.artworkType === 'video' ? (
                  <video 
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.png';
                    }}
                  />
                )}
              </div>

              {/* Type badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-[#0d0e12]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                  {nft.type || 'ERC721'}
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-1 p-4">
              <div className="mb-3">
                <div className="flex items-center justify-between gap-2 mb-1 w-full">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate flex-shrink min-w-0">
                    {displayName}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Minted:</span>
                  <span>{formatDistanceToNow(new Date(nft.mintedAt), { addSuffix: true })}</span>
                </div>
                {nft.value && (
                  <div className="flex justify-between items-center">
                    <span>Mint Price:</span>
                    <div className="flex items-center gap-1">
                      {nft.mintToken?.address && tokenLogos[nft.mintToken.address] ? (
                        <img 
                          src={tokenLogos[nft.mintToken.address]} 
                          alt={nft.mintToken.symbol || 'Token'} 
                          className="w-4 h-4 rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/token-default.png';
                          }}
                        />
                      ) : (
                        <FaEthereum className="text-[#00ffbd]" />
                      )}
                      <span>{formatMintPrice(nft.value, nft)} {nft.mintToken?.symbol}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Collection:</span>
                  <Link 
                    to={`/collection/${nft.symbol}`}
                    className="text-[#00ffbd] hover:underline"
                  >
                    {nft.collectionName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0e12] p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1a1b1f] rounded-xl h-[400px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="relative inline-block mb-12">
          <h1 className="text-3xl font-bold text-white">My NFTs</h1>
          <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#00ffbd]"></div>
        </div>
        <FilterControls />
        {filteredNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map(renderNFTCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-white mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-400">
              You haven't minted any NFTs yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 