import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { FiAlertCircle } from 'react-icons/fi';

export default function SellerRefunds() {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [refundRequests, setRefundRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const refundsPerPage = 10;

  useEffect(() => {
    if (user?.sellerId) {
      fetchRefundRequests();
    }
  }, [user]);

  const fetchRefundRequests = async () => {
    try {
      const refundsQuery = query(
        collection(db, 'refundRequests'),
        where('sellerId', '==', user.sellerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(refundsQuery);
      
      // Fetch order details and buyer info for each refund request
      const refundData = await Promise.all(snapshot.docs.map(async refundDoc => {
        const data = refundDoc.data();
        
        try {
          // Fetch order to get buyer info
          const orderRef = doc(db, 'orders', data.orderId);
          const orderDoc = await getDoc(orderRef);
          const orderData = orderDoc.data();
          
          return {
            id: refundDoc.id,
            ...data,
            buyerName: orderData?.buyerInfo?.name || orderData?.buyerId || 'Anonymous',
            createdAt: data.createdAt?.toDate(),
            processedAt: data.processedAt?.toDate()
          };
        } catch (orderError) {
          console.error('Error fetching order:', orderError);
          return {
            id: refundDoc.id,
            ...data,
            buyerName: data.buyerId || 'Anonymous',
            createdAt: data.createdAt?.toDate(),
            processedAt: data.processedAt?.toDate()
          };
        }
      }));

      setRefundRequests(refundData);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      toast.error('Failed to fetch refund requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get current refunds
  const indexOfLastRefund = currentPage * refundsPerPage;
  const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
  const currentRefunds = refundRequests.slice(indexOfFirstRefund, indexOfLastRefund);
  const totalPages = Math.ceil(refundRequests.length / refundsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Buyers Refunds</h1>
        </div>

        {refundRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No refund requests found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested On
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processed On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRefunds.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{request.orderId.slice(-6)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {request.buyerName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ${request.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {request.createdAt.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {request.processedAt ? request.processedAt.toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200">
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
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
            )}
          </div>
        )}

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FiAlertCircle className="text-blue-500 text-base mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">About Refund Requests</p>
              <p className="text-sm text-blue-700 mt-1">
                Refund requests are automatically created when buyers request refunds for cancelled orders. 
                Our platform will process and handle these refunds, ensuring proper deduction from your account balance.
                The refunded amount will be automatically deducted from your total sales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 