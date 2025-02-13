import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { getOwnedNFTs, getTokenDeploymentByAddress } from '../services/firebase';
import { ipfsToHttp } from '../utils/ipfs';
import { FaEthereum } from 'react-icons/fa';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import axios from 'axios';
import { useConnectModal } from '@rainbow-me/rainbowkit';

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
      // Process cached NFTs to ensure network information
      return data.map(nft => ({
        ...nft,
        network: nft.network || 
          (nft.chainId === 11155111 ? 'sepolia' :
           nft.chainId === 1301 ? 'unichain' :
           nft.chainId === 1828369849 ? 'moonwalker' : 'sepolia')
      }));
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
        // Process cached NFTs to ensure network information
        return data.map(nft => ({
          ...nft,
          network: nft.network || 
            (nft.chainId === 11155111 ? 'sepolia' :
             nft.chainId === 1301 ? 'unichain' :
             nft.chainId === 1828369849 ? 'moonwalker' : 'sepolia')
        }));
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
    if (chainId === 130) {
      baseUrl = 'https://unichain.blockscout.com';
    } else if (chainId === 1301) {
      baseUrl = 'https://unichain-sepolia.blockscout.com';
    } else if (chainId === 137) {
      baseUrl = 'https://polygonscan.com';
    } else if (chainId === 1828369849) {
      baseUrl = 'https://moonwalker-blockscout.eu-north-2.gateway.fm';
    } else if (chainId === 11155111) {
      baseUrl = 'https://eth-sepolia.blockscout.com';
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

// Add animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.3
    }
  }
};

// Add skeleton card component
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative"
  >
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

      {/* Glowing dots */}
      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

      {/* Three dots */}
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
        {/* Image skeleton */}
        <div className="h-[180px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />

        {/* Type badge skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <div className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Status badge skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Content section */}
        <div className="p-4">
          {/* Title and description */}
          <div className="mb-3">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          {/* Price section */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>

          {/* Supply and Minted */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function AccountPage() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const [tokenLogos, setTokenLogos] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    network: 'all'     // 'all', 'sepolia', 'unichain', 'moonwalker'
  });
  const closeTimeoutRef = useRef(null);

  // Add filteredNFTs memo
  const filteredNFTs = useMemo(() => {
    return nfts.filter(nft => {
      // Type filter
      if (filters.type !== 'all' && nft.type !== filters.type) return false;
      
      // Network filter
      if (filters.network !== 'all') {
        const networkId = parseInt(filters.network);
        return nft.chainId === networkId || 
               (networkId === 11155111 && nft.network === 'sepolia') ||
               (networkId === 130 && nft.network === 'unichain-mainnet') ||
               (networkId === 1301 && nft.network === 'unichain') ||
               (networkId === 137 && nft.network === 'polygon') ||
               (networkId === 1828369849 && nft.network === 'moonwalker');
      }
      
      return true;
    });
  }, [nfts, filters]);

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
        
        // Fetch Blockscout NFTs for accurate balances based on chain
        const chainId = chain?.id;
        const blockscoutNFTs = await fetchBlockscoutNFTs(account, chainId);
        
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
        
        // Filter NFTs based on current chain - improved chain detection
        const filteredNFTs = processedNFTs.filter(nft => {
          // Don't filter by chain - show all NFTs
          return true;
        });

        // Process NFTs to ensure network information is preserved
        const processedWithNetwork = filteredNFTs.map(nft => ({
          ...nft,
          network: nft.network || 
            (nft.chainId === 11155111 ? 'sepolia' :
             nft.chainId === 1301 ? 'unichain' :
             nft.chainId === 1828369849 ? 'moonwalker' : 'sepolia')
        }));

        // Sort NFTs by mint date (newest first)
        const sortedNFTs = processedWithNetwork.sort((a, b) => {
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
        cacheNFTs(account, chain?.id, processedWithNetwork);
        setTokenLogos(logos);
        setNfts(processedWithNetwork);
        setLoading(false);
      } catch (error) {
        console.error('Error loading fresh NFT data:', error);
        setLoading(false);
      }
    };

    loadNFTs();
  }, [account, chain]);

  // Update the useEffect to fetch logos for all payment tokens
  useEffect(() => {
    const fetchTokenLogos = async () => {
      for (const nft of nfts) {
        if (nft?.mintToken?.address && !tokenLogos[nft.mintToken.address.toLowerCase()]) {
          try {
            const tokenDeployment = await getTokenDeploymentByAddress(nft.mintToken.address);
            if (tokenDeployment?.logo) {
              setTokenLogos(prev => ({
                ...prev,
                [nft.mintToken.address.toLowerCase()]: tokenDeployment.logo
              }));
            }
          } catch (error) {
            console.error('Error fetching token logo:', error);
          }
        }
      }
    };

    fetchTokenLogos();
  }, [nfts]);

  const formatMintPrice = (price, nft) => {
    if (!price) return '0';
    try {
      // Check if it's ZERO token
      const tokenAddress = nft?.mintToken?.address?.toLowerCase();
      const isZeroToken = tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e' || nft.network === 'moonwalker';
      
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

      // For ZERO tokens, custom tokens, USDC, or USDT, we don't need to convert from Wei
      if (isZeroToken ||
          nft?.mintToken?.type === 'custom' || 
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

  // Filter controls UI
  const FilterControls = () => {
    const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

    const handleMouseEnter = (setDropdown) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setDropdown(true);
    };

    const handleMouseLeave = (setDropdown) => {
      closeTimeoutRef.current = setTimeout(() => {
        setDropdown(false);
      }, 300);
    };

    const typeCount = {
      all: nfts.length,
      ERC721: nfts.filter(nft => nft.type === 'ERC721').length,
      ERC1155: nfts.filter(nft => nft.type === 'ERC1155').length
    };

    const networkCount = {
      all: nfts.length,
      11155111: nfts.filter(nft => nft.network === 'sepolia' || nft.chainId === 11155111).length,
      130: nfts.filter(nft => nft.network === 'unichain-mainnet' || nft.chainId === 130).length,
      1301: nfts.filter(nft => nft.network === 'unichain' || nft.chainId === 1301).length,
      137: nfts.filter(nft => nft.network === 'polygon' || nft.chainId === 137).length,
      1828369849: nfts.filter(nft => nft.network === 'moonwalker' || nft.chainId === 1828369849).length
    };

    const types = [
      { value: 'all', label: `All Types (${typeCount.all})` },
      { value: 'ERC721', label: `ERC721 (${typeCount.ERC721})` },
      { value: 'ERC1155', label: `ERC1155 (${typeCount.ERC1155})` }
    ];

    const networks = [
      { value: 'all', label: 'All Networks' },
      { value: '11155111', label: 'Sepolia' },
      { value: '130', label: 'Unichain Mainnet' },
      { value: '1301', label: 'Unichain Testnet' },
      { value: '137', label: 'Polygon' },
      { value: '1828369849', label: 'Moonwalker' }
    ];

    const networkFilters = [
      { id: 'all', label: `All Networks (${networkCount.all})` },
      { id: '11155111', label: `Sepolia (${networkCount[11155111]})` },
      { id: '130', label: `Unichain Mainnet (${networkCount[130]})` },
      { id: '1301', label: `Unichain Testnet (${networkCount[1301]})` },
      { id: '137', label: `Polygon (${networkCount[137]})` },
      { id: '1828369849', label: `Moonwalker (${networkCount[1828369849]})` }
    ];

    return (
      <div className="flex gap-2">
        {/* Type Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setTypeDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setTypeDropdownOpen)}
        >
          <button
            type="button"
            className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none min-w-[160px] flex items-center justify-between text-xs"
          >
            <span>{types.find(t => t.value === filters.type)?.label}</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {typeDropdownOpen && (
            <div 
              className="absolute z-[110] w-full mt-1 bg-white dark:bg-[#0d0e12] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
              onMouseLeave={() => handleMouseLeave(setTypeDropdownOpen)}
            >
              {types.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFilters(f => ({ ...f, type: type.value }));
                    setTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 text-xs ${
                    filters.type === type.value ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Network Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setNetworkDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setNetworkDropdownOpen)}
        >
          <button
            type="button"
            className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none min-w-[160px] flex items-center justify-between text-xs"
          >
            <span>{networkFilters.find(n => n.id === filters.network)?.label}</span>
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
            <div 
              className="absolute z-[110] w-full mt-1 bg-white dark:bg-[#0d0e12] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
              onMouseLeave={() => handleMouseLeave(setNetworkDropdownOpen)}
            >
              {networkFilters.map(network => (
                <button
                  key={network.id}
                  onClick={() => {
                    setFilters(f => ({ ...f, network: network.id }));
                    setNetworkDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 text-xs ${
                    filters.network === network.id ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {network.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add renderCurrencyLogo function
  const renderCurrencyLogo = (nft) => {
    const tokenAddress = nft?.mintToken?.address?.toLowerCase();
    const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';

    // Handle native tokens based on network
    if (isNativeToken) {
      if (nft?.network === 'moonwalker' || nft?.chainId === 1828369849) {
        return <img src="/Zero.png" alt="ZERO" className="w-5 h-5" />;
      }
      if (nft?.network === 'polygon' || nft?.chainId === 137) {
        return <img src="/polygon.png" alt="POL" className="w-5 h-5" />;
      }
      return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
    }

    // Handle ZERO token by address
    if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
      return <img src="/Zero.png" alt="ZERO" className="w-4 h-4" />;
    }

    // For custom tokens with logo
    if (tokenAddress && tokenLogos[tokenAddress]) {
      return (
        <img 
          src={tokenLogos[tokenAddress]}
          alt={nft.mintToken.symbol || 'Token'}
          className="w-4 h-4 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }
    
    // Default to token-default.png for custom tokens without logo
    if (nft.mintToken?.type === 'custom') {
      return <img src="/token-default.png" alt="Token" className="w-4 h-4 rounded-full" />;
    }
    
    return <FaEthereum className="w-4 h-4 text-[#00ffbd]" />;
  };

  const renderNFTCard = (nft) => {
    const imageUrl = ipfsToHttp(nft.image || nft.previewUrl);
    const displayName = nft.name?.replace(/ #0$/, '');

    return (
      <motion.div
        key={nft.uniqueId}
        variants={itemVariants}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <div className="relative">
          {/* L-shaped corners with animation */}
          <motion.div 
            className="absolute -top-[2px] -left-[2px] w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
          </motion.div>
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
          <div className="relative z-10 bg-white dark:bg-[#1a1b1f] h-[340px]">
            {/* Image section with fade-in animation */}
            <motion.div 
              className="relative h-[180px] w-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>

            {/* Content section with fade-in animation */}
            <motion.div 
              className="flex flex-col flex-1 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                      <span className="font-medium">
                        {formatMintPrice(nft.value, nft)} {(() => {
                          const tokenAddress = nft?.mintToken?.address?.toLowerCase();
                          if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') return 'ZERO';
                          
                          const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';
                          if (isNativeToken) {
                            if (nft.network === 'moonwalker' || nft.chainId === 1828369849) return 'ZERO';
                            if (nft.network === 'polygon' || nft.chainId === 137) return 'POL';
                            return 'ETH';
                          }
                          
                          return nft?.mintToken?.type === 'custom' ? nft.mintToken.symbol : 'ETH';
                        })()}
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
            </motion.div>
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
      </motion.div>
    );
  };

  // Early return for wallet connection
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
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
        <div className="ml-[256px] relative">
          <div className="sticky top-0 z-50 bg-gray-50 dark:bg-[#0a0b0f] border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block mb-3 pt-4"
              >
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#00ffbd]"></div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-xl pb-3"
              >
                <div className="flex gap-2">
                  <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 py-4 overflow-y-auto custom-scrollbar" style={{
            height: 'calc(100vh - 120px)',
            scrollbarWidth: 'thin',
            scrollbarColor: `#00ffbd ${document.documentElement.classList.contains('dark') ? '#1a1b1f' : '#ffffff'}`
          }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      <div className="ml-[256px] relative">
        <div className="sticky top-0 z-50 bg-gray-50 dark:bg-[#0a0b0f] border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block mb-3 pt-4"
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">My NFTs</h1>
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#00ffbd]"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl pb-3"
            >
              <FilterControls />
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-4 overflow-y-auto custom-scrollbar" style={{
          height: 'calc(100vh - 120px)',
          scrollbarWidth: 'thin',
          scrollbarColor: `#00ffbd ${document.documentElement.classList.contains('dark') ? '#1a1b1f' : '#ffffff'}`
        }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map(renderNFTCard)
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12 col-span-full"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No NFTs Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You haven't minted any NFTs yet.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 

const getExplorerUrl = (chainId, type, value) => {
  let baseUrl;
  
  switch (chainId) {
    case 130:
      baseUrl = 'https://unichain.blockscout.com';
      break;
    case 1301:
      baseUrl = 'https://unichain-sepolia.blockscout.com';
      break;
    case 137:
      baseUrl = 'https://polygonscan.com';
      break;
    case 1828369849:
      baseUrl = 'https://moonwalker-blockscout.eu-north-2.gateway.fm';
      break;
    default:
      baseUrl = 'https://sepolia.etherscan.io';
  }

  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    default:
      return `${baseUrl}/tx/${value}`;
  }
}; 