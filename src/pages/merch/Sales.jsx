import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiDollarCircle, BiPackage, BiUser, BiTrendingUp, BiCheck, BiDownload } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

const StatCard = ({ title, value, icon: Icon, trend, subtitle, secondaryValue }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white p-4 rounded-2xl shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
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
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-2 bg-pink-50 rounded-lg">
        <Icon className="w-5 h-5 text-[#FF1B6B]" />
      </div>
    </div>
  </motion.div>
);

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

const SalesSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <div className="w-48 h-8">
        <SkeletonPulse />
      </div>
      <div className="w-64 h-5">
        <SkeletonPulse />
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="w-32 h-5">
                <SkeletonPulse />
              </div>
              <div className="w-40 h-8">
                <SkeletonPulse />
              </div>
              <div className="w-24 h-4">
                <SkeletonPulse />
              </div>
            </div>
            <div className="w-12 h-12">
              <SkeletonPulse />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Orders Table Skeleton */}
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="w-48 h-6 mb-4">
        <SkeletonPulse />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              {['Order ID', 'Customer', 'Products', 'Total', 'Date', 'Status'].map((header) => (
                <th key={header} className="pb-3">
                  <div className="w-24 h-4">
                    <SkeletonPulse />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="py-3">
                  <div className="w-20 h-5">
                    <SkeletonPulse />
                  </div>
                </td>
                <td className="py-3">
                  <div className="w-32 h-5">
                    <SkeletonPulse />
                  </div>
                </td>
                <td className="py-3">
                  <div className="w-24 h-5">
                    <SkeletonPulse />
                  </div>
                </td>
                <td className="py-3">
                  <div className="w-24 h-5">
                    <SkeletonPulse />
                  </div>
                </td>
                <td className="py-3">
                  <div className="w-32 h-5">
                    <SkeletonPulse />
                  </div>
                </td>
                <td className="py-3">
                  <div className="w-20 h-6">
                    <SkeletonPulse />
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

const Sales = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    allOrders: [],
    allTimeRevenue: 0,
    totalWithdrawn: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;

  useEffect(() => {
    fetchSalesData();
  }, [user]);

  const fetchSalesData = async () => {
    try {
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const ordersQuery = query(
        collection(db, 'orders'),
        where('sellerId', '==', user.sellerId),
        orderBy('createdAt', 'desc')
      );

      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('sellerId', '==', user.sellerId),
        where('status', '==', 'completed')
      );

      const [ordersSnapshot, withdrawalsSnapshot] = await Promise.all([
        getDocs(ordersQuery),
        getDocs(withdrawalsQuery)
      ]);

      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate metrics for this month and last month
      const thisMonthOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate();
        return orderDate >= firstDayThisMonth;
      });

      const lastMonthOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate();
        return orderDate >= firstDayLastMonth && orderDate <= lastDayLastMonth;
      });

      // Calculate revenues
      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled' && order.status !== 'refunded') {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);

      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled' && order.status !== 'refunded') {
          return sum + (order.total || 0);
        }
        return sum;
      }, 0);

      // Calculate unique customers
      const thisMonthCustomers = new Set(thisMonthOrders.map(order => order.buyerId)).size;
      const lastMonthCustomers = new Set(lastMonthOrders.map(order => order.buyerId)).size;

      // Calculate percentage changes
      const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const revenueChange = calculatePercentageChange(thisMonthRevenue, lastMonthRevenue);
      const ordersChange = calculatePercentageChange(thisMonthOrders.length, lastMonthOrders.length);
      const customersChange = calculatePercentageChange(thisMonthCustomers, lastMonthCustomers);

      // Calculate total withdrawn amount
      const totalWithdrawn = withdrawalsSnapshot.docs.reduce((sum, doc) => {
        const withdrawal = doc.data();
        return sum + (withdrawal.amount || 0);
      }, 0);

      // Filter out cancelled orders and handle refunds for revenue calculation
      const validOrders = orders.filter(order => order.status !== 'cancelled');
      const grossRevenue = validOrders.reduce((sum, order) => {
        // If order is refunded, don't include it in revenue
        if (order.status === 'refunded') {
          return sum;
        }
        return sum + order.total;
      }, 0);

      // Calculate total refunds
      const totalRefunds = validOrders.reduce((sum, order) => {
        if (order.status === 'refunded') {
          return sum + order.total;
        }
        return sum;
      }, 0);

      // Calculate statistics
      const uniqueCustomers = new Set(validOrders.map(order => order.buyerId)).size;

      // Calculate all time revenue (current revenue + withdrawn amount)
      const allTimeRevenue = grossRevenue + totalWithdrawn;

      setSalesData({
        totalRevenue: grossRevenue,
        grossRevenue: grossRevenue,
        totalRefunds: totalRefunds,
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers,
        recentOrders: orders.slice(0, 5),
        allOrders: orders,
        allTimeRevenue: allTimeRevenue,
        totalWithdrawn: totalWithdrawn,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        customersChange: parseFloat(customersChange.toFixed(1))
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = salesData.allOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(salesData.allOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToExcel = () => {
    try {
      // Prepare monthly summary data
      const monthlySummary = {
        'Monthly Summary': [{
          Month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          'All Time Revenue': salesData.allTimeRevenue.toFixed(2),
          'Net Revenue (Current Month)': salesData.totalRevenue.toFixed(2),
          'Total Orders': salesData.totalOrders,
          'Total Customers': salesData.totalCustomers,
          'Total Withdrawn': salesData.totalWithdrawn.toFixed(2),
          'Total Refunds': salesData.totalRefunds.toFixed(2),
          'Revenue Change': `${salesData.revenueChange}%`,
          'Orders Change': `${salesData.ordersChange}%`,
          'Customers Change': `${salesData.customersChange}%`
        }]
      };

      // Prepare detailed sales data
      const detailedSales = salesData.allOrders.map(order => ({
        'Order ID': `#${order.id.slice(-6)}`,
        'Date': new Date(order.createdAt?.toDate()).toLocaleString(),
        'Customer Name': order.buyerInfo?.name || 'Anonymous',
        'Customer Email': order.buyerInfo?.email || 'N/A',
        'Items Count': order.items.reduce((total, item) => total + (item.quantity || 0), 0),
        'Products': order.items.map(item => `${item.name} (${item.quantity})`).join(', '),
        'Status': order.status,
        'Subtotal': order.total.toFixed(2),
        'Shipping Fee': order.items.reduce((total, item) => total + (item.shippingFee || 0), 0).toFixed(2),
        'Total': order.total.toFixed(2)
      }));

      // Create workbook with multiple sheets
      const wb = XLSX.utils.book_new();
      
      // Add Monthly Summary sheet
      const summaryWs = XLSX.utils.json_to_sheet(monthlySummary['Monthly Summary']);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Monthly Summary');
      
      // Add Detailed Sales sheet
      const detailsWs = XLSX.utils.json_to_sheet(detailedSales);
      XLSX.utils.book_append_sheet(wb, detailsWs, 'Detailed Sales');

      // Generate filename with current date
      const date = new Date();
      const filename = `sales_report_${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, filename);
      toast.success('Sales report downloaded successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to download sales report');
    }
  };

  if (loading) {
    return <SalesSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen flex flex-col"
    >
      {/* Fixed Header Section */}
      <div className="sticky top-0 bg-[#FFF5F7] z-10 pt-4 pb-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sales Overview</h1>
              <p className="text-sm text-gray-500">Monitor your store's performance</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
            >
              <BiDownload className="w-5 h-5" />
              <span>Export Sales</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="All Time Revenue"
            value={`$${salesData.allTimeRevenue.toFixed(2)}`}
            icon={BiDollarCircle}
            subtitle={`Withdrawn: $${salesData.totalWithdrawn.toFixed(2)}`}
          />
          <StatCard
            title="Net Revenue"
            value={`$${salesData.totalRevenue.toFixed(2)}`}
            icon={BiDollarCircle}
            trend={salesData.revenueChange}
            secondaryValue={salesData.totalRefunds > 0 ? `$${salesData.totalRefunds.toFixed(2)}` : undefined}
          />
          <StatCard
            title="Total Orders"
            value={salesData.totalOrders}
            icon={BiPackage}
            trend={salesData.ordersChange}
          />
          <StatCard
            title="Total Customers"
            value={salesData.totalCustomers}
            icon={BiUser}
            trend={salesData.customersChange}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        <div className="max-w-5xl mx-auto">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Orders</h2>
            {salesData.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b">
                      <th className="pb-2 font-medium">Order ID</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Products</th>
                      <th className="pb-2 font-medium">Total</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {salesData.recentOrders.map((order) => (
                      <tr key={order.id} className="text-sm">
                        <td className="py-3 text-gray-900">#{order.id.slice(-6)}</td>
                        <td className="py-3 text-gray-900">{order.buyerInfo?.name || 'Anonymous'}</td>
                        <td className="py-3 text-gray-500">
                          {order.items.reduce((total, item) => total + (item.quantity || 0), 0)} items
                        </td>
                        <td className="py-3 text-gray-900">${order.total.toFixed(2)}</td>
                        <td className="py-3 text-gray-500">
                          {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped' || order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                            {(order.status === 'delivered') && <BiCheck className="w-4 h-4" />}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-3">No orders yet</p>
            )}
          </div>

          {/* All Sales with Pagination */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">All Sales</h2>
            {currentOrders.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="pb-2 font-medium">Order ID</th>
                        <th className="pb-2 font-medium">Customer</th>
                        <th className="pb-2 font-medium">Products</th>
                        <th className="pb-2 font-medium">Total</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentOrders.map((order) => (
                        <tr key={order.id} className="text-sm">
                          <td className="py-3 text-gray-900">#{order.id.slice(-6)}</td>
                          <td className="py-3 text-gray-900">{order.buyerInfo?.name || 'Anonymous'}</td>
                          <td className="py-3 text-gray-500">
                            {order.items.reduce((total, item) => total + (item.quantity || 0), 0)} items
                          </td>
                          <td className="py-3 text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="py-3 text-gray-500">
                            {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'shipped' || order.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : order.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                              {(order.status === 'delivered') && <BiCheck className="w-4 h-4" />}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-3 flex justify-center">
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'bg-[#FF1B6B] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-3">No sales data available</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sales; 