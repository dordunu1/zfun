import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BiPackage, BiChevronRight } from 'react-icons/bi';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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

const Orders = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

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
              className="bg-white rounded-lg p-6"
            >
              <div className="space-y-4">
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                    </p>
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
                <div className="border-t pt-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center">
                      <Link
                        to={`/merch-store/product/${item.productId}`}
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          to={`/merch-store/product/${item.productId}`}
                          className="font-medium text-gray-800 hover:text-[#FF1B6B]"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={item.tokenLogo}
                            alt={item.acceptedToken}
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

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={order.items[0].tokenLogo}
                        alt={order.items[0].acceptedToken}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-gray-800">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Orders; 