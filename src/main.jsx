import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { config, ethereumClient } from './config/wagmi';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </WagmiConfig>
  </React.StrictMode>
);