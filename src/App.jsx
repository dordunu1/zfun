import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import CreateNFTModal from './components/CreateNFTModal';
import FAQ from './components/FAQ';
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'
import { config, ethereumClient } from './config/wagmi'
import { BiRocket, BiShield, BiCoin, BiPalette, BiLineChart, BiCog, BiStore, BiTransfer, BiWater, BiCollection } from 'react-icons/bi';
import { useDeployments } from './context/DeploymentsContext';
import { formatDistanceToNow } from 'date-fns';
import { DeploymentsProvider } from './context/DeploymentsContext';

const getExplorerUrl = (chainId, address) => {
  switch (chainId) {
    case 137:
      return `https://polygonscan.com/token/${address}`;
    case 11155111:
      return `https://sepolia.etherscan.io/token/${address}`;
    default:
      return '#';
  }
};

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { darkMode } = useTheme();
  const { deployments } = useDeployments();

  const features = [
    {
      icon: BiRocket,
      title: "Launch in Minutes",
      description: "Create your own ERC20 tokens with just a few clicks. No coding required.",
      gradient: "from-[#00ffbd] to-[#00e6a9]"
    },
    {
      icon: BiShield,
      title: "Battle-Tested Security",
      description: "Built on OpenZeppelin's proven smart contract standards with additional security measures.",
      gradient: "from-[#00e6a9] to-[#00cc96]"
    },
    {
      icon: BiCoin,
      title: "Full Token Control",
      description: "Set supply, name, symbol, and decimals. Receive complete ownership of your token.",
      gradient: "from-[#00cc96] to-[#00b383]"
    },
    {
      icon: BiPalette,
      title: "NFT Creation (Coming Soon)",
      description: "Design and launch your own NFT collections with customizable properties.",
      gradient: "from-[#00b383] to-[#009970]"
    },
    {
      icon: BiLineChart,
      title: "Multi-Chain Support",
      description: "Deploy on Polygon for low fees, or choose Sepolia for testing. Z Chain coming soon.",
      gradient: "from-[#009970] to-[#00805d]"
    },
    {
      icon: BiCog,
      title: "Simple Management",
      description: "Easy-to-use interface for managing your tokens and tracking deployments.",
      gradient: "from-[#00805d] to-[#00664a]"
    }
  ];

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
        <Toaster position="top-right" />
        <Sidebar 
          onOpenModal={() => setIsModalOpen(true)}
          onOpenNFTModal={() => setIsNFTModalOpen(true)}
        />
        <div className="flex-1">
          <Header />
          <main className="mt-16 p-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Welcome to Token Factory
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Launch your own tokens and NFTs on Polygon Mainnet and Z Chain (coming soon). 
                Start creating now with our simple, secure, and powerful platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative p-6 bg-white dark:bg-[#1a1b1f] rounded-2xl border border-gray-200 dark:border-gray-800 group-hover:border-transparent transition-colors duration-300">
                    <feature.icon className="w-12 h-12 mb-4 text-[#00ffbd]" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-7xl mx-auto mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Ecosystem Integrations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <BiWater className="w-8 h-8 text-[#00ffbd]" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add Liquidity & Trade
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    List your token on popular DEXes and create trading pairs
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://quickswap.exchange/#/pools" target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm">
                      QuickSwap
                    </a>
                    <a href="https://app.sushi.com/pools" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                      SushiSwap
                    </a>
                    <a href="https://app.uniswap.org/#/pools" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 text-sm">
                      Uniswap
                    </a>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                      More coming soon
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <BiStore className="w-8 h-8 text-[#00ffbd]" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      NFT Marketplaces
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    List your NFTs on popular marketplaces instantly
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                      OpenSea
                    </a>
                    <a href="https://market.wilderworld.com/" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm">
                      WWMarket
                    </a>
                    <a href="https://rarible.com/" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm">
                      Rarible
                    </a>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                      More coming soon
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <BiTransfer className="w-8 h-8 text-[#00ffbd]" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Deployments
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {deployments.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tokens deployed yet
                      </p>
                    ) : (
                      deployments.slice(0, 5).map((deployment, index) => (
                        <div 
                          key={deployment.timestamp}
                          className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={deployment.logo.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                              alt={deployment.name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/token-default.png';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {deployment.name} ({deployment.symbol})
                                </span>
                                <BiShield 
                                  className="text-[#00ffbd]" 
                                  size={16} 
                                  title="Non-Mintable Token"
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                on {deployment.chainName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(deployment.timestamp, { addSuffix: true })}
                            </div>
                            <a 
                              href={getExplorerUrl(deployment.chainId, deployment.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
                            >
                              Supply: {Number(deployment.totalSupply).toLocaleString()}
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <BiLineChart className="w-8 h-8 text-[#00ffbd]" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Token Analytics
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Track your token's performance and trading activity
                  </p>
                  
                  {/* Trading View Style Chart */}
                  <div className="mt-4 h-[200px] bg-gray-50 dark:bg-[#1a1b1f] rounded-lg p-4 relative overflow-hidden">
                    {/* Chart Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ZFUN/POL</span>
                        <span className="text-xs text-[#00ffbd]">+2.45%</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3d3f46]">1H</button>
                        <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2d2f36] text-[#00ffbd]">24H</button>
                        <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3d3f46]">7D</button>
                      </div>
                    </div>
                    
                    {/* Placeholder Chart */}
                    <div className="relative h-[120px]">
                      {/* Gradient Line */}
                      <div className="absolute inset-0">
                        <svg className="w-full h-full">
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00ffbd" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#00ffbd" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M0,100 C50,80 100,120 150,60 C200,0 250,40 300,20 L300,150 L0,150 Z" 
                            fill="url(#gradient)"
                            className="transition-all duration-300"
                          />
                          <path 
                            d="M0,100 C50,80 100,120 150,60 C200,0 250,40 300,20" 
                            fill="none"
                            stroke="#00ffbd"
                            strokeWidth="2"
                            className="transition-all duration-300"
                          />
                        </svg>
                      </div>
                      
                      {/* Price Points */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                        <span>$1.24</span>
                        <span>$1.12</span>
                        <span>$1.00</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trading Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Volume 24h</div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">369K</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Liquidity</div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">$369K</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Holders</div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">69</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <CreateTokenModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
        <CreateNFTModal 
          isOpen={isNFTModalOpen}
          onClose={() => setIsNFTModalOpen(false)}
        />
        <FAQ 
          isOpen={isFAQOpen}
          onClose={setIsFAQOpen}
        />
      </div>

      <Web3Modal 
        projectId={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeMode={darkMode ? 'dark' : 'light'}
      />
    </>
  );
}

function App() {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider>
        <WalletProvider>
          <DeploymentsProvider>
            <AppContent />
          </DeploymentsProvider>
        </WalletProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;