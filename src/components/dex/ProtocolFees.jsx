import React, { useState, useEffect } from 'react';
import { useUniswap } from '../../hooks/useUniswap';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export default function ProtocolFees({ pairAddress }) {
  const uniswap = useUniswap();
  const [accumulatedFees, setAccumulatedFees] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkFees = async () => {
    if (!uniswap || !pairAddress) return;

    try {
      const result = await uniswap.checkAccumulatedFees(pairAddress);
      if (result.success) {
        setAccumulatedFees(result.accumulatedFees);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error checking fees:', error);
      toast.error('Failed to check accumulated fees');
    }
  };

  const collectFees = async () => {
    if (!uniswap || !pairAddress) return;

    setLoading(true);
    try {
      const result = await uniswap.collectProtocolFees(pairAddress);
      if (result.success) {
        toast.success(`Successfully collected fees: 
          ${result.token0Collected} Token0, 
          ${result.token1Collected} Token1`
        );
        // Refresh accumulated fees
        checkFees();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error collecting fees:', error);
      toast.error('Failed to collect fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFees();
  }, [pairAddress]);

  if (!accumulatedFees) return null;

  return (
    <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Protocol Fees
          </span>
          <button
            onClick={checkFees}
            className="text-sm text-[#00ffbd] hover:text-[#00e6a9]"
          >
            Refresh
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Accumulated Fees</span>
          <span className="text-sm text-gray-200">
            {ethers.formatUnits(accumulatedFees, 18)} LP Tokens
          </span>
        </div>

        <button
          onClick={collectFees}
          disabled={loading || accumulatedFees === '0'}
          className={`
            w-full px-4 py-2 rounded-xl font-medium text-black text-sm
            ${loading || accumulatedFees === '0'
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
            }
          `}
        >
          {loading ? 'Collecting...' : 'Collect Fees'}
        </button>
      </div>
    </div>
  );
} 