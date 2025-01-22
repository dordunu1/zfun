import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiXCircle, FiExternalLink } from 'react-icons/fi';

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

const RefundsSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <div className="space-y-4">
            <div className="w-48 h-6">
              <SkeletonPulse />
            </div>
            <div className="w-32 h-4">
              <SkeletonPulse />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-24 h-4">
                  <SkeletonPulse />
                </div>
                <div className="w-36 h-4">
                  <SkeletonPulse />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-28 h-4">
                  <SkeletonPulse />
                </div>
                <div className="w-32 h-4">
                  <SkeletonPulse />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return <FiCheckCircle className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <FiXCircle className="w-5 h-5 text-red-500" />;
    default:
      return <FiClock className="w-5 h-5 text-yellow-500" />;
  }
};

const getStatusColor = (status, isDarkMode) => {
  switch (status) {
    case 'approved':
      return isDarkMode 
        ? 'bg-[#FF1B6B]/20 border border-[#FF1B6B]/30 text-[#FF1B6B]'
        : 'bg-[#FF1B6B]/10 border border-[#FF1B6B]/20 text-[#FF1B6B]';
    case 'rejected':
      return isDarkMode
        ? 'bg-red-900/20 border border-red-800/30 text-red-400'
        : 'bg-red-50 border border-red-200 text-red-700';
    default:
      return isDarkMode
        ? 'bg-yellow-900/20 border border-yellow-800/30 text-yellow-400'
        : 'bg-yellow-50 border border-yellow-200 text-yellow-700';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Processing';
  }
};

export default function Refunds() {
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      fetchRefunds();
    }
  }, [user]);

  const fetchRefunds = async () => {
    try {
      const refundsQuery = query(
        collection(db, 'refundRequests'),
        where('buyerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(refundsQuery);
      const refundsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        processedAt: doc.data().processedAt?.toDate()
      }));
      setRefunds(refundsData);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refund history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <RefundsSkeleton />;
  }

  return (
    <div className={`max-w-2xl mx-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Buyers Refunds</h1>

      {refunds.length === 0 ? (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 text-center`}>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No refund requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {refunds.map((refund) => (
            <div key={refund.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${isDarkMode ? 'border-gray-700 hover:border-[#FF1B6B]' : 'border-gray-100 hover:border-[#FF1B6B]'} transition-colors duration-200`}>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Order #{refund.orderId.slice(-6)}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(refund.status, isDarkMode)}`}>
                        {getStatusIcon(refund.status)}
                        {getStatusText(refund.status)}
                      </span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Requested on {refund.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className={`${isDarkMode ? 'bg-[#FF1B6B]/10' : 'bg-[#FF1B6B]/5'} p-3 rounded-lg`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Amount</span>
                      </div>
                      <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        ${refund.amount.toFixed(2)} <span className="text-[#FF1B6B]">{refund.orderDetails.paymentMethod.token}</span>
                      </p>
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Payment Address</span>
                      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-2 rounded-lg`}>
                        <code className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} break-all font-mono`}>
                          {refund.paymentAddress}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Network</span>
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {refund.orderDetails.paymentMethod.network === 1301 ? 'Unichain' : 'Polygon'}
                        </span>
                      </div>
                    </div>
                    
                    {refund.status === 'approved' && refund.transactionHash && (
                      <div>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Transaction Hash</span>
                        <div className={`${isDarkMode ? 'bg-[#FF1B6B]/10 border-[#FF1B6B]/20' : 'bg-[#FF1B6B]/5 border-[#FF1B6B]/10'} border p-2 rounded-lg`}>
                          <div className="flex items-center justify-between">
                            <code className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-mono truncate`}>
                              {refund.transactionHash}
                            </code>
                            <a
                              href={`${refund.orderDetails.paymentMethod.network === 1301 
                                ? 'https://unichain-sepolia.blockscout.com/tx/'
                                : 'https://polygonscan.com/tx/'
                              }${refund.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 flex items-center gap-1 text-[#FF1B6B] hover:text-[#D4145A] transition-colors"
                            >
                              <span className="text-xs font-medium">View</span>
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {refund.status !== 'pending' && (
                      <div>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>Processed on</span>
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {refund.processedAt.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 