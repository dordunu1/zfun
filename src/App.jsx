import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Modal } from '@web3modal/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import CreateNFTModal from './components/CreateNFTModal';
import CreateRandomNFTModal from './components/CreateRandomNFTModal';
import FAQ from './components/FAQ';
import { useTheme } from './context/ThemeContext';
import { config as wagmiConfig, ethereumClient } from './config/wagmi';
import { DeploymentsProvider } from './context/DeploymentsContext';
import { WagmiConfig } from 'wagmi';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isRandomNFTModalOpen, setIsRandomNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleOpenNFTModal = (type) => {
    if (type === 'random') {
      setIsRandomNFTModalOpen(true);
    } else {
      setIsNFTModalOpen(true);
    }
  };

  return (
    <DeploymentsProvider>
      <WagmiConfig config={wagmiConfig}>
        <Web3Modal 
          projectId={import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID}
          ethereumClient={ethereumClient}
          themeMode={isDarkMode ? 'dark' : 'light'}
        />
        
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
          <Toaster position="top-right" />
          <Sidebar 
            onOpenModal={() => setIsModalOpen(true)}
            onOpenNFTModal={handleOpenNFTModal}
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
          <CreateRandomNFTModal 
            isOpen={isRandomNFTModalOpen}
            onClose={() => setIsRandomNFTModalOpen(false)}
          />
          <FAQ 
            isOpen={isFAQOpen}
            onClose={setIsFAQOpen}
          />
        </div>
      </WagmiConfig>
    </DeploymentsProvider>
  );
}

export default App;