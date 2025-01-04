import React, { useState, useEffect } from 'react';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Navigate } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';

const ADMIN_WALLET = "0x34B5e3B8465e0A4b40b4D0819C1eB6c38E160b33";

export default function AdminDashboard() {
  const { isAdmin } = useMerchAuth();
  const { address: account } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeSellers: 0,
    pendingWithdrawals: 0,
    platformBalance: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const theme = localStorage.getItem('admin-theme') || 'light';

  useEffect(() => {
    if (account) {
      fetchDashboardData();
    }
  }, [account]);

  const handleConnectWallet = async () => {
    try {
      await disconnect();
      const connector = new MetaMaskConnector({
        options: {
          shimDisconnect: true,
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      });
      await connect({ connector });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const sellersQuery = query(collection(db, 'users'), where('isSeller', '==', true));
      const sellersSnapshot = await getDocs(sellersQuery);
      
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );
      const withdrawalsSnapshot = await getDocs(withdrawalsQuery);

      const activityQuery = query(
        collection(db, 'activity'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const activitySnapshot = await getDocs(activityQuery);

      setStats({
        totalSales: 0,
        activeSellers: sellersSnapshot.size,
        pendingWithdrawals: withdrawalsSnapshot.size,
        platformBalance: 0
      });

      setRecentActivity(
        activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/merch-store" replace />;
  }

  if (!account) {
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

  if (account.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>This wallet does not have admin privileges</p>
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
      <h1 className="text-2xl font-bold text-[#FF1B6B] mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Sales</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${stats.totalSales.toFixed(2)}</p>
            </div>
            <FiDollarSign className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Sellers</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.activeSellers}</p>
            </div>
            <FiUsers className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Pending Withdrawals</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.pendingWithdrawals}</p>
            </div>
            <FiCreditCard className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg border-l-4 border-[#FF1B6B]`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Platform Balance</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.platformBalance} USDT</p>
            </div>
            <FiShoppingBag className="text-3xl text-[#FF1B6B]" />
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pb-4`}
              >
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{activity.type}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{activity.description}</p>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(activity.timestamp?.toDate()).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 