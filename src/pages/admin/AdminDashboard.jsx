import React, { useState, useEffect } from 'react';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { Navigate } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiCreditCard, FiShoppingBag, FiTrendingUp, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { getMerchPlatformContract } from '../../contracts/MerchPlatform';

const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF";
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

export default function AdminDashboard() {
  const { isAdmin } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [contractBalances, setContractBalances] = useState({
    unichain: {
      USDT: { total: 0, fees: 0, available: 0, error: null },
      USDC: { total: 0, fees: 0, available: 0, error: null }
    },
    polygon: {
      USDT: { total: 0, fees: 0, available: 0, error: null },
      USDC: { total: 0, fees: 0, available: 0, error: null }
    }
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    currentSales: 0,
    activeSellers: 0,
    pendingWithdrawals: 0,
    platformBalance: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    platformFee: 0,
    totalEarnings: 0,
    recentOrders: [],
    topSellers: [],
    salesByNetwork: {
      unichain: 0,
      polygon: 0
    },
    contractBalances: {
      unichain: {
        USDT: { total: 0, fees: 0, available: 0 },
        USDC: { total: 0, fees: 0, available: 0 }
      },
      polygon: {
        USDT: { total: 0, fees: 0, available: 0 },
        USDC: { total: 0, fees: 0, available: 0 }
      }
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [orderViewType, setOrderViewType] = useState('list');
  const theme = localStorage.getItem('admin-theme') || 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ordersPerPage = 50;
  const [contractBalancesLoading, setContractBalancesLoading] = useState(true);
  const [networkLoadingStates, setNetworkLoadingStates] = useState({
    unichain: false,
    polygon: false
  });

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
        
        if (orderData.sellerId) {
          const sellerDoc = await getDocs(query(
            collection(db, 'users'),
            where('uid', '==', orderData.sellerId)
          ));
          if (!sellerDoc.empty) {
            const sellerData = sellerDoc.docs[0].data();
            orderData.sellerName = sellerData.name || 'Unknown Seller';
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

  useEffect(() => {
    if (stats.recentOrders.length > 0) {
      const filtered = stats.recentOrders.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(searchLower) ||
          (order.buyerInfo?.name || '').toLowerCase().includes(searchLower) ||
          (order.sellerName || '').toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower)
        );
      });
      setFilteredOrders(filtered);
    }
  }, [searchQuery, stats.recentOrders]);

  const fetchDashboardData = async () => {
    try {
      const sellersQuery = query(collection(db, 'users'), where('isSeller', '==', true));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      // Get both pending and approved withdrawals in one query
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
      const orders = await Promise.all(ordersSnapshot.docs.map(async doc => {
        const orderData = {
          id: doc.id,
          ...doc.data()
        };
        
        if (orderData.sellerId) {
          const sellerDoc = await getDocs(query(
            collection(db, 'users'),
            where('uid', '==', orderData.sellerId)
          ));
          if (!sellerDoc.empty) {
            const sellerData = sellerDoc.docs[0].data();
            orderData.sellerName = sellerData.name || 'Unknown Seller';
          }
        }
        
        return orderData;
      }));

      setHasMore(orders.length === ordersPerPage);

      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);

      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const platformFee = orders.reduce((sum, order) => sum + (order.total * 0.05), 0);
      
      // Calculate total withdrawn amount
      const totalWithdrawn = withdrawalsSnapshot.docs
        .filter(doc => doc.data().status === 'approved')
        .reduce((sum, doc) => sum + doc.data().amount, 0);
      
      // Current sales should be the available balance (total - platform fees - withdrawn)
      const currentSales = totalSales - platformFee - totalWithdrawn;

      const uniqueCustomers = new Set(orders.map(order => order.buyerId)).size;
      
      const salesByNetwork = orders.reduce((acc, order) => {
        const network = order.paymentMethod?.network;
        if (network === 1301) acc.unichain += order.total;
        if (network === 137) acc.polygon += order.total;
        return acc;
      }, { unichain: 0, polygon: 0 });

      const sellerSales = {};
      orders.forEach(order => {
        if (!sellerSales[order.sellerId]) {
          sellerSales[order.sellerId] = {
            id: order.sellerId,
            name: order.sellerName,
            total: 0,
            orders: 0
          };
        }
        sellerSales[order.sellerId].total += order.total;
        sellerSales[order.sellerId].orders += 1;
      });

      const topSellers = Object.values(sellerSales)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      // Get contract balances
      const tokenABI = ["function balanceOf(address) view returns (uint256)"];
      const unichainProvider = new ethers.JsonRpcProvider('https://sepolia.unichain.org');
      const unichainContract = await getMerchPlatformContract(unichainProvider, '1301');
      
      let unichainUSDTTotal = 0;
      if (unichainContract && unichainContract.target) {
        const unichainUSDTAddress = import.meta.env.VITE_UNICHAIN_USDT_ADDRESS;
        if (unichainUSDTAddress) {
          const unichainUSDT = new ethers.Contract(unichainUSDTAddress, tokenABI, unichainProvider);
          const balance = await unichainUSDT.balanceOf(unichainContract.target);
          unichainUSDTTotal = Number(ethers.formatUnits(balance, 6));
        }
      }

      // Set both stats and contract balances together
      setStats({
        totalSales,
        currentSales,
        activeSellers: sellersSnapshot.size,
        pendingWithdrawals: withdrawalsSnapshot.docs.filter(doc => doc.data().status === 'pending').length,
        platformBalance: platformFee,
        totalOrders: orders.length,
        totalProducts: productsSnapshot.size,
        totalCustomers: uniqueCustomers,
        platformFee: platformFee,
        totalEarnings: platformFee,
        recentOrders: orders,
        topSellers,
        salesByNetwork
      });

      // Set contract balances using the same values
      setContractBalances({
        unichain: {
          USDT: { 
            total: unichainUSDTTotal,
            fees: platformFee,
            available: currentSales
          },
          USDC: { 
            total: 0,
            fees: 0,
            available: 0
          }
        },
        polygon: {
          USDT: { 
            total: 0,
            fees: 0,
            available: 0
          },
          USDC: { 
            total: 0,
            fees: 0,
            available: 0
          }
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch contract balances
  const fetchContractBalances = async () => {
    setNetworkLoadingStates({
      unichain: true,
      polygon: true
    });
    try {
      // Token ABI for balance checking
      const tokenABI = ["function balanceOf(address) view returns (uint256)"];
      const platformABI = [
        "function platformFees(address) external view returns (uint256)",
        "function balanceOf(address) view returns (uint256)"
      ];

      // Get Unichain balances
      const unichainProvider = new ethers.JsonRpcProvider('https://sepolia.unichain.org');
      const unichainContract = await getMerchPlatformContract(unichainProvider, '1301');
      
      // Get Polygon balances - using more reliable RPC
      const polygonProvider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/' + import.meta.env.VITE_ALCHEMY_API_KEY);
      const polygonContract = await getMerchPlatformContract(polygonProvider, '137');
      
      console.log('Contract Addresses:', {
        unichain: unichainContract?.target,
        polygon: polygonContract?.target
      });
      
      let newBalances = {
        unichain: {
          USDT: { total: 0, fees: 0, available: 0, error: null },
          USDC: { total: 0, fees: 0, available: 0, error: null }
        },
        polygon: {
          USDT: { total: 0, fees: 0, available: 0, error: null },
          USDC: { total: 0, fees: 0, available: 0, error: null }
        }
      };
      
      // Fetch Unichain balances
      if (unichainContract && unichainContract.target) {
        try {
          // Get USDT balance and fees for Unichain
          const unichainUSDTContract = new ethers.Contract(
            import.meta.env.VITE_UNICHAIN_USDT_ADDRESS,
            tokenABI,
            unichainProvider
          );
          const [unichainUSDTBalance, unichainUSDTFees] = await Promise.all([
            unichainUSDTContract.balanceOf(unichainContract.target),
            unichainContract.platformFees(import.meta.env.VITE_UNICHAIN_USDT_ADDRESS)
          ]);
          
          const formattedUSDTBalance = Number(ethers.formatUnits(unichainUSDTBalance, 6));
          const formattedUSDTFees = Number(ethers.formatUnits(unichainUSDTFees, 6));

          newBalances.unichain.USDT = {
            total: formattedUSDTBalance,
            fees: formattedUSDTFees,
            available: formattedUSDTBalance - formattedUSDTFees,
            error: null
          };
          
          // Get USDC balance and fees for Unichain
          const unichainUSDCContract = new ethers.Contract(
            import.meta.env.VITE_UNICHAIN_USDC_ADDRESS,
            tokenABI,
            unichainProvider
          );
          const [unichainUSDCBalance, unichainUSDCFees] = await Promise.all([
            unichainUSDCContract.balanceOf(unichainContract.target),
            unichainContract.platformFees(import.meta.env.VITE_UNICHAIN_USDC_ADDRESS)
          ]);
          
          const formattedUSDCBalance = Number(ethers.formatUnits(unichainUSDCBalance, 6));
          const formattedUSDCFees = Number(ethers.formatUnits(unichainUSDCFees, 6));

          newBalances.unichain.USDC = {
            total: formattedUSDCBalance,
            fees: formattedUSDCFees,
            available: formattedUSDCBalance - formattedUSDCFees,
            error: null
          };
        } catch (error) {
          console.error('Error fetching Unichain balances:', error);
          newBalances.unichain.USDT.error = 'Failed to fetch Unichain USDT balance';
          newBalances.unichain.USDC.error = 'Failed to fetch Unichain USDC balance';
        }
      }

      // Fetch Polygon balances
      if (polygonContract && polygonContract.target) {
        try {
          // Get USDT balance and fees for Polygon
          const polygonUSDTContract = new ethers.Contract(
            import.meta.env.VITE_USDT_ADDRESS_POLYGON,
            tokenABI,
            polygonProvider
          );
          const [polygonUSDTBalance, polygonUSDTFees] = await Promise.all([
            polygonUSDTContract.balanceOf(polygonContract.target),
            polygonContract.platformFees(import.meta.env.VITE_USDT_ADDRESS_POLYGON)
          ]);
          
          const formattedUSDTBalance = Number(ethers.formatUnits(polygonUSDTBalance, 6));
          const formattedUSDTFees = Number(ethers.formatUnits(polygonUSDTFees, 6));

          newBalances.polygon.USDT = {
            total: formattedUSDTBalance,
            fees: formattedUSDTFees,
            available: formattedUSDTBalance - formattedUSDTFees,
            error: null
          };
          
          // Get USDC balance and fees for Polygon
          const polygonUSDCContract = new ethers.Contract(
            import.meta.env.VITE_USDC_ADDRESS_POLYGON,
            tokenABI,
            polygonProvider
          );
          const [polygonUSDCBalance, polygonUSDCFees] = await Promise.all([
            polygonUSDCContract.balanceOf(polygonContract.target),
            polygonContract.platformFees(import.meta.env.VITE_USDC_ADDRESS_POLYGON)
          ]);
          
          const formattedUSDCBalance = Number(ethers.formatUnits(polygonUSDCBalance, 6));
          const formattedUSDCFees = Number(ethers.formatUnits(polygonUSDCFees, 6));

          newBalances.polygon.USDC = {
            total: formattedUSDCBalance,
            fees: formattedUSDCFees,
            available: formattedUSDCBalance - formattedUSDCFees,
            error: null
          };
        } catch (error) {
          console.error('Error fetching Polygon balances:', error);
          newBalances.polygon.USDT.error = 'Failed to fetch Polygon USDT balance';
          newBalances.polygon.USDC.error = 'Failed to fetch Polygon USDC balance';
        }
      }

      // Update state with all balances
      setContractBalances(newBalances);
      console.log('Updated Contract Balances:', newBalances);
    } catch (error) {
      console.error('Error fetching contract balances:', error);
    } finally {
      setNetworkLoadingStates({
        unichain: false,
        polygon: false
      });
      setContractBalancesLoading(false);
    }
  };

  // Add useEffect to fetch contract balances periodically
  useEffect(() => {
    if (walletConnected && walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      fetchContractBalances();
      const interval = setInterval(fetchContractBalances, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [walletConnected, walletAddress]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>All-time Sales</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.totalSales.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total volume</p>
            </div>
            <FiTrendingUp className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current Sales</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.currentSales.toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Available for withdrawal for sellers</p>
            </div>
            <FiDollarSign className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>All-time Platform Fees</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${(stats.totalSales * 0.05).toFixed(2)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Total platform fees earned</p>
            </div>
            <FiTrendingUp className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Current Platform Fees</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ${(
                  (contractBalances?.unichain?.USDT?.fees || 0) + 
                  (contractBalances?.unichain?.USDC?.fees || 0) + 
                  (contractBalances?.polygon?.USDT?.fees || 0) + 
                  (contractBalances?.polygon?.USDC?.fees || 0)
                ).toFixed(2)}
              </p>
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
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{seller.name}</span>
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

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-12`}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h2>
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
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer, seller or status..."
              className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent`}
            />
          </div>
        </div>

        {orderViewType === 'list' ? (
          <div className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Order ID</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Customer</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Seller</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Items</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Amount</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Date</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div 
                className="overflow-y-auto"
                style={{ maxHeight: '400px' }}
                onScroll={handleScroll}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          #{order.id.slice(-6)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {order.buyerInfo?.name || 'Anonymous'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {order.sellerName || 'Unknown Seller'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {order.items.reduce((total, item) => total + (item.quantity || 0), 0)} items
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {new Date(order.createdAt?.toDate()).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto"
            style={{ maxHeight: '400px' }}
            onScroll={handleScroll}
          >
            {filteredOrders.map((order) => (
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
                      {new Date(order.createdAt?.toDate()).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b border-gray-200 py-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Customer</span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.buyerInfo?.name || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Seller</span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.sellerName || 'Unknown Seller'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Items</span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.items.reduce((total, item) => total + (item.quantity || 0), 0)} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Network</span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {order.paymentMethod?.network === 1301 ? 'Unichain' : 'Polygon'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>Total Amount</span>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${order.total.toFixed(2)}
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

      {/* Platform Contract Balances Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#FF1B6B] mb-4">Platform Contract Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unichain Network Card */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <h3 className="text-lg font-semibold mb-4">Unichain Network</h3>
            {networkLoadingStates.unichain ? (
              <div className="flex justify-center items-center py-4">
                <div className="w-6 h-6 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* USDT Balance */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <img src="/logos/usdt.png" alt="USDT" className="w-6 h-6 mr-2" />
                    <span className="font-medium">USDT</span>
                  </div>
                  {contractBalances.unichain.USDT.error ? (
                    <p className="text-red-500 text-sm">{contractBalances.unichain.USDT.error}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">${contractBalances.unichain.USDT.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fees</p>
                        <p className="font-medium">${contractBalances.unichain.USDT.fees.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">${contractBalances.unichain.USDT.available.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* USDC Balance */}
                <div>
                  <div className="flex items-center mb-2">
                    <img src="/logos/usdc.png" alt="USDC" className="w-6 h-6 mr-2" />
                    <span className="font-medium">USDC</span>
                  </div>
                  {contractBalances.unichain.USDC.error ? (
                    <p className="text-red-500 text-sm">{contractBalances.unichain.USDC.error}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">${contractBalances.unichain.USDC.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fees</p>
                        <p className="font-medium">${contractBalances.unichain.USDC.fees.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">${contractBalances.unichain.USDC.available.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Polygon Network Card */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <h3 className="text-lg font-semibold mb-4">Polygon Network</h3>
            {networkLoadingStates.polygon ? (
              <div className="flex justify-center items-center py-4">
                <div className="w-6 h-6 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* USDT Balance */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <img src="/logos/usdt.png" alt="USDT" className="w-6 h-6 mr-2" />
                    <span className="font-medium">USDT</span>
                  </div>
                  {contractBalances.polygon.USDT.error ? (
                    <p className="text-red-500 text-sm">{contractBalances.polygon.USDT.error}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">${contractBalances.polygon.USDT.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fees</p>
                        <p className="font-medium">${contractBalances.polygon.USDT.fees.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">${contractBalances.polygon.USDT.available.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* USDC Balance */}
                <div>
                  <div className="flex items-center mb-2">
                    <img src="/logos/usdc.png" alt="USDC" className="w-6 h-6 mr-2" />
                    <span className="font-medium">USDC</span>
                  </div>
                  {contractBalances.polygon.USDC.error ? (
                    <p className="text-red-500 text-sm">{contractBalances.polygon.USDC.error}</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-medium">${contractBalances.polygon.USDC.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fees</p>
                        <p className="font-medium">${contractBalances.polygon.USDC.fees.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Available</p>
                        <p className="font-medium">${contractBalances.polygon.USDC.available.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 