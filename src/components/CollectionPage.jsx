import React, { useState } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { BiMinus, BiPlus } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function CollectionPage() {
  const { symbol } = useParams();
  const [mintAmount, setMintAmount] = useState(1);
  const [isWhitelistPhase, setIsWhitelistPhase] = useState(true);
  
  // Get collection data from localStorage
  const storedData = localStorage.getItem(`collection_${symbol}`);
  const collectionData = storedData ? JSON.parse(storedData) : null;
  
  // Combine stored data with default values
  const collection = {
    name: collectionData?.name || "Sample Collection",
    symbol: symbol,
    description: collectionData?.description || "This is a sample NFT collection",
    previewUrl: collectionData?.previewUrl || "/logo.png",
    mintPrice: collectionData?.mintPrice || "0.1",
    maxPerWallet: collectionData?.maxPerWallet || 5,
    properties: collectionData?.properties || [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Eyes", value: "Green" },
    ]
  };

  const handleMint = async () => {
    // This will be implemented with contract interaction
    toast.success(`Minted ${mintAmount} NFTs!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-[#00ffbd] to-[#00e6a9]">
        <img 
          src={collection.previewUrl} 
          alt={collection.name}
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Collection Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Collection Image */}
              <div className="w-full md:w-1/3">
                <img 
                  src={collection.previewUrl} 
                  alt={collection.name}
                  className="w-full aspect-square rounded-xl object-cover"
                />
              </div>

              {/* Collection Details */}
              <div className="w-full md:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {collection.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {collection.description}
                </p>

                {/* Minting Section */}
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isWhitelistPhase ? 'Whitelist Mint' : 'Public Mint'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isWhitelistPhase ? 'Early access for whitelisted addresses' : 'Open for everyone'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <FaEthereum />
                        <span>{collection.mintPrice}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Per NFT
                      </p>
                    </div>
                  </div>

                  {/* Mint Amount Selector */}
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3d3f46]"
                    >
                      <BiMinus size={20} />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">
                      {mintAmount}
                    </span>
                    <button
                      onClick={() => setMintAmount(Math.min(collection.maxPerWallet, mintAmount + 1))}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3d3f46]"
                    >
                      <BiPlus size={20} />
                    </button>
                  </div>

                  {/* Mint Button */}
                  <button
                    onClick={handleMint}
                    className="w-full py-3 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
                  >
                    Mint Now
                  </button>

                  {/* Minting Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>50/1000 Minted</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-[#2d2f36] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00ffbd]" 
                        style={{ width: '50%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Properties */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Properties
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {collection.properties.map((prop, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {prop.trait_type}
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {prop.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 