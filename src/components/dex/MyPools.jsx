import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { getTokenLogo, getTokenMetadata } from '../../utils/tokens';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Cache management for My Pools
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
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
      localStorage.setItem('myPoolsCache', JSON.stringify({
        data: serializedData,
        timestamp: this.timestamp
      }));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  },
  load() {
    try {
      const stored = localStorage.getItem('myPoolsCache');
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
    localStorage.removeItem('myPoolsCache');
  }
};

// Token metadata cache with BigInt handling
const tokenMetadataCache = {
  data: new Map(),
  load() {
    try {
      const stored = localStorage.getItem('tokenMetadataCache');
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
      localStorage.setItem('tokenMetadataCache', serialized);
    } catch (error) {
      console.warn('Error saving token metadata cache:', error);
    }
  },
  get(address) {
    return this.data.get(address.toLowerCase());
  }
};

// Load caches on module initialization
tokenMetadataCache.load();
myPoolsCache.load();

export default function MyPools() {
  const { address } = useAccount();
  const uniswap = useUniswap();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');

  useEffect(() => {
    const loadPools = async () => {
      if (!address) {
        console.log('No wallet address found');
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

        // Fetch pools using Alchemy API
        const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
        
        // First, get all token balances for the user
        const balanceResponse = await fetch(alchemyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getTokenBalances',
            params: [address, 'erc20']
          })
        });

        const balanceData = await balanceResponse.json();
        console.log('Token balances:', balanceData);

        if (balanceData.result?.tokenBalances) {
          // Get token metadata for each balance
          const tokenMetadataPromises = balanceData.result.tokenBalances
            .filter(token => token.tokenBalance !== '0x0')
            .map(async token => {
              // Check token metadata cache first
              const cachedMetadata = tokenMetadataCache.get(token.contractAddress);
              if (cachedMetadata) {
                return { result: cachedMetadata };
              }

              const response = await fetch(alchemyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'alchemy_getTokenMetadata',
                  params: [token.contractAddress]
                })
              });
              const metadata = await response.json();
              if (metadata.result) {
                tokenMetadataCache.set(token.contractAddress, metadata.result);
              }
              return metadata;
            });

          const tokenMetadata = await Promise.all(tokenMetadataPromises);
          console.log('Token metadata:', tokenMetadata);

          // Filter for Uniswap V2 LP tokens
          const lpTokens = balanceData.result.tokenBalances
            .filter((token, index) => 
              tokenMetadata[index]?.result?.symbol?.includes('UNI-V2')
            );

          console.log('LP tokens found:', lpTokens);

          if (lpTokens.length > 0) {
            // Get pool data for each LP token
            const poolsData = await Promise.all(
              lpTokens.map(async (token) => {
                try {
                  const poolAddress = token.contractAddress;
                  console.log('Fetching data for pool:', poolAddress);
                  const poolInfo = await uniswap.getPoolInfoByAddress(poolAddress);
                  if (!poolInfo) {
                    console.log('No pool info found for:', poolAddress);
                    return null;
                  }

                  // Enhance token metadata
                  const [token0Metadata, token1Metadata] = await Promise.all([
                    getTokenMetadata(poolInfo.token0),
                    getTokenMetadata(poolInfo.token1)
                  ]);

                  console.log('Pool info found:', {
                    token0: token0Metadata?.symbol,
                    token1: token1Metadata?.symbol,
                    reserves: poolInfo.reserves
                  });

                  return {
                    ...poolInfo,
                    token0: token0Metadata,
                    token1: token1Metadata,
                    pairAddress: poolAddress,
                    lpBalance: token.tokenBalance,
                    createdAt: new Date(),
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

            // Set pools data
            const validPools = poolsData.filter(pool => pool !== null);
            console.log('Setting pools:', validPools);
            setPools(validPools);
            
            // Cache the valid pools
            myPoolsCache.set(validPools);
          }
        }
      } catch (error) {
        console.error('Error loading pools:', error);
        toast.error('Failed to load pools: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadPools();
  }, [address, uniswap]);

  const handleSearch = async () => {
    if (!ethers.isAddress(searchAddress)) {
      toast.error('Please enter a valid pool address');
      return;
    }

    setLoading(true);
    try {
      const poolInfo = await uniswap.getPoolInfoByAddress(searchAddress);
      if (!poolInfo) {
        toast.error('No pool found at this address');
        return;
      }

      // Enhance token metadata
      const [token0Metadata, token1Metadata] = await Promise.all([
        getTokenMetadata(poolInfo.token0),
        getTokenMetadata(poolInfo.token1)
      ]);

      // Add the found pool to the list if it's not already there
      setPools(prevPools => {
        if (!prevPools.some(p => p.pairAddress.toLowerCase() === searchAddress.toLowerCase())) {
          const newPool = {
            ...poolInfo,
            token0: token0Metadata,
            token1: token1Metadata,
            pairAddress: searchAddress,
            reserves: {
              ...poolInfo.reserves,
              reserve0Formatted: ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', token0Metadata?.decimals || 18),
              reserve1Formatted: ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', token1Metadata?.decimals || 18)
            }
          };
          return [...prevPools, newPool];
        }
        return prevPools;
      });
      
      toast.success('Pool found!');
    } catch (error) {
      console.error('Error searching pool:', error);
      toast.error('Failed to fetch pool information');
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please connect your wallet to view your pools</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Enter pool address..."
          className="flex-1 px-4 py-2 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffbd]"></div>
        </div>
      ) : pools.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pools found</p>
          <p className="text-sm text-gray-400 mt-2">Search for a pool by address or create a new one</p>
        </div>
      ) : (
        pools.map((pool) => (
          <div
            key={pool.pairAddress}
            className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
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
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token0?.symbol || 'ERC20 Token'}/{pool.token1?.symbol || 'ERC20 Token'}
                </span>
              </div>
              {pool.createdAt && (
                <span className="text-sm text-gray-500">
                  Created {new Date(pool.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="truncate">{pool.pairAddress}</span>
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

            {pool.reserves && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.token0?.symbol || 'ERC20 Token'} Reserves
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {pool.reserves.reserve0Formatted}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.token1?.symbol || 'ERC20 Token'} Reserves
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {pool.reserves.reserve1Formatted}
                  </div>
                </div>
              </div>
            )}

            {pool.lpBalance && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your LP Balance
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {ethers.formatUnits(pool.lpBalance || '0', 18)} LP Tokens
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
} 