import React, { useState, useEffect } from 'react';
import { useUnichain } from '../../../hooks/useUnichain';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../../utils/tokens';
import { useTokenPrices } from '../../../hooks/useTokenPrices';

export default function AllPools() {
  const uniswap = useUnichain();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { calculateUSDValue, formatUSD } = useTokenPrices();

  useEffect(() => {
    const loadPools = async () => {
      try {
        setLoading(true);
        const factoryPools = await uniswap.getAllPools();
        console.log('Found pools:', factoryPools);

        if (!factoryPools || factoryPools.length === 0) {
          console.log('No pools found');
          setPools([]);
          return;
        }

        const poolsData = await Promise.all(
          factoryPools.map(async (poolAddress) => {
            try {
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

              // Calculate TVL using Chainlink price feeds
              const [reserve0USD, reserve1USD] = await Promise.all([
                calculateUSDValue(token0Metadata, poolInfo.reserves?.reserve0 || '0'),
                calculateUSDValue(token1Metadata, poolInfo.reserves?.reserve1 || '0')
              ]);

              const tvl = (reserve0USD || 0) + (reserve1USD || 0);

              return {
                ...poolInfo,
                token0: token0Metadata,
                token1: token1Metadata,
                pairAddress: poolAddress,
                tvl,
                createdAt: poolInfo.volumes?.poolCreatedAt || 0,
                volumes: {
                  oneDay: poolInfo.volumes?.oneDayVolume || 0,
                  sevenDay: poolInfo.volumes?.sevenDayVolume || 0,
                  thirtyDay: poolInfo.volumes?.thirtyDayVolume || 0,
                  oneDayTxCount: poolInfo.volumes?.oneDayTxCount || 0,
                  sevenDayTxCount: poolInfo.volumes?.sevenDayTxCount || 0,
                  thirtyDayTxCount: poolInfo.volumes?.thirtyDayTxCount || 0
                }
              };
            } catch (err) {
              console.error('Error processing pool:', poolAddress, err);
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
      } catch (err) {
        console.error('Error loading pools:', err);
        setError('Failed to load pools');
        toast.error('Failed to load pools');
      } finally {
        setLoading(false);
      }
    }

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

  const isPoolOlderThan = (createdAt, days) => {
    if (!createdAt) return false;
    const now = Math.floor(Date.now() / 1000);
    const daysInSeconds = days * 24 * 60 * 60;
    return (now - createdAt) >= daysInSeconds;
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