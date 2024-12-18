import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { toast } from 'react-hot-toast';

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('created'); // 'created' or 'address'
  const uniswap = useUniswap();

  // Fetch user-created pools from localStorage
  useEffect(() => {
    if (!isOpen || !uniswap) return;
    
    const loadUserPools = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get user pools from localStorage
        const userPoolsStr = localStorage.getItem('userCreatedPools') || '[]';
        const userPools = JSON.parse(userPoolsStr);
        
        // Fetch current data for each pool
        const updatedPools = await Promise.all(
          userPools.map(async (poolAddress) => {
            try {
              const poolInfo = await uniswap.getPoolInfoByAddress(poolAddress);
              if (!poolInfo) return null;

              // Get token logos (you can implement a token logo service)
              const token0Logo = '/placeholder.png'; // Replace with actual token logo service
              const token1Logo = '/placeholder.png'; // Replace with actual token logo service

              return {
                ...poolInfo,
                token0: {
                  ...poolInfo.token0,
                  logo: token0Logo
                },
                token1: {
                  ...poolInfo.token1,
                  logo: token1Logo
                },
                pairAddress: poolAddress
              };
            } catch (err) {
              console.error(`Error fetching pool ${poolAddress}:`, err);
              return null;
            }
          })
        );

        // Filter out null values (failed fetches)
        setPools(updatedPools.filter(Boolean));
      } catch (err) {
        console.error('Error loading user pools:', err);
        setError('Failed to load your pools');
      } finally {
        setLoading(false);
      }
    };

    if (searchMode === 'created') {
      loadUserPools();
    }
  }, [isOpen, uniswap, searchMode]);

  // Handle pool address search
  const handleAddressSearch = async () => {
    if (!searchQuery || !ethers.isAddress(searchQuery)) {
      toast.error('Please enter a valid pool address');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const poolInfo = await uniswap.getPoolInfoByAddress(searchQuery);
      if (!poolInfo) {
        setError('No pool found at this address');
        setPools([]);
      } else {
        // Get token logos (you can implement a token logo service)
        const token0Logo = '/placeholder.png'; // Replace with actual token logo service
        const token1Logo = '/placeholder.png'; // Replace with actual token logo service

        setPools([{
          ...poolInfo,
          token0: {
            ...poolInfo.token0,
            logo: token0Logo
          },
          token1: {
            ...poolInfo.token1,
            logo: token1Logo
          },
          pairAddress: searchQuery
        }]);
      }
    } catch (err) {
      console.error('Error searching pool:', err);
      setError('Failed to fetch pool information');
      setPools([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-white dark:bg-[#1a1b1f] rounded-2xl max-w-lg w-full mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Pool
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSearchMode('created')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                searchMode === 'created'
                  ? 'bg-[#00ffbd] text-black'
                  : 'bg-gray-100 dark:bg-[#2d2f36] text-gray-700 dark:text-gray-300'
              }`}
            >
              My Pools
            </button>
            <button
              onClick={() => setSearchMode('address')}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                searchMode === 'address'
                  ? 'bg-[#00ffbd] text-black'
                  : 'bg-gray-100 dark:bg-[#2d2f36] text-gray-700 dark:text-gray-300'
              }`}
            >
              Search by Address
            </button>
          </div>

          {/* Search Input */}
          {searchMode === 'address' && (
            <div className="relative mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter pool address..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAddressSearch}
                  className="px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black rounded-xl font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Pool List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading pools...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : pools.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchMode === 'created' 
                  ? 'No pools created yet' 
                  : 'Enter a pool address to search'}
              </div>
            ) : (
              pools.map((pool) => (
                <button
                  key={pool.pairAddress}
                  onClick={() => onSelect(pool)}
                  className="w-full p-4 bg-white/5 dark:bg-[#2d2f36] hover:bg-gray-50 dark:hover:bg-[#2d2f36]/80 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <img
                          src={pool.token0?.logo || '/unknown-token.png'}
                          alt={pool.token0?.symbol || 'Unknown'}
                          className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        />
                        <img
                          src={pool.token1?.logo || '/unknown-token.png'}
                          alt={pool.token1?.symbol || 'Unknown'}
                          className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {pool.token0?.symbol || 'Unknown'}/{pool.token1?.symbol || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {pool.pairAddress}
                  </div>
                  {pool.reserves && (
                    <div className="flex justify-between text-sm mt-2">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {pool.token0?.symbol || 'Token0'}:
                        </span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {pool.reserves.reserve0Formatted}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {pool.token1?.symbol || 'Token1'}:
                        </span>
                        <span className="ml-1 text-gray-900 dark:text-white">
                          {pool.reserves.reserve1Formatted}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
} 