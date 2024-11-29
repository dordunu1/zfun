import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { saveTokenDeployment, getTokenDeploymentsByWallet } from '../services/firebase';

const DeploymentsContext = createContext();

export function DeploymentsProvider({ children }) {
  const { address } = useAccount();
  const [deployments, setDeployments] = useState([]);

  // Load deployments from Firebase when wallet connects/changes
  useEffect(() => {
    const loadDeployments = async () => {
      if (address) {
        try {
          const walletDeployments = await getTokenDeploymentsByWallet(address);
          const sortedDeployments = walletDeployments
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10);
          setDeployments(sortedDeployments);
        } catch (error) {
          console.error('Error loading deployments:', error);
        }
      } else {
        setDeployments([]);
      }
    };

    loadDeployments();
  }, [address]);

  const addDeployment = async (deployment) => {
    if (!address) return;
    
    try {
      await saveTokenDeployment(deployment, address);
      const walletDeployments = await getTokenDeploymentsByWallet(address);
      const sortedDeployments = walletDeployments
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10);
      setDeployments(sortedDeployments);
    } catch (error) {
      console.error('Error adding deployment:', error);
      throw error;
    }
  };

  return (
    <DeploymentsContext.Provider value={{ deployments, addDeployment }}>
      {children}
    </DeploymentsContext.Provider>
  );
}

export const useDeployments = () => {
  const context = useContext(DeploymentsContext);
  if (!context) {
    throw new Error('useDeployments must be used within a DeploymentsProvider');
  }
  return context;
}; 