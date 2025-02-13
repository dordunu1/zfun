import React, { useState, useMemo, useRef } from 'react';
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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

// Add these constants near the top of the file
const ITEMS_PER_PAGE = 20;

export default function CollectionsList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    network: 'all',    // 'all', 'sepolia', 'polygon'
    type: 'all',       // 'all', 'ERC721', 'ERC1155'
    sortBy: 'newest'   // 'newest', 'oldest', 'name'
  });
  const [tokenLogos, setTokenLogos] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const closeTimeoutRef = useRef(null);

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
          if (filters.network === 'unichain-mainnet') {
            return collection.chainId === 130;
          } else if (filters.network === 'unichain') {
            return collection.chainId === 1301;
          } else if (filters.network === 'sepolia') {
            return collection.network === 'sepolia' || collection.chainId === 11155111;
          } else if (filters.network === 'polygon') {
            return collection.network === 'polygon' || collection.chainId === 137;
          } else if (filters.network === 'moonwalker') {
            return collection.network === 'moonwalker' || collection.chainId === 1828369849;
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
            // Silently fail - if logo can't be fetched, default will be used
          }
        }
      }
    };

    fetchTokenLogos();
  }, [filteredCollections]);

  // Filter controls UI
  const FilterControls = () => {
    const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const handleMouseEnter = (setDropdown) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setDropdown(true);
    };

    const handleMouseLeave = (setDropdown) => {
      closeTimeoutRef.current = setTimeout(() => {
        setDropdown(false);
      }, 300); // 300ms delay before closing
    };

    const networks = [
      { value: 'all', label: 'All Networks' },
      { value: 'sepolia', label: 'Sepolia' },
      { value: 'unichain-mainnet', label: 'Unichain Mainnet' },
      { value: 'unichain', label: 'Unichain Testnet' },
      { value: 'polygon', label: 'Polygon' },
      { value: 'moonwalker', label: 'Moonwalker' }
    ];

    const types = [
      { value: 'all', label: 'All Types' },
      { value: 'ERC721', label: 'ERC721' },
      { value: 'ERC1155', label: 'ERC1155' }
    ];

    const sortOptions = [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'name', label: 'Name A-Z' }
    ];

    return (
      <div className="flex gap-4 mb-6 relative z-[100]">
        {/* Network Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setNetworkDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setNetworkDropdownOpen)}
        >
          <button
            type="button"
            className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none min-w-[160px] flex items-center justify-between"
          >
            <span>{networks.find(n => n.value === filters.network)?.label}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${networkDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {networkDropdownOpen && (
            <div 
              className="absolute z-[110] w-full mt-1 bg-white dark:bg-[#0d0e12] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
              onMouseLeave={() => handleMouseLeave(setNetworkDropdownOpen)}
            >
              {networks.map(network => (
                <button
                  key={network.value}
                  onClick={() => {
                    setFilters(f => ({ ...f, network: network.value }));
                    setNetworkDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 ${
                    filters.network === network.value ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {network.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setTypeDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setTypeDropdownOpen)}
        >
          <button
            type="button"
            className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none min-w-[160px] flex items-center justify-between"
          >
            <span>{types.find(t => t.value === filters.type)?.label}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {typeDropdownOpen && (
            <div 
              className="absolute z-[110] w-full mt-1 bg-white dark:bg-[#0d0e12] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
              onMouseLeave={() => handleMouseLeave(setTypeDropdownOpen)}
            >
              {types.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFilters(f => ({ ...f, type: type.value }));
                    setTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 ${
                    filters.type === type.value ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => handleMouseEnter(setSortDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setSortDropdownOpen)}
        >
          <button
            type="button"
            className="bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none min-w-[160px] flex items-center justify-between"
          >
            <span>{sortOptions.find(s => s.value === filters.sortBy)?.label}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {sortDropdownOpen && (
            <div 
              className="absolute z-[110] w-full mt-1 bg-white dark:bg-[#0d0e12] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => clearTimeout(closeTimeoutRef.current)}
              onMouseLeave={() => handleMouseLeave(setSortDropdownOpen)}
            >
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters(f => ({ ...f, sortBy: option.value }));
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 ${
                    filters.sortBy === option.value ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
    </div>
  );
  };

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
    const categoryKey = (category || 'other').toLowerCase();
    const iconData = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.other;
    
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
    const tokenAddress = collection?.mintToken?.address?.toLowerCase();
    const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';

    // Handle native tokens based on network
    if (isNativeToken) {
      if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) {
        return <img src="/Zero.png" alt="ZERO" className="w-5 h-5" />;
      }
      if (collection?.network === 'polygon') {
        return <img src="/polygon.png" alt="POL" className="w-5 h-5" />;
      }
      return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
    }

    // Handle ZERO token by address
    if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
      return <img src="/Zero.png" alt="ZERO" className="w-5 h-5" />;
    }

    // For other custom tokens with logo
    const logoUrl = tokenLogos[tokenAddress];
    if (logoUrl) {
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
    
    // Default fallback
    return <img src="/token-default.png" alt="Token" className="w-5 h-5 rounded-full" />;
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

  // Add pagination calculation
  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCollections.slice(startIndex, endIndex);
  }, [filteredCollections, currentPage]);

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);

  // Add pagination controls component
  const PaginationControls = () => (
    <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCollections.length)} of {filteredCollections.length} collections
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 
            disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                w-8 h-8 rounded-lg text-sm font-medium transition-colors
                ${currentPage === page 
                  ? 'bg-[#00ffbd] text-gray-900' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 
            disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto w-full px-8 flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 py-2 bg-gray-50 dark:bg-[#0a0b0f] sticky top-16 z-[100]"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
          <FilterControls />
        </motion.div>
      </div>
        
      <div className="flex-1 overflow-y-auto px-8 custom-scrollbar bg-white dark:bg-[#0a0b0f] relative z-0">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-2"
          >
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              paginatedCollections.map((collection) => {
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
          
          {/* Add pagination controls */}
          {!loading && filteredCollections.length > ITEMS_PER_PAGE && (
            <PaginationControls />
          )}
        </div>
      </div>
    </div>
  );
} 