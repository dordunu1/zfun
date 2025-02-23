import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './config/wagmi';
import { ThemeProvider } from './context/ThemeContext';
import { MerchAuthProvider } from './context/MerchAuthContext';
import { router } from './router';
import './index.css';

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