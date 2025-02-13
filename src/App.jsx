import React, { useState } from 'react';
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