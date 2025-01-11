import React, { useState, useEffect, useMemo } from 'react';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { Navigate } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiCreditCard, FiShoppingBag, FiTrendingUp, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// Get admin wallet from environment variable - same for all chains
const ADMIN_WALLET = import.meta.env.VITE_ADMIN_WALLET || "0x5828D525fe00902AE22f2270Ac714616651894fF";

export default function AdminDashboard() {
  const { isAdmin } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [stats, setStats] = useState({
    totalSales: 0,
    currentSales: 0,
    totalRefunds: 0,
    activeSellers: 0,
    pendingWithdrawals: 0,
    platformBalance: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    platformFee: 0,
    totalPlatformFees: 0,
    withdrawnFees: 0,
    totalEarnings: 0,
    recentOrders: [],
    topSellers: [],
    salesByNetwork: {
      unichain: 0,
      polygon: 0
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [orderViewType, setOrderViewType] = useState('list');
  const theme = localStorage.getItem('admin-theme') || 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ordersPerPage = 50;

  const getUniqueStores = () => {
    const stores = stats.recentOrders?.map(order => order.sellerName) || [];
    return ['all', ...new Set(stores)];
  };

  const filteredOrders = useMemo(() => {
    return stats.recentOrders?.filter(order => {
      const matchesSearch = 
        (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.buyerInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStore = selectedStore === 'all' || order.sellerName === selectedStore;
      
      return matchesSearch && matchesStore;
    });
  }, [stats.recentOrders, searchTerm, selectedStore]);

  const loadMoreOrders = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const lastOrder = stats.recentOrders[stats.recentOrders.length - 1];
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        startAfter(lastOrder.createdAt),
        limit(ordersPerPage)
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      const newOrders = await Promise.all(ordersSnapshot.docs.map(async doc => {
        const orderData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Fetch seller data including flag
        if (orderData.sellerId) {
          const sellerQuery = query(
            collection(db, 'sellers'),
            where('uid', '==', orderData.sellerId)
          );
          const sellerSnapshot = await getDocs(sellerQuery);
          if (!sellerSnapshot.empty) {
            const sellerData = sellerSnapshot.docs[0].data();
            orderData.sellerName = sellerData.storeName || sellerData.name || 'Unknown Seller';
            orderData.sellerFlag = sellerData.country?.flag || null;
          }
        }
        
        return orderData;
      }));

      if (newOrders.length < ordersPerPage) {
        setHasMore(false);
      }

      setStats(prev => ({
        ...prev,
        recentOrders: [...prev.recentOrders, ...newOrders]
      }));
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more orders:', error);
      toast.error('Failed to load more orders');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreOrders();
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      try {
        const provider = await detectEthereumProvider();
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && accounts[0].toLowerCase() === ADMIN_WALLET.toLowerCase()) {
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0 || accounts[0].toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
          setWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      });
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        toast.error('Please connect your wallet');
        return;
      }

      const walletAddress = accounts[0];
      if (walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
        setWalletAddress(walletAddress);
        setWalletConnected(true);
        toast.success('Wallet connected successfully');
      } else {
        toast.error('This wallet does not have admin privileges');
        setWalletConnected(false);
        setWalletAddress('');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    }
  };

  useEffect(() => {
    if (walletConnected && walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      fetchDashboardData();
    }
  }, [walletConnected, walletAddress]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const sellersQuery = query(collection(db, 'sellers'));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('status', 'in', ['pending', 'approved'])
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
      
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(ordersPerPage)
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      // Create a map of seller data for quick lookup
      const sellersMap = {};
      sellersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        sellersMap[doc.id] = {
          id: doc.id,
          name: data.storeName || data.name || 'Unknown Store',
          flag: data.country?.flag || null
        };
      });

      // Process orders with seller data
      const processedOrders = await Promise.all(ordersSnapshot.docs.map(async doc => {
        const orderData = {
          id: doc.id,
          ...doc.data()
        };
        
        // Add seller data from the map
        if (orderData.sellerId && sellersMap[orderData.sellerId]) {
          const sellerData = sellersMap[orderData.sellerId];
          orderData.sellerName = sellerData.name;
          orderData.sellerFlag = sellerData.flag;
        }
        
        return orderData;
      }));

      setHasMore(processedOrders.length === ordersPerPage);

      // Calculate platform-wide metrics
      const validOrders = processedOrders.filter(order => order.status !== 'cancelled');
      const activeOrders = validOrders.filter(order => 
        order.status === 'shipped' || 
        order.status === 'processing' || 
        order.status === 'completed' ||
        order.status === 'delivered'
      );
      const refundedOrders = validOrders.filter(order => order.status === 'refunded');

      // Calculate total sales from active orders (completed + processing + shipped + delivered)
      const totalSales = activeOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      // Calculate total refunds (95% of refunded order totals)
      const totalRefunds = refundedOrders.reduce((sum, order) => sum + ((Number(order.total) || 0) * 0.95), 0);

      // Calculate platform fees (5% of total sales)
      const currentPlatformFees = totalSales * 0.05;
      const totalPlatformFees = [...activeOrders, ...refundedOrders].reduce((sum, order) => sum + (Number(order.total) * 0.05), 0);

      // Get withdrawn fees from approved platform fee withdrawals
      const withdrawnFees = withdrawalsSnapshot.docs
        .filter(doc => doc.data().status === 'approved' && doc.data().type === 'platform_fee')
        .reduce((sum, doc) => sum + doc.data().amount, 0);

      // Calculate current sales (total sales from active orders)
      const currentSales = activeOrders
        .filter(order => 
          order.status === 'shipped' || 
          order.status === 'processing' || 
          order.status === 'completed' ||
          order.status === 'delivered'
        )
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      // Calculate total withdrawn amount (for sellers)
      const totalWithdrawn = withdrawalsSnapshot.docs
        .filter(doc => doc.data().status === 'approved' && doc.data().type !== 'platform_fee')
        .reduce((sum, doc) => sum + doc.data().amount, 0);
      
      const uniqueCustomers = new Set([...activeOrders, ...refundedOrders].map(order => order.buyerId)).size;

      // Calculate seller statistics from active orders
      const sellerStats = {};
      activeOrders.forEach(order => {
        const sellerId = order.sellerId;
        const sellerName = sellersMap[sellerId]?.name || 'Unknown Store';
        
        if (!sellerStats[sellerId]) {
          sellerStats[sellerId] = {
            id: sellerId,
            name: sellerName,
            flag: sellersMap[sellerId]?.flag || null,
            totalSales: 0,
            ordersCount: 0
          };
        }
        sellerStats[sellerId].totalSales += Number(order.total) || 0;
        sellerStats[sellerId].ordersCount += 1;
      });

      // Sort sellers by total sales and get top 5
      const topSellers = Object.values(sellerStats)
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 5)
        .map(seller => ({
          id: seller.id,
          name: seller.name,
          flag: seller.flag,
          total: seller.totalSales,
          orders: seller.ordersCount
        }));

      // Get total products count
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const totalProducts = productsSnapshot.size;

      // Calculate sales by network from orders
      let salesByNetwork = { unichain: 0, polygon: 0 };
      activeOrders.forEach(order => {
        if (order.paymentMethod?.network === 1301) {
          salesByNetwork.unichain += Number(order.total) || 0;
        } else if (order.paymentMethod?.network === 137) {
          salesByNetwork.polygon += Number(order.total) || 0;
        }
      });

      setStats({
        totalSales,
        currentSales: Math.max(0, currentSales),
        totalRefunds,
        activeSellers: sellersSnapshot.size,
        pendingWithdrawals: withdrawalsSnapshot.docs.filter(doc => doc.data().status === 'pending').length,
        platformBalance: currentPlatformFees,
        totalOrders: processedOrders.length,
        totalProducts,
        totalCustomers: uniqueCustomers,
        platformFee: currentPlatformFees,
        totalPlatformFees,
        withdrawnFees,
        totalEarnings: totalPlatformFees + withdrawnFees,
        recentOrders: processedOrders,
        topSellers,
        salesByNetwork
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/merch-store" replace />;
  }

  if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h1 className="text-2xl font-bold text-[#FF1B6B] mb-4">Admin Authentication Required</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Please connect your admin wallet to access the dashboard</p>
        <button
          onClick={handleConnectWallet}
          className="px-6 py-3 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>All-time Sales</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.totalSales.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total volume (excl. refunds)</p>
            </div>
            <FiTrendingUp className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current Sales</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${Math.max(0, stats.currentSales).toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Available for withdrawal</p>
            </div>
            <FiDollarSign className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-red-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Refunds</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.totalRefunds.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Refunded amount (excl. platform fees)</p>
            </div>
            <FiCreditCard className="text-3xl text-red-500" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>All-time Platform Fees</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.totalPlatformFees.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total platform fees (incl. withdrawn)</p>
            </div>
            <FiTrendingUp className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current Platform Fees</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.platformFee.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Available for withdrawal</p>
            </div>
            <FiDollarSign className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Sellers</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.activeSellers}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{stats.totalProducts} products listed</p>
            </div>
            <FiUsers className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalOrders}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>All-time orders</p>
            </div>
            <FiShoppingBag className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalProducts}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Listed products</p>
            </div>
            <FiGrid className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Customers</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalCustomers}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Unique buyers</p>
            </div>
            <FiUsers className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Sales by Network</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/unichain-logo.png" alt="Unichain" className="w-6 h-6 object-contain" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Unichain</span>
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${stats.salesByNetwork.unichain.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/polygon.png" alt="Polygon" className="w-6 h-6 object-contain" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Polygon</span>
              </div>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${stats.salesByNetwork.polygon.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Top Sellers</h2>
          <div className="space-y-4">
            {stats.topSellers.map((seller, index) => (
              <div key={seller.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full bg-[#FF1B6B] flex items-center justify-center text-white text-sm`}>
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{seller.name}</span>
                    {seller.flag && (
                      <img 
                        src={seller.flag}
                        alt="Seller country flag"
                        className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                      />
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${seller.total.toFixed(2)}
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {seller.orders} orders
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h3>
          <div className="flex items-center gap-4">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className={`px-3 py-2 rounded-md text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 border-gray-600'
                  : 'bg-white text-gray-700 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-[#FF1B6B]`}
            >
              {getUniqueStores().map((store) => (
                <option key={store} value={store}>
                  {store === 'all' ? 'All Stores' : store}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID or Customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-md text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-700 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] w-64`}
              />
              <svg
                className={`absolute left-3 top-2.5 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOrderViewType('list')}
                className={`p-2 rounded-lg transition-colors ${
                  orderViewType === 'list'
                    ? 'bg-[#FF1B6B] text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setOrderViewType('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  orderViewType === 'grid'
                    ? 'bg-[#FF1B6B] text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {orderViewType === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr className="bg-gray-50">
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Order ID
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Seller
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Customer
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Amount
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredOrders?.map((order) => (
                  <tr key={order.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.id.slice(-6)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-2">
                        <span>{order.sellerName}</span>
                        {order.sellerFlag && (
                          <img 
                            src={order.sellerFlag}
                            alt="Seller country flag"
                            className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                          />
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className="flex items-center gap-2">
                        <span>{order.buyerInfo?.name || 'Anonymous'}</span>
                        {order.flag && (
                          <img 
                            src={order.flag}
                            alt={typeof order.shippingAddress?.country === 'object' 
                              ? order.shippingAddress?.country.name 
                              : order.shippingAddress?.country}
                            className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                          />
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'delivered' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString() : new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto"
            style={{ maxHeight: '600px' }}
            onScroll={handleScroll}
          >
            {filteredOrders?.map((order) => (
              <div
                key={order.id}
                className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                } p-4 rounded-lg space-y-3`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      Order #{order.id.slice(-6)}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString() : new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b border-gray-200 py-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Customer</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                        {order.buyerInfo?.name || 'Anonymous'}
                      </span>
                      {order.flag && (
                        <img 
                          src={order.flag}
                          alt="Buyer country flag"
                          className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seller</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                        {order.sellerName}
                      </span>
                      {order.sellerFlag && (
                        <img 
                          src={order.sellerFlag}
                          alt="Seller country flag"
                          className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Total Amount</span>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {loadingMore && (
              <div className="col-span-full flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 