import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiSearch, BiFilter, BiStar } from 'react-icons/bi';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

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

const Browse = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  const categories = [
    'all',
    'clothing',
    'accessories',
    'electronics',
    'home',
    'art',
    'collectibles'
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
        constraints.push(where('category', '==', selectedCategory));
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
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

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
      className="max-w-7xl mx-auto p-4 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Search and Filter */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
        <div className="relative w-[400px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
          />
          <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
          >
            {networks.map(network => (
              <option key={network.value} value={network.value}>
                {network.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
          >
            <option value="latest">Latest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-[#FF1B6B] text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-[#FF1B6B]'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
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
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden group"
              variants={itemVariants}
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
                      <p className="text-[#FF1B6B] font-medium">
                        ${product.price.toFixed(2)}
                      </p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    by {product.sellerName}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Browse; 