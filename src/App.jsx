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
import { config as wagmiConfig, ethereumClient } from './config/wagmi';
import { DeploymentsProvider } from './context/DeploymentsContext';
import { UniswapVersionProvider } from './context/UniswapVersionContext';
import { WagmiConfig } from 'wagmi';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <DeploymentsProvider>
      <WagmiConfig config={wagmiConfig}>
        <UniswapVersionProvider>
          <Web3Modal 
            projectId={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID}
            ethereumClient={ethereumClient}
            themeMode={isDarkMode ? 'dark' : 'light'}
          />
          
          <div className="min-h-screen bg-white dark:bg-[#0a0b0f]">
            <Toaster position="top-right" />
            <Sidebar 
              onOpenModal={() => setIsModalOpen(true)}
              onOpenNFTModal={() => setIsNFTModalOpen(true)}
            />
            <div className="flex-1 bg-white dark:bg-[#0a0b0f]">
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
              onClose={() => setIsFAQOpen(false)}
            />
          </div>
        </UniswapVersionProvider>
      </WagmiConfig>
    </DeploymentsProvider>
  );
}

export default App;