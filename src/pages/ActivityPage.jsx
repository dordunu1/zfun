import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaPlus, FaWater, FaList } from 'react-icons/fa';
import { useNetwork, useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import SepoliaTokenSwap from '../components/dex/TokenSwap';
import UnichainTokenSwapV2 from '../components/dex/unichain/v2/TokenSwap';
import UnichainTokenSwapV3 from '../components/dex/unichain/v3/TokenSwap';
import SepoliaPoolCreation from '../components/dex/PoolCreation';
import UnichainPoolCreationV2 from '../components/dex/unichain/v2/PoolCreation';
import UnichainPoolCreationV3 from '../components/dex/unichain/v3/PoolCreation';
import SepoliaManageLiquidity from '../components/dex/ManageLiquidity';
import UnichainAddLiquidityV2 from '../components/dex/unichain/v2/AddLiquidity';
import UnichainAddLiquidityV3 from '../components/dex/unichain/v3/AddLiquidity';
import UnichainRemoveLiquidityV2 from '../components/dex/unichain/v2/RemoveLiquidity';
import UnichainRemoveLiquidityV3 from '../components/dex/unichain/v3/RemoveLiquidity';
import SepoliaMyPools from '../components/dex/MyPools';
import UnichainMyPoolsV2 from '../components/dex/unichain/v2/MyPools';
import UnichainMyPoolsV3 from '../components/dex/unichain/v3/MyPools';
import { unichainTestnet } from '../config/wagmi';
import VersionToggle from '../components/dex/unichain/shared/VersionToggle';
import { useUniswapVersion } from '../hooks/useUniswapVersion';
import UnichainManageLiquidityV2 from '../components/dex/unichain/v2/ManageLiquidity';
import UnichainManageLiquidityV3 from '../components/dex/unichain/v3/ManageLiquidity';
import { useLocation } from 'react-router-dom';

const getTabsForVersion = (version) => {
  if (version === 'v2') {
    return [
      { id: 'swap', label: 'Swap', icon: FaExchangeAlt },
      { id: 'my-pools', label: 'My Pools', icon: FaList },
      { id: 'pool', label: 'Create Pool', icon: FaPlus },
      { id: 'liquidity', label: 'Add/Remove Liquidity', icon: FaWater },
    ];
  } else {
    return [
      { id: 'swap', label: 'Swap', icon: FaExchangeAlt },
      { id: 'my-pools', label: 'My Positions', icon: FaList },
      { id: 'pool', label: 'Create Position', icon: FaPlus },
    ];
  }
};

export default function ActivityPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('swap');
  const [selectedTokens, setSelectedTokens] = useState(null);
  const [selectedPoolAddress, setSelectedPoolAddress] = useState(null);
  const { chain } = useNetwork();
  const { address: account } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [zKeyPresses, setZKeyPresses] = useState([]);
  const { version } = useUniswapVersion();
  const TABS = getTabsForVersion(version);

  // Modified setActiveTab to handle additional data
  const handleTabChange = (tab, data) => {
    setActiveTab(tab);
    if (data?.selectedTokens) {
      setSelectedTokens(data.selectedTokens);
    }
    if (data?.poolAddress) {
      setSelectedPoolAddress(data.poolAddress);
    }
  };

  // Handle key presses for dev mode toggle
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'z') {
        const now = Date.now();
        setZKeyPresses(prev => {
          // Add current timestamp and keep only last 3 presses
          const newPresses = [...prev, now].slice(-3);
          
          // Check if we have 3 presses within 2 seconds
          if (newPresses.length === 3 && 
              (newPresses[2] - newPresses[0]) <= 2000) {
            // Toggle dev mode and reset presses
            setDevModeEnabled(prev => !prev);
            return [];
          }
          
          return newPresses;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Function to get the appropriate component based on chain
  const getChainComponent = (componentType) => {
    if (!chain) return null;

    if (chain.id === 11155111 && !devModeEnabled) {
      return (
        <div className="text-center py-8 text-gray-500">
          Please switch to Unichain network
        </div>
      );
    }

    switch (componentType) {
      case 'swap':
        if (chain.id === unichainTestnet.id) {
          return version === 'v2' ? <UnichainTokenSwapV2 /> : <UnichainTokenSwapV3 />;
        } else if (chain.id === 11155111 && devModeEnabled) {
          return <SepoliaTokenSwap />;
        }
        break;
      case 'pool':
        if (chain.id === unichainTestnet.id) {
          return version === 'v2' 
            ? <UnichainPoolCreationV2 setActiveTab={handleTabChange} /> 
            : <UnichainPoolCreationV3 setActiveTab={handleTabChange} />;
        } else if (chain.id === 11155111 && devModeEnabled) {
          return <SepoliaPoolCreation setActiveTab={handleTabChange} />;
        }
        break;
      case 'liquidity':
        if (chain.id === unichainTestnet.id) {
          return version === 'v2' 
            ? <UnichainManageLiquidityV2 initialTokens={selectedTokens} poolAddress={selectedPoolAddress} /> 
            : <UnichainManageLiquidityV3 initialTokens={selectedTokens} poolAddress={selectedPoolAddress} />;
        } else if (chain.id === 11155111 && devModeEnabled) {
          return <SepoliaManageLiquidity initialTokens={selectedTokens} poolAddress={selectedPoolAddress} />;
        }
        break;
      case 'my-pools':
        if (chain.id === unichainTestnet.id) {
          return version === 'v2' ? <UnichainMyPoolsV2 /> : <UnichainMyPoolsV3 />;
        } else if (chain.id === 11155111 && devModeEnabled) {
          return <SepoliaMyPools />;
        }
        break;
    }

    return (
      <div className="text-center py-8 text-gray-500">
        Please switch to Unichain network
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Trading
          </h1>
          <div className="flex items-center gap-4">
            {devModeEnabled && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-900">
                Dev Mode
              </span>
            )}
          </div>
        </div>

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
            {!account ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 mb-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#00ffbd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9l-6 6m0-6l6 6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                  Please connect your wallet to access the trading features. You'll be able to swap tokens, manage liquidity, and more.
                </p>
                <button
                  onClick={openConnectModal}
                  className="px-6 py-3 bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Connect Wallet
                </button>
              </div>
            ) : (
              <>
                {/* Network Warning for Sepolia when Dev Mode is disabled */}
                {chain?.id === 11155111 && !devModeEnabled && (
                  <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      You are connected to Sepolia network. Please switch to Unichain network or enable Dev Mode to use Sepolia.
                    </p>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    {TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
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
                  {chain?.id === unichainTestnet.id && <VersionToggle />}
                </div>

                {/* Tab Content */}
                <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                  {activeTab === 'swap' && getChainComponent('swap')}
                  {activeTab === 'pool' && getChainComponent('pool')}
                  {activeTab === 'liquidity' && getChainComponent('liquidity')}
                  {activeTab === 'my-pools' && getChainComponent('my-pools')}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 