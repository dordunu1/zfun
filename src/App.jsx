import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import FAQ from './components/FAQ';
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'
import { config, ethereumClient } from './config/wagmi'
import { BiRocket, BiShield, BiCoin, BiPalette, BiLineChart, BiCog } from 'react-icons/bi';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { darkMode } = useTheme();

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
        <Sidebar onCreateToken={() => setIsModalOpen(true)} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
          </main>
        </div>
        <CreateTokenModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
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
          <AppContent />
        </WalletProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default App;