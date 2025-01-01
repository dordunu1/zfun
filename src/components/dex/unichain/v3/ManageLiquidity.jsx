import React, { useState } from 'react';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';

export default function ManageLiquidity() {
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'remove'

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 dark:bg-[#1a1b1f] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Liquidity</h2>
      
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
          <AddLiquidity />
        ) : (
          <RemoveLiquidity />
        )}
      </div>
    </div>
  );
} 