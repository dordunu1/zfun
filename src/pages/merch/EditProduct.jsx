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
    shippingInfo: ''
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
        setProduct(data);
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
      const productRef = doc(db, 'products', id);
      
      await updateDoc(productRef, {
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
        updatedAt: new Date()
      });

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
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images ({product.images.length}/5)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {product.images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url, index)}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <BiTrash className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
              {product.images.length < 5 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1B6B] transition-colors">
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
                </label>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network & Price
                </label>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    {Object.entries(NETWORK_INFO).map(([network, info]) => (
                      <button
                        key={network}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'network', value: network } })}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          product.network === network 
                            ? 'border-[#FF1B6B] bg-pink-50' 
                            : 'border-gray-300 hover:border-[#FF1B6B] hover:bg-pink-50'
                        }`}
                      >
                        <img 
                          src={info.logo} 
                          alt={info.name} 
                          className="w-6 h-6 object-contain"
                        />
                        <span className={`font-medium ${
                          product.network === network 
                            ? 'text-[#FF1B6B]' 
                            : 'text-gray-700'
                        }`}>
                          {info.name}
                        </span>
                      </button>
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
                      className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {NETWORK_INFO[product.network]?.tokens && (
                        <select
                          name="acceptedToken"
                          value={product.acceptedToken}
                          onChange={handleInputChange}
                          className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                        >
                          {Object.entries(NETWORK_INFO[product.network].tokens).map(([token, info]) => (
                            <option key={token} value={token} className="flex items-center gap-2">
                              {info.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
                {NETWORK_INFO[product.network]?.tokens?.[product.acceptedToken] && (
                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                    <img 
                      src={NETWORK_INFO[product.network].tokens[product.acceptedToken].logo} 
                      alt={product.acceptedToken} 
                      className="w-4 h-4"
                    />
                    Buyers will pay in {product.acceptedToken} on {NETWORK_INFO[product.network].name} network
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Available
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                      value={product.shippingFee}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                    value={product.shippingInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
                    placeholder="Additional shipping information"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/merch-store/products')}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProduct; 