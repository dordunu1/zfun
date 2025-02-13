import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnichain } from '../../../../hooks/useUnichain';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FaSearch } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { getTokenDeploymentByAddress } from '../../../../services/firebase';

// Add network constants
const UNICHAIN_NETWORKS = {
  TESTNET: {
    id: 1301,
    name: 'Unichain Testnet',
    blockscoutUrl: 'https://unichain-sepolia.blockscout.com'
  },
  MAINNET: {
    id: 130,
    name: 'Unichain Mainnet',
    blockscoutUrl: 'https://unichain.blockscout.com'
  }
};

// Common tokens with metadata per network
const COMMON_TOKENS = {
  // Testnet tokens (1301)
  1301: [
    {
      address: UNISWAP_ADDRESSES[1301].WETH,
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: '/usdc.png'
    },
    {
      address: UNISWAP_ADDRESSES[1301].USDT,
      symbol: 'USDT',
      name: 'Test USDT',
      decimals: 6,
      logo: '/usdt.png'
    }
  ],
  // Mainnet tokens (130)
  130: [
    {
      address: UNISWAP_ADDRESSES[130].WETH,
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: UNISWAP_ADDRESSES[130].USDT,
      symbol: 'USDT',
      name: 'USDT',
      decimals: 6,
      logo: '/usdt.png'
    }
  ]
};

// Helper function to get token metadata based on network
const getCommonTokenMetadata = (token, chainId) => {
  // Check if it's a common token for the current network
  const commonToken = COMMON_TOKENS[chainId]?.find(t => t.address?.toLowerCase() === token.address?.toLowerCase());
  if (commonToken) {
    return {
      ...token,
      ...commonToken,
      logo: commonToken.logo
    };
  }

  return token;
};

// Enhanced token metadata fetcher
const getEnhancedTokenMetadata = async (tokenAddress, existingMetadata, chainId) => {
  try {
    if (!tokenAddress) {
      console.warn('Token address is undefined in getEnhancedTokenMetadata');
      return existingMetadata;
    }

    // First check if it's a common token for the current network
    const commonToken = COMMON_TOKENS[chainId]?.find(t => 
      t.address?.toLowerCase() === tokenAddress?.toLowerCase()
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

    // Get the correct Blockscout URL based on the chain
    const blockscoutUrl = chainId === UNICHAIN_NETWORKS.TESTNET.id
      ? UNICHAIN_NETWORKS.TESTNET.blockscoutUrl
      : UNICHAIN_NETWORKS.MAINNET.blockscoutUrl;

    // Try to get from Firebase first
    try {
      const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
      if (tokenDeployment) {
        const logo = tokenDeployment.logo || getTokenLogo({ 
          ...tokenDeployment,
          address: tokenAddress 
        }, chainId);
        
        return {
          ...existingMetadata,
          name: tokenDeployment.name || existingMetadata?.name,
          symbol: tokenDeployment.symbol || existingMetadata?.symbol,
          decimals: tokenDeployment.decimals || existingMetadata?.decimals || 18,
          logo,
          logoIpfs: tokenDeployment.logoIpfs,
          address: tokenAddress,
          verified: true
        };
      }
    } catch (error) {
      console.log('Firebase fetch failed:', error);
    }

    // Try to get from Blockscout API
    try {
      const response = await fetch(`${blockscoutUrl}/api/v2/tokens/${tokenAddress}`);
      if (response.ok) {
        const data = await response.json();
        return {
          ...existingMetadata,
          name: data.name || existingMetadata?.name,
          symbol: data.symbol || existingMetadata?.symbol,
          decimals: parseInt(data.decimals) || existingMetadata?.decimals || 18,
          logo: data.logo || getTokenLogo({ address: tokenAddress }, chainId),
          address: tokenAddress,
          verified: true
        };
      }
    } catch (error) {
      console.log('Blockscout API fetch failed, falling back to existing metadata');
    }

    // Fall back to existing metadata with default logo
    return {
      ...existingMetadata,
      logo: existingMetadata?.logo || getTokenLogo({ address: tokenAddress }, chainId),
      address: tokenAddress,
      verified: false
    };
  } catch (error) {
    console.error('Error in enhanced token metadata:', error);
    return existingMetadata;
  }
};

const getDisplaySymbol = (token) => {
  if (!token?.address) return 'Unknown';
  if (token.address.toLowerCase() === UNISWAP_ADDRESSES.WETH?.toLowerCase()) {
    return 'ETH';
  }
  return token?.symbol || 'Unknown';
};

const getDisplayName = (token) => {
  if (!token?.address) return 'Unknown Token';
  if (token.address.toLowerCase() === UNISWAP_ADDRESSES.WETH?.toLowerCase()) {
    return 'Ethereum';
  }
  return token?.name || 'Unknown Token';
};

// Animation variants
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
      stiffness: 100,
      damping: 15
    }
  }
};

const searchVariants = {
  hidden: { 
    opacity: 0,
    y: -20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Add skeleton animation variant
const skeletonVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const skeletonItemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Update the PoolItem component with animations
const PoolItem = ({ pool, onSelect }) => {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(pool)}
      className="w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={pool.token0.logo}
            alt={pool.token0.symbol}
            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            src={pool.token1.logo}
            alt={pool.token1.symbol}
            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
        </div>
        <div className="text-left">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-medium text-gray-900 dark:text-white"
          >
            {pool.token0.symbol}/{pool.token1.symbol}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {pool.token0.name}/{pool.token1.name}
          </motion.div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {pool.tvl && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            TVL: ${Number(pool.tvl).toLocaleString()}
          </motion.span>
        )}
        <motion.svg
          whileHover={{ x: 5 }}
          className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </div>
    </motion.button>
  );
};

// Add SkeletonPoolItem component
const SkeletonPoolItem = () => {
  return (
    <motion.div
      variants={skeletonItemVariants}
      className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </motion.div>
  );
};

// Process pool data function
const processPoolData = async (pool) => {
  try {
    if (!pool?.token0?.address || !pool?.token1?.address) {
      console.warn('Invalid pool data - missing token addresses');
      return null;
    }

    // Get token metadata using the same pattern as the original PoolSelectionModal
    const [token0Metadata, token1Metadata] = await Promise.all([
      getEnhancedTokenMetadata(pool.token0.address, pool.token0, pool.chainId),
      getEnhancedTokenMetadata(pool.token1.address, pool.token1, pool.chainId)
    ]);

    // Special handling for USDT
    const USDT_ADDRESS = UNISWAP_ADDRESSES[pool.chainId]?.USDT;
    const isToken0USDT = token0Metadata?.address?.toLowerCase() === USDT_ADDRESS?.toLowerCase();
    const isToken1USDT = token1Metadata?.address?.toLowerCase() === USDT_ADDRESS?.toLowerCase();

    // Convert WETH to ETH consistently
    const WETH_ADDRESS = UNISWAP_ADDRESSES[pool.chainId]?.WETH;
    const isToken0WETH = token0Metadata?.address?.toLowerCase() === WETH_ADDRESS?.toLowerCase();
    const isToken1WETH = token1Metadata?.address?.toLowerCase() === WETH_ADDRESS?.toLowerCase();

    const displayToken0 = isToken0WETH
      ? {
          ...token0Metadata,
          symbol: 'ETH',
          name: 'Ethereum',
          logo: '/eth.png',
          isWETH: true,
          originalSymbol: 'WETH'
        }
      : isToken0USDT
      ? {
          ...token0Metadata,
          logo: '/usdt.png'
        }
      : {
          ...token0Metadata,
          logo: token0Metadata?.logo || getTokenLogo(token0Metadata)
        };

    const displayToken1 = isToken1WETH
      ? {
          ...token1Metadata,
          symbol: 'ETH',
          name: 'Ethereum',
          logo: '/eth.png',
          isWETH: true,
          originalSymbol: 'WETH'
        }
      : isToken1USDT
      ? {
          ...token1Metadata,
          logo: '/usdt.png'
        }
      : {
          ...token1Metadata,
          logo: token1Metadata?.logo || getTokenLogo(token1Metadata)
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
      chainId: pool.chainId,
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

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const uniswap = useUnichain();
  const { address } = useAccount();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentChainId, setCurrentChainId] = useState(null);

  // Get current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (!window.ethereum) return;
      try {
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentChainId(parseInt(hexChainId, 16));
      } catch (error) {
        console.error('Error getting chain ID:', error);
      }
    };
    getChainId();

    // Listen for chain changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        setCurrentChainId(parseInt(chainId, 16));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  // Load pools
  useEffect(() => {
    const loadPools = async () => {
      if (!isOpen || !address || !currentChainId) return;

      // Check if we're on a supported network
      const isUnichain = currentChainId === UNICHAIN_NETWORKS.TESTNET.id || 
                        currentChainId === UNICHAIN_NETWORKS.MAINNET.id;
      
      if (!isUnichain) {
        setError('Please switch to Unichain network (Testnet or Mainnet)');
        setPools([]);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        const allPools = await uniswap.getPools(UNISWAP_ADDRESSES[currentChainId].WETH);
        console.log('All pools:', allPools);

        if (allPools && allPools.length > 0) {
          const poolsData = await Promise.all(
            allPools.map(async (pool) => {
              try {
                const processedPool = await processPoolData({
                  ...pool,
                  chainId: currentChainId
                });
                return processedPool;
              } catch (error) {
                console.error('Error processing pool:', error);
                return null;
              }
            })
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
  }, [isOpen, uniswap, address, currentChainId]);

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
        if (!pool?.token0?.symbol || !pool?.token1?.symbol || !pool?.pairAddress) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
          pool.token0.symbol.toLowerCase().includes(searchLower) ||
          pool.token1.symbol.toLowerCase().includes(searchLower) ||
          pool.pairAddress.toLowerCase().includes(searchLower)
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-[#1a1b1f] rounded-2xl shadow-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="p-6"
          >
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select a Pool
            </Dialog.Title>

            {/* Network Status */}
            {currentChainId && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                {currentChainId === UNICHAIN_NETWORKS.TESTNET.id ? (
                  <div className="px-4 py-2 rounded-xl bg-[#00ffbd]/10 border border-[#00ffbd]/20 text-[#00ffbd] text-sm inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ffbd] animate-pulse" />
                    Unichain Testnet
                  </div>
                ) : currentChainId === UNICHAIN_NETWORKS.MAINNET.id ? (
                  <div className="px-4 py-2 rounded-xl bg-[#00ffbd]/10 border border-[#00ffbd]/20 text-[#00ffbd] text-sm inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ffbd] animate-pulse" />
                    Unichain Mainnet
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    Please switch to Unichain network
                  </div>
                )}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            <motion.div 
              variants={searchVariants}
              className="relative mb-4"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by token name or address..."
                className="w-full px-4 py-3 pl-10 bg-white/10 dark:bg-[#1a1b1f] rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#00ffbd]/50 focus:border-[#00ffbd] outline-none transition-colors font-mono"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </motion.div>

            <div 
              className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#00ffbd #2d2f36',
              }}
            >
              <style>
                {`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #2d2f36;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #00ffbd;
                    border-radius: 3px;
                  }
                `}
              </style>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    variants={skeletonVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-2"
                  >
                    {[...Array(5)].map((_, index) => (
                      <SkeletonPoolItem key={index} />
                    ))}
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12 text-red-500"
                  >
                    {error}
                  </motion.div>
                ) : (searchTerm ? searchResults : pools).length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12 text-gray-500"
                  >
                    No pools found
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    className="space-y-2"
                  >
                    {(searchTerm ? searchResults : pools).map((pool) => (
                      <PoolItem key={pool.pairAddress} pool={pool} onSelect={onSelect} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 