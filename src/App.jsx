import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import CreateNFTModal from './components/CreateNFTModal';
import FAQ from './components/FAQ';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { config, ethereumClient } from './config/wagmi';
import { WalletProvider } from './context/WalletContext';
import { DeploymentsProvider } from './context/DeploymentsContext';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const { darkMode } = useTheme();

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