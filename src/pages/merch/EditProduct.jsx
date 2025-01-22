import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { BiUpload, BiTrash } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

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
      },
      USDC: {
        logo: '/logos/usdc.png',
        name: 'USDC (USD Coin)',
        decimals: 6
      }
    }
  }
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

const EditProduct = () => {
  const { user } = useMerchAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    images: [],
    network: 'polygon',
    acceptedToken: 'USDT',
    tokenLogo: '/logos/usdt.png',
    shippingFee: 0,
    shippingInfo: '',
    hasVariants: false,
    sizes: [],
    colors: [],
    colorQuantities: {},
    hasDiscount: false,
    discountPercent: 0
  });

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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (originalProduct) {
      const hasModifications = JSON.stringify(originalProduct) !== JSON.stringify(product);
      setHasChanges(hasModifications);
    }
  }, [product, originalProduct]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        const data = productDoc.data();
        if (data.sellerId !== user.sellerId) {
          toast.error('You do not have permission to edit this product');
          navigate('/merch-store/products');
          return;
        }

        // Get seller's preferred network and shipping fee
        const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
        if (sellerDoc.exists()) {
          const sellerData = sellerDoc.data();
          if (!sellerData.preferredNetwork) {
            toast.error('Please set your preferred network in settings first');
            navigate('/merch-store/settings');
            return;
          }
          // Set the product's network to seller's preferred network and shipping fee
          data.network = sellerData.preferredNetwork;
          data.acceptedToken = sellerData.preferredToken;
          data.shippingFee = sellerData.shippingFee || 0;
        }

        const productData = {
          ...data,
          hasVariants: data.hasVariants || false,
          sizes: data.sizes || [],
          colors: data.colors || [],
          colorQuantities: data.colorQuantities || {}
        };

        setProduct(productData);
        setOriginalProduct(productData);
      } else {
        toast.error('Product not found');
        navigate('/merch-store/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setProduct(prev => ({
        ...prev,
        category: value,
        subCategory: '',
        hasVariants: false,
        sizes: [],
        colors: []
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubCategorySelect = (mainCategory, subItem) => {
    setProduct(prev => ({
      ...prev,
      subCategory: `${mainCategory} - ${subItem}`
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + product.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Each image must be less than 2MB');
        }

        const storageRef = ref(storage, `products/${user.sellerId}/${id}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl, index) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!product.name || !product.description || !product.price) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate at least one image
      if (!product.images || product.images.length === 0) {
        toast.error('Please upload at least one product image');
        setSubmitting(false);
        return;
      }

      // Validate sizes for footwear
      if (isFootwearProduct() && product.hasVariants) {
        if (!product.sizes || product.sizes.length === 0) {
          toast.error('Please select at least one size for footwear');
          setSubmitting(false);
          return;
        }
      }

      // Calculate discounted price if discount is applied
      let discountedPrice = null;
      if (product.hasDiscount && product.discountPercent) {
        discountedPrice = product.price * (1 - product.discountPercent / 100);
      }

      // Prepare update data
      const updateData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category,
        subCategory: product.subCategory,
        images: product.images,
        hasVariants: product.hasVariants,
        hasDiscount: product.hasDiscount,
        discountPercent: product.hasDiscount ? parseFloat(product.discountPercent) : null,
        discountEndsAt: product.hasDiscount ? new Date(product.discountEndsAt).toISOString() : null,
        discountedPrice: discountedPrice,
        updatedAt: serverTimestamp(),
      };

      // Add sizes and colors if product has variants
      if (product.hasVariants) {
        updateData.sizes = product.sizes;
        updateData.colors = product.colors;
        updateData.colorQuantities = product.colorQuantities;
      }

      // Remove null or undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Update product in Firestore
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updateData);

      toast.success('Product updated successfully');
      navigate(`/merch-store/product/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFootwearProduct = () => {
    return product.subCategory && 
           product.subCategory.split(' - ')[0] === 'Footwear';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-6 h-6 border-2 border-[#FF1B6B] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <style>{styles}</style>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}>
        <motion.div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>Edit Product</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-6`}>Update your product details and listing information</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images */}
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
              Product Images ({product.images.length}/5)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {product.images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-white">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveImage(url, index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BiTrash size={16} />
                  </motion.button>
                </div>
              ))}
              {product.images.length < 5 && (
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
                  <BiUpload className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </motion.label>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2.5 border ${
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
                  value={product.category}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2.5 border ${
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
            </div>

            {/* Subcategory Section */}
            {(product.category === 'clothing' || product.category === 'accessories') && (
              <motion.div variants={itemVariants} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-4`}>
                  Product Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Categories */}
                  <div className="space-y-4">
                    {Object.entries(product.category === 'clothing' ? CLOTHING_SUBCATEGORIES : ACCESSORIES_SUBCATEGORIES)
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
                                product.subCategory === `${mainCategory} - ${subItem}`
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
                    {product.subCategory ? (
                      <div className={`${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'} border ${isDarkMode ? 'border-pink-900/20' : 'border-pink-100'} rounded-lg p-4`}>
                        <p className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                          <span className="font-medium">Main Category:</span>{' '}
                          {product.subCategory.split(' - ')[0]}
                        </p>
                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mt-2`}>
                          <span className="font-medium">Sub Category:</span>{' '}
                          {product.subCategory.split(' - ')[1]}
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

            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                Description *
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Network & Price Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                Network & Price
              </label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {Object.entries(NETWORK_INFO)
                    .filter(([network]) => network === product.network)
                    .map(([network, info]) => (
                      <div
                        key={network}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#FF1B6B] ${
                          isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'
                        } flex-1 justify-center`}
                      >
                        <img 
                          src={info.logo} 
                          alt={info.name} 
                          className="w-5 h-5"
                        />
                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{info.name}</span>
                      </div>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={product.price}
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
                    {product.acceptedToken}
                  </div>
                </div>

                {/* Discount Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasDiscount"
                      checked={product.hasDiscount}
                      onChange={(e) => {
                        setProduct(prev => ({
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

                  {product.hasDiscount && (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          name="discountPercent"
                          value={product.discountPercent}
                          onChange={(e) => {
                            const value = Math.min(Math.max(0, Number(e.target.value)), 99);
                            setProduct(prev => ({
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
                          value={product.discountEndsAt ? new Date(product.discountEndsAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            const now = new Date();
                            
                            if (selectedDate <= now) {
                              toast.error('Please select a future date and time');
                              return;
                            }
                            
                            setProduct(prev => ({
                              ...prev,
                              discountEndsAt: selectedDate.toISOString()
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

                      {product.discountPercent > 0 && product.price > 0 && (
                        <div className={`${
                          isDarkMode ? 'bg-pink-900/20 border-pink-900/20' : 'bg-pink-50 border-pink-100'
                        } border rounded-lg p-3`}>
                          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            <span className="font-medium">Original Price:</span>{' '}
                            {product.price} {product.acceptedToken}
                          </p>
                          <p className="text-[#FF1B6B] mt-1">
                            <span className="font-medium">Discounted Price:</span>{' '}
                            {(product.price * (1 - product.discountPercent / 100)).toFixed(2)} {product.acceptedToken}
                          </p>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            <span className="font-medium">Savings:</span>{' '}
                            {(product.price * (product.discountPercent / 100)).toFixed(2)} {product.acceptedToken}
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
                    src={`/${product.acceptedToken.toLowerCase()}.png`}
                    alt={product.acceptedToken}
                    className="w-5 h-5 object-contain"
                  />
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Buyers will pay in <span className="font-medium">{product.acceptedToken}</span> on <span className="font-medium">{
                      NETWORK_INFO[product.network]?.name || 'selected'
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
                value={product.quantity}
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

          {/* Variants Section */}
          {(product.category === 'clothing' || product.category === 'accessories') && (
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="hasVariants"
                  name="hasVariants"
                  checked={product.hasVariants}
                  onChange={(e) => {
                    setProduct(prev => ({
                      ...prev,
                      hasVariants: e.target.checked,
                      sizes: e.target.checked ? prev.sizes : [],
                      colors: e.target.checked ? prev.colors : []
                    }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#FF1B6B] focus:ring-[#FF1B6B]"
                />
                <label htmlFor="hasVariants" className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  This product has size and color variants
                </label>
              </div>

              {product.hasVariants && (
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
                            onClick={() => {
                              setProduct(prev => ({
                                ...prev,
                                sizes: prev.sizes.includes(size)
                                  ? prev.sizes.filter(s => s !== size)
                                  : [...prev.sizes, size]
                              }));
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              product.sizes.includes(size)
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
                        ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setProduct(prev => ({
                                ...prev,
                                sizes: prev.sizes.includes(size)
                                  ? prev.sizes.filter(s => s !== size)
                                  : [...prev.sizes, size]
                              }));
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              product.sizes.includes(size)
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
                      {[
                        { name: 'Black', code: '#000000' },
                        { name: 'White', code: '#FFFFFF' },
                        { name: 'Gray', code: '#808080' },
                        { name: 'Red', code: '#FF0000' },
                        { name: 'Blue', code: '#0000FF' },
                        { name: 'Green', code: '#008000' },
                        { name: 'Yellow', code: '#FFFF00' },
                        { name: 'Purple', code: '#800080' },
                        { name: 'Pink', code: '#FFC0CB' },
                        { name: 'Brown', code: '#A52A2A' }
                      ].map((color) => {
                        const isSelected = product.colors.includes(color.name);
                        return (
                          <div key={color.name} className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                const newColors = product.colors.includes(color.name)
                                  ? product.colors.filter(c => c !== color.name)
                                  : [...product.colors, color.name];
                                
                                // Update colorQuantities when removing a color
                                const newColorQuantities = { ...product.colorQuantities };
                                if (!newColors.includes(color.name)) {
                                  delete newColorQuantities[color.name];
                                }
                                
                                setProduct(prev => ({
                                  ...prev,
                                  colors: newColors,
                                  colorQuantities: newColorQuantities
                                }));
                              }}
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
                                style={{ backgroundColor: color.code }}
                              />
                              <span>{color.name}</span>
                            </button>
                            
                            {isSelected && (
                              <div className="flex-1 max-w-[150px]">
                                <input
                                  type="number"
                                  min="0"
                                  value={product.colorQuantities[color.name] || ''}
                                  onChange={(e) => {
                                    const value = Math.max(0, parseInt(e.target.value) || 0);
                                    setProduct(prev => ({
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
                    {product.colors.length > 0 && (
                      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Quantity:</span>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {Object.values(product.colorQuantities).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
                    value={product.shippingFee}
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
                  value={product.shippingInfo}
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/merch-store/products')}
              className={`px-8 py-3 border-2 ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } rounded-lg transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading || !hasChanges}
              className={`px-8 py-3 rounded-lg font-medium text-white ${
                submitting || uploading || !hasChanges 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#FF1B6B] hover:bg-[#D4145A]'
              } transition-colors flex items-center gap-2`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Updating Product...</span>
                </>
              ) : uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProduct;