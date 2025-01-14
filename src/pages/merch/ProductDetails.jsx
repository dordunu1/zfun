import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BiArrowBack, BiCart, BiStar, BiStore, BiPlus, BiMinus, BiWallet, BiMessageDetail } from 'react-icons/bi';
import { FiCopy } from 'react-icons/fi';
import { doc, getDoc, collection, query, where, getDocs, limit, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/reviews/ProductReviews';
import ReactCountryFlag from 'react-country-flag';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';
import CountdownTimer from '../../components/shared/CountdownTimer';

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
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          setProduct(productData);
          
          // Fetch seller details including shipping fee
          if (productData.sellerId) {
            const sellerDoc = await getDoc(doc(db, 'sellers', productData.sellerId));
            if (sellerDoc.exists()) {
              setSeller({ id: sellerDoc.id, ...sellerDoc.data() });
            }
          }
          
          fetchSimilarProducts();
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const isDiscountValid = product.hasDiscount && new Date() < new Date(product.discountEndsAt);
      const currentPrice = isDiscountValid ? product.discountedPrice : product.price;
      const subtotal = currentPrice * quantity;
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
    if (!selectedColor && product?.hasVariants) {
      toast.error('Please select a color first');
      return;
    }

    const maxQuantity = product?.hasVariants && product?.colorQuantities
      ? (product.colorQuantities[selectedColor] || 0)
      : (product?.quantity || 0);

    const newQuantity = Math.max(1, Math.min(maxQuantity, quantity + value));
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

      const productData = productDoc.data();
      const currentColorStock = product.hasVariants ? 
        (productData.colorQuantities?.[selectedColor] || 0) : 
        productData.quantity;

      // Check existing cart items for the same color
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

      if (totalRequestedQuantity > currentColorStock) {
        toast.error(`Sorry, only ${currentColorStock} items available in ${selectedColor || 'stock'}`);
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

      if (querySnapshot.empty) {
        // Add new cart item
        await addDoc(cartRef, {
          userId: user.uid,
          productId: id,
          quantity: quantity,
          size: selectedSize || null,
          color: selectedColor || null,
          addedAt: serverTimestamp(),
          price: product.hasDiscount && new Date() < new Date(product.discountEndsAt) 
            ? product.discountedPrice 
            : product.price,
          isDiscounted: product.hasDiscount && new Date() < new Date(product.discountEndsAt),
          originalPrice: product.price,
          discountedPrice: product.discountedPrice,
          discountEndsAt: product.discountEndsAt
        });
        toast.dismiss(loadingToast);
        toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      } else {
        // Update existing cart item
        const cartDoc = querySnapshot.docs[0];
        const currentQuantity = cartDoc.data().quantity;
        await updateDoc(doc(db, 'cart', cartDoc.id), {
          quantity: currentQuantity + quantity,
          price: product.hasDiscount && new Date() < new Date(product.discountEndsAt) 
            ? product.discountedPrice 
            : product.price,
          isDiscounted: product.hasDiscount && new Date() < new Date(product.discountEndsAt),
          originalPrice: product.price,
          discountedPrice: product.discountedPrice,
          discountEndsAt: product.discountEndsAt
        });
        toast.dismiss(loadingToast);
        toast.success(`Updated quantity in cart (+${quantity})`);
      }

      // Update cart count
      await updateCartCount(user.uid);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!user) {
        toast.error('Please login to purchase items');
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

      const productData = productDoc.data();
      const currentColorStock = product.hasVariants ? 
        (productData.colorQuantities?.[selectedColor] || 0) : 
        productData.quantity;

      if (quantity > currentColorStock) {
        toast.error(`Sorry, only ${currentColorStock} items available in ${selectedColor || 'stock'}`);
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Processing...');

      // Clear existing cart first
      const cartQuery = query(collection(db, 'cart'), where('userId', '==', user.uid));
      const cartSnapshot = await getDocs(cartQuery);
      const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Add this item to cart
      await addDoc(collection(db, 'cart'), {
        userId: user.uid,
        productId: id,
        quantity: quantity,
        size: selectedSize || null,
        color: selectedColor || null,
        addedAt: serverTimestamp(),
        price: product.hasDiscount && new Date() < new Date(product.discountEndsAt) 
          ? product.discountedPrice 
          : product.price,
        isDiscounted: product.hasDiscount && new Date() < new Date(product.discountEndsAt),
        originalPrice: product.price,
        discountedPrice: product.discountedPrice,
        discountEndsAt: product.discountEndsAt
      });

      // Update cart count
      await updateCartCount(user.uid);

      toast.dismiss(loadingToast);
      // Navigate to checkout
      navigate('/merch-store/checkout');

      // Update product quantities after purchase
      await updateProductQuantities(id, selectedColor, quantity);
    } catch (error) {
      console.error('Error processing buy now:', error);
      toast.error('Failed to process. Please try again.');
    }
  };

  const handleContactStore = async () => {
    if (!user) {
      toast.error('Please log in to contact the store');
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Starting conversation...');

      // Check if conversation already exists with this seller
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', user.uid),
        where('sellerId', '==', product.sellerId)
      );
      const querySnapshot = await getDocs(q);
      
      let conversationId;
      
      if (!querySnapshot.empty) {
        // Use existing conversation
        conversationId = querySnapshot.docs[0].id;
        
        // Add new product card message
        await addDoc(collection(db, 'messages'), {
          conversationId,
          senderId: user.uid,
          text: "Hi, I'm interested in this product:",
          timestamp: serverTimestamp(),
          productCard: {
            productId: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images[0]
          }
        });

        // Update conversation
        await updateDoc(doc(db, 'conversations', conversationId), {
          lastMessage: "Hi, I'm interested in this product:",
          lastMessageTime: serverTimestamp(),
          [`unreadCount.${product.sellerId}`]: (querySnapshot.docs[0].data().unreadCount?.[product.sellerId] || 0) + 1,
          updatedAt: serverTimestamp()
        });

      } else {
        // Create new conversation
        const conversationRef = await addDoc(collection(db, 'conversations'), {
          participants: [user.uid, product.sellerId],
          buyerId: user.uid,
          sellerId: product.sellerId,
          buyerName: user.displayName || 'Token Factory Shopper',
          sellerName: product.sellerName,
          isVerifiedSeller: seller?.verificationStatus === 'approved',
          unreadCount: {
            [product.sellerId]: 1,
            [user.uid]: 0
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        conversationId = conversationRef.id;

        // Add initial message with product card
        await addDoc(collection(db, 'messages'), {
          conversationId: conversationRef.id,
          senderId: user.uid,
          text: "Hi, I'm interested in this product:",
          timestamp: serverTimestamp(),
          productCard: {
            productId: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.images[0]
          }
        });

        // Update conversation with last message
        await updateDoc(conversationRef, {
          lastMessage: "Hi, I'm interested in this product:",
          lastMessageTime: serverTimestamp()
        });
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Message sent successfully!');

      // Navigate to conversation
      navigate(`/merch-store/inbox/${conversationId}`);
      
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
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

  // Add this function to update product quantities after purchase
  const updateProductQuantities = async (productId, color, quantity) => {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    
    if (productData.hasVariants && color) {
      // Update color-specific quantity
      const currentColorQuantity = productData.colorQuantities[color] || 0;
      const newColorQuantity = Math.max(0, currentColorQuantity - quantity);
      
      const newColorQuantities = {
        ...productData.colorQuantities,
        [color]: newColorQuantity
      };

      // Update total quantity as sum of all color quantities
      const newTotalQuantity = Object.values(newColorQuantities).reduce((a, b) => a + b, 0);

      await updateDoc(productRef, {
        colorQuantities: newColorQuantities,
        quantity: newTotalQuantity
      });
    } else {
      // Update regular quantity
      const newQuantity = Math.max(0, productData.quantity - quantity);
      await updateDoc(productRef, {
        quantity: newQuantity
      });
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Product not found</div>
      </div>
    );
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
            <div className="aspect-square rounded-lg overflow-hidden relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Discount Tag */}
              {product.hasDiscount && new Date() < new Date(product.discountEndsAt) && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-[#FF1B6B] text-white px-4 py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="font-bold">{product.discountPercent}% OFF</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <span>·</span>
                    <span>Ends in <CountdownTimer endsAt={product.discountEndsAt} /></span>
                  </div>
                </motion.div>
              )}
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
                    alt={`${product.name} ${index + 1}`}
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
                <div className="flex flex-col">
                  {product.hasDiscount && new Date() < new Date(product.discountEndsAt) ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#FF1B6B]">
                          {product.acceptedToken} {product.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-lg line-through text-gray-400">
                          {product.acceptedToken} {product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-[#FF1B6B]">
                        Save {product.acceptedToken} {(product.price - product.discountedPrice).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-[#FF1B6B]">
                      {product.acceptedToken} {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
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

            {/* Color Selection */}
            {product.hasVariants && (
              <div className="space-y-4">
                {/* Size Selection */}
                {product.sizes.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-3">Select Size</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
                )}

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div>
                    <span className="text-gray-600 block mb-3">Select Color</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => {
                        const isAvailable = product?.colorQuantities ? (product.colorQuantities[color] || 0) > 0 : false;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            disabled={!isAvailable}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                              selectedColor === color
                                ? 'bg-[#FF1B6B] text-white'
                                : isAvailable
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            <span>{color}</span>
                            <span className="text-xs">
                              ({product?.colorQuantities ? (product.colorQuantities[color] || 0) : 0})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                  <div className="text-right">
                    {product.hasDiscount && new Date() < new Date(product.discountEndsAt) ? (
                      <>
                        <span className="font-medium">{product.acceptedToken} {(product.discountedPrice * quantity).toFixed(2)}</span>
                        <div className="text-xs text-gray-400 line-through">
                          {product.acceptedToken} {(product.price * quantity).toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <span className="font-medium">{product.acceptedToken} {(product.price * quantity).toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium">{product.acceptedToken} {(product.shippingFee || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-[#FF1B6B]">{product.acceptedToken} {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-[#FF1B6B] rounded-lg transition-colors"
                >
                  <BiCart className="text-xl" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                >
                  <BiWallet className="text-xl" />
                  Buy Now
                </button>
              </div>

              {/* Contact Store Button */}
              <button
                onClick={handleContactStore}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-[#FF1B6B] text-[#FF1B6B] rounded-lg hover:bg-pink-50 transition-colors mt-2"
              >
                <BiMessageDetail className="text-xl" />
                Contact Store
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