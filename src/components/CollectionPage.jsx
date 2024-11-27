import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { BiMinus, BiPlus, BiCopy } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

export default function CollectionPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [mintAmount, setMintAmount] = useState(1);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem(`collection_${symbol}`);
    if (!storedData) {
      toast.error('Collection not found');
      navigate('/');
      return;
    }

    const collectionData = JSON.parse(storedData);
    setCollection(collectionData);
    setLoading(false);
  }, [symbol, navigate]);

  if (loading || !collection) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleMint = async () => {
    try {
      const newTotalMinted = (collection.totalMinted || 0) + mintAmount;
      const updatedCollection = {
        ...collection,
        totalMinted: newTotalMinted
      };
      
      localStorage.setItem(`collection_${symbol}`, JSON.stringify(updatedCollection));
      setCollection(updatedCollection);
      
      toast.success(`Minted ${mintAmount} NFTs!`);
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint');
    }
  };

  // Calculate remaining time until release
  const now = Date.now();
  const releaseDate = new Date(collection.releaseDate);
  const isLive = now >= releaseDate;
  
  // Calculate minting progress
  const progress = ((collection.totalMinted || 0) / collection.maxSupply) * 100;

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-[#00ffbd]/10 to-[#00e6a9]/10">
        <img 
          src={collection.previewUrl} 
          alt={collection.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Info */}
          <div className="bg-[#1a1b1f] rounded-xl p-8 shadow-2xl border border-gray-800">
            <div className="flex items-center gap-6 mb-6">
              <img 
                src={collection.previewUrl} 
                alt={collection.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-[#00ffbd]"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>{collection.symbol}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(collection.symbol);
                      toast.success('Symbol copied!');
                    }}
                    className="hover:text-[#00ffbd] transition-colors"
                  >
                    <BiCopy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {collection.description}
            </p>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {collection.properties?.map((prop, index) => (
                <div 
                  key={index}
                  className="bg-[#0d0e12] rounded-lg p-4 border border-gray-800"
                >
                  <p className="text-sm text-gray-500 mb-1">{prop.trait_type}</p>
                  <p className="text-lg font-medium text-[#00ffbd]">{prop.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Minting Section */}
          <div className="bg-[#1a1b1f] rounded-xl p-8 shadow-2xl border border-gray-800">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Price</span>
                <span className="flex items-center text-2xl font-bold text-white">
                  <FaEthereum className="mr-2 text-[#00ffbd]" />
                  {collection.mintPrice}
                </span>
              </div>
              
              {!isLive && (
                <div className="text-sm text-gray-400 bg-[#0d0e12] rounded-lg p-3 border border-gray-800">
                  Starts {releaseDate.toLocaleDateString()} at {releaseDate.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Mint Controls */}
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#0d0e12] rounded-lg p-4 border border-gray-800">
                <button
                  onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                  className="p-2 rounded-lg bg-[#1a1b1f] text-gray-400 hover:text-white transition-colors"
                  disabled={!isLive}
                >
                  <BiMinus size={24} />
                </button>
                <span className="text-2xl font-bold text-white min-w-[60px] text-center">
                  {mintAmount}
                </span>
                <button
                  onClick={() => setMintAmount(Math.min(collection.maxPerWallet, mintAmount + 1))}
                  className="p-2 rounded-lg bg-[#1a1b1f] text-gray-400 hover:text-white transition-colors"
                  disabled={!isLive}
                >
                  <BiPlus size={24} />
                </button>
              </div>

              <button
                onClick={handleMint}
                disabled={!isLive}
                className="w-full py-4 bg-[#00ffbd] hover:bg-[#00e6a9] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-lg transition-colors"
              >
                {isLive ? 'Mint Now' : 'Not Live Yet'}
              </button>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{collection.totalMinted || 0}/{collection.maxSupply} Minted</span>
                </div>
                <div className="h-2 bg-[#0d0e12] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00ffbd] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 