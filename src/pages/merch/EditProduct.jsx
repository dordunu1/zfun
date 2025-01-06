import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { BiUpload, BiTrash } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

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

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    images: [],
    category: '',
    network: 'polygon', // Default network
    acceptedToken: 'USDT',
    tokenLogo: '/logos/usdt.png',
    shippingFee: 0,
    shippingInfo: '',
    hasVariants: false,
    sizes: [],
    colors: []
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

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

        // Get seller's preferred network
        const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
        if (sellerDoc.exists()) {
          const sellerData = sellerDoc.data();
          if (!sellerData.preferredNetwork) {
            toast.error('Please set your preferred network in settings first');
            navigate('/merch/settings');
            return;
          }
          // Set the product's network to seller's preferred network
          data.network = sellerData.preferredNetwork;
        }

        setProduct({
          ...data,
          hasVariants: data.hasVariants || false,
          sizes: data.sizes || [],
          colors: data.colors || []
        });
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
    if (name === 'network') {
      // When network changes, reset token to first available token for that network
      if (NETWORK_INFO[value] && NETWORK_INFO[value].tokens) {
        const firstToken = Object.keys(NETWORK_INFO[value].tokens)[0];
        setProduct(prev => ({
          ...prev,
          network: value,
          acceptedToken: firstToken,
          tokenLogo: NETWORK_INFO[value].tokens[firstToken].logo
        }));
      }
    } else if (name === 'acceptedToken') {
      if (NETWORK_INFO[product.network]?.tokens?.[value]) {
        setProduct(prev => ({
          ...prev,
          acceptedToken: value,
          tokenLogo: NETWORK_INFO[product.network].tokens[value].logo
        }));
      }
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'quantity' ? Number(value) : value
      }));
    }
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
    setUploading(true);

    try {
      if (product.category === 'clothing' && product.hasVariants) {
        if (product.sizes.length === 0) {
          toast.error('Please select at least one size');
          return;
        }
        if (product.colors.length === 0) {
          toast.error('Please select at least one color');
          return;
        }
      }

      const productRef = doc(db, 'products', id);
      
      const updateData = {
        name: product.name,
        description: product.description,
        price: Number(product.price),
        quantity: Number(product.quantity),
        category: product.category,
        network: product.network,
        acceptedToken: product.acceptedToken,
        tokenLogo: product.tokenLogo,
        shippingFee: Number(product.shippingFee),
        shippingInfo: product.shippingInfo,
        images: product.images,
        hasVariants: Boolean(product.hasVariants),
        sizes: product.hasVariants ? product.sizes : [],
        colors: product.hasVariants ? product.colors : [],
        updatedAt: new Date()
      };

      await updateDoc(productRef, updateData);

      toast.success('Product updated successfully');
      navigate('/merch-store/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setUploading(false);
    }
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
      className="max-w-4xl mx-auto p-6"
    >
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Product</h1>
          <p className="text-gray-500 text-sm mb-6">Update your product details and listing information</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images */}
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
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
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B6B] transition-colors bg-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BiUpload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Image</span>
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

          {/* Basic Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white appearance-none"
              >
                <option value="">Select Category</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="collectibles">Collectibles</option>
                <option value="art">Art</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Description *
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
              placeholder="Describe your product..."
            />
          </div>

          {/* Network & Price Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Network & Price
              </label>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {Object.entries(NETWORK_INFO)
                    .filter(([network]) => network === product.network)
                    .map(([network, info]) => (
                      <div
                        key={network}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#FF1B6B] bg-pink-50 flex-1 justify-center"
                      >
                        <img 
                          src={info.logo} 
                          alt={info.name} 
                          className="w-5 h-5"
                        />
                        <span className="font-medium">{info.name}</span>
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
                    className="w-full pl-4 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                    placeholder="0.00"
                  />
                  <select
                    name="acceptedToken"
                    value={product.acceptedToken}
                    onChange={handleInputChange}
                    className="absolute right-0 top-0 bottom-0 w-20 border-l border-gray-300 bg-gray-50 text-gray-700 text-sm rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B]"
                  >
                    {NETWORK_INFO[product.network]?.tokens && 
                      Object.entries(NETWORK_INFO[product.network].tokens).map(([token, info]) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Payment Information Display */}
                <div className="flex items-center gap-2 px-4 py-3 bg-pink-50 rounded-lg border border-pink-100 mt-2">
                  <img 
                    src={`/${product.acceptedToken.toLowerCase()}.png`}
                    alt={product.acceptedToken}
                    className="w-5 h-5 object-contain"
                  />
                  <p className="text-sm text-gray-700">
                    Buyers will pay in <span className="font-medium">{product.acceptedToken}</span> on <span className="font-medium">{NETWORK_INFO[product.network]?.name}</span>
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
                value={product.quantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                placeholder="Enter available quantity"
              />
            </div>
          </div>

          {/* Variants Section */}
          {product.category === 'clothing' && (
            <div className="bg-gray-50 rounded-xl p-6">
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
                <label htmlFor="hasVariants" className="ml-2 text-sm font-medium text-gray-700">
                  This product has size and color variants
                </label>
              </div>

              {product.hasVariants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Size Options */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
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
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
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
                      ].map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => {
                            setProduct(prev => ({
                              ...prev,
                              colors: prev.colors.includes(color.name)
                                ? prev.colors.filter(c => c !== color.name)
                                : [...prev.colors, color.name]
                            }));
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            product.colors.includes(color.name)
                              ? 'bg-[#FF1B6B] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-gray-300 shadow-inner"
                            style={{ backgroundColor: color.code }}
                          />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shipping Section */}
          <div className="bg-gray-50 rounded-xl p-6">
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
                    value={product.shippingFee}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Additional shipping fee for this product
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Information
                </label>
                <textarea
                  name="shippingInfo"
                  value={product.shippingInfo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                  placeholder="e.g., Worldwide shipping available"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/merch-store/products')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`px-8 py-3 rounded-lg font-medium text-white ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF1B6B] hover:bg-[#D4145A]'
              } transition-colors flex items-center gap-2`}
            >
              {uploading ? (
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