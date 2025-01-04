import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiImageAdd, BiTrash, BiInfoCircle } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { storage, db } from '../../firebase/merchConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

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
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [platformFee, setPlatformFee] = useState(2.5); // Default fee
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    acceptedToken: 'USDT', // Set default token
    tokenLogo: '/logos/usdt.png', // Set default logo
    images: [],
    shippingFee: 0,
    shippingInfo: ''
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchPlatformFee();
    if (user?.sellerId) {
      fetchSellerPreferences();
    }
  }, [user]);

  const fetchPlatformFee = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
      if (settingsDoc.exists()) {
        setPlatformFee(settingsDoc.data().platformFee);
      }
    } catch (error) {
      console.error('Error fetching platform fee:', error);
    }
  };

  const fetchSellerPreferences = async () => {
    try {
      const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
      if (sellerDoc.exists()) {
        const sellerData = sellerDoc.data();
        const preferredToken = sellerData.preferredToken || 'USDT'; // Default to USDT if not set
        setProductData(prev => ({
          ...prev,
          acceptedToken: preferredToken,
          tokenLogo: TOKEN_INFO[preferredToken].logo
        }));
      }
    } catch (error) {
      console.error('Error fetching seller preferences:', error);
      // Set default values if there's an error
      setProductData(prev => ({
        ...prev,
        acceptedToken: 'USDT',
        tokenLogo: TOKEN_INFO['USDT'].logo
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'acceptedToken' && TOKEN_INFO[value]) {
      setProductData(prev => ({
        ...prev,
        [name]: value,
        tokenLogo: TOKEN_INFO[value].logo
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

      // Create product
      const productRef = await addDoc(collection(db, 'products'), {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        category: productData.category,
        acceptedToken: productData.acceptedToken,
        tokenLogo: productData.tokenLogo,
        images: imageUrls,
        shippingFee: Number(productData.shippingFee),
        shippingInfo: productData.shippingInfo,
        sellerId: user.sellerId,
        sellerName: sellerData.storeName,
        status: 'active',
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
      className="max-w-2xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
        {/* Product Images */}
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Images (Max 5 images, 2MB each)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Image Previews */}
            {imagePreview.map((url, index) => (
              <motion.div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden group"
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
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeImage(index)}
                >
                  <BiTrash />
                </motion.button>
              </motion.div>
            ))}

            {/* Upload Button */}
            {imagePreview.length < 5 && (
              <motion.label
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B6B] transition-colors"
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

        {/* Product Details */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="collectibles">Collectibles</option>
              <option value="art">Art</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    name="acceptedToken"
                    value={productData.acceptedToken}
                    onChange={handleInputChange}
                    className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-2 focus:ring-[#FF1B6B]"
                  >
                    {Object.entries(TOKEN_INFO).map(([token, info]) => (
                      <option key={token} value={token} className="flex items-center gap-2">
                        {info.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Token Logo Display */}
              <div className="mt-2 flex items-center gap-2">
                {productData.acceptedToken && TOKEN_INFO[productData.acceptedToken] && (
                  <>
                    <img 
                      src={TOKEN_INFO[productData.acceptedToken].logo} 
                      alt={productData.acceptedToken} 
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-gray-600">
                      {TOKEN_INFO[productData.acceptedToken].name}
                    </span>
                  </>
                )}
              </div>
              {/* Platform Fee Information */}
              <div className="mt-2 flex items-start space-x-2">
                <BiInfoCircle className="text-[#FF1B6B] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-500">
                  <p>Platform fee: {platformFee}%</p>
                  {productData.price && (
                    <p>
                      You'll receive: {(productData.price * (1 - platformFee / 100)).toFixed(2)} {productData.acceptedToken}
                      <span className="text-xs ml-1">
                        (after {(productData.price * (platformFee / 100)).toFixed(2)} {productData.acceptedToken} fee)
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Available
              </label>
              <input
                type="number"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Additional shipping fee for this product
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Information
                </label>
                <textarea
                  name="shippingInfo"
                  value={productData.shippingInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  placeholder="Enter shipping details, restrictions, or additional information"
                />
              </div>
            </div>
          </div>

          {/* Token Selection Info */}
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Buyers will pay for this product in the selected token on Polygon network
            </p>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="flex justify-end pt-4">
          <motion.button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2.5 bg-[#FF1B6B] text-white rounded-lg font-medium ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#D4145A]'} transition-colors`}
            whileHover={submitting ? {} : { scale: 1.02 }}
            whileTap={submitting ? {} : { scale: 0.98 }}
          >
            {submitting ? (
              <div className="flex items-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Adding Product...
              </div>
            ) : (
              'Add Product'
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddProduct; 