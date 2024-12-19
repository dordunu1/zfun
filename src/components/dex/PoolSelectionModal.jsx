import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { FaSearch } from 'react-icons/fa';
import { getTokenLogo, getTokenMetadata } from '../../utils/tokens';

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const uniswap = useUniswap();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPools = async () => {
      if (!isOpen) return;

      setLoading(true);
      setError('');
      try {
        const factoryPools = await uniswap.getAllPools();
        console.log('Factory pools:', factoryPools);

        if (factoryPools && factoryPools.length > 0) {
          // Get pool data for each pool
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

                return {
                  ...poolInfo,
                  token0: token0Metadata,
                  token1: token1Metadata,
                  pairAddress: poolAddress,
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
  }, [isOpen, uniswap]);

  // Filter pools based on search term
  const filteredPools = pools.filter(pool => {
    const searchLower = searchTerm.toLowerCase();
    return (
      pool.token0?.symbol?.toLowerCase().includes(searchLower) ||
      pool.token1?.symbol?.toLowerCase().includes(searchLower) ||
      pool.pairAddress.toLowerCase().includes(searchLower)
    );
  });

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
            ) : filteredPools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {pools.length === 0 ? 'No pools found' : 'No pools match your search'}
                </p>
                {pools.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">Try searching with a different term</p>
                )}
              </div>
            ) : (
              filteredPools.map((pool) => (
                <button
                  key={pool.pairAddress}
                  onClick={() => onSelect(pool)}
                  className="w-full p-6 bg-white/5 dark:bg-[#2d2f36] hover:bg-gray-50 dark:hover:bg-[#2d2f36]/80 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        <img
                          src={getTokenLogo(pool.token0)}
                          alt={pool.token0?.symbol || 'ERC20 Token'}
                          className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/token-default.png';
                          }}
                        />
                        <img
                          src={getTokenLogo(pool.token1)}
                          alt={pool.token1?.symbol || 'ERC20 Token'}
                          className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/token-default.png';
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-lg">
                        {pool.token0?.symbol || 'ERC20 Token'}/{pool.token1?.symbol || 'ERC20 Token'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {pool.token0?.symbol || 'ERC20 Token'} Reserves
                      </div>
                      <div className="text-base font-medium text-gray-900 dark:text-white">
                        {pool.reserves.reserve0Formatted}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {pool.token1?.symbol || 'ERC20 Token'} Reserves
                      </div>
                      <div className="text-base font-medium text-gray-900 dark:text-white">
                        {pool.reserves.reserve1Formatted}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {pool.pairAddress}
                  </div>
                </button>
              ))
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 