import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiExternalLink, FiCopy, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function AdminRecentWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = localStorage.getItem('admin-theme') || 'light';

  useEffect(() => {
    fetchRecentWithdrawals();
  }, []);

  useEffect(() => {
    if (withdrawals.length > 0) {
      const filtered = withdrawals.filter(withdrawal => {
        const searchLower = searchQuery.toLowerCase();
        return (
          withdrawal.storeName.toLowerCase().includes(searchLower) ||
          withdrawal.walletAddress.toLowerCase().includes(searchLower) ||
          withdrawal.transactionHash?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredWithdrawals(filtered);
    }
  }, [searchQuery, withdrawals]);

  const fetchRecentWithdrawals = async () => {
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        orderBy('processedAt', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(withdrawalsQuery);
      
      // Fetch all unique seller IDs
      const sellerIds = [...new Set(snapshot.docs.map(doc => doc.data().sellerId))];
      
      // Fetch seller details in parallel
      const sellerDetailsPromises = sellerIds.map(sellerId => 
        getDoc(doc(db, 'sellers', sellerId))
      );
      const sellerDetailsSnapshots = await Promise.all(sellerDetailsPromises);
      
      // Create a map of seller details
      const sellerDetailsMap = {};
      sellerDetailsSnapshots.forEach(sellerDoc => {
        if (sellerDoc.exists()) {
          sellerDetailsMap[sellerDoc.id] = sellerDoc.data();
        }
      });

      // Map withdrawals with seller details
      const withdrawalData = await Promise.all(snapshot.docs.map(async doc => {
        const data = doc.data();
        const sellerDetails = sellerDetailsMap[data.sellerId] || {};
        
        return {
          id: doc.id,
          ...data,
          storeName: sellerDetails.storeName || 'Unknown Store',
          storeAvatar: sellerDetails.avatarUrl || null,
          explorerUrl: getExplorerUrl(data.network, data.transactionHash)
        };
      }));

      setWithdrawals(withdrawalData);
    } catch (error) {
      console.error('Error fetching recent withdrawals:', error);
      toast.error('Failed to fetch recent withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (network, txHash) => {
    if (!txHash) return '';
    return network === 'unichain' 
      ? `https://sepolia.uniscan.xyz/tx/${txHash}`
      : `https://polygonscan.com/tx/${txHash}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Recent Withdrawals
            </h2>
            <div className="relative w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by store, wallet or tx..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent`}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Store</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>From</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>To</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Network</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Transaction</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {(searchQuery ? filteredWithdrawals : withdrawals).map((withdrawal) => (
                <tr key={withdrawal.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {withdrawal.storeAvatar ? (
                        <img 
                          src={withdrawal.storeAvatar} 
                          alt={withdrawal.storeName}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FF1B6B] bg-opacity-10 flex items-center justify-center mr-3">
                          <span className="text-[#FF1B6B] text-sm font-medium">
                            {withdrawal.storeName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {withdrawal.storeName}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div className="flex items-center">
                      <img 
                        src={`/logos/${withdrawal.token.toLowerCase()}.png`}
                        alt={withdrawal.token}
                        className="w-5 h-5 mr-2"
                      />
                      {withdrawal.amount} {withdrawal.token}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-[100px]">{withdrawal.contractAddress}</span>
                      <button
                        onClick={() => copyToClipboard(withdrawal.contractAddress)}
                        className="text-[#FF1B6B] hover:text-[#D4145A]"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-[100px]">{withdrawal.walletAddress}</span>
                      <button
                        onClick={() => copyToClipboard(withdrawal.walletAddress)}
                        className="text-[#FF1B6B] hover:text-[#D4145A]"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    <div className="flex items-center">
                      <img 
                        src={withdrawal.network === 'unichain' ? '/unichain-logo.png' : '/polygon.png'}
                        alt={withdrawal.network}
                        className="w-5 h-5 mr-2"
                      />
                      {withdrawal.network === 'unichain' ? 'Unichain' : 'Polygon'}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                    {withdrawal.transactionHash ? (
                      <a
                        href={withdrawal.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-[#FF1B6B] hover:text-[#D4145A]"
                      >
                        <span className="truncate max-w-[100px]">{withdrawal.transactionHash}</span>
                        <FiExternalLink className="ml-1 w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(withdrawal.processedAt?.toDate()).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(searchQuery ? filteredWithdrawals : withdrawals).length === 0 && (
            <div className={`py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchQuery ? 'No withdrawals found matching your search' : 'No recent withdrawals'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 