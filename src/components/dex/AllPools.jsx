import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { FaSearch } from 'react-icons/fa';
import { ipfsToHttp } from '../../utils/ipfs';
import { toast } from 'react-hot-toast';

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
  const commonToken = COMMON_TOKENS.find(t => t.address?.toLowerCase() === token?.address?.toLowerCase());
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

export default function AllPools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const uniswap = useUniswap();

  useEffect(() => {
    const loadPools = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use Alchemy API to get all pools
        const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
        
        // Get all events for pool creation from the factory
        const response = await fetch(alchemyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getLogs',
            params: [{
              address: UNISWAP_ADDRESSES.factory,
              topics: [
                ethers.id('PairCreated(address,address,address,uint256)')
              ],
              fromBlock: '0x0',
              toBlock: 'latest'
            }]
          })
        });

        const data = await response.json();
        console.log('Factory events:', data);

        if (data.result) {
          // Process each pool creation event
          const poolsData = await Promise.all(
            data.result.map(async (event) => {
              try {
                const poolAddress = '0x' + event.data.slice(26, 66);
                console.log('Fetching data for pool:', poolAddress);
                const poolInfo = await uniswap.getPoolInfoByAddress(poolAddress);
                if (!poolInfo) return null;

                // Calculate TVL from reserves
                const tvl = Number(ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', poolInfo.token0?.decimals || 18)) +
                          Number(ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', poolInfo.token1?.decimals || 18));

                // Mock volume data for now (to be replaced with actual volume tracking)
                const volumes = {
                  oneDay: Math.random() * 1000000,
                  sevenDay: Math.random() * 5000000,
                  thirtyDay: Math.random() * 15000000
                };

                return {
                  ...poolInfo,
                  pairAddress: poolAddress,
                  reserves: {
                    ...poolInfo.reserves,
                    reserve0Formatted: ethers.formatUnits(poolInfo.reserves?.reserve0 || '0', poolInfo.token0?.decimals || 18),
                    reserve1Formatted: ethers.formatUnits(poolInfo.reserves?.reserve1 || '0', poolInfo.token1?.decimals || 18)
                  },
                  tvl,
                  volumes
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
        }
      } catch (err) {
        console.error('Error loading pools:', err);
        setError('Failed to load pools');
        toast.error('Failed to load pools');
      } finally {
        setLoading(false);
      }
    };

    if (uniswap) {
      loadPools();
    }
  }, [uniswap]);

  // Filter pools based on search term
  const filteredPools = pools.filter(pool => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pool.token0?.symbol?.toLowerCase().includes(searchLower) ||
      pool.token1?.symbol?.toLowerCase().includes(searchLower) ||
      pool.pairAddress.toLowerCase().includes(searchLower)
    );
  });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffbd]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by token symbol or pool address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                    <span className="text-sm text-gray-900 dark:text-white">
                      {pool.token0?.symbol || 'Unknown'}/{pool.token1?.symbol || 'Unknown'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {pool.pairAddress}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(pool.tvl)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(pool.volumes.oneDay)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(pool.volumes.sevenDay)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                  ${formatNumber(pool.volumes.thirtyDay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 