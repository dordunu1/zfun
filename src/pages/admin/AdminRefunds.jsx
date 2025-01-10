import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, getDoc, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { FiAlertTriangle, FiCheck, FiX, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { getMerchPlatformContract, SUPPORTED_TOKENS } from '../../contracts/MerchPlatform';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF";

const TransactionHashModal = ({ isOpen, onClose, onSubmit, refundRequest }) => {
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!txHash.trim()) {
      toast.error('Please enter the transaction hash');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(txHash);
      onClose();
    } catch (error) {
      console.error('Error submitting transaction hash:', error);
      toast.error('Failed to submit transaction hash');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Transaction Hash</h2>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertTriangle className="text-blue-500 text-lg mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Refund Details</p>
              <p className="text-sm text-blue-700 mt-1">
                Amount: ${refundRequest.amount.toFixed(2)} {refundRequest.order.paymentMethod.token}
              </p>
              <p className="text-sm text-blue-700">
                To: {refundRequest.paymentAddress.slice(0, 6)}...{refundRequest.paymentAddress.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Hash
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF1B6B] focus:border-[#FF1B6B]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting
                ? 'bg-[#FF1B6B] opacity-50 cursor-not-allowed'
                : 'bg-[#FF1B6B] hover:bg-[#D4145A]'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit & Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminRefunds() {
  const { isAdmin } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [refundRequests, setRefundRequests] = useState([]);
  const [refundHistory, setRefundHistory] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showTxHashModal, setShowTxHashModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 10;
  const theme = localStorage.getItem('admin-theme') || 'light';

  useEffect(() => {
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
      fetchRefundRequests();
    } else {
      setLoading(false);
    }
  }, [walletConnected, walletAddress]);

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

  const fetchRefundRequests = async () => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) return;
    try {
      // Fetch pending requests
      const pendingQuery = query(
        collection(db, 'refundRequests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      
      // Fetch completed refunds (approved or rejected)
      const historyQuery = query(
        collection(db, 'refundRequests'),
        where('status', 'in', ['approved', 'rejected']),
        orderBy('processedAt', 'desc')
      );
      const historySnapshot = await getDocs(historyQuery);
      
      // Process pending requests
      const pendingData = await Promise.all(pendingSnapshot.docs.map(async refundDoc => {
        const data = refundDoc.data();
        const orderRef = doc(db, 'orders', data.orderId);
        const orderDoc = await getDoc(orderRef);
        return {
          id: refundDoc.id,
          ...data,
          order: orderDoc.exists() ? { id: orderDoc.id, ...orderDoc.data() } : null,
          createdAt: data.createdAt?.toDate()
        };
      }));

      // Process history requests
      const historyData = await Promise.all(historySnapshot.docs.map(async refundDoc => {
        const data = refundDoc.data();
        const orderRef = doc(db, 'orders', data.orderId);
        const orderDoc = await getDoc(orderRef);
        
        // Fetch buyer info
        const buyerRef = doc(db, 'users', data.buyerId);
        const buyerDoc = await getDoc(buyerRef);
        const buyerData = buyerDoc.exists() ? buyerDoc.data() : null;

        // Fetch seller info
        const sellerRef = doc(db, 'sellers', data.sellerId);
        const sellerDoc = await getDoc(sellerRef);
        const sellerData = sellerDoc.exists() ? sellerDoc.data() : null;

        return {
          id: refundDoc.id,
          ...data,
          order: orderDoc.exists() ? { id: orderDoc.id, ...orderDoc.data() } : null,
          buyerName: buyerData?.name || 'Unknown Buyer',
          sellerName: sellerData?.storeName || sellerData?.name || 'Unknown Seller',
          createdAt: data.createdAt?.toDate(),
          processedAt: data.processedAt?.toDate()
        };
      }));

      setRefundRequests(pendingData);
      setRefundHistory(historyData);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      toast.error('Failed to fetch refund requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefundWithdrawal = async (refundRequest) => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      toast.error('Please connect your admin wallet');
      return;
    }

    try {
      // Get the order details to get the numeric orderId
      const orderDoc = await getDoc(doc(db, 'orders', refundRequest.orderId));
      if (!orderDoc.exists()) {
        toast.error('Order not found');
        return;
      }
      const orderData = orderDoc.data();
      const numericOrderId = orderData.numericOrderId;
      if (!numericOrderId) {
        console.error('Missing numericOrderId in order:', orderData);
        toast.error('Order ID not found. This might be an old order.');
        return;
      }

      // Get the buyer's address from the order data
      const buyerAddress = orderData.paymentMethod?.buyerWallet;
      console.log('Raw buyer address from order:', buyerAddress);
      
      // Try to format the address
      let formattedBuyerAddress;
      try {
        formattedBuyerAddress = ethers.getAddress(buyerAddress); // This will format the address to checksum format
        console.log('Formatted buyer address:', formattedBuyerAddress);
      } catch (error) {
        console.error('Error formatting buyer address:', error);
        toast.error('Invalid buyer wallet address format');
        return;
      }

      if (!ethers.isAddress(formattedBuyerAddress)) {
        console.error('Address validation failed:', {
          original: buyerAddress,
          formatted: formattedBuyerAddress
        });
        toast.error('Invalid buyer wallet address in order');
        return;
      }

      // Debug log all relevant data
      console.log('Full refund details:', {
        numericOrderId,
        buyerAddress: formattedBuyerAddress,
        orderData,
        refundRequest,
        network: orderData.paymentMethod?.network,
        token: orderData.paymentMethod?.token
      });

      // Get seller's wallet address from sellers collection
      const sellerDoc = await getDoc(doc(db, 'sellers', refundRequest.sellerId));
      if (!sellerDoc.exists()) {
        toast.error('Seller not found');
        return;
      }

      const sellerAddress = sellerDoc.data().walletAddress;
      if (!ethers.isAddress(sellerAddress)) {
        console.error('Invalid seller address:', sellerAddress);
        toast.error('Invalid seller wallet address');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = refundRequest.order.paymentMethod.network;
      const networkId = network.toString();
      const token = refundRequest.order.paymentMethod.token;

      // Get token address from SUPPORTED_TOKENS mapping
      const tokenAddress = SUPPORTED_TOKENS[networkId]?.[token];
      if (!tokenAddress) {
        toast.error(`Unsupported token ${token} on network ${networkId}`);
        return;
      }

      // Get contract instance
      const contract = await getMerchPlatformContract(provider, networkId);
      if (!contract) {
        toast.error('Failed to get contract instance');
        return;
      }

      const contractWithSigner = contract.connect(signer);

      // Round to 6 decimal places and convert to string to avoid floating point issues
      const roundedAmount = Number(refundRequest.amount).toFixed(6);
      console.log('Rounded refund amount:', roundedAmount);

      // Parse refund amount with 6 decimals (USDT/USDC standard)
      const refundAmount = ethers.parseUnits(roundedAmount, 6);
      console.log('Parsed refund amount:', refundAmount.toString());

      // Show pending toast
      const pendingToast = toast.loading('Processing refund...');

      // Debug log
      console.log('Processing refund with params:', {
        orderId: numericOrderId,
        buyerAddress: formattedBuyerAddress,
        sellerAddress,
        refundAmount: refundAmount.toString(),
        token,
        network: networkId,
        roundedAmount
      });

      // Call the processRefund function with numeric orderId
      const tx = await contractWithSigner.processRefund(
        numericOrderId,
        formattedBuyerAddress,
        sellerAddress,
        refundAmount
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Create withdrawal record in Firestore
      await addDoc(collection(db, 'withdrawals'), {
        sellerId: refundRequest.sellerId,
        amount: Number(roundedAmount), // Use the rounded amount
        token: token,
        fee: 0,
        netAmount: Number(roundedAmount), // Use the rounded amount
        status: 'completed',
        walletAddress: formattedBuyerAddress,
        network: network === 1301 ? 'unichain' : 'polygon',
        timestamp: serverTimestamp(),
        requestedAt: Date.now(),
        completedAt: Date.now(),
        transactionHash: tx.hash,
        refundRequestId: refundRequest.id,
        type: 'refund'
      });

      // Update refund request status
      await updateDoc(doc(db, 'refundRequests', refundRequest.id), {
        status: 'approved',
        processedAt: serverTimestamp(),
        transactionHash: tx.hash
      });

      // Update order status
      await updateDoc(doc(db, 'orders', refundRequest.orderId), {
        status: 'refunded'
      });

      // Update seller's revenue data
      const sellerRevenueRef = doc(db, 'sellers', refundRequest.sellerId);
      const sellerRevenueDoc = await getDoc(sellerRevenueRef);
      
      if (sellerRevenueDoc.exists()) {
        const currentRevenue = sellerRevenueDoc.data().netRevenue || 0;
        const currentMonthlyRevenue = sellerRevenueDoc.data().monthlyRevenue || {};
        
        // Get the current month and year
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        
        // Update monthly revenue
        const monthlyRevenue = { ...currentMonthlyRevenue };
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) - Number(roundedAmount);

        await updateDoc(sellerRevenueRef, {
          netRevenue: Math.max(0, currentRevenue - Number(roundedAmount)), // Ensure it doesn't go below 0
          monthlyRevenue,
          lastUpdated: serverTimestamp()
        });

        console.log('Updated seller revenue:', {
          previousRevenue: currentRevenue,
          refundAmount: Number(roundedAmount),
          newRevenue: Math.max(0, currentRevenue - Number(roundedAmount))
        });
      }

      toast.dismiss(pendingToast);
      toast.success('Refund processed successfully');
      
      // Refresh the refund requests list
      fetchRefundRequests();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(
        error.message.includes('user rejected') 
          ? 'Transaction was rejected'
          : error.message || 'Failed to process refund'
      );
    }
  };

  const handleSubmitTransactionHash = async (txHash) => {
    try {
      // Update refund request status in Firestore
      await updateDoc(doc(db, 'refundRequests', selectedRefund.id), {
        status: 'approved',
        processedAt: new Date(),
        transactionHash: txHash
      });

      // Update order status
      await updateDoc(doc(db, 'orders', selectedRefund.orderId), {
        status: 'refunded'
      });

      // Update withdrawal status
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('refundRequestId', '==', selectedRefund.id),
        limit(1)
      );
      const withdrawalSnapshot = await getDocs(withdrawalsQuery);
      if (!withdrawalSnapshot.empty) {
        await updateDoc(doc(db, 'withdrawals', withdrawalSnapshot.docs[0].id), {
          status: 'completed',
          completedAt: new Date(),
          completionTxHash: txHash
        });
      }

      toast.success('Refund approved successfully');
      fetchRefundRequests();
    } catch (error) {
      console.error('Error updating refund status:', error);
      throw error;
    }
  };

  const handleRejectRefund = async (refundId) => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      toast.error('Please connect your admin wallet');
      return;
    }

    try {
      await updateDoc(doc(db, 'refundRequests', refundId), {
        status: 'rejected',
        processedAt: new Date()
      });
      toast.success('Refund request rejected');
      fetchRefundRequests();
    } catch (error) {
      console.error('Error rejecting refund:', error);
      toast.error('Failed to reject refund request');
    }
  };

  // Get current items for history pagination
  const indexOfLastHistory = historyPage * itemsPerPage;
  const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
  const currentHistory = refundHistory.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalHistoryPages = Math.ceil(refundHistory.length / itemsPerPage);

  // Change history page
  const paginateHistory = (pageNumber) => setHistoryPage(pageNumber);

  // Reset pages when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setHistoryPage(1);
  }, [activeTab]);

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
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
          Please connect your admin wallet to access the refunds page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FF1B6B]">Refunds Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-[#FF1B6B] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-[#FF1B6B] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Refunds History
          </button>
        </div>
      </div>
      
      {activeTab === 'pending' ? (
        // Existing Pending Requests Section
        refundRequests.length === 0 ? (
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center`}>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No pending refund requests</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {refundRequests.map((request) => (
              <div
                key={request.id}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Order #{request.orderId.slice(-6)}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Requested on {request.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestRefundWithdrawal(request)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                    >
                      <FiDollarSign className="w-4 h-4" />
                      Request Withdrawal
                    </button>
                    <button
                      onClick={() => handleRejectRefund(request.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Buyer ID:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {request.buyerId}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Seller ID:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {request.sellerId}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Refund Amount:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        ${request.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Payment Address:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} break-all`}>
                        {request.paymentAddress}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Token:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {request.order?.paymentMethod?.token}
                      </span>
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Network:
                      </span>
                      <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                        {request.order?.paymentMethod?.network === 1301 ? 'Unichain' : 'Polygon'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Refunds History Section
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          {refundHistory.length === 0 ? (
            <div className="p-6 text-center">
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No refund history found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200`}>
                    {currentHistory.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{refund.orderId.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.buyerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.sellerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${refund.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            refund.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {refund.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.order?.paymentMethod?.token}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.order?.paymentMethod?.network === 1301 ? 'Unichain' : 'Polygon'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.processedAt.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.transactionHash ? (
                            <a
                              href={`${refund.order?.paymentMethod?.network === 1301 
                                ? 'https://explorer.unichain.network'
                                : 'https://polygonscan.com'}/tx/${refund.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF1B6B] hover:text-[#D4145A]"
                            >
                              View
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalHistoryPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200">
                  <div className="flex gap-1">
                    {Array.from({ length: totalHistoryPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginateHistory(i + 1)}
                        className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                          historyPage === i + 1
                            ? 'bg-[#FF1B6B] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <TransactionHashModal
        isOpen={showTxHashModal}
        onClose={() => {
          setShowTxHashModal(false);
          setSelectedRefund(null);
        }}
        onSubmit={handleSubmitTransactionHash}
        refundRequest={selectedRefund}
      />
    </div>
  );
} 