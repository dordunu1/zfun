import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ViewNFTTraits = ({ tokenId, contractAddress, contractType, totalMetadata = 15 }) => {
  const [traits, setTraits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadataIndex, setMetadataIndex] = useState(null);

  // ABI with additional functions to check token existence
  const ABI = [
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "getTokenTraits",
      "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "ownerOf",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "traits",
      "outputs": [
        {
          "components": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string[]", "name": "values", "type": "string[]"},
            {"internalType": "uint256[]", "name": "weights", "type": "uint256[]"}
          ],
          "internalType": "struct RandomNFT721.Trait[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert tokenId to proper format
        const formattedTokenId = ethers.toBigInt(tokenId);
        console.log('Fetching traits for token:', formattedTokenId.toString());
        console.log('Contract address:', contractAddress);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, ABI, provider);
        
        // First check if token exists by trying to get its owner
        try {
          const owner = await contract.ownerOf(formattedTokenId);
          console.log('Token owner:', owner);
        } catch (err) {
          throw new Error('Token does not exist or has not been minted yet');
        }

        // Check if traits have been configured
        try {
          const traitsConfig = await contract.traits();
          console.log('Traits configuration:', traitsConfig);
          if (!traitsConfig || traitsConfig.length === 0) {
            throw new Error('No traits have been configured for this collection');
          }
        } catch (err) {
          console.warn('Could not check traits configuration:', err);
        }
        
        console.log('Calling getTokenTraits...');
        const traitValues = await contract.getTokenTraits(formattedTokenId);
        console.log('Received trait values:', traitValues);
        
        setTraits(traitValues);
      } catch (err) {
        console.error('Error fetching traits:', err);
        setError(err.message || 'Failed to fetch NFT traits. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (tokenId && contractAddress) {
      fetchTraits();
    }
  }, [tokenId, contractAddress, totalMetadata]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Loading traits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!traits || traits.length === 0) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No traits found for token ID {tokenId} (Metadata Index: {metadataIndex}). Make sure:
          <ul className="list-disc list-inside mt-2">
            <li>The token ID exists and has been minted</li>
            <li>Traits have been configured for the collection</li>
            <li>You're connected to the correct network (Sepolia)</li>
            <li>You're using the correct contract address</li>
          </ul>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">NFT Traits</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Token ID: {tokenId} (Metadata Index: {metadataIndex})
      </p>
      <div className="grid grid-cols-2 gap-4">
        {traits.map((trait, index) => (
          <div key={index} className="bg-white dark:bg-[#0d0e12] p-3 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-gray-900 dark:text-white font-medium">{trait}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewNFTTraits; 