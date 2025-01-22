import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BiEdit, BiTrash, BiPlus, BiX } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

// Token logos
const TOKEN_INFO = {
  USDT: {
    logo: '/logos/usdt.png',
    name: 'USDT (Tether)',
    decimals: 6
  },
  USDC: {
    logo: '/logos/usdc.png',
    name: 'USDC (USD Coin)',
    decimals: 6
  }
};

const SkeletonPulse = () => {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      className={`w-full h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}
      animate={{
        opacity: [0.4, 0.7, 0.4]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const ProductsSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="w-32 h-8">
          <SkeletonPulse />
        </div>
        <div className="w-40 h-10">
          <SkeletonPulse />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
            <div className="aspect-square">
              <SkeletonPulse />
            </div>
            <div className="p-3 space-y-2">
              <div className="w-3/4 h-5">
                <SkeletonPulse />
              </div>
              <div className="w-1/2 h-4">
                <SkeletonPulse />
              </div>
              <div className="w-1/3 h-4">
                <SkeletonPulse />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

const DeleteConfirmationModal = ({ product, onConfirm, onCancel }) => {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Delete Product</h3>
          <button
            onClick={onCancel}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{product.name}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price: ${product.price}</p>
            </div>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 ${
              isDarkMode 
                ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' 
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            } rounded-lg transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Product
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sellerPreferences, setSellerPreferences] = useState(null);

  useEffect(() => {
    if (user?.sellerId) {
      Promise.all([
        fetchProducts(),
        fetchSellerPreferences()
      ]);
    }
  }, [user]);

  const fetchSellerPreferences = async () => {
    try {
      const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
      if (sellerDoc.exists()) {
        setSellerPreferences(sellerDoc.data());
      }
    } catch (error) {
      console.error('Error fetching seller preferences:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, 'products'),
        where('sellerId', '==', user.sellerId)
      );
      
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // If product doesn't have a token specified, use seller's preferred token
        if (!data.acceptedToken && sellerPreferences?.preferredToken) {
          data.acceptedToken = sellerPreferences.preferredToken;
          data.tokenLogo = TOKEN_INFO[sellerPreferences.preferredToken].logo;
        }
        return {
          id: doc.id,
          ...data
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

  const handleDelete = async (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'products', productToDelete.id));
      const deletePromises = productToDelete.images.map(async (imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        return deleteObject(imageRef);
      });
      await Promise.all(deletePromises);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setProductToDelete(null);
    }
  };

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
    return <ProductsSkeleton />;
  }

  return (
    <>
      <motion.div
        className={`max-w-5xl mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h1 
            className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
            variants={itemVariants}
          >
            My Products
          </motion.h1>
          <motion.div variants={itemVariants}>
            <Link
              to="/merch-store/add-product"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
            >
              <BiPlus className="text-lg" />
              Add New Product
            </Link>
          </motion.div>
        </div>

        {products.length === 0 ? (
          <motion.div
            className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            variants={itemVariants}
          >
            <p className="mb-4">You haven't added any products yet.</p>
            <Link
              to="/merch-store/add-product"
              className="text-[#FF1B6B] hover:text-[#D4145A] font-medium"
            >
              Add your first product
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            variants={containerVariants}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="aspect-square relative group">
                  <ProductImages images={product.images} />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-white text-gray-800 rounded-full"
                      onClick={() => navigate(`/merch-store/edit-product/${product.id}`)}
                    >
                      <BiEdit className="text-lg" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-white text-red-500 rounded-full"
                      onClick={() => handleDelete(product)}
                    >
                      <BiTrash className="text-lg" />
                    </motion.button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} text-sm mb-0.5 truncate`}>{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <img 
                      src={product.tokenLogo || TOKEN_INFO[product.acceptedToken]?.logo} 
                      alt={product.acceptedToken} 
                      className="w-5 h-5"
                    />
                    <p className="text-[#FF1B6B] font-medium text-sm">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Stock: {product.quantity}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {productToDelete && (
          <DeleteConfirmationModal
            product={productToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setProductToDelete(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Products; 