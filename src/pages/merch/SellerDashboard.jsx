import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers, FiCreditCard } from 'react-icons/fi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';
import WithdrawalTermsModal from '../../components/merch/WithdrawalTermsModal';

// Token logos
const TOKEN_INFO = {
  USDT: {
    logo: '/logos/usdt.png',
    name: 'USDT (Tether)',
    decimals: 6
  },
  USDC: {
    logo: '/logos/usdc.png',
    name: 'USDC (USD Coin)',
    decimals: 6
  }
};

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

const DashboardSkeleton = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-8">
    {/* Welcome Section Skeleton */}
    <div className="space-y-2">
      <div className="w-64 h-8">
        <SkeletonPulse />
      </div>
      <div className="w-96 h-5">
        <SkeletonPulse />
      </div>
    </div>

    {/* Balance Widget Skeleton */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="w-48 h-6">
            <SkeletonPulse />
          </div>
          <div className="w-64 h-4">
            <SkeletonPulse />
          </div>
        </div>
        <div className="w-10 h-10 rounded-full">
          <SkeletonPulse />
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-6">
        <div className="space-y-2">
          <div className="w-56 h-10">
            <SkeletonPulse />
          </div>
          <div className="w-32 h-4">
            <SkeletonPulse />
          </div>
          <div className="w-48 h-4">
            <SkeletonPulse />
          </div>
          <div className="w-40 h-4">
            <SkeletonPulse />
          </div>
        </div>
        <div className="w-40 h-10">
          <SkeletonPulse />
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full h-3">
          <SkeletonPulse />
        </div>
        <div className="w-full h-3">
          <SkeletonPulse />
        </div>
        <div className="w-full h-3">
          <SkeletonPulse />
        </div>
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-lg shadow-lg h-32">
          <SkeletonPulse />
        </div>
      ))}
    </div>

    {/* Recent Activity Skeleton */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="w-48 h-6">
          <SkeletonPulse />
        </div>
        <div className="w-32 h-10">
          <SkeletonPulse />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg">
            <SkeletonPulse />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Add CountdownTimer component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="font-mono text-sm">
      {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h {timeLeft.minutes.toString().padStart(2, '0')}m {timeLeft.seconds.toString().padStart(2, '0')}s
    </div>
  );
};

const SellerDashboard = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [platformFee, setPlatformFee] = useState(2.5); // Default fee
  const [minWithdrawal, setMinWithdrawal] = useState(10); // Default min withdrawal
  const theme = localStorage.getItem('admin-theme') || 'light'; // Add theme
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalCustomers: 0,
    revenue: 0,
    balances: {
      USDC: 0,
      USDT: 0
    }
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [sellerData, setSellerData] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [isIncomingPaymentsExpanded, setIsIncomingPaymentsExpanded] = useState(false);
  const [incomingPayments, setIncomingPayments] = useState([]);

  useEffect(() => {
    if (!user?.sellerId) return;
    fetchDashboardData();
    fetchPlatformSettings();
  }, [user]);

  const fetchPlatformSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        setPlatformFee(settings.platformFee || 2.5);
        setMinWithdrawal(settings.withdrawalMinimum || 10);
      }
    } catch (error) {
      console.error('Error fetching platform settings:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch seller data
      const sellerDoc = await getDoc(doc(db, 'sellers', user.sellerId));
      const sellerData = sellerDoc.data();
      setSellerData(sellerData);

      // Fetch products
      const productsQuery = query(
        collection(db, 'products'),
        where('sellerId', '==', user.sellerId)
      );
      const productsSnapshot = await getDocs(productsQuery);

      // Fetch orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', user.sellerId),
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch all withdrawals
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('sellerId', '==', user.sellerId),
        orderBy('timestamp', 'desc')
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
      const withdrawalHistory = withdrawalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setWithdrawals(withdrawalHistory);

      // Calculate total withdrawn amount for each token from completed withdrawals
      const totalWithdrawn = {
        USDC: withdrawalHistory
          .filter(w => w.status === 'completed' && w.token === 'USDC')
          .reduce((sum, w) => sum + (w.amount || 0), 0),
        USDT: withdrawalHistory
          .filter(w => w.status === 'completed' && w.token === 'USDT')
          .reduce((sum, w) => sum + (w.amount || 0), 0)
      };

      // Calculate revenue and balance for each token
      let totalRevenue = 0;
      const tokenRevenue = {
        USDC: 0,
        USDT: 0
      };
      const customers = new Set();

      orders.forEach(order => {
        // Add all customers with buyerId to the set
        if (order.buyerId) {
          customers.add(order.buyerId);
        }

        if (order.paymentStatus === 'completed' && 
            order.shippingConfirmed && 
            order.shippingConfirmedAt && 
            new Date(order.shippingConfirmedAt.toDate()) <= new Date(order.shippingDeadline.toDate()) &&
            Date.now() >= new Date(order.fundsAvailableAt.toDate())) {
          const orderTotal = order.total || 0;
          totalRevenue += orderTotal;
          
          // Add to token-specific revenue
          const orderToken = order.paymentMethod?.token || 'USDT';
          tokenRevenue[orderToken] = (tokenRevenue[orderToken] || 0) + orderTotal;
        }
      });

      // Calculate available balance for each token (revenue minus platform fee and withdrawals)
      const balances = {
        USDC: tokenRevenue.USDC * (1 - platformFee / 100) - totalWithdrawn.USDC,
        USDT: tokenRevenue.USDT * (1 - platformFee / 100) - totalWithdrawn.USDT
      };

      setStats({
        totalProducts: productsSnapshot.size,
        totalSales: orders.filter(o => o.paymentStatus === 'completed').length,
        totalCustomers: customers.size,
        revenue: totalRevenue,
        balances
      });

      // Set recent orders (only completed ones)
      setRecentOrders(
        orders
          .filter(o => o.paymentStatus === 'completed')
          .slice(0, 3)
      );

      // Fetch incoming payments
      const incomingPaymentsQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', user.sellerId),
        where('paymentStatus', '==', 'completed'),
        orderBy('createdAt', 'desc')
      );
      const incomingPaymentsSnapshot = await getDocs(incomingPaymentsQuery);
      const incomingPaymentsData = incomingPaymentsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => {
          const orderDate = order.createdAt.toDate();
          const threeDaysFromOrder = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000));
          return Date.now() < threeDaysFromOrder;
        });
      setIncomingPayments(incomingPaymentsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
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

  const statsCards = [
    { title: 'Total Products', icon: <FiBox />, value: stats.totalProducts, color: 'bg-blue-500' },
    { title: 'Total Sales', icon: <FiShoppingBag />, value: stats.totalSales, color: 'bg-green-500' },
    { title: 'Total Customers', icon: <FiUsers />, value: stats.totalCustomers, color: 'bg-purple-500' },
    { title: 'Revenue', icon: <FiDollarSign />, value: `$${stats.revenue.toFixed(2)}`, color: 'bg-pink-500' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.displayName || 'Seller'}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your store today.</p>
      </motion.div>

      {/* Balance Widget */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Available Balance</h3>
              <p className="text-sm text-gray-500 mt-1">Withdraw anytime to your wallet</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <img 
                  src={sellerData?.preferredNetwork === 'unichain' ? '/unichain-logo.png' : '/polygon.png'}
                  alt={sellerData?.preferredNetwork === 'unichain' ? 'Unichain' : 'Polygon'}
                  className="w-6 h-6 object-contain"
                />
                <span className="text-sm font-medium text-gray-700">
                  {sellerData?.preferredNetwork === 'unichain' ? 'Unichain' : 'Polygon'} Network
                </span>
              </div>
              <div className="p-2 bg-[#FF1B6B] bg-opacity-10 rounded-full">
                <FiCreditCard className="text-[#FF1B6B] text-xl" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* USDC Balance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={TOKEN_INFO.USDC.logo}
                  alt="USDC"
                  className="w-6 h-6"
                />
                <div className="text-2xl font-bold text-[#FF1B6B]">
                  {stats.balances.USDC.toFixed(2)} USDC
                </div>
              </div>
              <div className="text-sm text-gray-500">
                ≈ ${stats.balances.USDC.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Platform fee: {platformFee}% ({(stats.balances.USDC * platformFee / 100).toFixed(2)} USDC)
              </div>
              <button
                onClick={() => {
                  if (!stats.balances.USDC || stats.balances.USDC < minWithdrawal) return;
                  setSelectedToken('USDC');
                  setIsTermsModalOpen(true);
                }}
                disabled={!stats.balances.USDC || stats.balances.USDC < minWithdrawal}
                className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !stats.balances.USDC || stats.balances.USDC < minWithdrawal
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FF1B6B] text-white hover:bg-[#D4145A]'
                }`}
              >
                {!stats.balances.USDC || stats.balances.USDC < minWithdrawal 
                  ? `Min. ${minWithdrawal} USDC Required`
                  : 'Request USDC Withdrawal'}
              </button>
            </div>

            {/* USDT Balance */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={TOKEN_INFO.USDT.logo}
                  alt="USDT"
                  className="w-6 h-6"
                />
                <div className="text-2xl font-bold text-[#FF1B6B]">
                  {stats.balances.USDT.toFixed(2)} USDT
                </div>
              </div>
              <div className="text-sm text-gray-500">
                ≈ ${stats.balances.USDT.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Platform fee: {platformFee}% ({(stats.balances.USDT * platformFee / 100).toFixed(2)} USDT)
              </div>
              <button
                onClick={() => {
                  if (!stats.balances.USDT || stats.balances.USDT < minWithdrawal) return;
                  setSelectedToken('USDT');
                  setIsTermsModalOpen(true);
                }}
                disabled={!stats.balances.USDT || stats.balances.USDT < minWithdrawal}
                className={`w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !stats.balances.USDT || stats.balances.USDT < minWithdrawal
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FF1B6B] text-white hover:bg-[#D4145A]'
                }`}
              >
                {!stats.balances.USDT || stats.balances.USDT < minWithdrawal 
                  ? `Min. ${minWithdrawal} USDT Required`
                  : 'Request USDT Withdrawal'}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Note: Withdrawals are processed on your selected network. Gas fees will be paid from your wallet.</p>
            <p>A {platformFee}% platform fee will be deducted from your withdrawal amount.</p>
            <p>Minimum withdrawal amount: {minWithdrawal} USDC/USDT</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={`p-6 rounded-lg shadow-lg ${stat.color} text-white transform hover:scale-105 transition-transform duration-200`}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold mb-2">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <div className="text-3xl opacity-80">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Incoming Payments Section */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Incoming Payments</h3>
            <p className="text-sm text-gray-500">Payments pending 3-day shipping confirmation</p>
          </div>
          <button
            onClick={() => setIsIncomingPaymentsExpanded(!isIncomingPaymentsExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className={`w-6 h-6 text-gray-500 transform transition-transform ${isIncomingPaymentsExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isIncomingPaymentsExpanded && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available In</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incomingPayments.map((payment) => {
                  const orderDate = payment.createdAt.toDate();
                  const availableDate = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000));
                  const daysRemaining = Math.max(0, Math.ceil((availableDate - Date.now()) / (24 * 60 * 60 * 1000)));
                  
                  return (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{payment.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {orderDate.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={payment.paymentMethod.token === 'USDC' ? TOKEN_INFO.USDC.logo : TOKEN_INFO.USDT.logo}
                            alt={payment.paymentMethod.token}
                            className="w-5 h-5 mr-2"
                          />
                          <span className="text-sm text-gray-900">{payment.paymentMethod.token}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.shippingConfirmed ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-green-600">
                              Shipping Confirmed
                            </span>
                            <span className="text-xs text-gray-500">
                              {payment.carrier}: {payment.trackingNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>Processing</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#FF1B6B] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, ((3 - daysRemaining) / 3) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Awaiting Shipping
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col gap-1">
                          <CountdownTimer 
                            targetDate={availableDate}
                          />
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-[#FF1B6B] h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, ((3 - daysRemaining) / 3) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {incomingPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No incoming payments at the moment
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <Link
            to="/merch-store/orders"
            className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
          >
            View All Orders
          </Link>
        </div>

        {/* Activity List */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {recentOrders.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-8 text-gray-500"
            >
              No orders yet
            </motion.div>
          ) : (
            recentOrders.map((order) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#FF1B6B] bg-opacity-10 rounded-full">
                    <FiTrendingUp className="text-[#FF1B6B] text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New order received</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt?.toDate()).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-[#FF1B6B] font-medium">${order.total.toFixed(2)}</span>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* Withdrawal History */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Withdrawal History</h3>
          
          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {withdrawal.timestamp ? new Date(withdrawal.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {withdrawal.amount} {withdrawal.token || stats.preferredToken}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {withdrawal.status === 'pending' ? (
                          <div className="space-y-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                              Processing
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#FF1B6B] h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.min(100, (Date.now() - withdrawal.timestamp) / (17 * 24 * 60 * 60 * 1000) * 100)}%` 
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.max(0, 17 - Math.floor((Date.now() - withdrawal.timestamp) / (24 * 60 * 60 * 1000)))} days remaining
                            </div>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            withdrawal.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {withdrawal.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {withdrawal.transactionHash ? (
                          <a 
                            href={`https://${withdrawal.network === 'polygon' ? 'polygonscan' : 'bscscan'}.com/tx/${withdrawal.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF1B6B] hover:text-[#D4145A]"
                          >
                            View
                          </a>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No withdrawals yet
            </div>
          )}
        </div>
      </motion.div>

      {/* Terms Modal */}
      <WithdrawalTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={async () => {
          try {
            const provider = await detectEthereumProvider();
            if (!provider) {
              toast.error('Please install MetaMask to withdraw funds');
              return;
            }

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
              toast.error('Please connect your wallet');
              return;
            }

            const balance = selectedToken === 'USDC' ? stats.balances.USDC : stats.balances.USDT;
            if (balance < minWithdrawal) {
              toast.error(`Minimum withdrawal amount is ${minWithdrawal} ${selectedToken}`);
              return;
            }

            // Create withdrawal request
            await addDoc(collection(db, 'withdrawals'), {
              sellerId: user.sellerId,
              amount: balance,
              token: selectedToken,
              fee: balance * platformFee / 100,
              netAmount: balance * (1 - platformFee / 100),
              status: 'pending',
              walletAddress: accounts[0],
              network: user.network || 'polygon',
              timestamp: serverTimestamp(),
              requestedAt: Date.now(),
              processingDays: 17
            });

            toast.success('Withdrawal request submitted');
          } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error('Failed to process withdrawal');
          }
        }}
        token={selectedToken}
      />
    </motion.div>
  );
};

export default SellerDashboard; 