import React from 'react';
import { Link } from 'react-router-dom';
import { FaEthereum, FaDiscord, FaTwitter, FaGlobe } from 'react-icons/fa';
import { BiTime, BiCheck, BiX } from 'react-icons/bi';

export default function CollectionsList() {
  // Get all collections from localStorage
  const collections = Object.keys(localStorage)
    .filter(key => key.startsWith('collection_'))
    .map(key => JSON.parse(localStorage.getItem(key)))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getMintStatus = (collection) => {
    const now = Date.now();
    const releaseDate = new Date(collection.releaseDate);
    const timeUntil = releaseDate - now;
    
    if (collection.totalMinted >= collection.maxSupply) {
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
        <h1 className="text-3xl font-bold text-white mb-8">Collections</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {collections.map((collection) => {
            const status = getMintStatus(collection);
            
            return (
              <Link 
                key={collection.symbol}
                to={`/collection/${collection.symbol}`}
                className="bg-[#1a1b1f] rounded-xl overflow-hidden border border-gray-800 hover:border-[#00ffbd] transition-colors group"
              >
                {/* Collection Image - Reduced size */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={collection.previewUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${status.color} text-xs`}>
                      <status.icon size={12} />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </div>
                  {/* NFT Type Badge */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                      {collection.tokenType || 'ERC721'}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Collection Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">
                      {collection.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 h-8">
                      {collection.description}
                    </p>
                  </div>

                  {/* Category & Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-[#0d0e12] px-2 py-1 rounded-lg">
                      <span className="text-xs text-gray-400">
                        {collection.category || 'Art'}
                      </span>
                    </div>
                    <div className="flex items-center text-white">
                      <FaEthereum className="w-3 h-3 mr-1 text-[#00ffbd]" />
                      <span className="text-sm font-medium">{collection.mintPrice}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="bg-[#0d0e12] rounded-lg p-2">
                      <div className="text-gray-400">Supply</div>
                      <div className="text-white font-medium">
                        {collection.maxSupply}
                      </div>
                    </div>
                    <div className="bg-[#0d0e12] rounded-lg p-2">
                      <div className="text-gray-400">Minted</div>
                      <div className="text-white font-medium">
                        {collection.totalMinted || 0}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
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
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 