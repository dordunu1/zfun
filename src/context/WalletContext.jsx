import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import toast from 'react-hot-toast';

const WalletContext = createContext();

const SUPPORTED_CHAINS = import.meta.env.VITE_SUPPORTED_CHAINS.split(',').map(Number);
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137
};

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const [loading, setLoading] = useState(false);

  const checkAndSwitchNetwork = async (targetChainId) => {
    if (!isConnected) return;
    
    if (chain?.id !== targetChainId) {
      try {
        await switchNetwork?.(targetChainId);
      } catch (error) {
        toast.error(`Please switch to supported network`);
      }
    }
  };

  const disconnectWallet = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ 
      account: address, 
      loading,
      disconnectWallet,
      checkAndSwitchNetwork
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};