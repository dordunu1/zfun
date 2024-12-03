import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import { BiTime, BiCheck, BiX } from 'react-icons/bi';
import { getAllCollections } from '../services/firebase';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import FuturisticCard from './FuturisticCard';

export default function RandomMintCollections() {
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({
    network: 'all',    // 'all', 'sepolia', 'polygon'
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    sortBy: 'newest'   // 'newest', 'oldest', 'name'
  });
  const [tokenLogos, setTokenLogos] = useState({});

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await getAllCollections({
          ...filters,
          isRandomMint: true // Add this filter to your Firebase query
        });
        setCollections(fetchedCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
        toast.error('Failed to load collections');
      }
    };

    loadCollections();
  }, [filters]);

  const filteredCollections = useMemo(() => {
    return collections
      .filter(collection => {
        if (filters.network !== 'all' && collection.network !== filters.network) return false;
        if (filters.type !== 'all' && collection.type !== filters.type) return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [collections, filters]);

  const FilterControls = () => (
    <div className="flex gap-4 mb-6">
      <select
        value={filters.network}
        onChange={(e) => setFilters(f => ({ ...f, network: e.target.value }))}
        className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
      >
        <option value="all">All Networks</option>
        <option value="sepolia">Sepolia</option>
        <option value="polygon">Polygon</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
        className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="ERC721">ERC721</option>
        <option value="ERC1155">ERC1155</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
        className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );

  const getMintStatus = (collection) => {
    const now = Math.floor(Date.now() / 1000);
    const releaseDate = Math.floor(new Date(collection.releaseDate).getTime() / 1000);
    const mintEndDate = Math.floor(new Date(collection.mintEndDate || Date.now() + 86400000).getTime() / 1000);
    const timeUntil = releaseDate - now;
    const timeUntilEnd = mintEndDate - now;
    
    if (timeUntilEnd <= 0 || (!collection.infiniteMint && collection.totalMinted >= collection.maxSupply)) {
      return {
        label: 'Ended',
        color: 'text-red-400 bg-red-400/10',
        icon: BiX
      };
    }
    
    if (timeUntil > 0) {
      if (timeUntil < 3600) {
        return {
          label: `Starts in ${Math.ceil(timeUntil / 60)}m`,
          color: 'text-yellow-400 bg-yellow-400/10',
          icon: BiTime
        };
      }
      return {
        label: 'Coming Soon',
        color: 'text-blue-400 bg-blue-400/10',
        icon: BiTime
      };
    }

    return {
      label: 'Live',
      color: 'text-green-400 bg-green-400/10',
      icon: BiCheck
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {filteredCollections.map((collection) => {
        const status = getMintStatus(collection);
        
        return (
          <Link 
            key={collection.symbol}
            to={`/collection/${collection.symbol}`}
            className="block"
          >
            <FuturisticCard>
              <div className="relative h-[340px]">
                {/* Image section */}
                <div className="relative h-[180px] w-full overflow-hidden">
                  <div className="absolute inset-0">
                    {collection.artworkType === 'video' ? (
                      <video 
                        src={collection.previewUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img 
                        src={collection.previewUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-[#0d0e12]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                      Random Mint
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon size={12} />
                      <span>{status.label}</span>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="flex flex-col flex-1 p-4">
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {collection.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                      {collection.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1b1f] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                      <FaEthereum className="w-5 h-5 text-[#00ffbd]" />
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {collection.mintPrice}
                      </span>
                    </div>
                  </div>

                  {/* Supply and Minted containers */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-[#1a1b1f] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Supply</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {collection.maxSupply || 0}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1a1b1f] px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Minted</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {collection.totalMinted || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FuturisticCard>
          </Link>
        );
      })}
    </div>
  );
} 