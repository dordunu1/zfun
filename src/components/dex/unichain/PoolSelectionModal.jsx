import React, { useState, useEffect } from 'react';
import { useUnichain } from '../../../hooks/useUnichain';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../../utils/tokens';
import { useTokenPrices } from '../../../hooks/useTokenPrices';

export default function PoolSelectionModal({ isOpen, onClose, onSelect, excludeToken }) {
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

              // Skip pools that contain the excluded token
              if (excludeToken && (
                poolInfo.token0.toLowerCase() === excludeToken.toLowerCase() ||
                poolInfo.token1.toLowerCase() === excludeToken.toLowerCase()
              )) {
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
                  thirtyDay: poolInfo.volumes?.thirtyDayVolume || 0
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

    if (uniswap && isOpen) {
      loadPools();
    }
  }, [uniswap, isOpen, excludeToken]);

  // Filter pools based on search term
  const filteredPools = pools.filter(pool => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pool.token0?.symbol?.toLowerCase().includes(searchLower) ||
      pool.token1?.symbol?.toLowerCase().includes(searchLower) ||
      pool.pairAddress.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-[#1a1b1f] rounded-xl shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select a Pool
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by token symbol or pool address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Pool List */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffbd]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredPools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pools found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPools.map((pool) => (
                  <button
                    key={pool.pairAddress}
                    onClick={() => onSelect(pool)}
                    className="w-full p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl hover:bg-white/10 dark:hover:bg-[#3d3f46] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          <img
                            src={getTokenLogo(pool.token0)}
                            alt={pool.token0?.symbol || 'Token 0'}
                            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/token-default.png';
                            }}
                          />
                          <img
                            src={getTokenLogo(pool.token1)}
                            alt={pool.token1?.symbol || 'Token 1'}
                            className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/token-default.png';
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {pool.token0?.symbol || 'Token 0'}/{pool.token1?.symbol || 'Token 1'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {pool.pairAddress}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatUSD(pool.tvl)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          TVL
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 