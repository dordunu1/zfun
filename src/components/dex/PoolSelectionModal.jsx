import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const EXAMPLE_POOLS = [
  {
    id: '1',
    token0: {
      symbol: 'ETH',
      logo: '/eth-logo.png',
    },
    token1: {
      symbol: 'USDT',
      logo: '/usdt-logo.png',
    },
    fee: '0.3',
    tvl: '$1.2M',
    volume24h: '$500K',
  },
  // Add more example pools
];

export default function PoolSelectionModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState(EXAMPLE_POOLS);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setPools(EXAMPLE_POOLS);
      return;
    }

    setLoading(true);
    try {
      // Pool search logic will go here
      // This will integrate with Uniswap subgraph or on-chain data
      
    } catch (error) {
      console.error('Pool search error:', error);
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

        <div className="relative bg-white dark:bg-[#1a1b1f] rounded-xl w-full max-w-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Pool
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search pools"
              className="w-full px-4 py-3 pl-10 bg-white dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent"
            />
            <FaSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Pool List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#00ffbd] rounded-full animate-spin border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-2">
                {pools.map((pool) => (
                  <button
                    key={pool.id}
                    onClick={() => onSelect(pool)}
                    className="w-full p-4 bg-white dark:bg-[#2d2f36] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <img
                            src={pool.token0.logo}
                            alt={pool.token0.symbol}
                            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                          />
                          <img
                            src={pool.token1.logo}
                            alt={pool.token1.symbol}
                            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                          />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {pool.token0.symbol}/{pool.token1.symbol}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {pool.fee}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">TVL:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{pool.tvl}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">24h Volume:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{pool.volume24h}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
} 