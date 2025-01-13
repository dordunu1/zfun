import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiDollarCircle, BiPackage, BiUser, BiTrendingUp, BiHistory, BiWallet, BiSearch, BiChevronLeft, BiChevronRight, BiChevronDown } from 'react-icons/bi';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, trend, subtitle, secondaryValue }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <BiTrendingUp className="text-emerald-500 w-4 h-4" />
            <span className="text-xs text-emerald-500">{trend}% from last month</span>
          </div>
        )}
        {secondaryValue && (
          <p className="text-xs text-red-500 mt-1">Refunds: {secondaryValue}</p>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
        <Icon className="w-5 h-5 text-[#FF1B6B]" />
      </div>
    </div>
  </motion.div>
);

const StoresRevenue = () => {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isWithdrawalVisible, setIsWithdrawalVisible] = useState(true);
  const storesPerPage = 5;

  useEffect(() => {
    fetchStoresData();
    fetchAllWithdrawals();
  }, []);

  useEffect(() => {
    // Filter stores based on search term
    const filtered = stores.filter(store => 
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Sort stores by all-time revenue in descending order
    const sortedStores = filtered.sort((a, b) => b.metrics.allTimeRevenue - a.metrics.allTimeRevenue);
    setFilteredStores(sortedStores);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, stores]);

  const fetchStoresData = async () => {
    try {
      // Fetch all sellers
      const sellersQuery = query(collection(db, 'sellers'), orderBy('storeName'));
      const sellersSnapshot = await getDocs(sellersQuery);
      const sellersData = sellersSnapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure country data is properly formatted
        const country = data.country || {};
        if (typeof country === 'string') {
          // If country is just a string, convert it to proper format
          return {
            id: doc.id,
            ...data,
            country: {
              code: country.trim().toLowerCase().slice(0, 2),
              name: country
            }
          };
        } else if (country.code) {
          // If country is an object with code, ensure it's properly formatted
          return {
            id: doc.id,
            ...data,
            country: {
              ...country,
              code: country.code.trim().toLowerCase()
            }
          };
        }
        return {
          id: doc.id,
          ...data
        };
      });

      // For each seller, fetch their orders and withdrawals
      const storesWithMetrics = await Promise.all(sellersData.map(async (seller) => {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('sellerId', '==', seller.id)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch withdrawals
        const withdrawalsQuery = query(
          collection(db, 'withdrawals'),
          where('sellerId', '==', seller.id)
        );
        const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
        const withdrawals = withdrawalsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.requestedAt ? new Date(data.requestedAt) : null
          };
        });

        // Sort withdrawals by date
        withdrawals.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });

        // Calculate completed and pending withdrawals
        const withdrawalsByStatus = withdrawals.reduce((acc, withdrawal) => {
          if (withdrawal.status === 'completed') {
            acc.completed += withdrawal.amount || 0;
          } else if (withdrawal.status === 'pending') {
            acc.pending += withdrawal.amount || 0;
          }
          return acc;
        }, { completed: 0, pending: 0 });

        // Calculate metrics
        const thisMonthOrders = orders.filter(order => {
          const orderDate = order.createdAt?.toDate();
          return orderDate >= firstDayThisMonth;
        });

        const lastMonthOrders = orders.filter(order => {
          const orderDate = order.createdAt?.toDate();
          return orderDate >= firstDayLastMonth && orderDate <= lastDayLastMonth;
        });

        const validOrders = orders.filter(order => order.status !== 'cancelled');
        const grossRevenue = validOrders.reduce((sum, order) => {
          // If order is refunded, don't include it in revenue
          if (order.status === 'refunded') {
            return sum;
          }
          return sum + (order.total || 0);
        }, 0);

        // All time revenue is just the gross revenue (total earned)
        const allTimeRevenue = grossRevenue;

        // Net revenue is gross revenue minus completed withdrawals
        const netRevenue = grossRevenue - withdrawalsByStatus.completed;

        const uniqueCustomers = new Set(validOrders.map(order => order.buyerId)).size;

        // Calculate percentage changes
        const calculatePercentageChange = (current, previous) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };

        const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => {
          return order.status !== 'refunded' && order.status !== 'cancelled' 
            ? sum + (order.total || 0) : sum;
        }, 0);

        const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
          return order.status !== 'refunded' && order.status !== 'cancelled'
            ? sum + (order.total || 0) : sum;
        }, 0);

        return {
          ...seller,
          metrics: {
            allTimeRevenue: allTimeRevenue, // Total earned (without withdrawals)
            totalWithdrawn: withdrawalsByStatus.completed, // Total amount withdrawn
            pendingWithdrawals: withdrawalsByStatus.pending, // Pending withdrawals
            netRevenue: netRevenue, // Available for withdrawal (gross - withdrawn)
            totalOrders: orders.length,
            totalCustomers: uniqueCustomers,
            revenueChange: parseFloat(calculatePercentageChange(thisMonthRevenue, lastMonthRevenue).toFixed(1)),
            ordersChange: parseFloat(calculatePercentageChange(thisMonthOrders.length, lastMonthOrders.length).toFixed(1)),
            customersChange: parseFloat(calculatePercentageChange(
              new Set(thisMonthOrders.map(order => order.buyerId)).size,
              new Set(lastMonthOrders.map(order => order.buyerId)).size
            ).toFixed(1))
          },
          withdrawalHistory: withdrawals.sort((a, b) => 
            (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
          ).map(withdrawal => ({
            id: withdrawal.id,
            amount: withdrawal.amount || 0,
            status: withdrawal.status,
            createdAt: withdrawal.createdAt,
            network: withdrawal.network,
            walletAddress: withdrawal.walletAddress
          }))
        };
      }));

      setStores(storesWithMetrics);
    } catch (error) {
      console.error('Error fetching stores data:', error);
      toast.error('Failed to load stores data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWithdrawals = async () => {
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        orderBy('createdAt', 'desc')
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
      const withdrawals = withdrawalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWithdrawalHistory(withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      toast.error('Failed to load withdrawal history');
    }
  };

  // Get current stores for pagination
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(indexOfFirstStore, indexOfLastStore);
  const totalPages = Math.ceil(filteredStores.length / storesPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stores Revenue</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#FF1B6B] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      {/* Stores List */}
      <div className="grid gap-6 mb-6">
        {currentStores.map(store => (
          <div 
            key={store.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{store.storeName}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Store ID: {store.id}</p>
                  {store.country?.code && (
                    <img 
                      src={`https://flagcdn.com/${store.country.code.toLowerCase()}.svg`}
                      alt={store.country.name || "Store country flag"}
                      className="w-3.5 h-2.5 object-cover rounded-[2px] shadow-sm"
                    />
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                store.verificationStatus === 'approved' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
              }`}>
                {store.verificationStatus === 'approved' ? 'Verified' : 'Unverified'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="All Time Revenue"
                value={`$${store.metrics.allTimeRevenue.toFixed(2)}`}
                icon={BiDollarCircle}
                subtitle={
                  <span className="flex items-center gap-1">
                    <span>Withdrawn: ${store.metrics.totalWithdrawn.toFixed(2)}</span>
                    {store.metrics.pendingWithdrawals > 0 && (
                      <span className="text-yellow-600">
                        (-${store.metrics.pendingWithdrawals.toFixed(2)} pending)
                      </span>
                    )}
                  </span>
                }
              />
              <StatCard
                title="Net Revenue"
                value={`$${store.metrics.netRevenue.toFixed(2)}`}
                icon={BiDollarCircle}
                trend={store.metrics.revenueChange}
              />
              <StatCard
                title="Total Orders"
                value={store.metrics.totalOrders}
                icon={BiPackage}
                trend={store.metrics.ordersChange}
              />
              <StatCard
                title="Total Customers"
                value={store.metrics.totalCustomers}
                icon={BiUser}
                trend={store.metrics.customersChange}
              />
            </div>

            {/* Withdrawal History */}
            <div className="mt-6">
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent store card click
                  setSelectedStore(selectedStore === store.id ? null : store.id);
                }}
                className="w-full flex items-center justify-between mb-4 text-gray-900 dark:text-white hover:text-[#FF1B6B] dark:hover:text-[#FF1B6B] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BiHistory className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Withdrawal History</h3>
                </div>
                <BiChevronDown 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    selectedStore === store.id ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              <AnimatePresence>
                {selectedStore === store.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-4 py-3">Store Name</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Token</th>
                            <th className="px-4 py-3">Network</th>
                            <th className="px-4 py-3">Wallet Address</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {store.withdrawalHistory.map(withdrawal => (
                            <tr key={withdrawal.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{store.storeName}</td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                {withdrawal.createdAt ? 
                                  withdrawal.createdAt.toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                  : 'No date available'
                                }
                              </td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${withdrawal.amount.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {withdrawal.token === 'USDC' ? (
                                    <img 
                                      src="/usdc.png"
                                      alt="USDC"
                                      className="w-4 h-4 object-contain"
                                    />
                                  ) : (
                                    <img 
                                      src="/usdt.png"
                                      alt="USDT"
                                      className="w-4 h-4 object-contain"
                                    />
                                  )}
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {withdrawal.token || 'USDT'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {withdrawal.network === 'polygon' ? (
                                    <img 
                                      src="/polygon.png"
                                      alt="Polygon"
                                      className="w-4 h-4 object-contain"
                                    />
                                  ) : withdrawal.network === 'unichain' ? (
                                    <img 
                                      src="/unichain-logo.png"
                                      alt="Unichain"
                                      className="w-4 h-4 object-contain"
                                    />
                                  ) : null}
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {withdrawal.network}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <BiWallet className="w-4 h-4 text-[#FF1B6B]" />
                                  <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                                    {withdrawal.walletAddress.slice(0, 6)}...{withdrawal.walletAddress.slice(-4)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  withdrawal.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                }`}>
                                  {withdrawal.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {store.withdrawalHistory.length === 0 && (
                            <tr>
                              <td colSpan="7" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                No withdrawal history
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination with dark mode support */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BiChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${
                currentPage === number
                  ? 'bg-[#FF1B6B] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default StoresRevenue; 