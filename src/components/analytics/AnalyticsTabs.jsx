import React, { useState } from 'react';
import RecentMints from './tabs/RecentMints';
import TopHolders from './tabs/TopHolders';
import Chat from './tabs/Chat';
import VolumeMetrics from './tabs/VolumeMetrics';

const TABS = [
  { id: 'recent', label: '🔥 Recent Mints' },
  { id: 'holders', label: '👑 Top Holders' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'volume', label: '📈 Volume' },
];

// Animated Cat Component for Coming Soon
const ComingSoonCat = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-6">
    <div className="relative w-48 h-48">
      {/* Cat Body */}
      <div className="absolute w-32 h-24 bg-[#00ffbd]/20 rounded-[50%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 animate-[float_3s_ease-in-out_infinite]">
        {/* Cat Head */}
        <div className="absolute w-24 h-20 bg-[#00ffbd]/20 rounded-full -left-4 -top-8">
          {/* Eyes */}
          <div className="absolute top-8 left-6 w-3 h-3 bg-[#00ffbd] rounded-full animate-[blink_4s_ease-in-out_infinite]" />
          <div className="absolute top-8 right-6 w-3 h-3 bg-[#00ffbd] rounded-full animate-[blink_4s_ease-in-out_infinite]" />
          {/* Nose */}
          <div className="absolute top-11 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-[#00ffbd] rounded-full" />
          {/* Whiskers */}
          <div className="absolute top-12 left-4 w-6 h-0.5 bg-[#00ffbd]/60 rotate-[15deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
          <div className="absolute top-13 left-4 w-6 h-0.5 bg-[#00ffbd]/60 -rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
          <div className="absolute top-12 right-4 w-6 h-0.5 bg-[#00ffbd]/60 -rotate-[15deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
          <div className="absolute top-13 right-4 w-6 h-0.5 bg-[#00ffbd]/60 rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
        </div>
        {/* Ears */}
        <div className="absolute -top-12 left-2 w-8 h-8 bg-[#00ffbd]/20 rounded-tr-[50%] rounded-tl-[50%] -rotate-[15deg] animate-[earTwitch_5s_ease-in-out_infinite]" />
        <div className="absolute -top-12 right-8 w-8 h-8 bg-[#00ffbd]/20 rounded-tr-[50%] rounded-tl-[50%] rotate-[15deg] animate-[earTwitch_5s_ease-in-out_infinite_0.5s]" />
        {/* Legs */}
        <div className="absolute bottom-0 left-2 w-4 h-8 bg-[#00ffbd]/20 rounded-b-full animate-[legSwing_2s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-8 w-4 h-8 bg-[#00ffbd]/20 rounded-b-full animate-[legSwing_2s_ease-in-out_infinite_0.5s]" />
        <div className="absolute bottom-0 right-8 w-4 h-8 bg-[#00ffbd]/20 rounded-b-full animate-[legSwing_2s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-0 right-2 w-4 h-8 bg-[#00ffbd]/20 rounded-b-full animate-[legSwing_2s_ease-in-out_infinite_1.5s]" />
        {/* Tail */}
        <div className="absolute -right-12 top-1/2 w-12 h-3 bg-[#00ffbd]/20 rounded-full origin-left animate-[tailWag_3s_ease-in-out_infinite]" />
      </div>
    </div>
    <div className="text-[#00ffbd] font-medium text-xl animate-pulse">Coming Soon...</div>
  </div>
);

// Add keyframes for the animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
    50% { transform: translate(-50%, -50%) translateY(-10px); }
  }
  @keyframes blink {
    0%, 95%, 100% { transform: scaleY(1); }
    97.5% { transform: scaleY(0); }
  }
  @keyframes tailWag {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }
  @keyframes legSwing {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(15deg); }
  }
  @keyframes whiskerMove {
    0%, 100% { transform: rotate(var(--rotate, 0deg)); }
    50% { transform: rotate(calc(var(--rotate, 0deg) + 5deg)); }
  }
  @keyframes earTwitch {
    0%, 90%, 100% { transform: rotate(var(--rotate, 0deg)); }
    95% { transform: rotate(calc(var(--rotate, 0deg) + 5deg)); }
  }
`;
document.head.appendChild(style);

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
          <div key={tab.id} className="relative group">
            <button
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

            {/* Coming Soon Tooltip */}
            {tab.comingSoon && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming Soon
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
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
            {activeTab === 'chat' && <Chat 
              collection={{
                ...collection,
                creator: collection.creator || collection.creatorAddress,
                contractAddress: collection.contractAddress
              }} 
            />}
            {activeTab === 'volume' && <VolumeMetrics contractAddress={collection?.contractAddress} network={collection?.network} />}
          </div>
        </div>
      </div>
    </div>
  );
} 