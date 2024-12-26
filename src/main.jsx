import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { config, ethereumClient } from './config/wagmi';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './router';
import './index.css';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Check if we're on mobile
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator?.userAgent || '');

// If on mobile Chrome without a provider, inject a dummy provider to prevent errors
if (isMobile && !window.ethereum) {
  window.ethereum = {
    isMetaMask: false,
    request: () => Promise.reject(new Error('No crypto wallet found')),
    on: () => {},
    removeListener: () => {},
    autoRefreshOnNetworkChange: false,
    chainId: null,
    networkVersion: null,
    selectedAddress: null,
    isConnected: () => false,
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </WagmiConfig>
    <Web3Modal 
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode="dark"
      themeVariables={{
        '--w3m-font-family': 'Inter, sans-serif',
        '--w3m-accent-color': '#00ffbd'
      }}
    />
  </React.StrictMode>
);