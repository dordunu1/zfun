import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaEthereum, FaDiscord, FaTwitter, FaGlobe, FaTelegram } from 'react-icons/fa';
import { BiTime, BiCheck, BiX, BiWorld } from 'react-icons/bi';
import TokenIcon from './TokenIcon';
import { getAllCollections } from '../services/firebase';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import FuturisticCard from './FuturisticCard';

export default function CollectionsList() {
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({
    network: 'all',    // 'all', 'sepolia', 'polygon'
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    sortBy: 'newest'   // 'newest', 'oldest', 'name'
  });

  // Add this useEffect to load collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await getAllCollections({
          network: filters.network,
          type: filters.type
        });
        setCollections(fetchedCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
        toast.error('Failed to load collections');
      }
    };

    loadCollections();
  }, [filters.network, filters.type]);

  // Filtering and sorting logic
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

  // Filter controls UI
  const FilterControls = () => (
    <div className="flex gap-4 mb-6">
      <select
        value={filters.network}
        onChange={(e) => setFilters(f => ({ ...f, network: e.target.value }))}
        className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
      >
        <option value="all">All Networks</option>
        <option value="sepolia">Sepolia</option>
        <option value="polygon">Polygon</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
        className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
      >
        <option value="all">All Types</option>
        <option value="ERC721">ERC721</option>
        <option value="ERC1155">ERC1155</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))}
        className="bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name A-Z</option>
      </select>
    </div>
  );

  const getMintStatus = (collection) => {
    const now = Date.now();
    const releaseDate = new Date(collection.releaseDate);
    const timeUntil = releaseDate - now;
    
    if (!collection.infiniteMint && collection.totalMinted >= collection.maxSupply) {
      return {
        label: 'Ended',
        color: 'text-red-400 bg-red-400/10',
        icon: BiX
      };
    } else if (timeUntil > 0) {
      if (timeUntil < 3600000) { // Less than 1 hour
        return {
          label: `Starts in ${Math.ceil(timeUntil / 60000)}m`,
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collections</h1>
          <FilterControls />
        </div>
        
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
                  <div className="flex flex-col h-[320px]">
                    {/* Image section */}
                    <div className="relative h-[160px] overflow-hidden rounded-t-lg">
                      <img 
                        src={collection.previewUrl}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Status badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          <status.icon size={12} />
                          <span>{status.label}</span>
                        </div>
                      </div>
                      {/* Type badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-[#0d0e12]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                          {collection.type || 'ERC721'}
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="flex flex-col flex-1 p-4">
                      <div className="mb-3">
                        <h3 className="text-base font-semibold text-white mb-1 truncate">
                          {collection.name}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {collection.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-[#1a1b1f] px-2 py-1 rounded text-xs text-gray-400">
                          {collection.category || 'Art'}
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#1a1b1f] px-2 py-1 rounded">
                          <TokenIcon 
                            type={collection.mintingToken} 
                            network={collection.network}
                          />
                          <span className="text-xs font-medium text-white">
                            {collection.mintPrice} {collection.mintToken?.symbol}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-[#1a1b1f] rounded p-2">
                          <div className="text-[11px] text-gray-400">Supply</div>
                          <div className="text-xs text-white font-medium">
                            {collection.maxSupply}
                          </div>
                        </div>
                        <div className="bg-[#1a1b1f] rounded p-2">
                          <div className="text-[11px] text-gray-400">Minted</div>
                          <div className="text-xs text-white font-medium">
                            {collection.totalMinted || 0}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        {collection.socials?.zos && (
                          <a 
                            href={`https://zos.zero.tech/${collection.socials.zos}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BiWorld size={14} />
                          </a>
                        )}
                        {collection.website && (
                          <a 
                            href={collection.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGlobe size={14} />
                          </a>
                        )}
                        {collection.socials?.twitter && (
                          <a 
                            href={`https://twitter.com/${collection.socials.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaTwitter size={14} />
                          </a>
                        )}
                        {collection.socials?.discord && (
                          <a 
                            href={collection.socials.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaDiscord size={14} />
                          </a>
                        )}
                        {collection.socials?.telegram && (
                          <a 
                            href={collection.socials.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaTelegram size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </FuturisticCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 