import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from './TokenSelectionModal';
import PoolSelectionModal from './PoolSelectionModal';

export default function AddLiquidity() {
  const { address } = useAccount();
  const [pool, setPool] = useState(null);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);

  const handleAddLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !token0Amount || !token1Amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Uniswap add liquidity logic will go here
      
    } catch (error) {
      console.error('Add liquidity error:', error);
      toast.error('Failed to add liquidity');
    } finally {
      setLoading(false);
    }
  };

  const handlePoolSelect = (selectedPool) => {
    setPool(selectedPool);
    setShowPoolModal(false);
  };

  return (
    <>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Card Container */}
        <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          {/* Pool Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Select Pool
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPoolModal(true)}
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
              >
                {pool ? (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src={pool.token0.logo}
                        alt={pool.token0.symbol}
                        className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                      />
                      <img
                        src={pool.token1.logo}
                        alt={pool.token1.symbol}
                        className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                      />
                    </div>
                    <span>
                      {pool.token0.symbol}/{pool.token1.symbol} {pool.fee}%
                    </span>
                  </div>
                ) : (
                  'Select Pool'
                )}
              </button>
            </div>
          </div>

          {pool && (
            <>
              {/* Token 0 Amount */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {pool.token0.symbol} Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token0Amount}
                    onChange={(e) => setToken0Amount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#00ffbd] hover:bg-[#00ffbd]/10 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Token 1 Amount */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {pool.token1.symbol} Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token1Amount}
                    onChange={(e) => setToken1Amount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#00ffbd] hover:bg-[#00ffbd]/10 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Pool Stats */}
              <div className="mt-6 p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pool Share</span>
                    <span className="text-gray-900 dark:text-gray-100">--</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                    <span className="text-gray-900 dark:text-gray-100">--</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  About Adding Liquidity
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  By adding liquidity you'll earn fees from trades in this pool.
                  The ratio of tokens you add will determine the price impact on the pool.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Add Liquidity Button */}
        <button
          onClick={handleAddLiquidity}
          disabled={loading || !pool || !token0Amount || !token1Amount}
          className={`
            w-full px-4 py-4 rounded-xl font-medium text-black text-lg
            ${loading || !pool || !token0Amount || !token1Amount
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
            }
          `}
        >
          {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
        </button>
      </div>

      {/* Pool Selection Modal */}
      <PoolSelectionModal
        isOpen={showPoolModal}
        onClose={() => setShowPoolModal(false)}
        onSelect={handlePoolSelect}
      />
    </>
  );
} 