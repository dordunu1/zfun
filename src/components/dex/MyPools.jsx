import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ipfsToHttp } from '../../utils/ipfs';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Common tokens with metadata
const COMMON_TOKENS = [
  {
    address: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

const getTokenLogo = (token) => {
  // Check if it's a common token
  const commonToken = COMMON_TOKENS.find(t => t.address.toLowerCase() === token?.address?.toLowerCase());
  if (commonToken) {
    return commonToken.logo;
  }

  // Check for IPFS or direct logo from token data
  if (token?.logo || token?.logoIpfs) {
    return token.logo || ipfsToHttp(token.logoIpfs);
  }

  // Default token logo
  return '/token-default.png';
};

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
            .map(token => 
              fetch(alchemyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'alchemy_getTokenMetadata',
                  params: [token.contractAddress]
                })
              }).then(res => res.json())
            );

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

                  console.log('Pool info found:', {
                    token0: poolInfo.token0?.symbol,
                    token1: poolInfo.token1?.symbol,
                    reserves: poolInfo.reserves
                  });

                  return {
                    ...poolInfo,
                    pairAddress: poolAddress,
                    lpBalance: token.tokenBalance,
                    createdAt: new Date(),
                    reserves: {
                      ...poolInfo.reserves,
                      reserve0Formatted: ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', poolInfo.token0?.decimals || 18),
                      reserve1Formatted: ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', poolInfo.token1?.decimals || 18)
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
          }
        }
      } catch (error) {
        console.error('Error loading pools:', error);
        toast.error('Failed to load pools: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

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

      // Add the found pool to the list if it's not already there
      setPools(prevPools => {
        if (!prevPools.some(p => p.pairAddress.toLowerCase() === searchAddress.toLowerCase())) {
          const newPool = {
            ...poolInfo,
            pairAddress: searchAddress,
            reserves: {
              ...poolInfo.reserves,
              reserve0Formatted: ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', poolInfo.token0?.decimals || 18),
              reserve1Formatted: ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', poolInfo.token1?.decimals || 18)
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
                    alt={pool.token0?.symbol || 'Unknown'}
                    className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/token-default.png';
                    }}
                  />
                  <img
                    src={getTokenLogo(pool.token1)}
                    alt={pool.token1?.symbol || 'Unknown'}
                    className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/token-default.png';
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token0?.symbol || 'Unknown'}/{pool.token1?.symbol || 'Unknown'}
                </span>
              </div>
              {pool.createdAt && (
                <span className="text-sm text-gray-500">
                  Created {new Date(pool.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
              {pool.pairAddress}
            </div>

            {pool.reserves && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.token0?.symbol || 'Token0'} Reserves
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {pool.reserves.reserve0Formatted}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pool.token1?.symbol || 'Token1'} Reserves
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