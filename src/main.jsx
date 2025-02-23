import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './config/wagmi';
import { ThemeProvider } from './context/ThemeContext';
import { MerchAuthProvider } from './context/MerchAuthContext';
import { router } from './router';
import './index.css';

// If no provider is available, inject a dummy provider to prevent errors
if (!window.ethereum) {
  window.ethereum = {
    isMetaMask: false,
    request: () => Promise.reject(new Error('No crypto wallet found. Please install MetaMask or another Web3 wallet.')),
    on: (eventName, callback) => {
      // Return a no-op function for cleanup
      return () => {};
    },
    removeListener: () => {},
    autoRefreshOnNetworkChange: false,
    chainId: null,
    networkVersion: null,
    selectedAddress: null,
    isConnected: () => false,
    enable: () => Promise.reject(new Error('No crypto wallet found. Please install MetaMask or another Web3 wallet.')),
    sendAsync: () => Promise.reject(new Error('No crypto wallet found')),
    send: () => Promise.reject(new Error('No crypto wallet found')),
    addListener: () => {},
    removeAllListeners: () => {},
    providers: [],
    isEIP1193: true,
  };
}

function Root() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ThemeProvider>
        <MerchAuthProvider>
          <RouterProvider router={router} />
        </MerchAuthProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);