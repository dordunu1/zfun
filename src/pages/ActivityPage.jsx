import React, { useState } from 'react';
import { FaExchangeAlt, FaPlus, FaWater, FaList, FaLayerGroup, FaHistory } from 'react-icons/fa';
import TokenSwap from '../components/dex/TokenSwap';
import PoolCreation from '../components/dex/PoolCreation';
import AddLiquidity from '../components/dex/AddLiquidity';
import MyPools from '../components/dex/MyPools';
import AllPools from '../components/dex/AllPools';
import Transactions from '../components/dex/Transactions';

const TABS = [
  { id: 'swap', label: 'Swap', icon: FaExchangeAlt },
  { id: 'transactions', label: 'Transactions', icon: FaHistory },
  { id: 'pool', label: 'Create Pool', icon: FaPlus },
  { id: 'liquidity', label: 'Add Liquidity', icon: FaWater },
  { id: 'my-pools', label: 'My Pools', icon: FaList },
  { id: 'all-pools', label: 'All Pools', icon: FaLayerGroup },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState('swap');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          DEX Activity
        </h1>

        {/* Main Container with L-shape corners and glowing dots */}
        <div className="relative">
          {/* L-shaped corners */}
          <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
            <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>
          <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
            <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
          </div>

          {/* Glowing dots in corners */}
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

          {/* Three dots in top right */}
          <div className="absolute top-3 right-3 flex gap-1 z-20">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 rounded-xl">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                    transition-all duration-200 relative group
                    ${activeTab === tab.id 
                      ? 'text-[#00ffbd] bg-[#00ffbd]/10' 
                      : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1b1f] hover:bg-gray-50 dark:hover:bg-[#1a1b1f]/80'
                    }
                    border border-gray-100 dark:border-gray-800
                  `}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  
                  {/* Active Indicator */}
                  <div className={`
                    absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                    transition-all duration-200
                    ${activeTab === tab.id ? 'bg-[#00ffbd]' : 'bg-transparent group-hover:bg-[#00ffbd]/30'}
                  `} />
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              {activeTab === 'swap' && <TokenSwap />}
              {activeTab === 'transactions' && <Transactions />}
              {activeTab === 'pool' && <PoolCreation />}
              {activeTab === 'liquidity' && <AddLiquidity />}
              {activeTab === 'my-pools' && <MyPools />}
              {activeTab === 'all-pools' && <AllPools />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 