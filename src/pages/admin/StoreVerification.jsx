import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import toast from 'react-hot-toast';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';

const StoreVerification = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const sellersRef = collection(db, 'sellers');
      const q = query(sellersRef, where('verificationRequested', '==', true));
      const querySnapshot = await getDocs(q);
      
      const sellersData = [];
      for (const doc of querySnapshot.docs) {
        const seller = { id: doc.id, ...doc.data() };
        
        // Get seller's reviews
        const reviewsRef = collection(db, 'reviews');
        const reviewsQuery = query(reviewsRef, where('sellerId', '==', doc.id));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        
        const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        
        sellersData.push({
          ...seller,
          reviewCount: reviews.length,
          averageRating: avgRating
        });
      }
      
      setSellers(sellersData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerReviews = async (sellerId) => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef, 
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleVerifyStore = async (sellerId, approve) => {
    try {
      if (approve) {
        await updateDoc(doc(db, 'sellers', sellerId), {
          verificationStatus: 'approved',
          verificationDate: new Date().toISOString(),
          rejectedAt: null,
          rejectionReason: null
        });
      } else {
        setSelectedSellerId(sellerId);
        setShowRejectModal(true);
        return;
      }
      
      // Update local state
      setSellers(sellers.map(seller => 
        seller.id === sellerId 
          ? { 
              ...seller, 
              verificationStatus: approve ? 'approved' : 'rejected',
              rejectionReason: approve ? null : rejectionReason 
            }
          : seller
      ));
      
      toast.success(`Store ${approve ? 'verified' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating store verification:', error);
      toast.error('Failed to update store verification');
    }
  };

  const handleReject = async () => {
    if (!selectedSellerId || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await updateDoc(doc(db, 'sellers', selectedSellerId), {
        verificationStatus: 'rejected',
        verificationDate: new Date().toISOString(),
        rejectedAt: new Date(),
        rejectionReason: rejectionReason.trim(),
        rejectionCooldown: 72 // 3 days cooldown
      });

      // Update local state
      setSellers(sellers.map(seller => 
        seller.id === selectedSellerId 
          ? { 
              ...seller, 
              verificationStatus: 'rejected',
              rejectionReason: rejectionReason.trim() 
            }
          : seller
      ));

      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedSellerId(null);
      toast.success('Store verification rejected');
    } catch (error) {
      console.error('Error rejecting store:', error);
      toast.error('Failed to reject store verification');
    }
  };

  const filteredSellers = sellers.filter(seller => 
    seller.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Store Verification Requests</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sellers List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Stores</h2>
          <div className="space-y-4">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                onClick={() => {
                  setSelectedSeller(seller);
                  fetchSellerReviews(seller.id);
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedSeller?.id === seller.id
                    ? 'border-[#FF1B6B] bg-pink-50'
                    : 'border-gray-200 hover:border-[#FF1B6B] hover:bg-pink-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{seller.storeName}</h3>
                    <p className="text-sm text-gray-500">{seller.email}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= seller.averageRating
                                ? 'text-[#FF1B6B]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  {seller.verificationStatus === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyStore(seller.id, true);
                        }}
                        className="hover:opacity-80"
                      >
                        <VerificationCheckmark />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerifyStore(seller.id, false);
                        }}
                        className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    seller.verificationStatus === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : seller.verificationStatus === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {seller.verificationStatus || 'pending'}
                  </span>
                </div>
              </div>
            ))}
            {filteredSellers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No verification requests found
              </div>
            )}
          </div>
        </div>

        {/* Reviews Panel */}
        {selectedSeller && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">{selectedSeller.storeName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedSeller.averageRating
                          ? 'text-[#FF1B6B]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900">
                  {selectedSeller.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({selectedSeller.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.userName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'text-[#FF1B6B]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review}</p>
                  {review.image && (
                    <img
                      src={review.image}
                      alt="Review"
                      className="mt-2 rounded-lg w-24 h-24 object-cover cursor-pointer"
                      onClick={() => window.open(review.image, '_blank')}
                    />
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm text-gray-500">{review.productName}</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Verification Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF1B6B]"
                rows="4"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedSellerId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={!rejectionReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreVerification; 