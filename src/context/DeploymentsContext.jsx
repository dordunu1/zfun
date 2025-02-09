import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { saveTokenDeployment, getAllTokenDeployments, getCollectionsByWallet } from '../services/firebase';

const DeploymentsContext = createContext();

export function DeploymentsProvider({ children }) {
  const { address } = useAccount();
  const [deployments, setDeployments] = useState([]);
  const [nftDeployments, setNftDeployments] = useState([]);

  // Load deployments from Firebase when wallet connects/changes
  useEffect(() => {
    const loadDeployments = async () => {
      try {
        // Load all token deployments regardless of creator
        const allDeployments = await getAllTokenDeployments();
        setDeployments(allDeployments);

        // Load NFT deployments only for connected wallet
        if (address) {
          const nftCollections = await getCollectionsByWallet(address);
          const formattedNftDeployments = nftCollections.map(nft => ({
            ...nft,
            type: 'nft',
            logo: nft.previewUrl,
            logoIpfs: nft.imageIpfsUrl,
            totalSupply: nft.maxSupply,
            timestamp: nft.createdAt,
            chainName: nft.network === 'polygon' ? 'Polygon' : 'Sepolia'
          }));
          setNftDeployments(formattedNftDeployments);
        } else {
          setNftDeployments([]);
        }
      } catch (error) {
        console.error('Error loading deployments:', error);
        setDeployments([]);
        setNftDeployments([]);
      }
    };

    loadDeployments();
  }, [address]);

  const addDeployment = async (deployment) => {
    if (!address) return;
    
    try {
      await saveTokenDeployment(deployment, address);
      // Refresh all deployments after adding a new one
      const allDeployments = await getAllTokenDeployments();
      setDeployments(allDeployments);
    } catch (error) {
      throw error;
    }
  };

  // Combine token and NFT deployments for the UI
  const allDeployments = [...deployments, ...nftDeployments]
    .sort((a, b) => {
      const timeA = a.timestamp || a.createdAt;
      const timeB = b.timestamp || b.createdAt;
      return timeB - timeA;
    })
    .slice(0, 10);

  return (
    <DeploymentsContext.Provider value={{ deployments: allDeployments, addDeployment }}>
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