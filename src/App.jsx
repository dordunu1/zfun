import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Modal } from '@web3modal/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import CreateNFTModal from './components/CreateNFTModal';
import FAQ from './components/FAQ';
import { useTheme } from './context/ThemeContext';
import { config, ethereumClient } from './config/wagmi';
import { WalletProvider } from './context/WalletContext';
import { DeploymentsProvider } from './context/DeploymentsContext';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { sepolia, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const { chains, publicClient } = configureChains(
  [sepolia, polygon],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  publicClient
});

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <WagmiConfig config={wagmiConfig}>
      <Web3Modal 
        projectId={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
        themeMode={isDarkMode ? 'dark' : 'light'}
      />
      
      <WalletProvider>
        <DeploymentsProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
            <Toaster position="top-right" />
            <Sidebar 
              onOpenModal={() => setIsModalOpen(true)}
              onOpenNFTModal={() => setIsNFTModalOpen(true)}
            />
            <div className="flex-1">
              <Header />
              <Outlet />
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
        </DeploymentsProvider>
      </WalletProvider>
    </WagmiConfig>
  );
}

export default App;