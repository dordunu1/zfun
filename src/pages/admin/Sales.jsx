import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Sales() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    uniqueCustomers: 0,
    sellers: [],
    recentOrders: []
  });
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [tokenSalesTotals, setTokenSalesTotals] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewType, setViewType] = useState('list');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const ordersPerPage = 50;
  const theme = localStorage.getItem('admin-theme') || 'light';

  const calculateTokenTotals = (orders) => {
    return orders.reduce((acc, order) => {
      const tokenSymbol = order.paymentMethod?.token || 'Unknown';
      if (!acc[tokenSymbol]) {
        acc[tokenSymbol] = 0;
      }
      acc[tokenSymbol] += order.total;
      return acc;
    }, {});
  };

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
    if (stats.recentOrders.length > 0) {
      let filtered = stats.recentOrders;
      
      if (selectedSeller !== 'all') {
        filtered = filtered.filter(order => order.sellerName === selectedSeller);
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filtered = filtered.filter(order => (
          order.id.toLowerCase().includes(searchLower) ||
          (order.buyerInfo?.name || '').toLowerCase().includes(searchLower) ||
          (order.sellerName || '').toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower)
        ));
      }

      setFilteredOrders(filtered);
      setTokenSalesTotals(calculateTokenTotals(filtered));
    }
  }, [searchQuery, stats.recentOrders, selectedSeller]);

  const fetchSalesData = async () => {
    try {
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
        return orderData;
      }));

      setHasMore(orders.length === ordersPerPage);

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const uniqueCustomers = new Set(orders.map(order => order.buyerId)).size;
      const averageOrderValue = totalRevenue / orders.length;

      // Get unique sellers from orders
      const uniqueSellers = [...new Set(orders.map(order => order.sellerName))].map(name => ({
        name,
        id: name // Using name as ID since we're filtering by store name
      })).filter(seller => seller.name); // Filter out undefined/null names

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        averageOrderValue,
        uniqueCustomers,
        sellers: uniqueSellers,
        recentOrders: orders
      });
      setFilteredOrders(orders);

    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#FF1B6B] mb-6">Sales Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ${stats.totalRevenue.toFixed(2)}
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {stats.totalOrders} orders
          </p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stats.totalOrders}
          </p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Average Order Value</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ${stats.averageOrderValue.toFixed(2)}
          </p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Unique Customers</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stats.uniqueCustomers}
          </p>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Sales Overview</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === 'list'
                    ? 'bg-[#FF1B6B] text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewType === 'grid'
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

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
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

            <div className="relative w-64">
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className={`w-full pl-4 pr-10 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent`}
              >
                <option value="all">All Sellers</option>
                {stats.sellers.map((seller) => (
                  <option key={seller.id} value={seller.name}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Token Sales Summary
            </h3>
            <div className="space-y-2">
              {Object.entries(tokenSalesTotals).map(([token, total]) => (
                <div key={token} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {token !== 'Unknown' && (
                      <img 
                        src={`/${token.toLowerCase()}.png`}
                        alt={token}
                        className="w-5 h-5 object-contain"
                      />
                    )}
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {token}
                    </span>
                  </div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {viewType === 'list' ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Order ID</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Customer</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Seller</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Items</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Token</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Amount</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider sticky top-0 bg-inherit`}>Network</th>
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
                          <div className="flex items-center gap-2">
                            {order.paymentMethod?.token && (
                              <img 
                                src={`/${order.paymentMethod.token.toLowerCase()}.png`}
                                alt={order.paymentMethod.token}
                                className="w-5 h-5 object-contain"
                              />
                            )}
                            {order.paymentMethod?.token || 'Unknown'}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={order.paymentMethod?.network === 1301 ? "/unichain-logo.png" : "/polygon.png"} 
                              alt={order.paymentMethod?.network === 1301 ? "Unichain" : "Polygon"} 
                              className="w-4 h-4 object-contain" 
                            />
                            {order.paymentMethod?.network === 1301 ? 'Unichain' : 'Polygon'}
                          </div>
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
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
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

                  <div className="border-t border-b border-gray-200 py-3 space-y-2">
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
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Token</span>
                      <div className="flex items-center gap-2">
                        {order.paymentMethod?.token && (
                          <img 
                            src={`/${order.paymentMethod.token.toLowerCase()}.png`}
                            alt={order.paymentMethod.token}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {order.payment?.token?.symbol || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Network</span>
                      <div className="flex items-center gap-2">
                        <img 
                          src={order.paymentMethod?.network === 1301 ? "/unichain-logo.png" : "/polygon.png"} 
                          alt={order.paymentMethod?.network === 1301 ? "Unichain" : "Polygon"} 
                          className="w-4 h-4 object-contain" 
                        />
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                          {order.paymentMethod?.network === 1301 ? 'Unichain' : 'Polygon'}
                        </span>
                      </div>
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
      </div>
    </div>
  );
} 