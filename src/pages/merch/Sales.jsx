import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiDollarCircle, BiPackage, BiUser, BiTrendingUp, BiCheck, BiDownload } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const StatCard = ({ title, value, icon: Icon, trend, subtitle, secondaryValue, withdrawals }) => {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl shadow-sm relative group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mt-1`}>{value}</p>
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
            <div className="relative">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 cursor-help`}>{subtitle}</p>
              {withdrawals && (
                <div className={`absolute left-0 bottom-full mb-2 w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg p-3 text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Withdrawals</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Completed:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>${withdrawals.completed.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Pending:</span>
                      <span className="font-medium">${withdrawals.pending.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between font-medium pt-1 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>Total:</span>
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>${(withdrawals.completed + withdrawals.pending).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`p-2 ${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'} rounded-lg`}>
          <Icon className="w-5 h-5 text-[#FF1B6B]" />
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonPulse = () => {
  const { isDarkMode } = useTheme();
  return (
    <motion.div
      className={`w-full h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}
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
};

const SalesSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
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
          <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm`}>
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
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm`}>
        <div className="w-48 h-6 mb-4">
          <SkeletonPulse />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {['Order ID', 'Customer', 'Products', 'Total', 'Date', 'Status'].map((header) => (
                  <th key={header} className="pb-3">
                    <div className="w-24 h-4">
                      <SkeletonPulse />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
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
};

const ProductDistributionChart = ({ orders }) => {
  const { isDarkMode } = useTheme();
  const productDistribution = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name]++;
    });
    return acc;
  }, {});

  // Get top 4 products instead of 9
  const topProducts = Object.entries(productDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const data = {
    labels: topProducts.map(([name]) => name),
    datasets: [{
      data: topProducts.map(([,count]) => count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.9)',   // Pink
        'rgba(99, 102, 241, 0.9)',   // Indigo
        'rgba(245, 158, 11, 0.9)',   // Amber
        'rgba(16, 185, 129, 0.9)',   // Emerald
      ],
      borderWidth: 0,
      borderRadius: 2,
      spacing: 2
    }]
  };

  const options = {
    cutout: '85%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkMode ? '#374151' : 'white',
        titleColor: isDarkMode ? '#F3F4F6' : '#111827',
        bodyColor: isDarkMode ? '#F3F4F6' : '#111827',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} sold`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    layout: {
      padding: 0
    }
  };

  const totalSold = topProducts.reduce((sum, [,count]) => sum + count, 0);

  return (
    <div className={`relative h-[140px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-2`}>
      {/* Chart container */}
      <div className="h-[100px]">
        <Doughnut data={data} options={options} />
      </div>
      
      {/* Total in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {totalSold}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
        </div>
      </div>
      
      {/* Legends below chart */}
      <div className="absolute bottom-0 left-0 right-0 px-2">
        <div className="flex flex-wrap justify-center gap-3">
          {topProducts.map(([name, count], index) => (
            <div key={name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ 
                backgroundColor: data.datasets[0].backgroundColor[index] 
              }}></span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate max-w-[60px]`} title={name}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopProducts = ({ orders, isDarkMode }) => {
  const productStats = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = {
          count: 0,
          price: item.price,
          image: item.image
        };
      }
      acc[item.name].count++;
    });
    return acc;
  }, {});

  const topProducts = Object.entries(productStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="space-y-2">
      {topProducts.map(([name, data]) => (
        <div key={name} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            {data.image && (
              <img src={data.image} alt={name} className="w-6 h-6 rounded object-cover" />
            )}
            <div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} truncate max-w-[120px]`} title={name}>{name}</p>
              <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.count} sold</p>
            </div>
          </div>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>${data.price}</span>
        </div>
      ))}
    </div>
  );
};

// Add Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-1 mt-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        ←
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`w-6 h-6 text-xs rounded-full ${
            currentPage === i + 1
              ? 'bg-pink-100 text-pink-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        →
      </button>
    </div>
  );
};

// Update RecentSoldProducts component
const RecentSoldProducts = ({ orders, isDarkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const recentProducts = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.name] || new Date(order.createdAt.toDate()) > new Date(acc[item.name].soldDate)) {
        acc[item.name] = {
          name: item.name,
          price: item.price,
          image: item.image,
          soldDate: order.createdAt.toDate()
        };
      }
    });
    return acc;
  }, {});

  const allProducts = Object.values(recentProducts)
    .sort((a, b) => b.soldDate - a.soldDate);

  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        {currentProducts.map((product, index) => (
          <div key={index} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-2 flex items-center gap-2`}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} truncate`} title={product.name}>
                {product.name}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(product.soldDate).toLocaleDateString()}
                </span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  ${product.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const Sales = () => {
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    allOrders: [],
    allTimeRevenue: 0,
    totalWithdrawn: 0,
    pendingWithdrawals: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('Monthly');
  const [productStats, setProductStats] = useState([25, 30, 20, 25]); // Example distribution

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#374151' : 'white',
        titleColor: isDarkMode ? '#F3F4F6' : '#111827',
        bodyColor: isDarkMode ? '#F3F4F6' : '#111827',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: isDarkMode ? '#9CA3AF' : '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            if (value >= 1000) {
              return '$' + (value/1000) + 'k';
            }
            return '$' + value;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchSalesData();
    }
  }, [user, selectedTimeframe]);

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
        where('sellerId', '==', user.sellerId)
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

      // Calculate completed and pending withdrawals
      const withdrawalsByStatus = withdrawalsSnapshot.docs.reduce((acc, doc) => {
        const withdrawal = doc.data();
        if (withdrawal.status === 'completed') {
          acc.completed += withdrawal.amount || 0;
        } else if (withdrawal.status === 'pending') {
          acc.pending += withdrawal.amount || 0;
        }
        return acc;
      }, { completed: 0, pending: 0 });

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

      // Calculate all time revenue (total revenue earned, regardless of withdrawals)
      const allTimeRevenue = grossRevenue;

      // Net revenue is all time revenue minus completed withdrawals
      const netRevenue = Math.max(0, grossRevenue - withdrawalsByStatus.completed);

      // Prepare data for the revenue chart
      const dates = [];
      const revenues = [];

      if (selectedTimeframe === 'Monthly') {
        // Get last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dates.push(date.toLocaleDateString('default', { month: 'short', day: 'numeric' }));
          
          const dayRevenue = orders.reduce((sum, order) => {
            const orderDate = order.createdAt?.toDate();
            if (orderDate && 
                orderDate.getDate() === date.getDate() &&
                orderDate.getMonth() === date.getMonth() &&
                orderDate.getFullYear() === date.getFullYear() &&
                order.status !== 'cancelled' &&
                order.status !== 'refunded') {
              return sum + (order.total || 0);
            }
            return sum;
          }, 0);
          
          revenues.push(dayRevenue);
        }
      } else {
        // Weekly view - last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          dates.push(date.toLocaleDateString('default', { weekday: 'short' }));
          
          const dayRevenue = orders.reduce((sum, order) => {
            const orderDate = order.createdAt?.toDate();
            if (orderDate && 
                orderDate.getDate() === date.getDate() &&
                orderDate.getMonth() === date.getMonth() &&
                orderDate.getFullYear() === date.getFullYear() &&
                order.status !== 'cancelled' &&
                order.status !== 'refunded') {
              return sum + (order.total || 0);
            }
            return sum;
          }, 0);
          
          revenues.push(dayRevenue);
        }
      }

      setRevenueData({
        labels: dates,
        datasets: [
          {
            data: revenues,
            fill: true,
            backgroundColor: 'rgba(255, 27, 107, 0.1)',
            borderColor: 'rgb(255, 27, 107)',
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: 'rgb(255, 27, 107)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2
          }
        ]
      });

      setSalesData({
        totalRevenue: netRevenue, // This is now net revenue (after withdrawals)
        grossRevenue: grossRevenue,
        totalRefunds: totalRefunds,
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers,
        recentOrders: orders.slice(0, 5),
        allOrders: orders,
        allTimeRevenue: allTimeRevenue, // This is the total revenue earned
        totalWithdrawn: withdrawalsByStatus.completed,
        pendingWithdrawals: withdrawalsByStatus.pending,
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
      const exportData = salesData.allOrders.map(order => ({
        'Order ID': order.id,
        'Product': order.items.map(item => item.name).join(', '),
        'Customer': order.buyerInfo?.name || 'Anonymous',
        'Price': order.total,
        'Date': new Date(order.createdAt?.toDate()).toLocaleDateString(),
        'Status': order.status
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
      XLSX.writeFile(wb, "sales_data.xlsx");
      toast.success('Sales data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export sales data');
    }
  };

  if (loading) {
    return <SalesSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Sales Overview</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monitor your store's performance</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
            >
              <BiDownload className="w-5 h-5" />
              <span>Export Sales</span>
            </button>
          </div>

          {/* Revenue Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Card */}
            <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Total Revenue</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>${salesData.grossRevenue.toFixed(2)}</span>
                    {salesData.revenueChange > 0 && (
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded-full">
                        ↑ {salesData.revenueChange}%
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Gained ${salesData.grossRevenue - (salesData.lastMonthRevenue || 0)} this month
                  </p>
                </div>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className={`px-3 py-1.5 text-sm border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-200' 
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="h-[200px]">
                <Line data={revenueData} options={chartOptions} />
              </div>
            </div>

            {/* Product Distribution Card */}
            <div className="lg:col-span-1">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4`}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Products Sold Chart */}
                  <div>
                    <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Products Sold</h2>
                    <div className="h-[140px]">
                      <ProductDistributionChart orders={salesData.allOrders} />
                    </div>
                  </div>

                  {/* Top Products */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Top Products</h2>
                      <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>See all</button>
                    </div>
                    <TopProducts orders={salesData.allOrders} isDarkMode={isDarkMode} />
                  </div>
                </div>

                {/* Recent Sold Products Grid */}
                <RecentSoldProducts orders={salesData.allOrders} isDarkMode={isDarkMode} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="All Time Revenue"
              value={`$${salesData.allTimeRevenue.toFixed(2)}`}
              icon={BiDollarCircle}
              subtitle={`Withdrawn: $${salesData.totalWithdrawn.toFixed(2)}`}
              withdrawals={{
                completed: salesData.totalWithdrawn,
                pending: salesData.pendingWithdrawals
              }}
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

          {/* Recent Orders */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Recent Orders</h2>
                <div className="flex items-center gap-2">
                  <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}>
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-sm ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-50'}`}>
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="py-3 px-4 font-medium">Product</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                  {currentOrders.slice(0, 10).map((order) => (
                    <tr key={order.id} className={`text-sm ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {order.items[0]?.image && (
                            <img
                              src={order.items[0].image}
                              alt={order.items[0].name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{order.items[0]?.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{order.buyerInfo?.name || 'Anonymous'}</td>
                      <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>${order.total.toFixed(2)}</td>
                      <td className={`py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentOrders.length === 0 ? (
                <div className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No orders yet</div>
              ) : (
                <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(salesData.allOrders.length / 10)}
                    onPageChange={paginate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sales; 