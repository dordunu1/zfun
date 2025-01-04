import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiPackage, BiCheck, BiX } from 'react-icons/bi';
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

const OrdersReceived = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, processing, completed, cancelled

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
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.buyerName || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{order.buyerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              className="p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                              title="Process Order"
                            >
                              <BiCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="p-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                              title="Cancel Order"
                            >
                              <BiX className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="p-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                            title="Complete Order"
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
    </motion.div>
  );
};

export default OrdersReceived; 