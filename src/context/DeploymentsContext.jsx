import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const DeploymentsContext = createContext();

export function DeploymentsProvider({ children }) {
  const { address } = useAccount();
  const [deployments, setDeployments] = useState([]);

  // Load deployments from localStorage on mount
  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`deployments_${address}`);
      if (stored) {
        setDeployments(JSON.parse(stored));
      }
    }
  }, [address]);

  const addDeployment = (deployment) => {
    const newDeployments = [
      {
        ...deployment,
        timestamp: Date.now(),
      },
      ...deployments,
    ].slice(0, 10); // Keep only last 10 deployments

    setDeployments(newDeployments);
    if (address) {
      localStorage.setItem(`deployments_${address}`, JSON.stringify(newDeployments));
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