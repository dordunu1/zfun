import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { toast } from 'react-hot-toast';

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const uniswap = useUniswap();

  // Load pools when modal opens
  useEffect(() => {
    if (!isOpen || !uniswap) return;
    
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

                return {
                  ...poolInfo,
                  pairAddress: poolAddress,
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

          // Filter out null values and set pools
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

  // Filter pools based on search query
  const filteredPools = pools.filter(pool => {
    const searchLower = searchQuery.toLowerCase();
    return (
      // Match pool address
      pool.pairAddress.toLowerCase().includes(searchLower) ||
      // Match token symbols
      `${pool.token0?.symbol}/${pool.token1?.symbol}`.toLowerCase().includes(searchLower) ||
      // Match token addresses
      pool.token0?.address.toLowerCase().includes(searchLower) ||
      pool.token1?.address.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <div className="relative bg-white dark:bg-[#1a1b1f] rounded-2xl max-w-3xl w-full mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
              Select Pool
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, symbol, or address..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Pool List */}
          <div 
            className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#00ffbd #2d2f36'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: #2d2f36;
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb {
                background-color: #00ffbd;
                border-radius: 3px;
              }
            `}</style>
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
                          src={pool.token0?.logo || '/unknown-token.png'}
                          alt={pool.token0?.symbol || 'Unknown'}
                          className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        />
                        <img
                          src={pool.token1?.logo || '/unknown-token.png'}
                          alt={pool.token1?.symbol || 'Unknown'}
                          className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-lg">
                        {pool.token0?.symbol || 'Unknown'}/{pool.token1?.symbol || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {pool.pairAddress}
                  </div>
                  {pool.reserves && (
                    <div className="flex justify-between text-sm mt-3">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {pool.token0?.symbol || 'Token0'}:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {pool.reserves.reserve0Formatted}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {pool.token1?.symbol || 'Token1'}:
                        </span>
                        <span className="ml-2 text-gray-900 dark:text-white">
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