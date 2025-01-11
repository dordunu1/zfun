import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BiArrowBack, BiCart, BiStar, BiStore, BiPlus, BiMinus } from 'react-icons/bi';
import { doc, getDoc, collection, query, where, getDocs, limit, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/reviews/ProductReviews';

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

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  return (
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
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

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
          <div className="border-t pt-6 space-y-4">
            <h2 className="font-medium text-gray-800">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 text-gray-800">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Payment Token:</span>
                <span className="ml-2 text-gray-800">{product.acceptedToken}</span>
              </div>
              {product.category === 'clothing' && product.hasVariants && (
                <>
                  <div>
                    <span className="text-gray-500">Available Sizes:</span>
                    <span className="ml-2 text-gray-800">
                      {product.sizes.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Available Colors:</span>
                    <span className="ml-2 text-gray-800">
                      {product.colors.join(', ')}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Shipping Information */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-800 mb-3">Shipping Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span className="font-medium text-gray-900">${product.shippingFee?.toFixed(2) || '0.00'}</span>
                </div>
                {product.shippingInfo && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Information:</h4>
                    <p className="text-sm text-gray-600">{product.shippingInfo}</p>
                  </div>
                )}
              </div>
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
  );
};

export default ProductDetails; 