import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { DeploymentsProvider } from './context/DeploymentsContext';
import { router } from './router';
import { config } from './config/wagmi';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider>
        <WalletProvider>
          <DeploymentsProvider>
            <RouterProvider router={router} />
          </DeploymentsProvider>
        </WalletProvider>
      </ThemeProvider>
    </WagmiConfig>
  </React.StrictMode>
);