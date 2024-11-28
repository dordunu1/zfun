import React from 'react';
import { Link } from 'react-router-dom';
import { FaEthereum, FaDiscord, FaTwitter, FaGlobe, FaTelegram } from 'react-icons/fa';
import { BiTime, BiCheck, BiX, BiWorld } from 'react-icons/bi';
import TokenIcon from './TokenIcon';

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Collections</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {collections.map((collection) => {
            const status = getMintStatus(collection);
            
            return (
              <Link 
                key={collection.symbol}
                to={`/collection/${collection.symbol}`}
                className="bg-white dark:bg-[#1a1b1f] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-[#00ffbd] transition-colors group h-[360px] flex flex-col"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img 
                    src={collection.previewUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${status.color} text-xs backdrop-blur-sm`}>
                      <status.icon size={12} />
                      <span className="font-medium">{status.label}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                      {collection.tokenType || 'ERC721'}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#1a1b1f] to-transparent opacity-50" />
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {collection.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 min-h-[2.5rem]">
                      {collection.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-gray-100 dark:bg-[#0d0e12] px-2 py-1 rounded-lg">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {collection.category || 'Art'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#0d0e12] px-2 py-1 rounded-lg">
                      <TokenIcon 
                        type={collection.mintingToken} 
                        network={collection.network}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {collection.mintPrice} {collection.mintToken?.symbol}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                    <div className="bg-gray-100 dark:bg-[#0d0e12] rounded-lg p-1.5">
                      <div className="text-gray-600 dark:text-gray-400">Supply</div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {collection.maxSupply}
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-[#0d0e12] rounded-lg p-1.5">
                      <div className="text-gray-600 dark:text-gray-400">Minted</div>
                      <div className="text-gray-900 dark:text-white font-medium">
                        {collection.totalMinted || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
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