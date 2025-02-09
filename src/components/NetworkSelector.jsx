import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork, useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

export default function NetworkSelector() {
  const { isLoading: networkLoading, chain, chains } = useNetwork();
  const { isConnected } = useAccount();
  const [isChangingNetwork, setIsChangingNetwork] = useState(false);

  // Handle network change errors
  useEffect(() => {
    const handleError = (error) => {
      if (error.message?.includes('Internal JSON-RPC error')) {
        setIsChangingNetwork(false);
        toast.error('Network switch failed. Please try again.');
      }
    };

    // Listen for MetaMask errors
    if (window.ethereum) {
      window.ethereum.on('error', handleError);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('error', handleError);
      }
    };
  }, []);

  // Handle network changes
  useEffect(() => {
    if (isConnected && chain) {
      setIsChangingNetwork(false);
    }
  }, [chain, isConnected]);

  return (
    <div className="relative" style={{ zIndex: 99999 }}>
      <ConnectButton 
        chainStatus={networkLoading || isChangingNetwork ? "loading" : "icon"}
        showBalance={false}
        accountStatus="address"
        onClick={() => {
          if (!networkLoading && !isChangingNetwork) {
            setIsChangingNetwork(true);
          }
        }}
      />
    </div>
  );
} 