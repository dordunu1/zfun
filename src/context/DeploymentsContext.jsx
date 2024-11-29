import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { saveTokenDeployment, getTokenDeploymentsByWallet, getCollectionsByWallet } from '../services/firebase';

const DeploymentsContext = createContext();

export function DeploymentsProvider({ children }) {
  const { address } = useAccount();
  const [deployments, setDeployments] = useState([]);
  const [nftDeployments, setNftDeployments] = useState([]);

  // Load deployments from Firebase when wallet connects/changes
  useEffect(() => {
    const loadDeployments = async () => {
      if (address) {
        try {
          console.log('Loading deployments for address:', address);
          // Load token deployments
          const walletDeployments = await getTokenDeploymentsByWallet(address);
          console.log('Token deployments:', walletDeployments);
          setDeployments(walletDeployments);

          // Load NFT deployments
          const nftCollections = await getCollectionsByWallet(address);
          console.log('NFT collections:', nftCollections);
          const formattedNftDeployments = nftCollections.map(nft => ({
            ...nft,
            type: 'nft',
            logo: nft.previewUrl,
            logoIpfs: nft.imageIpfsUrl,
            totalSupply: nft.maxSupply,
            timestamp: nft.createdAt,
            chainName: nft.network === 'polygon' ? 'Polygon' : 'Sepolia'
          }));
          console.log('Formatted NFT deployments:', formattedNftDeployments);
          setNftDeployments(formattedNftDeployments);

        } catch (error) {
          console.error('Error loading deployments:', error);
        }
      } else {
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
      const walletDeployments = await getTokenDeploymentsByWallet(address);
      setDeployments(walletDeployments);
    } catch (error) {
      console.error('Error adding deployment:', error);
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