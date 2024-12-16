import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from './TokenSelectionModal';

export default function PoolCreation() {
  const { address } = useAccount();
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [fee, setFee] = useState('0.3');
  const [loading, setLoading] = useState(false);
  const [showToken0Modal, setShowToken0Modal] = useState(false);
  const [showToken1Modal, setShowToken1Modal] = useState(false);

  const handleCreatePool = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!token0 || !token1) {
      toast.error('Please select both tokens');
      return;
    }

    setLoading(true);
    try {
      // Uniswap pool creation logic will go here
      
    } catch (error) {
      console.error('Pool creation error:', error);
      toast.error('Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const handleToken0Select = (token) => {
    setToken0(token);
    setShowToken0Modal(false);
  };

  const handleToken1Select = (token) => {
    setToken1(token);
    setShowToken1Modal(false);
  };

  return (
    <>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Card Container */}
        <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          {/* Token 0 Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Token 1
            </label>
            <div className="relative">
              <button
                onClick={() => setShowToken0Modal(true)}
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
              >
                {token0 ? (
                  <div className="flex items-center gap-2">
                    <img src={token0.logo} alt={token0.symbol} className="w-5 h-5" />
                    <span>{token0.symbol}</span>
                  </div>
                ) : (
                  'Select Token'
                )}
              </button>
            </div>
          </div>

          {/* Token 1 Selection */}
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Token 2
            </label>
            <div className="relative">
              <button
                onClick={() => setShowToken1Modal(true)}
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
              >
                {token1 ? (
                  <div className="flex items-center gap-2">
                    <img src={token1.logo} alt={token1.symbol} className="w-5 h-5" />
                    <span>{token1.symbol}</span>
                  </div>
                ) : (
                  'Select Token'
                )}
              </button>
            </div>
          </div>

          {/* Fee Tier Selection */}
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Fee Tier
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['0.01', '0.05', '0.3', '1'].map((feeTier) => (
                <button
                  key={feeTier}
                  onClick={() => setFee(feeTier)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium
                    ${fee === feeTier
                      ? 'bg-[#00ffbd] text-black border-[#00ffbd]'
                      : 'bg-white/10 dark:bg-[#2d2f36] text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80'
                    }
                    border border-gray-200 dark:border-gray-800 transition-colors
                  `}
                >
                  {feeTier}%
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              About Pool Creation
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Creating a new liquidity pool allows you to be the first liquidity provider.
              You'll need to deposit both tokens in the ratio you want to set the initial price.
            </p>
          </div>
        </div>

        {/* Create Pool Button */}
        <button
          onClick={handleCreatePool}
          disabled={loading || !token0 || !token1}
          className={`
            w-full px-4 py-4 rounded-xl font-medium text-black text-lg
            ${loading || !token0 || !token1
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
            }
          `}
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>
      </div>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showToken0Modal}
        onClose={() => setShowToken0Modal(false)}
        onSelect={handleToken0Select}
      />
      <TokenSelectionModal
        isOpen={showToken1Modal}
        onClose={() => setShowToken1Modal(false)}
        onSelect={handleToken1Select}
      />
    </>
  );
} 