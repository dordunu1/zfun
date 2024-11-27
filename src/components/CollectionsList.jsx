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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => {
            const status = getMintStatus(collection);
            
            return (
              <Link 
                key={collection.symbol}
                to={`/collection/${collection.symbol}`}
                className="bg-[#1a1b1f] rounded-xl overflow-hidden border border-gray-800 hover:border-[#00ffbd] transition-colors group"
              >
                {/* Collection Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={collection.previewUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.color}`}>
                      <status.icon size={16} />
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Collection Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {collection.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#0d0e12] rounded-lg p-3">
                      <div className="text-sm text-gray-400">Supply</div>
                      <div className="text-lg font-bold text-white">
                        {collection.maxSupply}
                      </div>
                    </div>
                    <div className="bg-[#0d0e12] rounded-lg p-3">
                      <div className="text-sm text-gray-400">Price</div>
                      <div className="flex items-center text-lg font-bold text-white">
                        <FaEthereum className="mr-1 text-[#00ffbd]" />
                        {collection.mintPrice}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {collection.website && (
                      <a 
                        href={collection.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaGlobe size={16} />
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
                        <FaTwitter size={16} />
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
                        <FaDiscord size={16} />
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