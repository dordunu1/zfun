import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const WalletContext = createContext();

const SUPPORTED_CHAINS = import.meta.env.VITE_SUPPORTED_CHAINS.split(',').map(Number);
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137
};

const getFactoryAddress = (chainId) => FACTORY_ADDRESSES[chainId];

export function WalletProvider({ children }) {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);

  const checkAndSwitchNetwork = async (targetChainId) => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== `0x${Number(targetChainId).toString(16)}`) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(targetChainId).toString(16)}` }],
        });
      }
    } catch (error) {
      toast.error(`Please switch to supported network`);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      await checkAndSwitchNetwork(SUPPORTED_CHAINS[0]);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      toast.success('Wallet connected!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    toast.success('Wallet disconnected');
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, loading, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);