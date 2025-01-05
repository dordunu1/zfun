import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiPackage, BiCheck, BiX, BiMap } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
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

const OrdersReceivedSkeleton = () => (
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
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {['Order Details', 'Customer', 'Total', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3">
                  <div className="w-24 h-4">
                    <SkeletonPulse />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
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

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <BiX className="w-6 h-6" />
          </button>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Order ID and Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(order.createdAt?.toDate()).toLocaleString()}
            </p>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-2">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Name: {order.buyerInfo?.name}</p>
              <p className="text-sm text-gray-600">Email: {order.buyerInfo?.email}</p>
              <p className="text-sm text-gray-600">Phone: {order.buyerInfo?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{order.shippingAddress?.street}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-2">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Shipping: ${item.shippingFee.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="font-medium mb-2">Payment Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Method: {order.paymentMethod?.type} ({order.paymentMethod?.token})
              </p>
              <p className="text-sm text-gray-600">
                Network: {order.paymentMethod?.network}
              </p>
              <p className="text-sm text-gray-600">
                Wallet: {order.paymentMethod?.buyerWallet}
              </p>
              <p className="text-sm font-medium mt-2">
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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

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

      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success(`Order ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Received</h1>
          <p className="text-gray-500">Manage your incoming orders</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-[#FF1B6B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <BiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
          <p className="text-gray-500">
            {filter === 'all'
              ? "You haven't received any orders yet"
              : `No ${filter} orders found`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">#{order.id.slice(-6)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt?.toDate()).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{order.buyerInfo?.name}</p>
                        <p className="text-sm text-gray-500">{order.buyerInfo?.email}</p>
                        <p className="text-sm text-gray-500">{order.buyerInfo?.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">{order.shippingAddress?.street}</p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.country} {order.shippingAddress?.postalCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <BiMap className="w-5 h-5" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                            title="Mark as Processing"
                          >
                            <BiCheck className="w-5 h-5" />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="p-2 text-green-400 hover:text-green-600 transition-colors"
                            title="Mark as Completed"
                          >
                            <BiCheck className="w-5 h-5" />
                          </button>
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