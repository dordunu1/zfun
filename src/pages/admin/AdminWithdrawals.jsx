import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiCheck, FiX, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { NETWORK_NAMES } from '../../contracts/MerchPlatform';
import { getMerchPlatformContract } from '../../contracts/MerchPlatform';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const theme = localStorage.getItem('admin-theme') || 'light';

  useEffect(() => {
    if (isConnected) {
      fetchWithdrawals();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchWithdrawals = async () => {
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(withdrawalsQuery);
      const withdrawalData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWithdrawals(withdrawalData);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawal) => {
    if (!isConnected) return;
    setProcessingId(withdrawal.id);

    try {
      // Get the network for this withdrawal
      const network = withdrawal.network || (withdrawal.token === 'USDT' ? '1301' : '137');
      const chainId = Number(network);

      // Switch network if needed
      if (chain?.id !== chainId) {
        await switchNetwork(chainId);
      }

      // Get contract for this network
      const contract = await getMerchPlatformContract(chainId);
      if (!contract) {
        throw new Error('Could not get contract instance');
      }

      // Convert amount to proper decimals (6 for USDT/USDC)
      const amount = ethers.parseUnits(withdrawal.amount.toString(), 6);

      // Get token address
      const tokenAddress = withdrawal.token === 'USDT' 
        ? (chainId === 1301 ? import.meta.env.VITE_UNICHAIN_USDT_ADDRESS : import.meta.env.VITE_USDT_ADDRESS_POLYGON)
        : (chainId === 1301 ? import.meta.env.VITE_UNICHAIN_USDC_ADDRESS : import.meta.env.VITE_USDC_ADDRESS_POLYGON);

      console.log('Approving withdrawal:', {
        seller: withdrawal.walletAddress,
        token: tokenAddress,
        amount: amount.toString(),
        formatted: ethers.formatUnits(amount, 6)
      });

      // Approve withdrawal on-chain
      const tx = await contract.approveWithdrawal(
        withdrawal.walletAddress,
        tokenAddress,
        amount
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Update status in Firestore
      await updateDoc(doc(db, 'withdrawals', withdrawal.id), {
        status: 'approved',
        processedAt: new Date(),
        transactionHash: tx.hash
      });

      toast.success('Withdrawal approved successfully');
      fetchWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error(error.message || 'Failed to approve withdrawal');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId) => {
    if (!isConnected) return;
    try {
      await updateDoc(doc(db, 'withdrawals', withdrawalId), {
        status: 'rejected',
        processedAt: new Date()
      });
      toast.success('Withdrawal rejected');
      fetchWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast.error('Failed to reject withdrawal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FiAlertTriangle className="w-16 h-16 text-[#FF1B6B] mb-4" />
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Access Denied</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>Please connect your admin wallet to access the withdrawals page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#FF1B6B] mb-6">Withdrawal Requests</h1>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
        {withdrawals.length === 0 ? (
          <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No pending withdrawal requests
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Seller</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Token</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Network</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Wallet</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Requested</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {withdrawals.map((withdrawal) => {
                const network = withdrawal.network || (withdrawal.token === 'USDT' ? '1301' : '137');
                const networkName = NETWORK_NAMES[network] || 'Unknown Network';
                
                return (
                  <tr key={withdrawal.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{withdrawal.sellerName}</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{withdrawal.sellerId}</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {withdrawal.amount}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {withdrawal.token}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                      {networkName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {withdrawal.walletAddress}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(withdrawal.timestamp?.toDate()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {processingId === withdrawal.id ? (
                        <button
                          disabled
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#FF1B6B] opacity-50 cursor-not-allowed"
                        >
                          <FiLoader className="mr-1 animate-spin" />
                          Processing...
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(withdrawal)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B]"
                          >
                            <FiCheck className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiX className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 