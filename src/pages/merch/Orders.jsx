import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiPackage, BiChevronRight, BiStar, BiCheck, BiX, BiImage } from 'react-icons/bi';
import { FaPlaneDeparture, FaBox, FaCheckCircle, FaStar } from 'react-icons/fa';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FiAlertCircle } from 'react-icons/fi';
import { getMerchPlatformContract, parseTokenAmount } from '../../contracts/MerchPlatform';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import TrackingModal from '../../components/TrackingModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/merchConfig';

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

const OrdersSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="w-32 h-8">
          <SkeletonPulse />
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <div className="w-48 h-5">
                  <SkeletonPulse />
                </div>
                <div className="w-32 h-4">
                  <SkeletonPulse />
                </div>
              </div>
              <div className="w-24 h-8">
                <SkeletonPulse />
              </div>
            </div>

            {/* Order Items */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-4`}>
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <SkeletonPulse />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-5">
                      <SkeletonPulse />
                    </div>
                    <div className="w-1/2 h-4">
                      <SkeletonPulse />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-4">
                        <SkeletonPulse />
                      </div>
                      <div className="w-24 h-4">
                        <SkeletonPulse />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mt-4 pt-4`}>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="w-32 h-4">
                    <SkeletonPulse />
                  </div>
                  <div className="w-48 h-4">
                    <SkeletonPulse />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="w-32 h-6">
                    <SkeletonPulse />
                  </div>
                  <div className="w-24 h-4">
                    <SkeletonPulse />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RefundRequestModal = ({ isOpen, onClose, order }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleSubmitRefund = async () => {
    if (order.status !== 'cancelled') {
      toast.error('Only cancelled orders are eligible for refund requests');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get seller's wallet address from sellers collection
      const sellerDoc = await getDoc(doc(db, 'sellers', order.sellerId));
      if (!sellerDoc.exists()) {
        throw new Error(`Seller not found with ID: ${order.sellerId}`);
      }
      
      const sellerWallet = sellerDoc.data().walletAddress;
      const buyerWallet = order.paymentMethod?.buyerWallet;

      // Validate addresses
      if (!buyerWallet || !ethers.isAddress(buyerWallet)) {
        throw new Error('Invalid buyer wallet address');
      }

      if (!sellerWallet || !ethers.isAddress(sellerWallet)) {
        throw new Error(`Invalid seller wallet address: ${sellerWallet}`);
      }

      const refundAmount = order.total * 0.95; // Calculate 95% of the total (5% platform fee deducted)

      // Create refund request in Firestore
      const refundRequest = {
        orderId: order.id,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        amount: refundAmount,
        originalAmount: order.total,
        paymentAddress: buyerWallet, // Use buyer's wallet address
        status: 'pending',
        createdAt: serverTimestamp(),
        network: order.paymentMethod.network,
        orderDetails: {
          items: order.items,
          total: order.total,
          paymentMethod: order.paymentMethod
        }
      };

      // Add the refund request to Firestore
      await addDoc(collection(db, 'refundRequests'), refundRequest);

      toast.success('Refund request submitted successfully');
      onClose();

    } catch (error) {
      console.error('Error submitting refund request:', error);
      toast.error(error.message || 'Failed to submit refund request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const platformFee = order.total * 0.05;
  const refundAmount = order.total * 0.95;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full mx-4`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Request Refund</h2>
        
        {order.status !== 'cancelled' ? (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="text-yellow-500 text-lg mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Not Eligible for Refund</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Only cancelled orders are eligible for refund requests. This order's status is "{order.status}".
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-blue-500 text-lg mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Refund Processing Time</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Refund requests typically take up to 1 week to process.
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 p-4 bg-pink-50 rounded-lg">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-[#FF1B6B] text-lg mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#FF1B6B]">Platform Fee Notice</p>
                  <p className="text-sm text-[#FF1B6B]/80 mt-1">
                    The 5% platform fee (${platformFee.toFixed(2)}) is non-refundable as it was deducted at the time of purchase.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Order ID
            </label>
            <input
              type="text"
              value={`#${order.id.slice(-6)}`}
              disabled
              className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-300'} border rounded-lg`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Payment Address
            </label>
            <input
              type="text"
              value={order.paymentMethod.buyerWallet}
              disabled
              className={`w-full px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-300'} border rounded-lg`}
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Original Amount
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={`/${order.paymentMethod?.token?.toLowerCase() || 'usdt'}.png`}
                  alt={order.paymentMethod?.token || 'USDT'}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={`$${order.total.toFixed(2)}`}
                  disabled
                  className={`flex-1 px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-300'} border rounded-lg line-through`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FF1B6B] mb-1">
                Refund Amount (after 5% platform fee)
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={`/${order.paymentMethod?.token?.toLowerCase() || 'usdt'}.png`}
                  alt={order.paymentMethod?.token || 'USDT'}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={`$${refundAmount.toFixed(2)}`}
                  disabled
                  className={`flex-1 px-3 py-2 bg-[#FF1B6B]/5 border border-[#FF1B6B]/20 rounded-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitRefund}
            disabled={isSubmitting || order.status !== 'cancelled'}
            className={`px-4 py-2 rounded-lg text-white ${
              order.status !== 'cancelled'
                ? 'bg-gray-400 cursor-not-allowed'
                : isSubmitting
                ? 'bg-[#FF1B6B] opacity-50 cursor-not-allowed'
                : 'bg-[#FF1B6B] hover:bg-[#D4145A]'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Refund Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeliveryConfirmationModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useTheme();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm(orderId);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} bg-opacity-90`} onClick={onClose} />
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative z-50`}>
        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Confirm Delivery</h3>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-blue-500 text-lg mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Please confirm that you have received your order.</p>
              <p className="text-sm text-blue-700 mt-1">
                This will help release the payment to the seller.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 p-4 bg-pink-50 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-[#FF1B6B] text-lg mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#FF1B6B]">Automatic Fund Release Notice</p>
              <p className="text-sm text-[#FF1B6B]/80 mt-1">
                If delivery is not confirmed within 2-3 weeks of shipping and no complaint is raised about non-receipt while tracking shows delivered, the seller's funds will be automatically released.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-white bg-[#FF1B6B] hover:bg-[#D4145A] disabled:opacity-50"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Delivery'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, order, item }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `reviews/${item.productId}/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const reviewData = {
        productId: item.productId,
        orderId: order.id,
        userId: user.uid,
        sellerId: item.sellerId || order.sellerId,
        rating,
        review: review.trim(),
        image: imageUrl,
        createdAt: new Date(),
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        productName: item.name,
        productImage: item.image
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      toast.success('Review submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Write a Review</h3>
            <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
              <BiX className="w-6 h-6" />
            </button>
          </div>

          <div className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg mb-4`}>
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order #{order.id.slice(-6)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-[#FF1B6B]' : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                rows="4"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Add Image (optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 hover:bg-gray-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <BiImage className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choose Image</span>
                  </div>
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5"
                    >
                      <BiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#FF1B6B]/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

const Orders = () => {
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const confirmDelivery = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveredAt: new Date(),
        shippingStatus: 'delivered',
        deliveryConfirmedByBuyer: true
      });

      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: 'delivered',
                deliveredAt: new Date(),
                shippingStatus: 'delivered',
                deliveryConfirmedByBuyer: true
              }
            : order
        )
      );

      toast.success('Delivery confirmed successfully');
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Failed to confirm delivery');
    }
  };

  const handleTrackingClick = (order) => {
    setSelectedTracking({
      trackingNumber: order.trackingNumber,
      carrier: order.carrier
    });
    setIsTrackingModalOpen(true);
  };

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <motion.div
      className={`max-w-4xl mx-auto p-4 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        variants={itemVariants}
        className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
      >
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}
        >
          <div className="flex justify-center mb-4">
            <BiPackage className={`text-4xl ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          </div>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>You haven't placed any orders yet</p>
          <Link
            to="/merch-store"
            className="text-[#FF1B6B] hover:text-[#D4145A] font-medium"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4`}
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Order #{order.id.slice(-6)}
                  </h3>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-3">
                    <Link
                      to={`/merch-store/product/${item.productId}`}
                      className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/merch-store/product/${item.productId}`}
                        className={`font-medium ${isDarkMode ? 'text-gray-100 hover:text-[#FF1B6B]' : 'text-gray-800 hover:text-[#FF1B6B]'} block truncate`}
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={`/${order.paymentMethod?.token?.toLowerCase() || 'usdt'}.png`}
                          alt={order.paymentMethod?.token || 'USDT'}
                          className="w-4 h-4"
                        />
                        <span className="text-[#FF1B6B] font-medium">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setSelectedItemForReview(item);
                            setIsReviewModalOpen(true);
                          }}
                          className="text-sm text-[#FF1B6B] hover:text-[#FF1B6B]/80 font-medium flex items-center gap-1"
                        >
                          <BiStar className="w-4 h-4" />
                          Write a Review
                        </button>
                      )}
                      <BiChevronRight className={`text-xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary and Tracking */}
              <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pt-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</span>
                    <div className="flex items-center gap-1">
                      <img
                        src={`/${order.paymentMethod?.token?.toLowerCase() || 'usdt'}.png`}
                        alt={order.paymentMethod?.token || 'USDT'}
                        className="w-4 h-4"
                      />
                      <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {order.status === 'shipped' && (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Estimated Delivery: {new Date(order.createdAt?.seconds * 1000 + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {order.trackingNumber && (
                  <div className="flex justify-between items-center mt-2">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-medium">{order.carrier || 'other'}</span> Tracking: 
                      <span className="ml-1 font-medium">{order.trackingNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === 'shipped' && !order.deliveryConfirmedByBuyer && (
                        <button
                          onClick={() => {
                            setSelectedOrderForDelivery(order.id);
                            setIsDeliveryModalOpen(true);
                          }}
                          className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      <button
                        onClick={() => handleTrackingClick(order)}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        Track Package
                      </button>
                      {order.shippingStatus === 'in_transit' ? (
                        <div className="flex items-center gap-1 text-blue-600">
                          <FaPlaneDeparture className="text-base" />
                          <span className="font-medium">In Transit</span>
                        </div>
                      ) : order.deliveryConfirmedByBuyer ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle className="text-base" />
                          <span className="font-medium">Delivered</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaBox className="text-base" />
                          <span className="font-medium">Processing</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Refund Button */}
              <div className={`flex justify-end mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsRefundModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#FF1B6B] hover:text-[#D4145A] transition-colors"
                >
                  Request Refund
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Modals */}
      {selectedOrder && (
        <RefundRequestModal
          isOpen={isRefundModalOpen}
          onClose={() => {
            setIsRefundModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}

      <DeliveryConfirmationModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onConfirm={confirmDelivery}
        orderId={selectedOrderForDelivery}
      />

      {selectedTracking && (
        <TrackingModal
          isOpen={isTrackingModalOpen}
          onClose={() => {
            setIsTrackingModalOpen(false);
            setSelectedTracking(null);
          }}
          trackingNumber={selectedTracking.trackingNumber}
          carrier={selectedTracking.carrier}
        />
      )}

      {selectedItemForReview && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedItemForReview(null);
          }}
          order={selectedOrder}
          item={selectedItemForReview}
        />
      )}
    </motion.div>
  );
};

export default Orders; 