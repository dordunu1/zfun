import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useUnichain } from '../../../../hooks/useUnichain';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FaSearch } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { getTokenDeploymentByAddress } from '../../../../services/firebase';

// Add common token list (we'll keep updating this)
const COMMON_TOKENS = {
  [UNISWAP_ADDRESSES.WETH.toLowerCase()]: {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  [UNISWAP_ADDRESSES.USDT.toLowerCase()]: {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  // Add more common tokens as needed
};

// Enhanced token metadata fetcher
const getEnhancedTokenMetadata = async (tokenAddress, existingMetadata) => {
  try {
    // First check if it's a common token
    const chainTokens = getChainTokens(1301); // Unichain chainId
    const commonToken = chainTokens.find(t => 
      t.address.toLowerCase() === tokenAddress.toLowerCase()
    );

    if (commonToken) {
      return {
        ...existingMetadata,
        ...commonToken,
        address: tokenAddress,
        logo: commonToken.logo,
        verified: true
      };
    }

    // Try to get from Firebase first
    try {
      const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
      if (tokenDeployment) {
        const logo = tokenDeployment.logo || getTokenLogo({ 
          ...tokenDeployment,
          address: tokenAddress 
        }, 1301);
        
        return {
          ...existingMetadata,
          name: tokenDeployment.name || existingMetadata.name,
          symbol: tokenDeployment.symbol || existingMetadata.symbol,
          decimals: tokenDeployment.decimals || existingMetadata.decimals || 18,
          logo,
          logoIpfs: tokenDeployment.logoIpfs,
          address: tokenAddress,
          verified: true
        };
      }
    } catch (error) {
      console.log('Firebase fetch failed:', error);
    }

    // Try to get from Unichain scan API if available
    try {
      const response = await fetch(`https://api.unichainscanner.com/api/v1/tokens/${tokenAddress}`);
      if (response.ok) {
        const data = await response.json();
        return {
          ...existingMetadata,
          name: data.name || existingMetadata.name,
          symbol: data.symbol || existingMetadata.symbol,
          decimals: data.decimals || existingMetadata.decimals || 18,
          logo: data.logo || getTokenLogo({ address: tokenAddress }, 1301),
          address: tokenAddress,
          verified: true
        };
      }
    } catch (error) {
      console.log('Unichain scan fetch failed, falling back to existing metadata');
    }

    // Fall back to existing metadata with default logo
    return {
      ...existingMetadata,
      logo: existingMetadata.logo || getTokenLogo({ address: tokenAddress }, 1301),
      address: tokenAddress,
      verified: false
    };
  } catch (error) {
    console.error('Error in enhanced token metadata:', error);
    return existingMetadata;
  }
};

const getDisplaySymbol = (token) => {
  if (token?.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
    return 'ETH';
  }
  return token?.symbol || 'Unknown';
};

const getDisplayName = (token) => {
  if (token?.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
    return 'Ethereum';
  }
  return token?.name || 'Unknown Token';
};

// Update the pool display in the list
const PoolItem = ({ pool, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(pool)}
      className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <img
            src={pool.token0.logo}
            alt={pool.token0.symbol}
            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
          <img
            src={pool.token1.logo}
            alt={pool.token1.symbol}
            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {pool.token0.symbol}/{pool.token1.symbol}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pool.token0.name}/{pool.token1.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {pool.tvl && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            TVL: ${Number(pool.tvl).toLocaleString()}
          </span>
        )}
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const uniswap = useUnichain();
  const { address } = useAccount();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Function to process pool data
  const processPoolData = async (pool) => {
    try {
      // Get token metadata using the same pattern as the original PoolSelectionModal
      const [token0Metadata, token1Metadata] = await Promise.all([
        getEnhancedTokenMetadata(pool.token0.address, pool.token0),
        getEnhancedTokenMetadata(pool.token1.address, pool.token1)
      ]);

      // Special handling for USDT
      const isToken0USDT = token0Metadata.address?.toLowerCase() === '0x70262e266E50603AcFc5D58997eF73e5a8775844'.toLowerCase();
      const isToken1USDT = token1Metadata.address?.toLowerCase() === '0x70262e266E50603AcFc5D58997eF73e5a8775844'.toLowerCase();

      // Convert WETH to ETH consistently
      const isToken0WETH = token0Metadata.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();
      const isToken1WETH = token1Metadata.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();

      const displayToken0 = isToken0WETH
        ? {
            ...token0Metadata,
            symbol: 'ETH',
            name: 'Ethereum',
            logo: '/logos/eth.png',
            isWETH: true,
            originalSymbol: 'WETH'
          }
        : isToken0USDT
        ? {
            ...token0Metadata,
            logo: '/logos/usdt.png'
          }
        : {
            ...token0Metadata,
            logo: token0Metadata.logo || getTokenLogo(token0Metadata)
          };

      const displayToken1 = isToken1WETH
        ? {
            ...token1Metadata,
            symbol: 'ETH',
            name: 'Ethereum',
            logo: '/logos/eth.png',
            isWETH: true,
            originalSymbol: 'WETH'
          }
        : isToken1USDT
        ? {
            ...token1Metadata,
            logo: '/logos/usdt.png'
          }
        : {
            ...token1Metadata,
            logo: token1Metadata.logo || getTokenLogo(token1Metadata)
          };

      // Ensure addresses are preserved
      const processedPool = {
        token0: {
          ...displayToken0,
          address: pool.token0.address,
          isWETH: isToken0WETH
        },
        token1: {
          ...displayToken1,
          address: pool.token1.address,
          isWETH: isToken1WETH
        },
        pairAddress: pool.address,
        reserves: {
          ...pool.reserves,
          reserve0Formatted: ethers.formatUnits(pool.reserves?.reserve0 || '0', displayToken0?.decimals || 18),
          reserve1Formatted: ethers.formatUnits(pool.reserves?.reserve1 || '0', displayToken1?.decimals || 18)
        }
      };

      console.log('Processed pool:', processedPool);
      return processedPool;
    } catch (err) {
      console.error(`Error processing pool data:`, err);
      return null;
    }
  };

  // Load initial pools
  useEffect(() => {
    const loadPools = async () => {
      if (!isOpen || !address) return;

      setLoading(true);
      setError('');
      try {
        const allPools = await uniswap.getPools(UNISWAP_ADDRESSES.WETH);
        console.log('All pools:', allPools);

        if (allPools && allPools.length > 0) {
          const poolsData = await Promise.all(
            allPools.map(processPoolData)
          );

          const validPools = poolsData.filter(pool => pool !== null);
          console.log('Setting pools:', validPools);
          setPools(validPools);
        }
      } catch (err) {
        console.error('Error loading pools:', err);
        setError('Failed to load pools');
      } finally {
        setLoading(false);
      }
    };

    loadPools();
  }, [isOpen, uniswap, address]);

  // Handle search with debounce
  useEffect(() => {
    const searchPools = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      // If searching for an exact address
      if (searchTerm.length >= 42 && ethers.isAddress(searchTerm)) {
        try {
          setLoading(true);
          // Try to get pool info directly
          const poolInfo = await uniswap.getPoolInfoByAddress(searchTerm);
          if (poolInfo) {
            // Try to get token metadata from Firebase for both tokens
            const [token0Deployment, token1Deployment] = await Promise.all([
              getTokenDeploymentByAddress(poolInfo.token0.address).catch(() => null),
              getTokenDeploymentByAddress(poolInfo.token1.address).catch(() => null)
            ]);

            // Enhance token0 metadata if found in Firebase
            if (token0Deployment) {
              poolInfo.token0 = {
                ...poolInfo.token0,
                name: token0Deployment.name,
                symbol: token0Deployment.symbol,
                decimals: token0Deployment.decimals || 18,
                logo: token0Deployment.logo,
                logoIpfs: token0Deployment.logoIpfs
              };
            }

            // Enhance token1 metadata if found in Firebase
            if (token1Deployment) {
              poolInfo.token1 = {
                ...poolInfo.token1,
                name: token1Deployment.name,
                symbol: token1Deployment.symbol,
                decimals: token1Deployment.decimals || 18,
                logo: token1Deployment.logo,
                logoIpfs: token1Deployment.logoIpfs
              };
            }

            const processedPool = await processPoolData({
              ...poolInfo,
              address: searchTerm
            });
            
            if (processedPool) {
              console.log('Found pool by address:', processedPool);
              setSearchResults([processedPool]);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Error fetching specific pool:', err);
        } finally {
          setLoading(false);
        }
      }

      // Filter existing pools
      const filtered = pools.filter(pool => {
        const searchLower = searchTerm.toLowerCase();
        return (
          pool.token0?.symbol?.toLowerCase().includes(searchLower) ||
          pool.token1?.symbol?.toLowerCase().includes(searchLower) ||
          pool.pairAddress?.toLowerCase().includes(searchLower)
        );
      });

      setSearchResults(filtered);
    };

    const timeoutId = setTimeout(searchPools, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, pools, uniswap]);

  // Use search results if available, otherwise use all pools
  const displayPools = searchTerm ? searchResults : pools;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl border border-gray-200 dark:border-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Pool
          </Dialog.Title>

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by token symbol or pool address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/5 dark:bg-[#1a1b1f] rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>

          {/* Pool List Container */}
          <div className="overflow-y-auto max-h-[60vh] space-y-2 pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffbd] mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading pools...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : displayPools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No pools match your search' : 'No pools found'}
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-400 mt-2">Try searching with a different term</p>
                )}
              </div>
            ) : (
              displayPools.map((pool) => (
                <PoolItem key={pool.pairAddress} pool={pool} onSelect={onSelect} />
              ))
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 