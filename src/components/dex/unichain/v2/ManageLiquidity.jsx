import React, { useState, useEffect } from 'react';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import { useUnichain } from '../../../../hooks/useUnichain';

export default function ManageLiquidity({ initialTokens, poolAddress }) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'remove'
  const [poolDetails, setPoolDetails] = useState(null);
  const uniswap = useUnichain();

  // Fetch pool details when pool address is provided
  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (poolAddress) {
        try {
          const details = await uniswap.getPoolDetails(poolAddress);
          setPoolDetails(details);
          // If we have pool details, automatically show the add liquidity tab
          setActiveTab('add');
        } catch (error) {
          console.error('Error fetching pool details:', error);
        }
      }
    };
    fetchPoolDetails();
  }, [poolAddress, uniswap]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 dark:bg-[#1a1b1f] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add/Remove Liquidity</h2>
      
      {/* Pool Details Section - Show if we have a specific pool */}
      {poolDetails && (
        <div className="mb-6 p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Pool Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tokens</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {poolDetails.token0Symbol}/{poolDetails.token1Symbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Liquidity</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                ${poolDetails.totalLiquidity?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 dark:bg-[#2d2f36] rounded-xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${activeTab === 'add'
              ? 'bg-[#00ffbd] text-black shadow-lg shadow-[#00ffbd]/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }
          `}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${activeTab === 'remove'
              ? 'bg-[#00ffbd] text-black shadow-lg shadow-[#00ffbd]/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }
          `}
        >
          Remove Liquidity
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'add' ? (
          <AddLiquidity 
            initialTokens={initialTokens} 
            poolAddress={poolAddress}
            poolDetails={poolDetails}
          />
        ) : (
          <RemoveLiquidity 
            initialTokens={initialTokens}
            poolAddress={poolAddress}
            poolDetails={poolDetails}
          />
        )}
      </div>
    </div>
  );
} 