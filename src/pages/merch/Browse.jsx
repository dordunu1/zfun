import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiSearch, BiFilter, BiStar, BiMenu, BiTime } from 'react-icons/bi';
import { 
  MdGrid3X3,
  MdOutlineShoppingBag,
  MdDevices,
  MdOutlineHome,
  MdOutlinePalette,
  MdOutlineCollections,
  // Clothing and Fashion icons
  MdOutlineCheckroom,
  MdOutlineDry,
  MdOutlineStyle,
  MdOutlineSportsHockey,
  MdOutlineDryCleaning,
  MdOutlineBusinessCenter,
  MdOutlinePerson,
  MdOutlinePersonOutline,
  MdOutlineWoman,
  MdOutlineSportsBasketball,
  MdOutlineWork,
  // Footwear icons
  MdOutlineDirectionsRun,
  MdOutlineDirectionsWalk,
  // Fashion Accessories icons
  MdOutlineShoppingBag as MdOutlineBag,
  MdOutlineWatchLater,
  MdOutlineFace,
  MdOutlineDiamond,
  // Tech Accessories icons
  MdOutlinePhoneAndroid,
  MdOutlineLaptop,
  MdOutlineHeadphones,
  MdOutlineTablet,
  MdOutlineBatteryChargingFull,
  MdOutlineNightlight
} from 'react-icons/md';
import {
  GiTShirt,
  GiPoloShirt,
  GiArmoredPants,
  GiHoodie,
  GiLabCoat,
  GiSuitcase,
  GiDress,
  GiSkirt,
  GiRunningShoe,
  GiBoots,
  GiBelt
} from 'react-icons/gi';
import {
  FaShoePrints,
  FaSocks
} from 'react-icons/fa';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';
import { MdLocalOffer, MdTimer } from 'react-icons/md';
import FeaturedDeals from '../../components/merch/FeaturedDeals';

const SkeletonPulse = () => (
  <motion.div
    className="w-full h-full bg-gray-100 rounded-lg"
    animate={{
      opacity: [0.3, 0.6, 0.3],
      scale: [0.98, 1, 0.98]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const ProductImages = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Product"
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BrowseSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 space-y-6">
    {/* Search and Filter Skeleton */}
    <motion.div 
      className="flex items-center justify-between gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1">
        <div className="w-full h-12">
          <SkeletonPulse />
        </div>
      </div>
      <div className="w-32 h-12">
        <SkeletonPulse />
      </div>
    </motion.div>

    {/* Categories Skeleton */}
    <motion.div 
      className="flex gap-2 overflow-x-auto pb-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div 
          key={i} 
          className="w-24 h-8 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <SkeletonPulse />
        </motion.div>
      ))}
    </motion.div>

    {/* Products Grid Skeleton */}
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <motion.div 
          key={i} 
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <div className="aspect-square">
            <SkeletonPulse />
          </div>
          <div className="p-3 space-y-2">
            <div className="w-3/4 h-4">
              <SkeletonPulse />
            </div>
            <div className="w-1/2 h-4">
              <SkeletonPulse />
            </div>
            <div className="w-1/3 h-4">
              <SkeletonPulse />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const CountdownTimer = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(endsAt).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        return 'Ended';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeString = '';
      
      if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        timeString = `${minutes}m ${seconds}s`;
      } else {
        timeString = `${seconds}s`;
      }

      return timeString;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 'Ended') {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  return (
    <span className="font-mono text-lg sm:text-xl font-bold text-[#FF1B6B]">
      {timeLeft}
    </span>
  );
};

const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden group"
      whileHover={{ y: -3 }}
    >
      <Link to={`/merch-store/product/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          <ProductImages images={product.images} />
          {product.rating && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800 flex items-center gap-1">
              <BiStar className="text-yellow-400" />
              {product.rating}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-800 mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={product.tokenLogo}
                alt={product.acceptedToken}
                className="w-4 h-4"
              />
              <div className="flex items-center gap-1">
                {product.hasDiscount ? (
                  <>
                    <p className="text-[#FF1B6B] font-medium text-sm">
                      ${product.discountedPrice.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-xs line-through">
                      ${product.price.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-[#FF1B6B] font-medium text-sm">
                    ${product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
              <img 
                src={product.network === 'polygon' ? '/polygon.png' : '/unichain-logo.png'} 
                alt={product.network} 
                className="w-4 h-4"
              />
              <span className="text-xs font-medium text-gray-600 capitalize">
                {product.network}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <p className="text-xs text-gray-500">
                by {product.sellerName}
              </p>
              {product.isSellerVerified && (
                <div className="group relative inline-flex items-center">
                  <VerificationCheckmark className="!w-[10px] !h-[10px] min-w-[10px] min-h-[10px]" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 bg-gray-900 text-white text-[8px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                    Verified Store
                  </div>
                </div>
              )}
            </div>
            <p className={`text-xs font-medium ${
              product.quantity > 10 
                ? 'text-green-600' 
                : product.quantity > 0 
                  ? 'text-orange-500' 
                  : 'text-red-500'
            }`}>
              {product.quantity > 10 
                ? 'In Stock' 
                : product.quantity > 0 
                  ? `Only ${product.quantity} left` 
                  : 'Out of Stock'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const MaxDiscountBanner = ({ products }) => {
  // Find max discount and latest end time
  const getMaxDiscountAndLatestEnd = () => {
    let maxDiscount = 0;
    let latestEndTime = null;

    products.forEach(product => {
      if (product.hasDiscount && product.discountEndsAt) {
        // Update max discount
        const discount = product.discountPercent;
        if (discount > maxDiscount) {
          maxDiscount = discount;
        }

        // Update latest end time
        const endTime = new Date(product.discountEndsAt);
        if (!latestEndTime || endTime > latestEndTime) {
          latestEndTime = endTime;
        }
      }
    });

    return { maxDiscount, latestEndTime };
  };

  const { maxDiscount, latestEndTime } = getMaxDiscountAndLatestEnd();

  if (!maxDiscount || !latestEndTime) return null;

  return (
    <div className="bg-gradient-to-r from-pink-500/5 via-pink-500/10 to-purple-500/5 rounded-2xl p-6 mb-6 overflow-hidden">
      <div className="flex items-center gap-2 justify-center mb-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#FF1B6B] text-white rounded-full">
          <MdLocalOffer className="text-xl animate-pulse" />
          <span className="font-bold">Flash Sale · Limited time offer</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="text-gray-800">Up to </span>
          <span className="text-[#FF1B6B]">{maxDiscount}% OFF</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-lg sm:text-xl font-medium text-gray-700">Ends:</span>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-lg">
            <BiTime className="text-xl text-[#FF1B6B] animate-pulse" />
            <CountdownTimer endsAt={latestEndTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const networkDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ];

  const CLOTHING_SUBCATEGORIES = {
    "Men's Wear": [
      { name: "T-Shirts", icon: <GiTShirt className="text-lg" /> },
      { name: "Shirts", icon: <GiPoloShirt className="text-lg" /> },
      { name: "Pants", icon: <GiArmoredPants className="text-lg" /> },
      { name: "Hoodies", icon: <GiHoodie className="text-lg" /> },
      { name: "Jackets", icon: <GiLabCoat className="text-lg" /> },
      { name: "Suits", icon: <GiSuitcase className="text-lg" /> }
    ],
    "Women's Wear": [
      { name: "Dresses", icon: <GiDress className="text-lg" /> },
      { name: "Tops", icon: <GiTShirt className="text-lg" /> },
      { name: "Skirts", icon: <GiSkirt className="text-lg" /> },
      { name: "Pants", icon: <GiArmoredPants className="text-lg" /> },
      { name: "Blouses", icon: <GiPoloShirt className="text-lg" /> },
      { name: "Jackets", icon: <GiLabCoat className="text-lg" /> }
    ],
    "Footwear": [
      { name: "Sneakers", icon: <GiRunningShoe className="text-lg" /> },
      { name: "Formal Shoes", icon: <span className="text-lg text-gray-400 group-hover/item:text-[#FF1B6B] transition-colors">👞</span> },
      { name: "Boots", icon: <GiBoots className="text-lg" /> },
      { name: "Sandals", icon: <FaShoePrints className="text-lg" /> },
      { name: "Slippers", icon: <span className="text-lg text-gray-400 group-hover/item:text-[#FF1B6B] transition-colors">🥿</span> }
    ]
  };

  const ACCESSORIES_SUBCATEGORIES = {
    "Fashion Accessories": [
      { name: "Bags", icon: <MdOutlineBag className="text-lg" /> },
      { name: "Belts", icon: <GiBelt className="text-lg" /> },
      { name: "Hats", icon: <MdOutlineFace className="text-lg" /> },
      { name: "Scarves", icon: <span className="text-lg text-gray-400 group-hover/item:text-[#FF1B6B] transition-colors">🧣</span> },
      { name: "Jewelry", icon: <MdOutlineDiamond className="text-lg" /> }
    ],
    "Tech Accessories": [
      { name: "Phone Cases", icon: <MdOutlinePhoneAndroid className="text-lg" /> },
      { name: "Laptop Bags", icon: <MdOutlineLaptop className="text-lg" /> },
      { name: "Headphone Cases", icon: <MdOutlineHeadphones className="text-lg" /> },
      { name: "Tablet Covers", icon: <MdOutlineTablet className="text-lg" /> },
      { name: "Chargers", icon: <MdOutlineBatteryChargingFull className="text-lg" /> }
    ]
  };

  const categories = [
    { 
      id: 'all', 
      name: 'All Categories',
      icon: <MdGrid3X3 className="text-xl" />
    },
    { 
      id: 'clothing', 
      name: 'Clothing',
      icon: <MdOutlineCheckroom className="text-xl" />,
      subcategories: CLOTHING_SUBCATEGORIES
    },
    { 
      id: 'accessories', 
      name: 'Accessories',
      icon: <MdOutlineShoppingBag className="text-xl" />,
      subcategories: ACCESSORIES_SUBCATEGORIES 
    },
    { 
      id: 'electronics', 
      name: 'Electronics',
      icon: <MdDevices className="text-xl" />
    },
    { 
      id: 'home', 
      name: 'Home',
      icon: <MdOutlineHome className="text-xl" />
    },
    { 
      id: 'art', 
      name: 'Art',
      icon: <MdOutlinePalette className="text-xl" />
    },
    { 
      id: 'collectibles', 
      name: 'Collectibles',
      icon: <MdOutlineCollections className="text-xl" />
    }
  ];

  const networks = [
    { value: 'all', label: 'All Networks' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'unichain', label: 'Unichain' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, selectedNetwork]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let q = collection(db, 'products');

      // Build query based on filters
      const constraints = [where('status', '==', 'active')];
      
      if (selectedCategory !== 'all') {
        // Check if it's a subcategory selection
        if (selectedCategory.includes('-')) {
          const [mainCategory, categoryGroup, subCategory] = selectedCategory.split('-');
          constraints.push(where('category', '==', mainCategory));
          constraints.push(where('subCategory', '==', `${categoryGroup} - ${subCategory}`));
        } else {
          constraints.push(where('category', '==', selectedCategory));
        }
      }

      if (selectedNetwork !== 'all') {
        constraints.push(where('network', '==', selectedNetwork));
      }

      if (sortBy === 'latest') {
        constraints.push(orderBy('createdAt', 'desc'));
      } else if (sortBy === 'price_low') {
        constraints.push(orderBy('price', 'asc'));
      } else if (sortBy === 'price_high') {
        constraints.push(orderBy('price', 'desc'));
      }

      q = query(q, ...constraints, limit(50));
      const querySnapshot = await getDocs(q);
      
      // Fetch all unique seller IDs from products
      const sellerIds = [...new Set(querySnapshot.docs.map(doc => doc.data().sellerId))];
      
      // Fetch all sellers in one batch
      const sellersSnapshot = await getDocs(query(
        collection(db, 'sellers'),
        where('__name__', 'in', sellerIds)
      ));
      
      // Create a map of seller verification status
      const sellerVerificationMap = {};
      sellersSnapshot.docs.forEach(doc => {
        sellerVerificationMap[doc.id] = doc.data().verificationStatus === 'approved';
      });

      const productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isSellerVerified: sellerVerificationMap[data.sellerId] || false
        };
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return <BrowseSkeleton />;
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-1">
          {/* Categories Dropdown */}
          <div className="relative group">
            <button
              className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors hover:bg-gray-50 min-w-[160px] text-left flex items-center gap-2"
            >
              <BiMenu className="text-xl text-gray-500" />
              <span className="text-gray-700">
                {categories.find(cat => cat.id === selectedCategory)?.name || 'All Categories'}
              </span>
              <svg
                className="w-5 h-5 text-gray-500 ml-auto transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-1 w-[280px] bg-white rounded-lg shadow-lg border border-gray-100 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {categories.map((category) => (
                <div key={category.id} className="group/item">
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-pink-50 text-gray-700 hover:text-[#FF1B6B] flex items-center gap-3"
                  >
                    <span className="text-gray-500 group-hover/item:text-[#FF1B6B] transition-colors">
                      {category.icon}
                    </span>
                    <span>{category.name}</span>
                    {category.subcategories && (
                      <svg
                        className="w-4 h-4 text-gray-500 ml-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                  {/* Subcategories */}
                  {category.subcategories && (
                    <div className="absolute left-[279px] top-0 w-[280px] bg-white rounded-lg shadow-lg border border-gray-100 invisible opacity-0 group-hover/item:visible group-hover/item:opacity-100 transition-all duration-200">
                      {Object.entries(category.subcategories).map(([mainCategory, subItems]) => (
                        <div key={mainCategory} className="p-2">
                          <div className="px-2 py-1 text-sm font-medium text-gray-900">{mainCategory}</div>
                          <div className="grid grid-cols-2 gap-1">
                            {subItems.map((subItem) => (
                              <button
                                key={subItem.name}
                                onClick={() => {
                                  setSelectedCategory(`${category.id}-${mainCategory}-${subItem.name}`);
                                }}
                                className="px-2 py-1 text-sm text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B] rounded text-left flex items-center gap-2"
                              >
                                <span className="text-gray-400 group-hover/item:text-[#FF1B6B] transition-colors">
                                  {subItem.icon}
                                </span>
                                <span>{subItem.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
            />
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Network Dropdown */}
          <div 
            className="relative"
            ref={networkDropdownRef}
            onMouseEnter={() => setNetworkDropdownOpen(true)}
            onMouseLeave={() => setNetworkDropdownOpen(false)}
          >
            <button
              type="button"
              className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors hover:bg-gray-50 min-w-[160px] text-left flex items-center justify-between"
            >
              <span>{networks.find(n => n.value === selectedNetwork)?.label || 'All Networks'}</span>
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
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                {networks.map(network => (
                  <button
                    key={network.value}
                    onClick={() => setSelectedNetwork(network.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedNetwork === network.value ? 'bg-pink-50 text-[#FF1B6B]' : 'text-gray-700'
                    }`}
                  >
                    {network.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div 
            className="relative"
            ref={sortDropdownRef}
            onMouseEnter={() => setSortDropdownOpen(true)}
            onMouseLeave={() => setSortDropdownOpen(false)}
          >
            <button
              type="button"
              className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors hover:bg-gray-50 min-w-[160px] text-left flex items-center justify-between"
            >
              <span>{sortOptions.find(opt => opt.value === sortBy)?.label || 'Latest'}</span>
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
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value ? 'bg-pink-50 text-[#FF1B6B]' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Max Discount Banner */}
      <motion.div variants={itemVariants}>
        <MaxDiscountBanner products={products} />
      </motion.div>

      {/* Featured Deals Section */}
      <motion.div variants={itemVariants}>
        <FeaturedDeals products={products} />
      </motion.div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={containerVariants}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Browse; 