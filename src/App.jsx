import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSales from './pages/admin/AdminSales';
import StoreVerification from './pages/admin/StoreVerification';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateTokenModal from './components/CreateTokenModal';
import CreateNFTModal from './components/CreateNFTModal';
import FAQ from './components/FAQ';
import { useTheme } from './context/ThemeContext';
import { wagmiConfig, chains } from './config/wagmi';
import { DeploymentsProvider } from './context/DeploymentsContext';
import { UniswapVersionProvider } from './context/UniswapVersionContext';
import { WagmiConfig } from 'wagmi';
import { MerchAuthProvider } from './context/MerchAuthContext';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Dashboard from './components/Dashboard';
import CollectionsList from './components/CollectionsList';
import CollectionPage from './components/CollectionPage';
import HistoryPage from './pages/HistoryPage';
import AccountPage from './pages/AccountPage';
import ActivityPage from './pages/ActivityPage';
import BridgePage from './pages/bridge';
import FeesTracker from './pages/FeesTracker';
import MemeFactory from './pages/MemeFactory';

function App() {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const [providerError, setProviderError] = useState(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    const checkProvider = async () => {
      try {
        if (window.ethereum?.request) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsProviderLoading(false);
          setProviderError(null);
          return true;
        }
        return false;
      } catch (error) {
        console.warn('Provider check failed:', error);
        return false;
      }
    };

    const initializeProvider = async () => {
      const hasProvider = await checkProvider();
      
      if (!hasProvider && retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying provider check (${retryCount}/${maxRetries})...`);
        setTimeout(initializeProvider, retryDelay);
      } else if (!hasProvider) {
        setProviderError('Unable to connect to Web3 provider. Please make sure your wallet is connected.');
        setIsProviderLoading(false);
      }
    };

    initializeProvider();

    return () => {
      // Cleanup if needed
    };
  }, []);

  if (isProviderLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ffbd] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Web3 Provider...</p>
        </div>
      </div>
    );
  }

  if (providerError) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{providerError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00ffbd] text-black rounded-lg hover:opacity-90"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <DeploymentsProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={isDarkMode ? darkTheme({
            accentColor: '#00ffbd',
            accentColorForeground: 'black',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          }) : lightTheme({
            accentColor: '#00ffbd',
            accentColorForeground: 'black',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="wide"
          showRecentTransactions={true}
          appInfo={{
            appName: 'Token Factory',
          }}
        >
          <UniswapVersionProvider>
            <div className="min-h-screen bg-white dark:bg-[#0a0b0f]">
              <Toaster position="top-right" />
              <div className="flex">
                <Sidebar 
                  onOpenModal={() => setIsModalOpen(true)}
                  onOpenNFTModal={() => setIsNFTModalOpen(true)}
                />
                <div className="flex-1 bg-white dark:bg-[#0a0b0f]">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/collections" element={<CollectionsList />} />
                    <Route path="/collection/:symbol" element={<CollectionPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/bridge" element={<BridgePage />} />
                    <Route path="/feestracker" element={<FeesTracker />} />
                    <Route path="/memefactory" element={<MemeFactory />} />
                    <Route path="/trading" element={<ActivityPage />} />
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="sales" element={<AdminSales />} />
                      <Route path="store-verification" element={<StoreVerification />} />
                    </Route>
                  </Routes>
                </div>
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
        </RainbowKitProvider>
      </WagmiConfig>
    </DeploymentsProvider>
  );
}

export default App;