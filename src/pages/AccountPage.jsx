import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { getOwnedNFTs, getTokenDeploymentByAddress } from '../services/firebase';
import { ipfsToHttp } from '../utils/ipfs';
import { FaEthereum } from 'react-icons/fa';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import axios from 'axios';
import { useWeb3Modal } from '@web3modal/react';

// Memory cache for NFTs
const CACHE_DURATION = 30000; // 30 seconds
const nftCache = new Map();

// Helper function to get cached NFTs
const getCachedNFTs = (address, chainId) => {
  const cacheKey = `${address}-${chainId}`;
  const cachedData = nftCache.get(cacheKey);
  
  if (cachedData) {
    const { timestamp, data } = cachedData;
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Using cached NFTs');
      return data;
    }
    // Cache expired, remove it
    nftCache.delete(cacheKey);
  }
  
  // Check localStorage for backup cache
  const localCache = localStorage.getItem(`nfts-${cacheKey}`);
  if (localCache) {
    try {
      const { timestamp, data } = JSON.parse(localCache);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('Using localStorage cached NFTs');
        return data;
      }
      // Cache expired, remove it
      localStorage.removeItem(`nfts-${cacheKey}`);
    } catch (error) {
      console.error('Error parsing localStorage cache:', error);
    }
  }
  
  return null;
};

// Helper function to cache NFTs
const cacheNFTs = (address, chainId, nfts) => {
  const cacheKey = `${address}-${chainId}`;
  const cacheData = {
    timestamp: Date.now(),
    data: nfts
  };
  
  // Update memory cache
  nftCache.set(cacheKey, cacheData);
  
  // Update localStorage cache
  try {
    localStorage.setItem(`nfts-${cacheKey}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Update the Blockscout API function to handle multiple networks
const fetchBlockscoutNFTs = async (address, chainId) => {
  try {
    let baseUrl;
    if (chainId === 11155111) {
      baseUrl = 'https://eth-sepolia.blockscout.com';
    } else if (chainId === 1301) {
      baseUrl = 'https://unichain-sepolia.blockscout.com';
    } else {
      return [];
    }

    const response = await axios.get(`${baseUrl}/api/v2/addresses/${address}/nft?type=ERC-721%2CERC-404%2CERC-1155`);
    return response.data.items;
  } catch (error) {
    console.error('Error fetching from Blockscout:', error);
    return [];
  }
};

export default function AccountPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const [tokenLogos, setTokenLogos] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    network: 'all'     // 'all', 'sepolia', 'unichain', 'unichain-mainnet'
  });
  const { open: openConnectModal } = useWeb3Modal();

  // Function to get token details from Firebase
  const getTokenDetails = async (tokenAddress) => {
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      return { symbol: 'ETH', logo: null };
    }

    try {
      const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
      if (tokenDeployment?.logo) {
        return {
          symbol: tokenDeployment.symbol || 'Unknown',
          logo: tokenDeployment.logo
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
      if (!account) {
        setNfts([]);
        setLoading(false);
        return;
      }

      try {
        // Check cache first
        const cachedNFTs = getCachedNFTs(account, chain?.id);
        if (cachedNFTs) {
          setNfts(cachedNFTs);
          setLoading(false);
          
          // Load fresh data in the background
          loadFreshData();
          return;
        }

        await loadFreshData();
      } catch (error) {
        console.error('Error loading NFTs:', error);
        setLoading(false);
      }
    };

    const loadFreshData = async () => {
      try {
        // Load owned NFTs from Firebase
        const ownedNFTs = await getOwnedNFTs(account);
        console.log('Raw owned NFTs:', ownedNFTs);
        
        // Fetch Blockscout NFTs for accurate balances based on chain
        const chainId = chain?.id;
        const blockscoutNFTs = await fetchBlockscoutNFTs(account, chainId);
        console.log('Blockscout NFTs:', blockscoutNFTs);
        
        // Create a map of NFT balances from Blockscout
        const balanceMap = new Map();
        blockscoutNFTs.forEach(nft => {
          const key = `${nft.token.address}-${nft.id}`;
          balanceMap.set(key, parseInt(nft.value || '1'));
        });
        
        // Process NFTs with accurate balances
        const processedNFTs = ownedNFTs.flatMap(nft => {
          const blockscoutKey = `${nft.contractAddress}-${nft.tokenId || '0'}`;
          const blockscoutBalance = balanceMap.get(blockscoutKey) || 1;
          
          // For ERC1155, use balance from Blockscout
          if (nft.type === 'ERC1155') {
            return [{
              ...nft,
              tokenId: nft.tokenId || '0',
              uniqueId: `${nft.contractAddress}-${nft.tokenId}-${nft.type}`,
              balance: blockscoutBalance,
              individualMintPrice: nft.value ? String(Number(nft.value) / blockscoutBalance) : '0'
            }];
          }
          
          // For ERC721 with multiple mints in one transaction
          const quantity = parseInt(nft.quantity || '1');
          if (quantity > 1) {
            return Array(quantity).fill().map((_, index) => {
              const tokenId = String(parseInt(nft.tokenId || '0') + index);
              return {
                ...nft,
                tokenId,
                uniqueId: `${nft.contractAddress}-${tokenId}-${nft.type}-${Date.now()}-${index}`,
                individualMintPrice: nft.value ? String(Number(nft.value) / quantity) : '0'
              };
            });
          }
          
          // For single NFTs
          return [{
            ...nft,
            uniqueId: `${nft.contractAddress}-${nft.tokenId}-${nft.type}-${Date.now()}`,
            individualMintPrice: nft.value,
            balance: nft.type === 'ERC1155' ? blockscoutBalance : 1
          }];
        });
        
        console.log('Processed NFTs:', processedNFTs);

        // Filter NFTs based on current chain - improved chain detection
        const filteredNFTs = processedNFTs.filter(nft => {
          if (!chain?.id) return true; // Show all if no chain selected
          
          // Check all possible chain identifiers
          const nftChainId = nft.chainId || 
            (nft.network === 'sepolia' ? 11155111 : 
             nft.network === 'unichain' ? 1301 : null);
          
          // Match against current chain
          return chain.id === nftChainId || 
            (chain.id === 11155111 && nft.network === 'sepolia') ||
            (chain.id === 1301 && nft.network === 'unichain');
        });
        
        console.log('Filtered NFTs:', filteredNFTs);

        // Sort NFTs by mint date (newest first)
        const sortedNFTs = filteredNFTs.sort((a, b) => {
          const dateA = new Date(a.mintedAt || 0);
          const dateB = new Date(b.mintedAt || 0);
          return dateB - dateA;
        });

        // Get unique token addresses for minting tokens
        const uniqueTokenAddresses = [...new Set(
          sortedNFTs
            .filter(nft => nft.mintToken?.address)
            .map(nft => nft.mintToken.address.toLowerCase())
        )];

        // Load all token logos in parallel
        const logos = {};
        await Promise.all(
          uniqueTokenAddresses.map(async (tokenAddress) => {
            try {
              const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
              if (tokenDeployment?.logo) {
                logos[tokenAddress] = tokenDeployment.logo;
              }
            } catch (error) {
              console.error(`Error loading logo for token ${tokenAddress}:`, error);
            }
          })
        );

        // Cache and set the results
        cacheNFTs(account, chain?.id, processedNFTs);
        setTokenLogos(logos);
        setNfts(processedNFTs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading fresh NFT data:', error);
        setLoading(false);
      }
    };

    loadNFTs();
  }, [account, chain]);

  const formatMintPrice = (price, nft) => {
    if (!price) return '0';
    try {
      // Get the individual NFT price by dividing total value by quantity
      const quantity = parseInt(nft.quantity || '1');
      let individualPrice = price;
      
      if (quantity > 1) {
        // If it's a number or numeric string, divide by quantity
        if (!isNaN(price)) {
          individualPrice = String(Number(price) / quantity);
        } else {
          // For Wei/ETH values, convert to number first
          const cleanValue = price.toString().replace(/,/g, '');
          try {
            const valueInWei = ethers.parseUnits(cleanValue, 'wei');
            const totalEthValue = ethers.formatEther(valueInWei);
            individualPrice = String(Number(totalEthValue) / quantity);
          } catch {
            const totalEthValue = ethers.formatEther(cleanValue);
            individualPrice = String(Number(totalEthValue) / quantity);
          }
        }
      }

      // For custom tokens, we don't need to convert from Wei
      if (nft?.mintToken?.type === 'custom' || 
          nft?.mintToken?.type === 'usdc' || 
          nft?.mintToken?.type === 'usdt') {
        return parseFloat(individualPrice).toLocaleString('en-US', {
          maximumFractionDigits: 6,
          minimumFractionDigits: 0
        });
      }

      // For native tokens (ETH/MATIC), ensure proper conversion
      let valueInWei;
      if (typeof individualPrice === 'string') {
        const cleanValue = individualPrice.replace(/,/g, '');
        try {
          valueInWei = ethers.parseUnits(cleanValue, 'wei');
        } catch {
          valueInWei = ethers.parseEther(cleanValue);
        }
      } else {
        valueInWei = BigInt(individualPrice.toString());
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
      // Filter by type
      if (filters.type !== 'all' && nft.type !== filters.type) return false;

      // Filter by network
      if (filters.network !== 'all') {
        const nftNetwork = nft.network || 
          (nft.chainId === 11155111 ? 'sepolia' : 
           nft.chainId === 1301 ? 'unichain' :
           nft.chainId === 1 ? 'unichain-mainnet' : null);
        
        if (nftNetwork !== filters.network) return false;
      }

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

    const networkCount = {
      all: nfts.length,
      sepolia: nfts.filter(nft => nft.network === 'sepolia' || nft.chainId === 11155111).length,
      unichain: nfts.filter(nft => nft.network === 'unichain' || nft.chainId === 1301).length,
      'unichain-mainnet': nfts.filter(nft => nft.network === 'unichain-mainnet' || nft.chainId === 1).length
    };

    return (
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filters.type}
          onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
          className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
        >
          <option value="all">All Types ({typeCount.all})</option>
          <option value="ERC721">ERC721 ({typeCount.ERC721})</option>
          <option value="ERC1155">ERC1155 ({typeCount.ERC1155})</option>
        </select>

        <select
          value={filters.network}
          onChange={(e) => setFilters(f => ({ ...f, network: e.target.value }))}
          className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
        >
          <option value="all">All Networks ({networkCount.all})</option>
          <option value="sepolia">Sepolia ({networkCount.sepolia})</option>
          <option value="unichain">Unichain Testnet ({networkCount.unichain})</option>
          <option value="unichain-mainnet">Unichain Mainnet ({networkCount['unichain-mainnet']})</option>
        </select>
      </div>
    );
  };

  // Add renderCurrencyLogo function
  const renderCurrencyLogo = (nft) => {
    const tokenAddress = nft?.mintToken?.address?.toLowerCase();
    const logoUrl = tokenLogos[tokenAddress];
    
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
    
    return <FaEthereum className="w-4 h-4 text-[#00ffbd]" />;
  };

  const renderNFTCard = (nft) => {
    const imageUrl = ipfsToHttp(nft.image || nft.previewUrl);
    const displayName = nft.name?.replace(/ #0$/, '');

    return (
      <div key={nft.uniqueId} className="block">
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
                    <div className="flex items-center gap-1 text-[#00ffbd]">
                      {renderCurrencyLogo(nft)}
                      <span className="font-medium">{formatMintPrice(nft.value, nft)} {nft.mintToken?.symbol}</span>
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

          {/* Add balance badge for ERC1155 */}
          {nft.type === 'ERC1155' && nft.balance > 1 && (
            <div className="absolute top-3 right-12 z-10">
              <div className="bg-[#00ffbd] text-black px-2 py-0.5 rounded-full text-xs font-medium">
                x{nft.balance}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0d0e12] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative inline-block mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My NFTs</h1>
            <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#00ffbd]"></div>
          </div>

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
                  Please connect your wallet to view your NFTs. You'll be able to see all your NFT collections and manage them.
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
          </div>
        </div>
      </div>
    );
  }

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