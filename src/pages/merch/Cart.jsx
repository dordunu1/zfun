import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BiTrash, BiPlus, BiMinus } from 'react-icons/bi';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';

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

const CartSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4">
    {/* Header Skeleton */}
    <div className="mb-8">
      <div className="w-32 h-8">
        <SkeletonPulse />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items Skeleton */}
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <SkeletonPulse />
              </div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-5">
                  <SkeletonPulse />
                </div>
                <div className="w-1/2 h-4">
                  <SkeletonPulse />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="w-32 h-8">
                    <SkeletonPulse />
                  </div>
                  <div className="w-24 h-8">
                    <SkeletonPulse />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div className="w-40 h-6">
            <SkeletonPulse />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="w-24 h-4">
                <SkeletonPulse />
              </div>
              <div className="w-20 h-4">
                <SkeletonPulse />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-24 h-4">
                <SkeletonPulse />
              </div>
              <div className="w-20 h-4">
                <SkeletonPulse />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-24 h-4">
                <SkeletonPulse />
              </div>
              <div className="w-20 h-4">
                <SkeletonPulse />
              </div>
            </div>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="w-32 h-6">
                <SkeletonPulse />
              </div>
              <div className="w-28 h-6">
                <SkeletonPulse />
              </div>
            </div>
          </div>
          <div className="w-full h-12 mt-6">
            <SkeletonPulse />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Cart = () => {
  const { user, updateCartCount } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [platformFee, setPlatformFee] = useState(2.5); // Default fee percentage
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    fetchPlatformFee();
  }, [user]);

  const fetchPlatformFee = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        setPlatformFee(settings.platformFee || 2.5);
      }
    } catch (error) {
      console.error('Error fetching platform fee:', error);
      // Use default platform fee if there's an error
      setPlatformFee(2.5);
    }
  };

  const fetchCartItems = async () => {
    try {
      const q = query(
        collection(db, 'cart'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = [];

      for (const cartDoc of querySnapshot.docs) {
        const cartData = cartDoc.data();
        const productDoc = await getDoc(doc(db, 'products', cartData.productId));
        
        if (productDoc.exists()) {
          const productData = productDoc.data();
          items.push({
            id: cartDoc.id,
            quantity: cartData.quantity,
            product: {
              id: productDoc.id,
              ...productData
            }
          });
        }
      }

      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      await updateDoc(doc(db, 'cart', cartItemId), {
        quantity: newQuantity
      });
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await deleteDoc(doc(db, 'cart', cartItemId));
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      await updateCartCount(user.uid);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  };

  const calculateFees = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * platformFee) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateFees();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/merch-store/checkout');
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
    return <CartSkeleton />;
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold text-gray-800"
      >
        Shopping Cart
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-white rounded-lg"
        >
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/merch-store"
            className="text-[#FF1B6B] hover:text-[#D4145A] font-medium"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Cart Items */}
          <motion.div variants={containerVariants} className="space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-white rounded-lg p-4 flex gap-4 items-center"
              >
                <Link
                  to={`/merch-store/product/${item.product.id}`}
                  className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/merch-store/product/${item.product.id}`}
                    className="font-medium text-gray-800 hover:text-[#FF1B6B]"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={item.product.tokenLogo}
                      alt={item.product.acceptedToken}
                      className="w-4 h-4"
                    />
                    <span className="text-[#FF1B6B] font-medium">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Sold by {item.product.sellerName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <BiMinus className="text-lg" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={item.quantity >= item.product.quantity}
                    >
                      <BiPlus className="text-lg" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <BiTrash className="text-xl" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg p-6 space-y-4"
          >
            <h2 className="font-bold text-gray-800">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee ({platformFee}%)</span>
                <span>${calculateFees().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-[#FF1B6B] text-white rounded-lg font-medium hover:bg-[#D4145A] transition-colors"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Cart; 