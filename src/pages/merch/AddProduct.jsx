import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiImageAdd, BiTrash, BiInfoCircle } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storage, db } from '../../firebase/merchConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

const styles = `
  :root {
    color-scheme: light;
  }
  
  .dark input[type="datetime-local"] {
    color-scheme: dark;
    background-color: #1a1b1f !important;
    color: #fff !important;
  }

  .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1) !important;
    opacity: 0.7;
  }

  .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  .dark input[type="datetime-local"]::-webkit-datetime-edit {
    color: #fff !important;
  }

  .dark input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
    color: #fff !important;
  }

  input[type="datetime-local"] {
    color-scheme: light !important;
    background-color: white !important;
    color: #1F2937 !important;
  }

  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: none !important;
    color: #1F2937 !important;
    opacity: 0.7;
  }

  input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  input[type="datetime-local"]::-webkit-datetime-edit {
    color: #1F2937 !important;
  }

  input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
    color: #1F2937 !important;
  }

  /* Style the checkbox */
  input[type="checkbox"] {
    accent-color: #FF1B6B !important;
    border-color: #FF1B6B !important;
  }

  input[type="checkbox"]:checked {
    background-color: #FF1B6B !important;
    border-color: #FF1B6B !important;
  }

  input[type="checkbox"]:focus {
    box-shadow: 0 0 0 2px rgba(255, 27, 107, 0.3) !important;
  }
`;

// Token logos and networks
const NETWORK_INFO = {
  polygon: {
    name: 'Polygon',
    logo: '/polygon.png',
    tokens: {
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
    }
  },
  unichain: {
    name: 'Unichain',
    logo: '/unichain-logo.png',
    tokens: {
      USDT: {
        logo: '/logos/usdt.png',
        name: 'USDT (Tether)',
        decimals: 6
      }
    }
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

const AddProductSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Title Skeleton */}
      <div className="w-48 h-8 mb-6">
        <SkeletonPulse />
      </div>

      <div className={`space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
        {/* Image Upload Skeleton */}
        <div className="space-y-3">
          <div className="w-64 h-5">
            <SkeletonPulse />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square">
                <SkeletonPulse />
              </div>
            ))}
          </div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          {/* Product Name */}
          <div className="space-y-2">
            <div className="w-32 h-5">
              <SkeletonPulse />
            </div>
            <div className="w-full h-10">
              <SkeletonPulse />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="w-24 h-5">
              <SkeletonPulse />
            </div>
            <div className="w-full h-10">
              <SkeletonPulse />
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="w-16 h-5">
                <SkeletonPulse />
              </div>
              <div className="w-full h-10">
                <SkeletonPulse />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-32 h-5">
                <SkeletonPulse />
              </div>
              <div className="w-full h-10">
                <SkeletonPulse />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="w-28 h-5">
              <SkeletonPulse />
            </div>
            <div className="w-full h-32">
              <SkeletonPulse />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <div className="w-32 h-10">
              <SkeletonPulse />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SHOE_SIZES = [
  "US 6 / EU 39",
  "US 6.5 / EU 39.5",
  "US 7 / EU 40",
  "US 7.5 / EU 40.5",
  "US 8 / EU 41",
  "US 8.5 / EU 41.5",
  "US 9 / EU 42",
  "US 9.5 / EU 42.5",
  "US 10 / EU 43",
  "US 10.5 / EU 43.5",
  "US 11 / EU 44",
  "US 11.5 / EU 44.5",
  "US 12 / EU 45",
  "US 13 / EU 46"
];

const AddProduct = () => {
  const { user } = useMerchAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    images: [],
    network: 'polygon',
    acceptedToken: 'USDC',
    tokenLogo: '/logos/usdc.png',
    shippingFee: 0,
    shippingInfo: '',
    hasVariants: false,
    selectedSizes: [],
    selectedColors: [],
    colorQuantities: {},
    hasDiscount: false,
    discountPercent: 0
  });

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const COLORS = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Gray', value: '#808080' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Purple', value: '#800080' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Brown', value: '#A52A2A' }
  ];

  const NETWORKS = [
    { id: 'polygon', name: 'Polygon', logo: '/polygon.png' },
    { id: 'unichain', name: 'Unichain Testnet', logo: '/unichain-logo.png' }
  ];

  const CLOTHING_SUBCATEGORIES = {
    "Men's Wear": [
      "T-Shirts",
      "Shirts",
      "Pants",
      "Hoodies",
      "Jackets",
      "Suits"
    ],
    "Women's Wear": [
      "Dresses",
      "Tops",
      "Skirts",
      "Pants",
      "Blouses",
      "Jackets"
    ],
    "Footwear": [
      "Sneakers",
      "Formal Shoes",
      "Boots",
      "Sandals",
      "Slippers"
    ]
  };

  const ACCESSORIES_SUBCATEGORIES = {
    "Fashion Accessories": [
      "Bags",
      "Belts",
      "Hats",
      "Scarves",
      "Jewelry"
    ],
    "Tech Accessories": [
      "Phone Cases",
      "Laptop Bags",
      "Headphone Cases",
      "Tablet Covers",
      "Chargers",
      "Headphones",
      "Speakers",
      "MP3 Players",
      "Sound Systems",
      "Audio Cables"
    ]
  };

  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [quantities, setQuantities] = useState({});

  const isFootwearProduct = () => {
    return productData.category === 'clothing' && 
           productData.subCategory && 
           productData.subCategory.split(' - ')[0] === 'Footwear';
  };

  useEffect(() => {
    if (isFootwearProduct()) {
      setSizes(SHOE_SIZES);
      setSelectedSizes([]);
      setQuantities({});
    } else {
      setSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
      setSelectedSizes([]);
      setQuantities({});
    }
  }, [productData.category, productData.subCategory]);

  useEffect(() => {
    const loadSellerPreferences = async () => {
      try {
        if (!user?.sellerId) {
          setLoading(false);
          return;
        }

        const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
        if (sellerDoc.exists()) {
          const sellerData = sellerDoc.data();
          if (!sellerData.preferredNetwork || !sellerData.preferredToken) {
            setLoading(false);
            return;
          }

          setProductData(prev => ({
            ...prev,
            network: sellerData.preferredNetwork,
            acceptedToken: sellerData.preferredToken,
            tokenLogo: `/logos/${sellerData.preferredToken.toLowerCase()}.png`,
            shippingFee: sellerData.shippingFee || 0
          }));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading seller preferences:', error);
        setLoading(false);
      }
    };

    loadSellerPreferences();
  }, [user?.sellerId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1B6B]"></div>
    </div>;
  }

  // Check if preferences are set
  if (!productData.network || !productData.acceptedToken) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Network and Payment Preferences Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Before adding products, you need to set your preferred network and payment token in your store settings.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/merch/settings')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B]"
                >
                  Go to Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setProductData(prev => ({
        ...prev,
        category: value,
        subCategory: '',
        hasVariants: false,
        selectedSizes: [],
        selectedColors: []
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (imageFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Each image must be less than 2MB');
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...files]);
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreview[index]); // Clean up URL object
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${user.uid}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Check if user is a seller
      if (!user?.sellerId) {
        toast.error('You must be a registered seller to add products');
        setSubmitting(false);
        return;
      }

      // Get seller info
      const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
      if (!sellerDoc.exists()) {
        toast.error('Seller information not found');
        setSubmitting(false);
        return;
      }
      const sellerData = sellerDoc.data();

      // Validate required fields
      if (!productData.name || !productData.description || !productData.price) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate images
      if (imageFiles.length === 0) {
        toast.error('Please add at least one product image');
        setSubmitting(false);
        return;
      }

      // Upload images first
      const imageUrls = await uploadImages(imageFiles);

      // Validate sizes for footwear
      if (isFootwearProduct() && productData.hasVariants && productData.selectedSizes.length === 0) {
        toast.error('Please select at least one shoe size');
        setSubmitting(false);
        return;
      }

      // Validate quantities for selected sizes
      if (productData.hasVariants) {
        const totalQuantity = Object.values(productData.colorQuantities).reduce((sum, qty) => sum + Number(qty), 0);
        if (totalQuantity === 0) {
          toast.error('Please specify quantities for all selected colors');
          setSubmitting(false);
          return;
        }
      }

      // Format the discountEndsAt date properly
      let discountEndsAt = null;
      if (productData.hasDiscount && productData.discountEndsAt) {
        discountEndsAt = new Date(productData.discountEndsAt).toISOString();
      }

      // Calculate discounted price if discount is applied
      const discountedPrice = productData.hasDiscount ? 
        Number(productData.price) * (1 - Number(productData.discountPercent) / 100) : 
        Number(productData.price);

      // Prepare product data for Firestore
      const newProductData = {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        subCategory: productData.subCategory,
        images: imageUrls,
        network: productData.network,
        acceptedToken: productData.acceptedToken,
        tokenLogo: productData.tokenLogo,
        shippingFee: Number(productData.shippingFee),
        shippingInfo: productData.shippingInfo,
        hasVariants: productData.hasVariants,
        sizes: productData.hasVariants ? productData.selectedSizes : [],
        colors: productData.hasVariants ? productData.selectedColors : [],
        colorQuantities: productData.hasVariants ? productData.colorQuantities : {},
        quantity: productData.hasVariants ? 
          Object.values(productData.colorQuantities).reduce((a, b) => a + Number(b), 0) : 
          Number(productData.quantity),
        hasDiscount: productData.hasDiscount,
        discountPercent: productData.hasDiscount ? Number(productData.discountPercent) : 0,
        discountEndsAt: discountEndsAt,
        discountedPrice: discountedPrice,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sellerId: user.sellerId,
        sellerName: sellerData.storeName || 'Anonymous',
        soldCount: 0
      };

      // Remove empty or undefined values
      Object.keys(newProductData).forEach(key => {
        if (newProductData[key] === undefined || newProductData[key] === '' || newProductData[key] === null) {
          delete newProductData[key];
        }
      });

      const docRef = await addDoc(collection(db, 'products'), newProductData);
      
      toast.success('Product added successfully');
      navigate(`/merch-store/product/${docRef.id}`);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSizeToggle = (size) => {
    setProductData(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const handleColorToggle = (color) => {
    setProductData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color.name)
        ? prev.selectedColors.filter(c => c !== color.name)
        : [...prev.selectedColors, color.name]
    }));
  };

  const handleNetworkChange = (networkId) => {
    setProductData(prev => ({
      ...prev,
      network: networkId
    }));
  };

  const handleSubCategorySelect = (mainCategory, subItem) => {
    setProductData(prev => ({
      ...prev,
      subCategory: `${mainCategory} - ${subItem}`
    }));
  };

  // Animation variants
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
    return <AddProductSkeleton />;
  }

  return (
    <motion.div
      className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <style>{styles}</style>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}>
        <motion.div variants={itemVariants}>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Add New Product</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-6`}>Fill in the details for your new product listing</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
              Product Images (Max 5 images, 2MB each)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Image Previews */}
              {imagePreview.map((url, index) => (
                <motion.div
                  key={url}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    type="button"
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeImage(index)}
                  >
                    <BiTrash size={16} />
                  </motion.button>
                </motion.div>
              ))}

              {/* Upload Button */}
              {imagePreview.length < 5 && (
                <motion.label
                  className={`aspect-square rounded-lg border-2 border-dashed ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-[#FF1B6B]' 
                      : 'border-gray-300 hover:border-[#FF1B6B]'
                  } flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BiImageAdd className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                </motion.label>
              )}
            </div>
          </motion.div>

          {/* Basic Product Details */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white focus:border-[#FF1B6B]' 
                    : 'border-gray-300 bg-white text-gray-900 focus:border-[#FF1B6B]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors`}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                Category *
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors appearance-none`}
              >
                <option value="">Select Category</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home</option>
                <option value="art">Art</option>
                <option value="collectibles">Collectibles</option>
              </select>
            </div>
          </motion.div>

          {/* Subcategory Section */}
          {(productData.category === 'clothing' || productData.category === 'accessories') && (
            <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
                Product Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Categories */}
                <div className="space-y-4">
                  {Object.entries(productData.category === 'clothing' ? CLOTHING_SUBCATEGORIES : ACCESSORIES_SUBCATEGORIES)
                    .map(([mainCategory, subItems]) => (
                    <div key={mainCategory} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                      <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>{mainCategory}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {subItems.map((subItem) => (
                          <button
                            key={subItem}
                            type="button"
                            onClick={() => handleSubCategorySelect(mainCategory, subItem)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              productData.subCategory === `${mainCategory} - ${subItem}`
                                ? 'bg-[#FF1B6B] text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {subItem}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Category Display */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>Selected Category</h3>
                  {productData.subCategory ? (
                    <div className={`${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'} border ${isDarkMode ? 'border-pink-900/20' : 'border-pink-100'} rounded-lg p-4`}>
                      <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                        <span className="font-medium">Main Category:</span>{' '}
                        {productData.subCategory.split(' - ')[0]}
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mt-2`}>
                        <span className="font-medium">Sub Category:</span>{' '}
                        {productData.subCategory.split(' - ')[1]}
                      </p>
                    </div>
                  ) : (
                    <div className={`${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'} border rounded-lg p-4`}>
                      Please select a category from the left
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Variants Section */}
          {(productData.category === 'clothing' || productData.category === 'accessories') && (
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="hasVariants"
                  name="hasVariants"
                  checked={productData.hasVariants}
                  onChange={(e) => {
                    setProductData(prev => ({
                      ...prev,
                      hasVariants: e.target.checked,
                      sizes: e.target.checked ? prev.selectedSizes : [],
                      colors: e.target.checked ? prev.selectedColors : []
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF1B6B] focus:ring-[#FF1B6B]"
                />
                <label htmlFor="hasVariants" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  This product has size and color variants
                </label>
              </div>

              {productData.hasVariants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size Selection */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {isFootwearProduct() ? (
                        // Show shoe sizes for footwear
                        SHOE_SIZES.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              productData.selectedSizes.includes(size)
                                ? 'bg-[#FF1B6B] text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))
                      ) : (
                        // Show clothing sizes for non-footwear
                        SIZES.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              productData.selectedSizes.includes(size)
                                ? 'bg-[#FF1B6B] text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Color Selection and Quantities */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                      Available Colors & Quantities
                    </label>
                    <div className="space-y-4">
                      {COLORS.map(color => {
                        const isSelected = productData.selectedColors.includes(color.name);
                        return (
                          <div key={color.name} className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleColorToggle(color)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-[#FF1B6B] text-white'
                                  : isDarkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <span
                                className="h-4 w-4 rounded-full border border-gray-300 shadow-inner"
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </button>
                            
                            {isSelected && (
                              <div className="flex-1 max-w-[150px]">
                                <input
                                  type="number"
                                  min="0"
                                  value={productData.colorQuantities[color.name] || ''}
                                  onChange={(e) => {
                                    const value = Math.max(0, parseInt(e.target.value) || 0);
                                    setProductData(prev => ({
                                      ...prev,
                                      colorQuantities: {
                                        ...prev.colorQuantities,
                                        [color.name]: value
                                      }
                                    }));
                                  }}
                                  className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors text-sm ${
                                    isDarkMode
                                      ? 'border-gray-600 bg-gray-700 text-white'
                                      : 'border-gray-300 bg-white text-gray-900'
                                  }`}
                                  placeholder="Quantity"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Quantity Display */}
                    {productData.selectedColors.length > 0 && (
                      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Quantity:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {Object.values(productData.colorQuantities).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Network & Price Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                Network & Price
              </label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {NETWORKS.filter(network => network.id === productData.network).map(network => (
                    <div
                      key={network.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#FF1B6B] ${
                        isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'
                      } flex-1 justify-center`}
                    >
                      <img src={network.logo} alt={network.name} className="w-5 h-5" />
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{network.name}</span>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className={`w-full pl-4 pr-24 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="0.00"
                  />
                  <div className={`absolute right-0 top-0 bottom-0 w-20 border-l ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-600 text-gray-200'
                      : 'border-gray-300 bg-gray-50 text-gray-700'
                  } text-sm rounded-r-lg flex items-center justify-center`}>
                    {productData.acceptedToken}
                  </div>
                </div>

                {/* Discount Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasDiscount"
                      checked={productData.hasDiscount}
                      onChange={(e) => {
                        setProductData(prev => ({
                          ...prev,
                          hasDiscount: e.target.checked,
                          discountPercent: e.target.checked ? prev.discountPercent : 0
                        }));
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#FF1B6B] focus:ring-[#FF1B6B]"
                    />
                    <label htmlFor="hasDiscount" className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Apply Discount
                    </label>
                  </div>

                  {productData.hasDiscount && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          name="discountPercent"
                          value={productData.discountPercent}
                          onChange={(e) => {
                            const value = Math.min(Math.max(0, Number(e.target.value)), 99);
                            setProductData(prev => ({
                              ...prev,
                              discountPercent: value,
                              discountedPrice: prev.price * (1 - value / 100)
                            }));
                          }}
                          min="0"
                          max="99"
                          className={`w-full pl-4 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                            isDarkMode
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                          placeholder="Enter discount percentage"
                        />
                        <div className={`absolute right-0 top-0 bottom-0 w-12 border-l ${
                          isDarkMode
                            ? 'border-gray-600 bg-gray-600 text-gray-200'
                            : 'border-gray-300 bg-gray-50 text-gray-700'
                        } text-sm rounded-r-lg flex items-center justify-center`}>
                          %
                        </div>
                      </div>

                      <div className="relative">
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                          Discount Ends At
                        </label>
                        <input
                          type="datetime-local"
                          name="discountEndsAt"
                          value={productData.discountEndsAt ? new Date(productData.discountEndsAt).toISOString().substring(0, 16) : ''}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const now = new Date();
                            
                            if (selectedDate <= now) {
                              toast.error('Please select a future date and time');
                              return;
                            }
                            
                            setProductData(prev => ({
                              ...prev,
                              discountEndsAt: e.target.value
                            }));
                          }}
                          min={new Date(new Date().getTime() + 60000).toISOString().slice(0, 16)}
                          className={`w-full pl-4 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                            isDarkMode
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      {productData.discountPercent > 0 && productData.price > 0 && (
                        <div className={`${
                          isDarkMode ? 'bg-pink-900/20 border-pink-900/20' : 'bg-pink-50 border-pink-100'
                        } border rounded-lg p-3`}>
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            <span className="font-medium">Original Price:</span>{' '}
                            {productData.price} {productData.acceptedToken}
                          </p>
                          <p className="text-[#FF1B6B] mt-1">
                            <span className="font-medium">Discounted Price:</span>{' '}
                            {(productData.price * (1 - productData.discountPercent / 100)).toFixed(2)} {productData.acceptedToken}
                          </p>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            <span className="font-medium">Savings:</span>{' '}
                            {(productData.price * (productData.discountPercent / 100)).toFixed(2)} {productData.acceptedToken}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Information Display */}
                <div className={`flex items-center gap-2 px-4 py-3 ${
                  isDarkMode ? 'bg-pink-900/20 border-pink-900/20' : 'bg-pink-50 border-pink-100'
                } rounded-lg border mt-2`}>
                  <img 
                    src={`/${productData.acceptedToken.toLowerCase()}.png`}
                    alt={productData.acceptedToken}
                    className="w-5 h-5 object-contain"
                  />
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Buyers will pay in <span className="font-medium">{productData.acceptedToken}</span> on <span className="font-medium">{
                      NETWORKS.find(n => n.id === productData.network)?.name || 'selected'
                    }</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                Quantity Available
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Enter available quantity"
              />
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
              Description *
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="Describe your product..."
            />
          </motion.div>

          {/* Shipping Section */}
          <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Shipping Fee (USD)
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                  <input
                    type="number"
                    name="shippingFee"
                    min="0"
                    step="0.01"
                    value={productData.shippingFee}
                    disabled
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700/50 text-gray-400'
                        : 'border-gray-300 bg-gray-50 text-gray-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Shipping fee is set in your store settings
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Shipping Information
                </label>
                <input
                  type="text"
                  name="shippingInfo"
                  value={productData.shippingInfo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="e.g., Worldwide shipping available"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-medium text-white ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF1B6B] hover:bg-[#D4145A]'
              } transition-colors flex items-center gap-2`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Adding Product...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProduct; 