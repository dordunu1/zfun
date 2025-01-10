import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiImageAdd, BiTrash, BiInfoCircle } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { storage, db } from '../../firebase/merchConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

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

const SkeletonPulse = () => (
  <motion.div
    className="w-full h-full bg-gray-200 rounded-lg"
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

const AddProductSkeleton = () => (
  <div className="max-w-2xl mx-auto p-6">
    {/* Title Skeleton */}
    <div className="w-48 h-8 mb-6">
      <SkeletonPulse />
    </div>

    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
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

const AddProduct = () => {
  const { user } = useMerchAuth();
  const navigate = useNavigate();
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
    selectedColors: []
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
      "Chargers"
    ]
  };

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
    
    if (imageFiles.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    if (productData.category === 'clothing') {
      if (!productData.subCategory) {
        toast.error('Please select a subcategory');
        return;
      }
      if (productData.hasVariants) {
        if (productData.selectedSizes.length === 0) {
          toast.error('Please select at least one size');
          return;
        }
        if (productData.selectedColors.length === 0) {
          toast.error('Please select at least one color');
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      // Upload images
      const imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const imageRef = ref(storage, `products/${user.uid}/${Date.now()}-${file.name}`);
          const snapshot = await uploadBytes(imageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );

      // Get seller info
      const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
      const sellerData = sellerDoc.data();

      // Create product with new fields
      const productRef = await addDoc(collection(db, 'products'), {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        category: productData.category,
        subCategory: productData.subCategory,
        network: productData.network,
        acceptedToken: productData.acceptedToken,
        tokenLogo: `/${productData.acceptedToken.toLowerCase()}.png`,
        images: imageUrls,
        shippingFee: Number(productData.shippingFee),
        shippingInfo: productData.shippingInfo,
        sellerId: user.sellerId,
        sellerName: sellerData.storeName,
        status: 'active',
        hasVariants: productData.hasVariants,
        sizes: productData.hasVariants ? productData.selectedSizes : [],
        colors: productData.hasVariants ? productData.selectedColors : [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success('Product added successfully');
      navigate('/merch-store/products');
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
      className="max-w-4xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Product</h1>
          <p className="text-gray-500 text-sm mb-6">Fill in the details for your new product listing</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
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
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B6B] transition-colors bg-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BiImageAdd className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Image</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors appearance-none bg-white"
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
            <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Product Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Categories */}
                <div className="space-y-4">
                  {Object.entries(productData.category === 'clothing' ? CLOTHING_SUBCATEGORIES : ACCESSORIES_SUBCATEGORIES)
                    .map(([mainCategory, subItems]) => (
                    <div key={mainCategory} className="bg-white rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">{mainCategory}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {subItems.map((subItem) => (
                          <button
                            key={subItem}
                            type="button"
                            onClick={() => handleSubCategorySelect(mainCategory, subItem)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                              productData.subCategory === `${mainCategory} - ${subItem}`
                                ? 'bg-[#FF1B6B] text-white'
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
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Selected Category</h3>
                  {productData.subCategory ? (
                    <div className="bg-pink-50 border border-pink-100 rounded-lg p-4">
                      <p className="text-gray-700">
                        <span className="font-medium">Main Category:</span>{' '}
                        {productData.subCategory.split(' - ')[0]}
                      </p>
                      <p className="text-gray-700 mt-2">
                        <span className="font-medium">Sub Category:</span>{' '}
                        {productData.subCategory.split(' - ')[1]}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-gray-500">
                      Please select a category from the left
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Variants Section */}
          {productData.category === 'clothing' && (
            <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="hasVariants"
                  checked={productData.hasVariants}
                  onChange={(e) => {
                    setProductData(prev => ({
                      ...prev,
                      hasVariants: e.target.checked,
                      selectedSizes: e.target.checked ? prev.selectedSizes : [],
                      selectedColors: e.target.checked ? prev.selectedColors : []
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF1B6B] focus:ring-[#FF1B6B]"
                />
                <label htmlFor="hasVariants" className="ml-2 text-sm font-medium text-gray-700">
                  This product has size and color variants
                </label>
              </div>

              {productData.hasVariants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size Selection */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            productData.selectedSizes.includes(size)
                              ? 'bg-[#FF1B6B] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            productData.selectedColors.includes(color.name)
                              ? 'bg-[#FF1B6B] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-gray-300 shadow-inner"
                            style={{ backgroundColor: color.value }}
                          />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Network & Price Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Network & Price
              </label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {NETWORKS.filter(network => network.id === productData.network).map(network => (
                    <div
                      key={network.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#FF1B6B] bg-pink-50 flex-1 justify-center"
                    >
                      <img src={network.logo} alt={network.name} className="w-5 h-5" />
                      <span className="font-medium">{network.name}</span>
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
                    className="w-full pl-4 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                    placeholder="0.00"
                  />
                  <div className="absolute right-0 top-0 bottom-0 w-20 border-l border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-r-lg flex items-center justify-center">
                    {productData.acceptedToken}
                  </div>
                </div>

                {/* Payment Information Display */}
                <div className="flex items-center gap-2 px-4 py-3 bg-pink-50 rounded-lg border border-pink-100 mt-2">
                  <img 
                    src={`/${productData.acceptedToken.toLowerCase()}.png`}
                    alt={productData.acceptedToken}
                    className="w-5 h-5 object-contain"
                  />
                  <p className="text-sm text-gray-700">
                    Buyers will pay in <span className="font-medium">{productData.acceptedToken}</span> on <span className="font-medium">{
                      NETWORKS.find(n => n.id === productData.network)?.name || 'selected'
                    }</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity Available
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                placeholder="Enter available quantity"
              />
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
              placeholder="Describe your product..."
            />
          </motion.div>

          {/* Shipping Section */}
          <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Fee (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="shippingFee"
                    min="0"
                    step="0.01"
                    value={productData.shippingFee}
                    disabled
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-gray-50"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Shipping fee is set in your store settings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Information
                </label>
                <input
                  type="text"
                  name="shippingInfo"
                  value={productData.shippingInfo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
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