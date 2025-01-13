import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import toast from 'react-hot-toast';
import VerificationCheckmark from '../../components/shared/VerificationCheckmark';

const SellerSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex justify-between items-start">
      <div className="w-full">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-2"></div>
        </div>
      </div>
      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>
  </motion.div>
);

const ReviewSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="border-b border-gray-100 dark:border-gray-700 pb-4"
  >
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="mt-2 flex items-center gap-2">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>
  </motion.div>
);

const StoreVerification = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'verified'
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    fetchSellers();
    // Clear selected seller when switching views
    setSelectedSeller(null);
    setReviews([]);
  }, [viewMode]); // Refetch when view mode changes

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle Firestore timestamp
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Handle ISO string or Date object
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const sellersRef = collection(db, 'sellers');
      const q = query(
        sellersRef, 
        where('verificationStatus', '==', viewMode),
        orderBy('storeName', 'asc') // Add ordering for consistency
      );
      const querySnapshot = await getDocs(q);
      
      // Get all seller IDs first
      const sellerIds = querySnapshot.docs.map(doc => doc.id);
      
      // Batch fetch all reviews in one query
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(
        reviewsRef, 
        where('sellerId', 'in', sellerIds.length ? sellerIds : ['dummy']),
        orderBy('createdAt', 'desc')
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      // Group reviews by seller ID
      const reviewsBySeller = {};
      reviewsSnapshot.docs.forEach(doc => {
        const review = { id: doc.id, ...doc.data() };
        if (!reviewsBySeller[review.sellerId]) {
          reviewsBySeller[review.sellerId] = [];
        }
        reviewsBySeller[review.sellerId].push(review);
      });
      
      // Map sellers with their reviews
      const sellersData = querySnapshot.docs.map(doc => {
        const seller = { id: doc.id, ...doc.data() };
        const sellerReviews = reviewsBySeller[doc.id] || [];
        const totalRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = sellerReviews.length > 0 ? totalRating / sellerReviews.length : 0;
        
        return {
          ...seller,
          reviewCount: sellerReviews.length,
          averageRating: avgRating,
          reviews: sellerReviews // Store reviews with seller data
        };
      });
      
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
      setIsLoadingReviews(true);
      // Find the seller in our existing data
      const seller = sellers.find(s => s.id === sellerId);
      if (seller && seller.reviews) {
        // Use cached reviews if available
        setReviews(seller.reviews);
        return;
      }

      // Fallback to fetching if not cached
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
    } finally {
      setIsLoadingReviews(false);
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"
            />
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['Pending', 'Verified', 'Rejected'].map((text) => (
                <motion.div 
                  key={text}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded-md mx-1"
                />
              ))}
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <motion.div 
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"
            />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <SellerSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <motion.div 
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"
            />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <ReviewSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {viewMode === 'pending' 
              ? 'Store Verification Requests' 
              : viewMode === 'approved' 
                ? 'Verified Stores'
                : 'Rejected Stores'
            }
          </h1>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'pending'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setViewMode('approved')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'approved'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setViewMode('rejected')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'rejected'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sellers List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {viewMode === 'pending' 
              ? 'Pending Requests' 
              : viewMode === 'approved' 
                ? 'Verified Stores'
                : 'Rejected Stores'
            }
          </h2>
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
                    ? 'border-[#FF1B6B] bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#FF1B6B] hover:bg-pink-50 dark:hover:bg-pink-900/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{seller.storeName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{seller.email}</p>
                    {viewMode === 'approved' && seller.verificationDate && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Verified on {formatTimestamp(seller.verificationDate)}
                      </p>
                    )}
                    {viewMode === 'rejected' && seller.rejectedAt && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Rejected on {formatTimestamp(seller.rejectedAt)}
                        </p>
                        {seller.rejectionReason && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                            Reason: {seller.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= seller.averageRating
                                ? 'text-[#FF1B6B]'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  {viewMode === 'pending' && (
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
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  {viewMode === 'approved' && (
                    <VerificationCheckmark />
                  )}
                  {viewMode === 'rejected' && (
                    <FiX className="w-6 h-6 text-red-500 dark:text-red-400" />
                  )}
                </div>
              </div>
            ))}
            {filteredSellers.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {viewMode === 'pending' 
                  ? 'No verification requests found'
                  : 'No verified stores found'
                }
              </div>
            )}
          </div>
        </div>

        {/* Reviews Panel */}
        {selectedSeller && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSeller.storeName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedSeller.averageRating
                          ? 'text-[#FF1B6B]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedSeller.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({selectedSeller.reviewCount} reviews)
                </span>
              </div>
            </div>

            {isLoadingReviews ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <ReviewSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.userName}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-[#FF1B6B]' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.review}</p>
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">{review.productName}</span>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No reviews yet
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reject Verification Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
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