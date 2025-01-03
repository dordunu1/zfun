import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEthereum, FaDiscord, FaTwitter, FaGlobe, FaTelegram, FaPaintBrush, FaGamepad, FaCamera, FaMusic, FaStar, FaCrown } from 'react-icons/fa';
import { BiTime, BiCheck, BiX, BiWorld, BiMoviePlay } from 'react-icons/bi';
import { IoMdPaper } from 'react-icons/io';
import { GiCrownCoin } from 'react-icons/gi';
import TokenIcon from './TokenIcon';
import { getAllCollections, getTokenDeploymentByAddress } from '../services/firebase';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import FuturisticCard from './FuturisticCard';

// Category icons mapping
const CATEGORY_ICONS = {
  'Art': { icon: FaPaintBrush, label: 'Art Collection' },
  'gaming': { icon: FaGamepad, label: 'Gaming Assets' },
  'photography': { icon: FaCamera, label: 'Photography' },
  'music': { icon: FaMusic, label: 'Music' },
  'video': { icon: BiMoviePlay, label: 'Video Content' },
  'collectibles': { icon: GiCrownCoin, label: 'Collectibles' },
  'sports': { icon: FaGamepad, label: 'Sports' },
  'other': { icon: FaStar, label: 'Other' }
};

// Add container variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Add item variants for individual card animations
const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.3
    }
  }
};

export default function CollectionsList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    network: 'all',    // 'all', 'sepolia', 'polygon'
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    sortBy: 'newest'   // 'newest', 'oldest', 'name'
  });
  const [tokenLogos, setTokenLogos] = useState({});

  // Add this useEffect to load collections
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        const fetchedCollections = await getAllCollections({
          network: filters.network,
          type: filters.type
        });
        setCollections(fetchedCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
        toast.error('Failed to load collections');
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [filters.network, filters.type]);

  // Filtering and sorting logic
  const filteredCollections = useMemo(() => {
    return collections
      .filter(collection => {
        // Network filter
        if (filters.network !== 'all') {
          // Check both network field and chainId
          if (filters.network === 'unichain') {
            return collection.network === 'unichain' || collection.chainId === 1301;
          } else if (filters.network === 'sepolia') {
            return collection.network === 'sepolia' || collection.chainId === 11155111;
          }
          return false;
        }
        
        // Type filter
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

  // Add this effect to fetch token logos
  useEffect(() => {
    const fetchTokenLogos = async () => {
      for (const collection of filteredCollections) {
        if (collection?.mintToken?.address) {
          try {
            const tokenDeployment = await getTokenDeploymentByAddress(collection.mintToken.address);
            if (tokenDeployment?.logo) {
              setTokenLogos(prev => ({
                ...prev,
                [collection.mintToken.address.toLowerCase()]: tokenDeployment.logo
              }));
            }
          } catch (error) {
            console.error('Error fetching token logo:', error);
          }
        }
      }
    };

    fetchTokenLogos();
  }, [filteredCollections]);

  // Filter controls UI
  const FilterControls = () => (
    <div className="flex gap-4 mb-6">
      <select
        value={filters.network}
        onChange={(e) => setFilters(f => ({ ...f, network: e.target.value }))}
        className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
      >
        <option value="all">All Networks</option>
        <option value="sepolia">Sepolia</option>
        <option value="unichain">Unichain</option>
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
    const now = Date.now();
    const releaseDate = new Date(collection.releaseDate);
    const mintEndDate = new Date(collection.mintEndDate || Date.now() + 86400000); // Default 24h if not set
    const timeUntil = releaseDate - now;
    const timeUntilEnd = mintEndDate - now;
    
    // Check if mint has ended
    if (timeUntilEnd <= 0 || (!collection.infiniteMint && collection.totalMinted >= collection.maxSupply)) {
      return {
        label: 'Ended',
        color: 'text-red-400 bg-red-400/10',
        icon: BiX
      };
    }
    
    // Check if mint hasn't started yet
    if (timeUntil > 0) {
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

    // Mint is live
    return {
      label: 'Live',
      color: 'text-green-400 bg-green-400/10',
      icon: BiCheck
    };
  };

  const getCategoryIcon = (category) => {
    // Debug log to see what category value we're receiving
    console.log('Category received:', category);
    
    // Convert category to lowercase and handle null/undefined
    const categoryKey = (category || 'other').toLowerCase();
    console.log('Category key:', categoryKey);
    
    const iconData = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.other;
    console.log('Icon data:', iconData);
    
    return (
      <div className="group relative">
        <div className="bg-gray-100 dark:bg-[#1a1b1f] p-2 rounded-lg border border-gray-200 dark:border-gray-800">
          <iconData.icon className="w-4 h-4 text-gray-700 dark:text-[#00ffbd]" />
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {category || 'Other'}
        </div>
      </div>
    );
  };

  // Add this function to render currency logo
  const renderCurrencyLogo = (collection) => {
    // First check if there's a custom token
    const tokenAddress = collection?.mintToken?.address?.toLowerCase();
    const logoUrl = tokenLogos[tokenAddress];

    // If it's a custom token with a logo, show that
    if (tokenAddress && tokenAddress !== '0x0000000000000000000000000000000000000000' && logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Token"
          className="w-5 h-5 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }
    
    // Otherwise show the native currency logo based on network
    if (collection?.network === 'polygon') {
      return <img src="/matic.png" alt="MATIC" className="w-5 h-5" />;
    }
    
    // For both Sepolia and Unichain, show ETH logo when it's the native currency
    return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
  };

  // Add skeleton card component
  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="relative">
        {/* L-shaped corners */}
        <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
        </div>
        <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
          <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
        </div>
        <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
          <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
        </div>
        <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
        </div>

        {/* Glowing dots */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

        {/* Three dots */}
        <div className="absolute top-3 right-3 flex gap-1 z-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 bg-white dark:bg-[#0a0b0f] h-[340px]">
          {/* Image skeleton */}
          <div className="h-[180px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />

          {/* Type badge skeleton */}
          <div className="absolute top-3 left-3 z-10">
            <div className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>

          {/* Status badge skeleton */}
          <div className="absolute top-3 right-3 z-10">
            <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>

          {/* Content section */}
          <div className="p-4">
            {/* Title and description */}
            <div className="mb-3">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Price section */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>

            {/* Supply and Minted */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto w-full px-8 flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 py-2 bg-gray-50 dark:bg-[#0a0b0f] sticky top-16 z-10"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
          <FilterControls />
        </motion.div>
      </div>
        
      <div className="flex-1 overflow-y-auto px-8 custom-scrollbar bg-white dark:bg-[#0a0b0f]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-2"
          >
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              // Show actual collection cards
              filteredCollections.map((collection) => {
                const status = getMintStatus(collection);
                
                return (
                  <motion.div
                    key={collection.symbol}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={`/collection/${collection.symbol}`}
                      className="block"
                    >
                      <div className="relative">
                        {/* L-shaped corners */}
                        <motion.div 
                          className="absolute -top-[2px] -left-[2px] w-8 h-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
                          <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
                        </motion.div>
                        <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
                          <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
                          <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
                        </div>
                        <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
                          <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
                        </div>
                        <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
                          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
                          <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
                        </div>

                        {/* Glowing dots in corners */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

                        {/* Three dots in top right */}
                        <div className="absolute top-3 right-3 flex gap-1 z-20">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>

                        {/* Main Content */}
                        <div className="relative z-10 bg-white dark:bg-[#0a0b0f] h-[340px]">
                          {/* Image section with fade-in animation */}
                          <motion.div 
                            className="relative h-[180px] w-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
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
                          </motion.div>

                          {/* Type badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <div className="bg-[#0d0e12]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                              {collection.type || 'ERC721'}
                            </div>
                          </div>

                          {/* Status badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <status.icon size={12} />
                              <span>{status.label}</span>
                            </div>
                          </div>

                          {/* Content section */}
                          <motion.div 
                            className="flex flex-col flex-1 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="mb-3">
                              <div className="flex items-center justify-between gap-2 mb-1 w-full">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate flex-shrink min-w-0">
                                  {collection.name}
                                </h3>
                                {collection.enableWhitelist && (
                                  <div className="flex items-center gap-1 bg-[#00ffbd]/10 px-1.5 py-0.5 rounded-full flex-shrink-0 ml-auto">
                                    <span role="img" aria-label="crown" className="text-[10px]">👑</span>
                                    <span className="text-[10px] font-medium text-[#00ffbd]">Whitelist Mint</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                                {collection.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              {getCategoryIcon(collection.category)}
                              <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#1a1b1f] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                                {renderCurrencyLogo(collection)}
                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                  {collection.mintPrice}
                                </span>
                              </div>
                            </div>

                            {/* Add Supply and Minted containers - horizontal layout */}
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
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 