import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUnichain } from '../../../hooks/useUnichain';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../../utils/tokens';
import { ChainlinkService } from '../../../services/chainlink';

// Constants and configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Cache management for My Pools
 * Handles caching of pool data with BigInt support
 */
const myPoolsCache = {
  data: null,
  timestamp: 0,
  isValid() {
    return this.data && (Date.now() - this.timestamp < CACHE_DURATION);
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
    // Store in localStorage with BigInt handling
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        // Convert BigInt to string with a special prefix
        if (typeof value === 'bigint') {
          return `bigint:${value.toString()}`;
        }
        return value;
      });
      localStorage.setItem('myPoolsCache_unichain', JSON.stringify({
        data: serializedData,
        timestamp: this.timestamp
      }));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  },
  load() {
    try {
      const stored = localStorage.getItem('myPoolsCache_unichain');
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp < CACHE_DURATION) {
          // Parse the data and convert BigInt strings back to BigInt
          this.data = JSON.parse(data, (key, value) => {
            if (typeof value === 'string' && value.startsWith('bigint:')) {
              return BigInt(value.slice(7));
            }
            return value;
          });
          this.timestamp = timestamp;
          return true;
        }
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
    return false;
  },
  clear() {
    this.data = null;
    this.timestamp = 0;
    localStorage.removeItem('myPoolsCache_unichain');
  }
};

/**
 * Token metadata cache with BigInt handling
 * Caches token metadata to reduce API calls
 */
const tokenMetadataCache = {
  data: new Map(),
  load() {
    try {
      const stored = localStorage.getItem('tokenMetadataCache_unichain');
      if (stored) {
        const parsed = JSON.parse(stored, (key, value) => {
          if (typeof value === 'string' && value.startsWith('bigint:')) {
            return BigInt(value.slice(7));
          }
          return value;
        });
        this.data = new Map(parsed);
      }
    } catch (error) {
      console.warn('Error loading token metadata cache:', error);
    }
  },
  set(address, metadata) {
    this.data.set(address.toLowerCase(), metadata);
    try {
      const serialized = JSON.stringify([...this.data], (key, value) => {
        if (typeof value === 'bigint') {
          return `bigint:${value.toString()}`;
        }
        return value;
      });
      localStorage.setItem('tokenMetadataCache_unichain', serialized);
    } catch (error) {
      console.warn('Error saving token metadata cache:', error);
    }
  },
  get(address) {
    return this.data.get(address.toLowerCase());
  }
};

// Initialize caches on module load
tokenMetadataCache.load();
myPoolsCache.load();

/**
 * MyPools Component
 * Displays user's liquidity pools and their details
 */
export default function MyPools() {
  // State and hooks
  const { address } = useAccount();
  const uniswap = useUnichain();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const chainlinkService = new ChainlinkService();

  // Format USD values
  const formatUSD = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate USD value using Chainlink price feeds
  const calculateUSDValue = async (token, amount) => {
    try {
      if (!token || !amount) return 0;

      let price;
      if (token.symbol === 'WETH' || token.symbol === 'ETH') {
        price = await chainlinkService.getETHPrice();
      } else if (token.symbol === 'USDT') {
        price = await chainlinkService.getUSDTPrice();
      } else if (token.symbol === 'USDC') {
        price = await chainlinkService.getUSDCPrice();
      } else {
        // For other tokens, try to get price from pool ratio
        price = await chainlinkService.getPriceFromStablePair(token.address);
      }

      if (!price) return 0;

      const value = Number(ethers.formatUnits(amount, token.decimals)) * price;
      console.log(`USD Value for ${token.symbol}:`, {
        amount: ethers.formatUnits(amount, token.decimals),
        price,
        value
      });
      return value;
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return 0;
    }
  };

  // Load pools data
  useEffect(() => {
    const loadPools = async () => {
      if (!address || !uniswap) {
        console.log('No wallet address or uniswap instance found');
        return;
      }
      
      setLoading(true);
      try {
        console.log('Connected wallet address:', address);
        console.log('Starting to load pools...');

        // Check cache first
        if (myPoolsCache.isValid() && myPoolsCache.data) {
          console.log('Returning pools from cache');
          setPools(myPoolsCache.data);
          setLoading(false);
          return;
        }

        // Get user's LP tokens
        const userPools = await uniswap.getUserPools(address);
        console.log('Found user pools:', userPools);

        if (!userPools || userPools.length === 0) {
          console.log('No pools found');
          setPools([]);
          return;
        }

        // Get pool information for each LP token
        const poolsData = await Promise.all(
          userPools.map(async (poolAddress) => {
            try {
              // Get pool info
              const poolInfo = await uniswap.getPoolInfoByAddress(poolAddress);
              if (!poolInfo) {
                console.log('No pool info found for:', poolAddress);
                return null;
              }

              // Get token metadata
              const [token0Metadata, token1Metadata] = await Promise.all([
                getTokenMetadata(poolInfo.token0.address),
                getTokenMetadata(poolInfo.token1.address)
              ]);

              console.log('Pool info found:', {
                token0: token0Metadata?.symbol,
                token1: token1Metadata?.symbol,
                reserves: poolInfo.reserves
              });

              // Calculate TVL using price feeds
              const [reserve0USD, reserve1USD] = await Promise.all([
                calculateUSDValue(token0Metadata, poolInfo.reserves?.reserve0 || '0'),
                calculateUSDValue(token1Metadata, poolInfo.reserves?.reserve1 || '0')
              ]);

              console.log('Pool TVL calculation:', {
                token0: token0Metadata?.symbol,
                reserve0USD,
                token1: token1Metadata?.symbol,
                reserve1USD,
                total: (reserve0USD || 0) + (reserve1USD || 0)
              });

              const tvl = (reserve0USD || 0) + (reserve1USD || 0);

              return {
                ...poolInfo,
                token0: token0Metadata,
                token1: token1Metadata,
                pairAddress: poolAddress,
                tvl,
                createdAt: poolInfo.createdAt || Math.floor(Date.now() / 1000),
                volumes: {
                  oneDay: 0,
                  sevenDay: 0,
                  thirtyDay: 0,
                  oneDayTxCount: 0,
                  sevenDayTxCount: 0,
                  thirtyDayTxCount: 0
                },
                reserves: {
                  ...poolInfo.reserves,
                  reserve0Formatted: ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', token0Metadata?.decimals || 18),
                  reserve1Formatted: ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', token1Metadata?.decimals || 18)
                }
              };
            } catch (err) {
              console.error(`Error fetching pool data:`, err);
              return null;
            }
          })
        );

        // Filter out null values and sort by TVL
        const validPools = poolsData
          .filter(pool => pool !== null)
          .sort((a, b) => (b.tvl || 0) - (a.tvl || 0));
          
        console.log('Setting pools:', validPools);
        setPools(validPools);
        
        // Cache the valid pools
        myPoolsCache.set(validPools);
      } catch (error) {
        console.error('Error loading pools:', error);
        toast.error('Failed to load pools: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPools();
  }, [uniswap, address]);

  // Filter pools based on search term
  const filteredPools = pools.filter(pool => {
    const searchLower = searchAddress.toLowerCase();
    return (
      pool.token0?.symbol?.toLowerCase().includes(searchLower) ||
      pool.token1?.symbol?.toLowerCase().includes(searchLower) ||
      pool.pairAddress.toLowerCase().includes(searchLower)
    );
  });

  // Utility functions
  const formatNumber = (value) => {
    if (!value && value !== 0) return '-';
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toFixed(2);
    }
  };

  const isPoolOlderThan = (createdAt, days) => {
    if (!createdAt) return false;
    const now = Math.floor(Date.now() / 1000);
    const daysInSeconds = days * 24 * 60 * 60;
    return (now - createdAt) >= daysInSeconds;
  };

  // Render loading state
  if (!address) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please connect your wallet to view your pools
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffbd]"></div>
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pools found. Create a pool to get started!
      </div>
    );
  }

  // Main render
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by token symbol or pool address..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white/5 dark:bg-[#1a1b1f] rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Pools Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 dark:bg-[#1a1b1f] rounded-xl">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Pool</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">TVL</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">24h Volume</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">7d Volume</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">30d Volume</th>
            </tr>
          </thead>
          <tbody>
            {filteredPools.map((pool) => (
              <tr 
                key={pool.pairAddress}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-white/10 dark:hover:bg-[#2d2f36] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img 
                        src={getTokenLogo(pool.token0)}
                        alt={pool.token0?.symbol || 'ERC20 Token'}
                        className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                      <img 
                        src={getTokenLogo(pool.token1)}
                        alt={pool.token1?.symbol || 'ERC20 Token'}
                        className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {pool.token0?.symbol || 'ERC20 Token'}/{pool.token1?.symbol || 'ERC20 Token'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="truncate">{pool.pairAddress}</span>
                    <span className="text-xs text-gray-400">
                      Created {new Date(pool.createdAt * 1000).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pool.pairAddress);
                        toast.success('Address copied to clipboard!');
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Copy address"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  {formatUSD(pool.tvl)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  <div className="group relative inline-block">
                    {formatUSD(pool.volumes.oneDay)}
                    {pool.volumes.oneDayTxCount > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full right-0 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap">
                        {pool.volumes.oneDayTxCount} transactions in 24h
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  <div className="group relative inline-block">
                    {isPoolOlderThan(pool.createdAt, 7) ? formatUSD(pool.volumes.sevenDay) : '-'}
                    {pool.volumes.sevenDayTxCount > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full right-0 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap">
                        {pool.volumes.sevenDayTxCount} transactions in 7d
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  <div className="group relative inline-block">
                    {isPoolOlderThan(pool.createdAt, 30) ? formatUSD(pool.volumes.thirtyDay) : '-'}
                    {pool.volumes.thirtyDayTxCount > 0 && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full right-0 mb-2 px-3 py-1 text-xs bg-gray-900 text-white rounded-lg whitespace-nowrap">
                        {pool.volumes.thirtyDayTxCount} transactions in 30d
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 