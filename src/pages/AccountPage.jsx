import React, { useState, useEffect } from 'react';
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

  const formatMintPrice = (price) => {
    if (!price) return '0';
    try {
      // Convert wei to ETH
      return ethers.formatEther(price);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0';
    }
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
                          src={ipfsToHttp(tokenLogos[nft.mintToken.address])} 
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
                      <span>
                        {formatMintPrice(nft.value)} {nft.mintToken?.symbol || 'ETH'}
                      </span>
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
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map(renderNFTCard)}
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