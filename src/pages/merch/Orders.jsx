import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiPackage, BiChevronRight } from 'react-icons/bi';
import { FaPlaneDeparture } from 'react-icons/fa';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { FiAlertCircle } from 'react-icons/fi';
import { getMerchPlatformContract, parseTokenAmount } from '../../contracts/MerchPlatform';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

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

const OrdersSkeleton = () => (
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
        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
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
          <div className="border-t pt-4 space-y-4">
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
          <div className="border-t mt-4 pt-4">
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

const RefundRequestModal = ({ isOpen, onClose, order }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

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
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Refund</h2>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={`#${order.id.slice(-6)}`}
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Address
            </label>
            <input
              type="text"
              value={order.paymentMethod.buyerWallet}
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 line-through"
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
                  className="flex-1 px-3 py-2 bg-[#FF1B6B]/5 border border-[#FF1B6B]/20 rounded-lg text-gray-700 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
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

const Orders = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

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

  if (loading) {
    return <OrdersSkeleton />;
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
        My Orders
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-white rounded-lg"
        >
          <div className="flex justify-center mb-4">
            <BiPackage className="text-4xl text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
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
              className="bg-white rounded-lg p-4"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">
                    Order #{order.id.slice(-6)}
                  </h3>
                  <span className="text-sm text-gray-500">
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
              <div className="border-t border-gray-100">
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
                        className="font-medium text-gray-800 hover:text-[#FF1B6B] block truncate"
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
                        <span className="text-sm text-gray-500">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <BiChevronRight className="text-gray-400 text-xl" />
                  </div>
                ))}
              </div>

              {/* Order Summary and Tracking */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Total Amount</span>
                    <div className="flex items-center gap-1">
                      <img
                        src={`/${order.paymentMethod?.token?.toLowerCase() || 'usdt'}.png`}
                        alt={order.paymentMethod?.token || 'USDT'}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-800">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {order.status === 'shipped' && (
                    <span className="text-sm text-gray-600">
                      Estimated Delivery: {new Date(order.createdAt?.seconds * 1000 + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {order.trackingNumber && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{order.carrier || 'other'}</span> Tracking: 
                      <span className="ml-1 font-medium">{order.trackingNumber}</span>
                    </div>
                    {order.shippingStatus === 'in_transit' ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <FaPlaneDeparture className="text-base" />
                        <span className="font-medium">In Transit</span>
                      </div>
                    ) : (
                      <span className="text-green-600 font-medium">Delivered</span>
                    )}
                  </div>
                )}
              </div>

              {/* Add Refund Button */}
              <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
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

      {/* Add RefundRequestModal */}
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
    </motion.div>
  );
};

export default Orders; 