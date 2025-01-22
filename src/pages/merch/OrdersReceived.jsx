import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiPackage, BiCheck, BiX, BiMap, BiInfoCircle, BiTrash } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, getDoc, writeBatch, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

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

const OrdersReceivedSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="w-48 h-8">
            <SkeletonPulse />
          </div>
          <div className="w-64 h-5">
            <SkeletonPulse />
          </div>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-10">
              <SkeletonPulse />
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table Skeleton */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                {['Order Details', 'Customer', 'Total', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3">
                    <div className="w-24 h-4">
                      <SkeletonPulse />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="w-20 h-5">
                        <SkeletonPulse />
                      </div>
                      <div className="w-32 h-4">
                        <SkeletonPulse />
                      </div>
                      <div className="w-24 h-4">
                        <SkeletonPulse />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="w-32 h-5">
                        <SkeletonPulse />
                      </div>
                      <div className="w-48 h-4">
                        <SkeletonPulse />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-5">
                      <SkeletonPulse />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-6">
                      <SkeletonPulse />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8">
                        <SkeletonPulse />
                      </div>
                      <div className="w-8 h-8">
                        <SkeletonPulse />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TrackingModal = ({ isOpen, onClose, onSubmit, orderId }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim() || !carrier.trim()) {
      toast.error('Please enter both tracking number and carrier');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(orderId, trackingNumber, carrier);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full`}
        >
          <div className="p-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
              Enter Shipping Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Shipping Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Select a carrier</option>
                  <option value="fedex">FedEx</option>
                  <option value="ups">UPS</option>
                  <option value="usps">USPS</option>
                  <option value="dhl">DHL</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter tracking number"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !trackingNumber.trim() || !carrier.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF1B6B] hover:bg-[#D4145A] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Shipping'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  const { isDarkMode } = useTheme();
  if (!order) return null;

  // Helper function to get country name
  const getCountryName = (country) => {
    if (typeof country === 'object' && country.name) {
      return country.name;
    }
    return country;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Order Details</h2>
          <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
            <BiX className="w-6 h-6" />
          </button>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Order ID and Date */}
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Order ID: {order.id}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Date: {new Date(order.createdAt?.toDate()).toLocaleString()}
            </p>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Customer Information</h3>
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name: {order.buyerInfo?.name}</p>
                {order.flag && (
                  <img 
                    src={order.flag}
                    alt={getCountryName(order.shippingAddress?.country)}
                    className="w-5 h-4 object-cover rounded-sm shadow-sm"
                  />
                )}
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email: {order.buyerInfo?.email}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Phone: {order.buyerInfo?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Shipping Address</h3>
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.shippingAddress?.street}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getCountryName(order.shippingAddress?.country)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quantity: {item.quantity}</p>
                      {item.size && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Size: {item.size}</p>
                      )}
                      {item.color && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Color:</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ 
                                backgroundColor: item.color.toLowerCase(),
                                borderColor: item.color.toLowerCase() === '#ffffff' ? '#e5e7eb' : 'transparent'
                              }}
                            />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.color}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>${item.price.toFixed(2)}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Shipping: ${item.shippingFee.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Payment Information</h3>
            <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-lg`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Method: {order.paymentMethod?.type} ({order.paymentMethod?.token})
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Network: {order.paymentMethod?.network}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Wallet: {order.paymentMethod?.buyerWallet}
              </p>
              <p className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Total: ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersReceived = () => {
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', user.sellerId),
        orderBy('createdAt', 'desc')
      );

      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check for new orders and update seller's balance
      const newOrders = ordersData.filter(order => 
        order.status === 'processing' && 
        !order.balanceUpdated
      );

      if (newOrders.length > 0) {
        const sellerRef = doc(db, 'sellers', user.sellerId);
        const sellerDoc = await getDoc(sellerRef);
        
        if (sellerDoc.exists()) {
          try {
            const sellerData = sellerDoc.data();
            
            // Initialize balance if it doesn't exist
            if (!sellerData.balance) {
              await updateDoc(sellerRef, {
                balance: { available: 0, pending: 0 }
              });
              sellerData.balance = { available: 0, pending: 0 };
            }
            
            // Calculate total new amount from orders
            const totalNewAmount = newOrders.reduce((sum, order) => {
              const orderTotal = parseFloat(order.total);
              return sum + (isNaN(orderTotal) ? 0 : orderTotal);
            }, 0);
            
            // Update seller's balance
            const updatedBalance = {
              available: parseFloat(sellerData.balance.available || 0),
              pending: parseFloat(sellerData.balance.pending || 0) + totalNewAmount
            };

            // Update the seller document with new balance
            await updateDoc(sellerRef, {
              balance: {
                available: updatedBalance.available,
                pending: updatedBalance.pending
              }
            });

            // Mark orders as balance updated
            const batch = writeBatch(db);
            newOrders.forEach(order => {
              const orderRef = doc(db, 'orders', order.id);
              batch.update(orderRef, { balanceUpdated: true });
            });
            await batch.commit();

            console.log('Balance updated successfully:', {
              previousBalance: sellerData.balance,
              newBalance: updatedBalance,
              totalNewAmount,
              updatedOrders: newOrders.length
            });
          } catch (error) {
            console.error('Error updating balance:', error);
            console.error('Error details:', {
              sellerId: user.sellerId,
              sellerData: sellerDoc.data(),
              newOrders: newOrders
            });
          }
        }
      }

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, trackingNumber, carrier) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      const orderData = orderDoc.data();

      // Check if within shipping deadline
      const shippingDeadline = orderData.shippingDeadline.toDate();
      if (Date.now() > shippingDeadline) {
        toast.error('Shipping confirmation deadline has passed');
        return;
      }

      // Get seller's current balance
      const sellerRef = doc(db, 'sellers', user.sellerId);
      const sellerDoc = await getDoc(sellerRef);
      const currentBalance = sellerDoc.data().balance || { available: 0, pending: 0 };
      const orderAmount = Number(orderData.total || 0);

      // Move order amount from pending to available
      await updateDoc(sellerRef, {
        balance: {
          available: Number((Number(currentBalance.available || 0) + orderAmount).toFixed(2)),
          pending: Number((Number(currentBalance.pending || 0) - orderAmount).toFixed(2))
        }
      });

      // Update order status
      await updateDoc(orderRef, {
        status: 'shipped',
        updatedAt: new Date(),
        shippingConfirmed: true,
        shippingConfirmedAt: new Date(),
        fundsAvailable: true,
        fundsAvailableAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days after shipping
        trackingNumber,
        carrier,
        shippingStatus: 'in_transit'
      });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { 
                ...order, 
                status: 'shipped',
                shippingConfirmed: true,
                shippingConfirmedAt: new Date(),
                fundsAvailable: true,
                fundsAvailableAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                trackingNumber,
                carrier,
                shippingStatus: 'in_transit'
              }
            : order
        )
      );

      toast.success('Shipping confirmed successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      
      // Only update the order status
      await updateDoc(orderRef, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: 'seller'
      });
      
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return <OrdersReceivedSkeleton />;
  }

  return (
    <motion.div
      className={`max-w-5xl mx-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Orders Received</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your incoming orders</p>
        </div>
        <div className="flex gap-2">
          {['all', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-[#FF1B6B] text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 text-center`}>
          <BiPackage className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>No Orders Found</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filter === 'all'
              ? "You haven't received any orders yet"
              : `No ${filter} orders found`}
          </p>
        </div>
      ) : (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden mt-6`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Order Details
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Customer
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Items
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Total
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>#{order.id.slice(-6)}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(order.createdAt?.toDate()).toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{order.buyerInfo?.name}</p>
                          {order.flag && (
                            <img 
                              src={order.flag} 
                              alt={`${order.shippingAddress?.country} flag`}
                              className="w-5 h-4 object-cover rounded-sm shadow-sm"
                            />
                          )}
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.buyerInfo?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{item.name}</p>
                                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Qty: {item.quantity}
                                  {item.size && ` • Size: ${item.size}`}
                                  {item.color && (
                                    <span className="flex items-center gap-1 mt-0.5">
                                      <span>Color:</span>
                                      <span
                                        className="w-3 h-3 rounded-full border"
                                        style={{ 
                                          backgroundColor: item.color.toLowerCase(),
                                          borderColor: item.color.toLowerCase() === '#ffffff' ? '#e5e7eb' : 'transparent'
                                        }}
                                      />
                                      <span>{item.color}</span>
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>${order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                          title="View Details"
                        >
                          <BiInfoCircle className="w-5 h-5" />
                        </button>
                        {order.status === 'processing' && !order.shippingConfirmed && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsTrackingModalOpen(true);
                            }}
                            className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Confirm Shipping
                          </button>
                        )}
                        {order.trackingNumber && (
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {order.carrier.toUpperCase()}: {order.trackingNumber}
                            </span>
                            <span className={`text-xs font-medium flex items-center gap-1 ${
                              order.shippingStatus === 'delivered' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {order.shippingStatus === 'delivered' ? (
                                <>
                                  Delivered <BiCheck className="w-4 h-4" />
                                </>
                              ) : 'In Transit'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onSubmit={updateOrderStatus}
        orderId={selectedOrderId}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  );
};

export default OrdersReceived; 