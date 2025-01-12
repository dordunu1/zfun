import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BiArrowBack, BiCart, BiStar, BiStore, BiPlus, BiMinus } from 'react-icons/bi';
import { FiCopy } from 'react-icons/fi';
import { doc, getDoc, collection, query, where, getDocs, limit, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/reviews/ProductReviews';
import ReactCountryFlag from 'react-country-flag';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';

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

const ProductDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden">
          <SkeletonPulse />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <SkeletonPulse />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="w-3/4 h-8">
            <SkeletonPulse />
          </div>
          <div className="w-1/2 h-6">
            <SkeletonPulse />
          </div>
          <div className="w-full h-32">
            <SkeletonPulse />
          </div>
        </div>

        {/* Price and Token Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <SkeletonPulse />
          </div>
          <div className="w-24 h-8">
            <SkeletonPulse />
          </div>
        </div>

        {/* Quantity and Add to Cart Skeleton */}
        <div className="space-y-4">
          <div className="w-32 h-10">
            <SkeletonPulse />
          </div>
          <div className="w-full h-12">
            <SkeletonPulse />
          </div>
        </div>

        {/* Seller Info Skeleton */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <SkeletonPulse />
            </div>
            <div className="space-y-2">
              <div className="w-32 h-4">
                <SkeletonPulse />
              </div>
              <div className="w-24 h-4">
                <SkeletonPulse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Similar Products Skeleton */}
    <div className="mt-12 space-y-4">
      <div className="w-48 h-6">
        <SkeletonPulse />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateCartCount } = useMerchAuth();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProduct({ id: productDoc.id, ...productData });
          
          // Fetch seller details including shipping fee
          const sellerDoc = await getDoc(doc(db, 'sellers', productData.sellerId));
          if (sellerDoc.exists()) {
            setSeller({ id: sellerDoc.id, ...sellerDoc.data() });
          }
          
          fetchSimilarProducts();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const subtotal = product.price * quantity;
      const shippingFee = product.shippingFee || 0;
      const total = subtotal + shippingFee;
      setTotalPrice(total);
    }
  }, [quantity, product]);

  const fetchSimilarProducts = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        const productData = productDoc.data();
        
        // First, try to get other products from the same seller
        let q = query(
          collection(db, 'products'),
          where('sellerId', '==', productData.sellerId),
          where('status', '==', 'active'),
          limit(4)
        );
        let querySnapshot = await getDocs(q);
        let similarProductsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(p => p.id !== id); // Exclude current product

        // If seller has no other products, get products from same category
        if (similarProductsData.length === 0) {
          q = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            where('status', '==', 'active'),
            limit(4)
          );
          querySnapshot = await getDocs(q);
          similarProductsData = querySnapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(p => p.id !== id);
        }

        setSimilarProducts(similarProductsData);
      }
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, quantity + value));
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    try {
      if (!user) {
        toast.error('Please login to add items to cart');
        navigate('/merch-store/login');
        return;
      }

      if (product.category === 'clothing' && product.hasVariants) {
        if (!selectedSize) {
          toast.error('Please select a size');
          return;
        }
        if (!selectedColor) {
          toast.error('Please select a color');
          return;
        }
      }

      // Check if there's enough stock
      const productDoc = await getDoc(doc(db, 'products', id));
      if (!productDoc.exists()) {
        toast.error('Product not found');
        return;
      }

      const currentStock = productDoc.data().quantity;
      const cartQuery = query(
        collection(db, 'cart'),
        where('userId', '==', user.uid),
        where('productId', '==', id),
        where('size', '==', selectedSize || null),
        where('color', '==', selectedColor || null)
      );
      const cartSnapshot = await getDocs(cartQuery);
      const existingCartItem = cartSnapshot.docs[0]?.data();
      const totalRequestedQuantity = (existingCartItem?.quantity || 0) + quantity;

      if (totalRequestedQuantity > currentStock) {
        toast.error(`Sorry, only ${currentStock} items available in stock`);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Adding to cart...');

      const cartRef = collection(db, 'cart');
      const q = query(cartRef, 
        where('userId', '==', user.uid),
        where('productId', '==', id),
        where('size', '==', selectedSize || null),
        where('color', '==', selectedColor || null)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing cart item
        const cartDoc = querySnapshot.docs[0];
        const currentQuantity = cartDoc.data().quantity;
        await updateDoc(doc(db, 'cart', cartDoc.id), {
          quantity: currentQuantity + quantity
        });
        toast.dismiss(loadingToast);
        toast.success(`Updated quantity in cart (+${quantity})`);
      } else {
        // Add new cart item
        await addDoc(cartRef, {
          userId: user.uid,
          productId: id,
          quantity: quantity,
          size: selectedSize || null,
          color: selectedColor || null,
          addedAt: serverTimestamp()
        });
        toast.dismiss(loadingToast);
        toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      }

      // Update cart count
      await updateCartCount(user.uid);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
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

  const getTokenContractAddress = () => {
    if (!seller || !product) return null;
    
    // Map network names to chain IDs
    const networkToChainId = {
      'sepolia': '11155111',
      'polygon': '137',
      'unichain': '1301'
    };
    
    // Get network from seller's Firestore data and convert to chain ID
    const networkName = seller.preferredNetwork?.toLowerCase();
    const network = networkToChainId[networkName];
    
    if (!network) {
      console.warn('Invalid network name:', networkName);
      return null;
    }
    
    const token = product.acceptedToken;
    
    const contractAddresses = {
      '11155111': { // Sepolia
        'USDC': import.meta.env.VITE_USDC_ADDRESS_SEPOLIA,
        'USDT': import.meta.env.VITE_USDT_ADDRESS_SEPOLIA
      },
      '137': { // Polygon
        'USDC': import.meta.env.VITE_USDC_ADDRESS_POLYGON,
        'USDT': import.meta.env.VITE_USDT_ADDRESS_POLYGON
      },
      '1301': { // Unichain
        'USDC': import.meta.env.VITE_UNICHAIN_USDC_ADDRESS,
        'USDT': import.meta.env.VITE_UNICHAIN_USDT_ADDRESS
      }
    };

    const address = contractAddresses[network]?.[token];
    if (!address) {
      console.warn(`No contract address found for token ${token} on network ${network}`);
      return null;
    }

    return address;
  };

  const handleCopyAddress = async () => {
    const address = getTokenContractAddress();
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-6xl mx-auto p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#FF1B6B] mb-6"
        >
          <BiArrowBack className="text-xl" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-[#FF1B6B]'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              {seller && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 shrink-0">
                  <span className="text-sm font-medium text-gray-700">{seller.storeName}</span>
                  {seller.verificationStatus === 'approved' && (
                    <div className="group relative inline-flex items-center">
                      <VerificationCheckmark className="!w-[10px] !h-[10px] min-w-[10px] min-h-[10px]" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1 py-0.5 bg-gray-900 text-white text-[8px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                        Verified Store
                      </div>
                    </div>
                  )}
                  {seller.country?.code && (
                    <ReactCountryFlag
                      countryCode={seller.country.code}
                      svg
                      style={{
                        width: '1.2em',
                        height: '1.2em',
                      }}
                      className="rounded-sm shadow-sm"
                    />
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.tokenLogo}
                  alt={product.acceptedToken}
                  className="w-6 h-6"
                />
                <span className="text-2xl font-bold text-[#FF1B6B]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                product.quantity > 10 
                  ? 'bg-green-100 text-green-700' 
                  : product.quantity > 0 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {product.quantity > 10 
                  ? 'In Stock' 
                  : product.quantity > 0 
                    ? `Only ${product.quantity} left` 
                    : 'Out of Stock'}
              </div>
            </div>

            {/* Size and Color Selection for Clothing */}
            {product.category === 'clothing' && product.hasVariants && (
              <div className="space-y-4">
                {/* Size Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? 'bg-[#FF1B6B] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                          style={{ 
                            backgroundColor: color.toLowerCase(),
                            borderColor: color.toLowerCase() === '#ffffff' ? '#e5e7eb' : 'transparent'
                          }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-1 rounded-full hover:bg-pink-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <BiMinus className="text-xl" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="p-1 rounded-full hover:bg-pink-50 disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <BiPlus className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium">${(product.shippingFee || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-[#FF1B6B]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
              >
                <BiCart className="text-xl" />
                Add to Cart
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category and Payment Token */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="text-gray-800 font-medium">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Token</span>
                      <div className="flex items-center gap-2">
                        <img src={product.tokenLogo} alt={product.acceptedToken} className="w-4 h-4" />
                        <span className="text-gray-800 font-medium">{product.acceptedToken}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Contract Address */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Token Contract</span>
                      {getTokenContractAddress() && (
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                            {seller?.preferredNetwork?.toUpperCase()}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="px-4 py-2.5 font-mono text-sm text-gray-700">
                            {getTokenContractAddress() ? shortenAddress(getTokenContractAddress()) : 'Network or token not configured'}
                          </div>
                          {getTokenContractAddress() && (
                            <button
                              onClick={handleCopyAddress}
                              className="px-4 py-2.5 text-gray-400 hover:text-[#FF1B6B] transition-colors"
                              title="Copy full contract address"
                            >
                              <FiCopy className={`text-lg ${copiedAddress ? 'text-[#FF1B6B]' : ''}`} />
                            </button>
                          )}
                        </div>
                      </div>
                      {copiedAddress && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 transform translate-x-full">
                          <span className="bg-[#FF1B6B] text-white text-xs px-2 py-1 rounded">
                            Copied!
                          </span>
                        </div>
                      )}
                    </div>
                    {getTokenContractAddress() && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[#FF1B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Copy to acquire {product.acceptedToken} on {
                          seller?.preferredNetwork?.toLowerCase() === 'sepolia' ? 'Sepolia' :
                          seller?.preferredNetwork?.toLowerCase() === 'polygon' ? 'Polygon' :
                          seller?.preferredNetwork?.toLowerCase() === 'unichain' ? 'Unichain' : 'Unknown'
                        } network
                      </p>
                    )}
                  </div>
                </div>

                {/* Variants Information */}
                {product.category === 'clothing' && product.hasVariants && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-gray-600 block mb-3">Available Sizes</span>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <span key={size} className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 bg-gray-50">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-3">Available Colors</span>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => (
                            <div key={color} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50">
                              <span
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                              <span className="text-sm font-medium text-gray-700">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-medium text-[#FF1B6B]">${product.shippingFee?.toFixed(2) || '0.00'}</span>
                </div>
                {product.shippingInfo && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Information</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.shippingInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-12 border-t pt-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {similarProducts[0].sellerId === product.sellerId 
                ? `More from ${product.sellerName}`
                : 'Similar Products'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {similarProducts[0].sellerId === product.sellerId 
                ? 'Check out other items from this store'
                : 'You might also like these products'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group"
                  whileHover={{ y: -3 }}
                >
                  <button
                    onClick={() => {
                      navigate(`/merch-store/product/${product.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full text-left"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 mb-1 truncate">
                        {product.name}
                      </h3>
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
                      <p className="text-xs text-gray-500 mt-1">
                        by {product.sellerName}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 border-t pt-8"
        >
          <ProductReviews productId={id} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetails; 