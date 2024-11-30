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

export default function AnalyticsTabs() {
  const [activeTab, setActiveTab] = useState('recent');

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

      {/* Tab Content */}
      <div className="bg-white dark:bg-[#1a1b1f] rounded-xl">
        <div className="p-6 h-[400px] md:h-[600px]">
          {activeTab === 'recent' && <RecentMints />}
          {activeTab === 'holders' && <TopHolders />}
          {activeTab === 'chads' && <ChadMinters />}
          {activeTab === 'volume' && <VolumeMetrics />}
        </div>
      </div>
    </div>
  );
} 