import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';

export default function AdminRecentWithdrawals() {
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentWithdrawals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(withdrawalsQuery);
      const withdrawals = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || null,
          processedAt: data.processedAt?.toDate?.() || null
        };
      }).filter(Boolean);

      setRecentWithdrawals(withdrawals);
    } catch (err) {
      console.error('Error fetching recent withdrawals:', err);
      setError('Failed to fetch recent withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentWithdrawals();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Withdrawals
        </h2>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Withdrawals
        </h2>
        <div className="text-red-500 dark:text-red-400 text-center">{error}</div>
      </div>
    );
  }

  if (!recentWithdrawals || recentWithdrawals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Withdrawals
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400">No recent withdrawals</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Withdrawals
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Network</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {recentWithdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {withdrawal.timestamp ? new Date(withdrawal.timestamp).toLocaleString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {withdrawal.amount?.toFixed(2) || '0.00'} {withdrawal.token || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex items-center">
                    <img 
                      src={`/logos/${withdrawal.token?.toLowerCase() || 'usdt'}.png`}
                      alt={withdrawal.token || 'Token'}
                      className="w-5 h-5 mr-2"
                    />
                    {withdrawal.token || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex items-center">
                    <img 
                      src={withdrawal.network === 'unichain' ? '/unichain-logo.png' : '/polygon.png'}
                      alt={withdrawal.network || 'Network'}
                      className="w-5 h-5 mr-2"
                    />
                    {withdrawal.network === 'unichain' ? 'Unichain Testnet' : 'Polygon'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    withdrawal.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : withdrawal.status === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {withdrawal.status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {withdrawal.transactionHash ? (
                    <a 
                      href={`${withdrawal.network === 'unichain' 
                        ? 'https://unichain-sepolia.blockscout.com/tx/'
                        : 'https://polygonscan.com/tx/'
                      }${withdrawal.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF1B6B] hover:text-[#D4145A] dark:text-[#FF1B6B] dark:hover:text-[#D4145A]"
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
    </div>
  );
} 