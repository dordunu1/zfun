import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { getContractAddress } from '../../contracts/MerchPlatform';
import { useMerchAuth } from '../../context/MerchAuthContext';

// Get admin wallet from environment variable - same for all chains
const ADMIN_WALLET = import.meta.env.VITE_ADMIN_WALLET || "0x5828D525fe00902AE22f2270Ac714616651894fF";

export default function AdminSales() {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalRefunds: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    uniqueCustomers: 0,
    tokenSales: {
      USDT: { total: 0, refunds: 0 },
      USDC: { total: 0, refunds: 0 }
    }
  });
  const [sellerSales, setSellerSales] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { isAdmin } = useMerchAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');

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
      } finally {
        setLoading(false);
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

  useEffect(() => {
    if (walletConnected && walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      fetchSalesData();
    }
  }, [walletConnected, walletAddress]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders first
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      // Get unique sellers from orders with their names
      const uniqueSellers = {};
      orders.forEach(order => {
        if (order.sellerId && !uniqueSellers[order.sellerId]) {
          uniqueSellers[order.sellerId] = {
            id: order.sellerId,
            name: order.sellerName || 'Unknown Seller'
          };
        }
      });

      // Calculate platform-wide metrics
      const validOrders = orders.filter(order => order.status !== 'cancelled');
      const activeOrders = validOrders.filter(order => order.status === 'completed' || order.status === 'processing');
      const refundedOrders = validOrders.filter(order => order.status === 'refunded');

      // Calculate total sales from active orders (completed + processing)
      const totalSales = activeOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      // Calculate total refunds (95% of refunded order totals)
      const totalRefunds = refundedOrders.reduce((sum, order) => sum + ((Number(order.total) || 0) * 0.95), 0);

      // Calculate token-specific sales
      const tokenSales = {
        USDT: { total: 0, refunds: 0, net: 0 },
        USDC: { total: 0, refunds: 0, net: 0 }
      };

      // Process active orders for token sales
      activeOrders.forEach(order => {
        const token = order.paymentMethod?.token || 'USDT';
        const amount = Number(order.total) || 0;
        if (tokenSales[token]) {
          tokenSales[token].total += amount;
          tokenSales[token].net = tokenSales[token].total; // Set net equal to total for active orders
        }
      });

      // Process refunded orders for token sales
      refundedOrders.forEach(order => {
        const token = order.paymentMethod?.token || 'USDT';
        const amount = Number(order.total) || 0;
        const refundAmount = amount * 0.95;
        if (tokenSales[token]) {
          tokenSales[token].refunds += refundAmount;
          // Don't add to total or net for refunded orders
        }
      });

      // Update platform-wide stats
      setSalesData({
        totalRevenue: Math.max(0, totalSales),
        totalRefunds: totalRefunds,
        totalOrders: activeOrders.length,
        averageOrderValue: activeOrders.length ? totalSales / activeOrders.length : 0,
        uniqueCustomers: new Set(activeOrders.map(order => order.buyerId)).size,
        tokenSales,
        recentOrders: orders.slice(0, 10).map(order => ({
          id: order.id || '',
          buyerInfo: order.buyerInfo || {},
          total: Number(order.total) || 0,
          status: order.status || 'unknown',
          createdAt: order.createdAt || new Date(),
          sellerId: order.sellerId || '',
          sellerName: order.sellerName || 'Unknown Seller'
        }))
      });

      // Process seller-specific data
      const sellerData = Object.values(uniqueSellers).map(seller => {
        const sellerOrders = validOrders.filter(order => order.sellerId === seller.id);
        const sellerNonRefundedOrders = sellerOrders.filter(order => order.status !== 'refunded');
        const sellerRefundedOrders = sellerOrders.filter(order => order.status === 'refunded');
        
        // Calculate seller's total balance excluding refunds
        const totalBalance = sellerNonRefundedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

        // Calculate seller's total refunds (95% of order total)
        const totalRefunds = sellerRefundedOrders.reduce((sum, order) => sum + ((Number(order.total) || 0) * 0.95), 0);

        // Calculate period sales (excluding refunds)
        const calculatePeriodSales = (days) => {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          return sellerOrders
            .filter(order => {
              const orderDate = order.createdAt;
              return orderDate >= cutoff && order.status !== 'refunded';
            })
            .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        };

        // Calculate available to withdraw (total balance minus refunds and platform fees)
        const platformFee = totalBalance * 0.05; // 5% platform fee
        const availableToWithdraw = Math.max(0, totalBalance - totalRefunds - platformFee);

        return {
          id: seller.id,
          name: seller.name,
          totalOrders: sellerNonRefundedOrders.length || 0,
          totalBalance: totalBalance || 0,
          totalRefunds: totalRefunds || 0,
          sales: {
            '1d': calculatePeriodSales(1) || 0,
            '7d': calculatePeriodSales(7) || 0,
            '30d': calculatePeriodSales(30) || 0,
            '6m': calculatePeriodSales(180) || 0,
            'all': totalBalance || 0
          },
          availableToWithdraw
        };
      });

      setSellerSales(sellerData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueStores = () => {
    const stores = salesData.recentOrders?.map(order => order.sellerName) || [];
    return ['all', ...new Set(stores)];
  };

  const filteredOrders = salesData.recentOrders?.filter(order => {
    const matchesSearch = 
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.buyerInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStore = selectedStore === 'all' || order.sellerName === selectedStore;
    
    return matchesSearch && matchesStore;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FiAlertTriangle className="w-16 h-16 text-[#FF1B6B] mb-4" />
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Access Denied</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>Please connect your admin wallet to access the sales analytics.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FF1B6B]">Sales Analytics</h1>
        <button
          onClick={fetchSalesData}
          className="px-4 py-2 bg-[#FF1B6B] text-white rounded-md hover:bg-[#FF1B6B]/90 flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>
      
      {/* Platform Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${salesData.totalRevenue.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{salesData.totalOrders} orders</p>
              {salesData.totalRefunds > 0 && (
                <p className="text-xs text-red-500">Refunds: ${salesData.totalRefunds.toFixed(2)}</p>
              )}
            </div>
            <FiDollarSign className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{salesData.totalOrders}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Active orders</p>
            </div>
            <FiShoppingBag className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Order Value</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${salesData.averageOrderValue.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Per order average</p>
            </div>
            <FiTrendingUp className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Unique Customers</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{salesData.uniqueCustomers}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total buyers</p>
            </div>
            <FiUsers className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h3>
          <div className="flex gap-4">
            {/* Store Filter */}
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

            {/* Search Bar */}
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
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Order ID</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Customer</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Seller</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredOrders?.map((order) => (
                <tr key={order.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {order.id.slice(-6)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {order.buyerInfo?.name || 'Anonymous'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {order.sellerName}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${order.total?.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Overview */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Sales Overview</h2>
          <div className="flex space-x-2">
            {['1d', '7d', '30d', '6m', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeFilter === filter 
                    ? 'bg-[#FF1B6B] text-white' 
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === '1d' ? '24h' : filter === '7d' ? '7d' : filter === '30d' ? '30d' : filter === '6m' ? '6m' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Token Sales Summary */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Token Sales Summary</h3>
          <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
            {Object.entries(salesData.tokenSales || {}).map(([token, data]) => {
              // Ensure data and its properties exist with default values
              const safeData = {
                net: data?.net || 0,
                refunds: data?.refunds || 0
              };
              
              return (
                <div key={token} className="flex justify-between items-center mb-2 last:mb-0">
                  <div className="flex items-center gap-2">
                    {token === 'USDC' ? (
                      <img src="/logos/usdc.png" alt="USDC" className="w-5 h-5" />
                    ) : (
                      <img src="/logos/usdt.png" alt="USDT" className="w-5 h-5" />
                    )}
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{token}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ${safeData.net.toFixed(2)}
                    </p>
                    {safeData.refunds > 0 && (
                      <p className="text-xs text-red-500">
                        Refunds: ${safeData.refunds.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seller Sales Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Seller</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>24h</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>7d</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>30d</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>6m</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>All Time</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Refunds</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Available to Withdraw</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {sellerSales.map((seller) => (
                <tr key={seller.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{seller.name}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{seller.totalOrders} orders</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${seller.sales['1d'].toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${seller.sales['7d'].toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${seller.sales['30d'].toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${seller.sales['6m'].toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    ${seller.sales['all'].toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-red-500`}>
                    ${seller.totalRefunds.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#FF1B6B]">
                      ${seller.availableToWithdraw.toFixed(2)}
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
} 