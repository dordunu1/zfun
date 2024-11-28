import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, usePublicClient, useWalletClient } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { connect } = useConnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      await connect({ connector: new MetaMaskConnector() });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Create a stable reference to provider and signer
  const provider = publicClient;
  const signer = walletClient;

  return (
    <WalletContext.Provider value={{ 
      account, 
      provider: provider || null, 
      signer: signer || null, 
      connectWallet,
      isConnecting 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}