import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';
import WithdrawalTermsModal from '../../components/merch/WithdrawalTermsModal';
import { ethers } from 'ethers';
import { getMerchPlatformContract, parseTokenAmount } from '../../contracts/MerchPlatform';

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

const getProgressBarWidth = (order) => {
  if (order.status === 'delivered') return '100%';
  if (order.status === 'shipped') return '75%';
  if (order.status === 'processing') return '50%';
  if (order.paymentStatus === 'completed') return '25%';
  return '0%';
};

const getProgressBarColor = (order) => {
  if (order.status === 'delivered') return 'bg-orange-500';
  if (order.status === 'shipped') return 'bg-green-500';
  if (order.status === 'processing') return 'bg-blue-500';
  if (order.paymentStatus === 'completed') return 'bg-gray-500';
  return 'bg-gray-200';
};

const SellerDashboard = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [platformFee, setPlatformFee] = useState(2.5); // Default fee
  const [minWithdrawal, setMinWithdrawal] = useState(5); // Default min withdrawal
  const theme = localStorage.getItem('admin-theme') || 'light'; // Add theme
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalCustomers: 0,
    grossRevenue: 0,
    netRevenue: 0,
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
        setMinWithdrawal(settings.withdrawalMinimum || 5);
      }
    } catch (error) {
      console.error('Error fetching platform settings:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch seller data with real-time updates
      const sellerDocRef = doc(db, 'sellers', user.sellerId);
      const unsubscribeSeller = onSnapshot(sellerDocRef, (doc) => {
        setSellerData(doc.data());
      });

      // Fetch products with cache disabled
      const productsQuery = query(
        collection(db, 'products'),
        where('sellerId', '==', user.sellerId)
      );
      const productsSnapshot = await getDocs(productsQuery);

      // Fetch orders with real-time updates
      const ordersQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', user.sellerId),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate incoming payments (orders within 3-day shipping window)
        const now = new Date();
        const incomingPaymentsList = orders.filter(order => {
          if (order.paymentStatus === 'completed') {
            // Exclude canceled and refunded orders
            if (order.status === 'cancelled' || order.status === 'refunded') return false;
            
            const orderDate = order.createdAt.toDate();
            const shippingDeadline = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000));
            // Keep showing orders until the 3-day window is complete, regardless of shipping status
            return now <= shippingDeadline;
          }
          return false;
        });
        setIncomingPayments(incomingPaymentsList);

        // Fetch withdrawals with real-time updates
        const withdrawalsQuery = query(
          collection(db, 'withdrawals'),
          where('sellerId', '==', user.sellerId),
          orderBy('timestamp', 'desc')
        );

        const unsubscribeWithdrawals = onSnapshot(withdrawalsQuery, (withdrawalSnapshot) => {
          const withdrawalHistory = withdrawalSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          }));
          setWithdrawals(withdrawalHistory);

          // Calculate total withdrawn amount for each token from completed withdrawals
          const totalWithdrawn = {
            USDC: withdrawalHistory
              .filter(w => w.status === 'approved' && w.token === 'USDC')
              .reduce((sum, w) => sum + (w.amount || 0), 0),
            USDT: withdrawalHistory
              .filter(w => w.status === 'approved' && w.token === 'USDT')
              .reduce((sum, w) => sum + (w.amount || 0), 0)
          };

          // Calculate revenue and balance for each token
          let totalGrossRevenue = 0;
          let totalNetRevenue = 0;
          const tokenRevenue = {
            USDC: { gross: 0, net: 0 },
            USDT: { gross: 0, net: 0 }
          };
          const customers = new Set();

          orders.forEach(order => {
            if (order.buyerId) {
              customers.add(order.buyerId);
            }

            if (order.paymentStatus === 'completed') {
              const orderTotal = order.total || 0;
              const orderToken = order.paymentMethod?.token || 'USDT';
              
              // Check if order has passed the 3-day shipping window
              const orderDate = order.createdAt.toDate();
              const shippingWindowEnd = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days window
              const now = new Date();
              
              // Only add to revenue if shipping window has passed
              if (now >= shippingWindowEnd) {
                // Add to gross revenue
                totalGrossRevenue += orderTotal;
                
                // Calculate net revenue (95% of gross)
                const netAmount = orderTotal * 0.95;
                totalNetRevenue += netAmount;
                
                // Add to token-specific revenue
                if (!tokenRevenue[orderToken]) {
                  tokenRevenue[orderToken] = { gross: 0, net: 0 };
                }
                tokenRevenue[orderToken].gross += orderTotal;
                tokenRevenue[orderToken].net += netAmount;
              }
            }
          });

          // Calculate available balance for each token (net revenue minus withdrawals and pending refunds)
          const balances = {
            USDC: parseFloat((Math.max(0, tokenRevenue.USDC.net - totalWithdrawn.USDC - (sellerData?.pendingRefunds?.USDC || 0))).toFixed(2)),
            USDT: parseFloat((Math.max(0, tokenRevenue.USDT.net - totalWithdrawn.USDT - (sellerData?.pendingRefunds?.USDT || 0))).toFixed(2))
          };

          // Also account for pending withdrawals
          const pendingWithdrawals = {
            USDC: withdrawalHistory
              .filter(w => w.status === 'pending' && w.token === 'USDC')
              .reduce((sum, w) => sum + (w.amount || 0), 0),
            USDT: withdrawalHistory
              .filter(w => w.status === 'pending' && w.token === 'USDT')
              .reduce((sum, w) => sum + (w.amount || 0), 0)
          };

          // Subtract pending withdrawals from available balance
          balances.USDC = parseFloat((Math.max(0, balances.USDC - pendingWithdrawals.USDC)).toFixed(2));
          balances.USDT = parseFloat((Math.max(0, balances.USDT - pendingWithdrawals.USDT)).toFixed(2));

          console.log('Revenue Breakdown:', {
            USDC: {
              gross: tokenRevenue.USDC.gross,
              net: tokenRevenue.USDC.net,
              withdrawn: totalWithdrawn.USDC,
              pendingRefunds: sellerData?.pendingRefunds?.USDC || 0,
              available: balances.USDC
            },
            USDT: {
              gross: tokenRevenue.USDT.gross,
              net: tokenRevenue.USDT.net,
              withdrawn: totalWithdrawn.USDT,
              pendingRefunds: sellerData?.pendingRefunds?.USDT || 0,
              available: balances.USDT
            }
          });

          // Add pending refunds to the stats
          setStats({
            totalProducts: productsSnapshot.size,
            totalSales: orders.filter(o => o.paymentStatus === 'completed').length,
            totalCustomers: customers.size,
            grossRevenue: totalGrossRevenue,
            netRevenue: totalNetRevenue,
            balances,
            pendingRefunds: sellerData?.pendingRefunds || { USDC: 0, USDT: 0 }
          });

          // Set recent orders (only completed ones)
          setRecentOrders(
            orders
              .filter(o => o.paymentStatus === 'completed')
              .slice(0, 3)
          );
        });

        // Cleanup function to unsubscribe from real-time listeners
        return () => {
          unsubscribeSeller();
          unsubscribeOrders();
          unsubscribeWithdrawals();
        };
      });
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
    { 
      title: 'Revenue', 
      icon: <FiDollarSign />, 
      value: (
        <div>
          <div className="flex flex-col gap-1">
            <div className="text-lg">Current Balance:</div>
            <div className="text-2xl font-bold">${(stats.balances.USDC + stats.balances.USDT).toFixed(2)}</div>
            <div className="text-sm opacity-75">All-time Revenue:</div>
            <div className="text-xl">${stats.grossRevenue.toFixed(2)}</div>
            <div className="text-xs opacity-75">
              Net (after 5% fee): ${stats.netRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      ), 
      color: 'bg-pink-500' 
    },
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
                Available to withdraw
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
                Available to withdraw
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
            <p>A 5% platform fee is automatically deducted from each sale.</p>
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

        <div className="mb-4 p-4 bg-[#FF1B6B] bg-opacity-10 border border-[#FF1B6B] rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 text-[#FF1B6B] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-medium text-[#FF1B6B] mb-1">⚠️ Shipping Time Requirement</h4>
            <p className="text-sm text-gray-700">All orders must be shipped within 3 days of payment. Orders not shipped within this timeframe may be cancelled and refunded to protect buyers.</p>
          </div>
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
                  const hoursRemaining = Math.max(0, Math.ceil((availableDate - Date.now()) / (60 * 60 * 1000)));
                  
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
                        {payment.status === 'cancelled' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Canceled
                          </span>
                        ) : payment.shippingConfirmed ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-green-600">
                              Shipping Confirmed
                            </span>
                            <span className="text-xs text-gray-500">
                              {payment.carrier}: {payment.trackingNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>{payment.status === 'delivered' ? 'Delivered' : 'Processing'}</span>
                              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`absolute left-0 top-0 h-full transition-all duration-300 ${getProgressBarColor(payment)}`}
                                  style={{ width: getProgressBarWidth(payment) }}
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
                              style={{ width: `${Math.min(100, ((72 - hoursRemaining) / 72) * 100)}%` }}
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
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <Link
            to="/merch-store/orders-received"
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
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Withdrawal History</h2>
        
        {withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.timestamp ? new Date(withdrawal.timestamp).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.amount} {withdrawal.token || stats.preferredToken}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {withdrawal.status === 'pending' ? (
                        <div className="space-y-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#FF1B6B] h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (Date.now() - withdrawal.timestamp) / (3 * 24 * 60 * 60 * 1000) * 100)}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.max(0, 72 - Math.floor((Date.now() - withdrawal.timestamp) / (60 * 60 * 1000)))} hours remaining
                          </div>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          withdrawal.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {withdrawal.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.transactionHash ? (
                        <a 
                          href={`${withdrawal.network === 'unichain' 
                            ? 'https://unichain-sepolia.blockscout.com/tx/'
                            : 'https://polygonscan.com/tx/'
                          }${withdrawal.transactionHash}`}
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
          <div className="text-center py-8 text-gray-500">
            No withdrawals yet
          </div>
        )}
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

            // Verify that the connected wallet matches the seller's registered wallet
            if (accounts[0].toLowerCase() !== sellerData.walletAddress.toLowerCase()) {
              toast.error('Please use the wallet address registered in your seller settings');
              return;
            }

            const balance = selectedToken === 'USDC' ? stats.balances.USDC : stats.balances.USDT;
            if (balance < minWithdrawal) {
              toast.error(`Minimum withdrawal amount is ${minWithdrawal} ${selectedToken}`);
              return;
            }

            // Get network and contract
            const networkId = sellerData.preferredNetwork === 'unichain' ? 1301 : 137;
            if (window.ethereum.networkVersion !== networkId.toString()) {
              try {
                if (networkId === 1301) {
                  // Switch to Unichain testnet
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: '0x515',
                      chainName: 'Unichain Testnet',
                      nativeCurrency: {
                        name: 'UNW',
                        symbol: 'UNW',
                        decimals: 18
                      },
                      rpcUrls: [import.meta.env.VITE_UNICHAIN_RPC_URL],
                      blockExplorerUrls: [import.meta.env.VITE_UNICHAIN_EXPLORER_URL]
                    }]
                  });
                } else {
                  // Switch to Polygon
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x89' }], // 137 in hex
                  });
                }
              } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: '0x89',
                          chainName: 'Polygon Mainnet',
                          nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                          },
                          rpcUrls: ['https://polygon-rpc.com/'],
                          blockExplorerUrls: ['https://polygonscan.com/']
                        }
                      ]
                    });
                  } catch (addError) {
                    toast.error('Failed to add network to MetaMask');
                    return;
                  }
                } else {
                  toast.error(`Please switch to ${sellerData.preferredNetwork} network in MetaMask`);
                  return;
                }
              }
            }

            const ethProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await ethProvider.getSigner();
            const merchPlatform = getMerchPlatformContract(signer, networkId.toString());

            // Get token contract address based on network and token
            const tokenAddress = selectedToken === 'USDC' 
              ? (networkId === 1301 ? import.meta.env.VITE_UNICHAIN_USDC_ADDRESS : import.meta.env.VITE_USDC_ADDRESS_POLYGON)
              : (networkId === 1301 ? import.meta.env.VITE_UNICHAIN_USDT_ADDRESS : import.meta.env.VITE_USDT_ADDRESS_POLYGON);

            // Convert amount to proper decimals (6 for USDT/USDC)
            const withdrawalAmount = parseTokenAmount(balance);

            // Call contract to request withdrawal
            const tx = await merchPlatform.requestWithdrawal(
              tokenAddress,
              withdrawalAmount
            );

            // Show pending toast
            const pendingToast = toast.loading('Processing withdrawal request...');

            // Wait for transaction confirmation
            await tx.wait();

            // Create withdrawal record in Firestore
            await addDoc(collection(db, 'withdrawals'), {
              sellerId: user.sellerId,
              amount: balance,
              token: selectedToken,
              fee: 0,
              netAmount: balance,
              status: 'pending',
              walletAddress: accounts[0],
              network: sellerData.preferredNetwork,
              timestamp: serverTimestamp(),
              requestedAt: Date.now(),
              processingDays: 3,
              transactionHash: tx.hash
            });

            // Dismiss pending toast and show success
            toast.dismiss(pendingToast);
            toast.success('Withdrawal request submitted successfully');
            
            // Refresh dashboard data
            fetchDashboardData();
          } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error(error.message || 'Failed to process withdrawal');
          }
        }}
        token={selectedToken}
      />

      {/* Add this after the balances display */}
      {stats.pendingRefunds && (stats.pendingRefunds.USDC > 0 || stats.pendingRefunds.USDT > 0) && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-yellow-500 text-lg mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Refunds</p>
              <div className="mt-2 space-y-1">
                {stats.pendingRefunds.USDC > 0 && (
                  <p className="text-sm text-yellow-700">
                    USDC: ${stats.pendingRefunds.USDC.toFixed(2)}
                  </p>
                )}
                {stats.pendingRefunds.USDT > 0 && (
                  <p className="text-sm text-yellow-700">
                    USDT: ${stats.pendingRefunds.USDT.toFixed(2)}
                  </p>
                )}
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                These amounts are reserved for potential refunds and have been deducted from your available balance.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SellerDashboard; 