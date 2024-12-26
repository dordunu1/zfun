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