import React, { useState } from 'react';
import RecentMints from './tabs/RecentMints';
import TopHolders from './tabs/TopHolders';
import ChadMinters from './tabs/ChadMinters';
import VolumeMetrics from './tabs/VolumeMetrics';

const TABS = [
  { id: 'recent', label: '🔥 Recent Mints' },
  { id: 'holders', label: '👑 Top Holders' },
  { id: 'chads', label: '🚀 Chad Minters' },
  { id: 'volume', label: '📈 Volume' },
];

export default function AnalyticsTabs({ collection }) {
  const [activeTab, setActiveTab] = useState('recent');

  // Make collection data available globally for child components
  if (collection?.contractAddress) {
    window.collectionData = collection;
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              transition-all duration-200 relative group
              ${activeTab === tab.id 
                ? 'text-[#00ffbd] bg-[#00ffbd]/10' 
                : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1b1f] hover:bg-gray-50 dark:hover:bg-[#1a1b1f]/80'
              }
              border border-gray-100 dark:border-gray-800
            `}
          >
            {/* Glow Effect */}
            {activeTab === tab.id && (
              <div className="absolute inset-0 rounded-lg bg-[#00ffbd]/5 blur-xl -z-10" />
            )}
            
            {/* Tab Label */}
            <span className="relative z-10">{tab.label}</span>
            
            {/* Active Indicator */}
            <div className={`
              absolute bottom-0 left-0 right-0 h-0.5 rounded-full
              transition-all duration-200
              ${activeTab === tab.id ? 'bg-[#00ffbd]' : 'bg-transparent group-hover:bg-[#00ffbd]/30'}
            `} />
          </button>
        ))}
      </div>

      {/* Modified Tab Content Container with Futuristic Style */}
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
        <div className="relative z-10 bg-white dark:bg-[#1a1b1f] rounded-xl">
          <div className="p-6 h-[400px] md:h-[600px]">
            {activeTab === 'recent' && <RecentMints />}
            {activeTab === 'holders' && <TopHolders collection={collection} />}
            {activeTab === 'chads' && <ChadMinters />}
            {activeTab === 'volume' && <VolumeMetrics />}
          </div>
        </div>
      </div>
    </div>
  );
} 