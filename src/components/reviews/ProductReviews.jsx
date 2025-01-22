import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiStar, BiImage, BiX } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa';
import { collection, query, where, getDocs, addDoc, orderBy, getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const StarRating = ({ rating, setRating, isInteractive = true }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => isInteractive && setRating(star)}
          className={`${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!isInteractive}
        >
          <FaStar
            className={`w-6 h-6 ${
              star <= rating ? 'text-[#FF1B6B]' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useMerchAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image must be less than 2MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get user's orders for this product
      const ordersQuery = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        where('status', '==', 'delivered')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      // Find the specific order that contains this product
      const validOrder = ordersSnapshot.docs.find(doc => 
        doc.data().items.some(item => item.productId === productId)
      );

      if (!validOrder) {
        toast.error('You can only review products you have purchased and received');
        setIsSubmitting(false);
        return;
      }

      // Get product details to fetch sellerId
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (!productDoc.exists()) {
        toast.error('Product not found');
        setIsSubmitting(false);
        return;
      }
      const productData = productDoc.data();

      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `reviews/${productId}/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Create the review data object with sellerId
      const reviewData = {
        productId,
        userId: user.uid,
        sellerId: productData.sellerId, // Add sellerId
        rating,
        review: review.trim(),
        image: imageUrl,
        createdAt: new Date(),
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        productName: productData.name, // Add product name for better admin insights
        orderDate: validOrder.data().createdAt, // Add order date for verification purposes
        verificationStatus: 'pending' // Add verification status field
      };

      // Add the review to Firestore
      await addDoc(collection(db, 'reviews'), reviewData);
      
      // Update seller's average rating
      const sellerRef = doc(db, 'sellers', productData.sellerId);
      const sellerDoc = await getDoc(sellerRef);
      if (sellerDoc.exists()) {
        const sellerData = sellerDoc.data();
        const currentRating = sellerData.statistics?.rating || 0;
        const totalReviews = sellerData.statistics?.totalReviews || 0;
        
        const newRating = ((currentRating * totalReviews) + rating) / (totalReviews + 1);
        
        await updateDoc(sellerRef, {
          'statistics.rating': newRating,
          'statistics.totalReviews': totalReviews + 1,
          updatedAt: new Date()
        });
      }
      
      toast.success('Review submitted successfully');
      onReviewAdded();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <BiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF1B6B] focus:border-[#FF1B6B]"
                rows="4"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Image (optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <BiImage className="w-5 h-5" />
                    <span className="text-sm">Choose Image</span>
                  </div>
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <BiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rating}
                className="px-4 py-2 text-sm font-medium text-white bg-[#FF1B6B] hover:bg-[#D4145A] rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-4xl w-full">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <BiX className="w-8 h-8" />
          </button>
          <img
            src={imageUrl}
            alt="Review"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useMerchAuth();
  const [averageRating, setAverageRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const { isDarkMode } = useTheme();

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setReviews(reviewsData);

      // Calculate average rating
      if (reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        setAverageRating(avgRating);
      }

      // Check if user can review
      if (user) {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('buyerId', '==', user.uid),
          where('status', '==', 'delivered')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const hasValidOrder = ordersSnapshot.docs.some(doc => 
          doc.data().items.some(item => item.productId === productId)
        );
        
        const hasReviewed = reviewsData.some(review => review.userId === user.uid);
        setCanReview(hasValidOrder && !hasReviewed);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.getElementById('reviews-section').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <div className="mt-8" id="reviews-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-[#FF1B6B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                {averageRating.toFixed(1)}
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {canReview && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF1B6B] hover:bg-[#D4145A] rounded-lg"
          >
            Write a Review
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No reviews yet
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {currentReviews.map((review) => (
              <div key={review.id} className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b pb-6 last:border-b-0 last:pb-0`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {review.userName}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      · {review.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'text-[#FF1B6B]' : isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {review.review}
                </p>
                {review.image && (
                  <button
                    onClick={() => setSelectedImage(review.image)}
                    className="mt-3 block"
                  >
                    <img
                      src={review.image}
                      alt="Review"
                      className="rounded-lg w-32 h-32 object-cover hover:opacity-90 transition-opacity"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    currentPage === index + 1
                      ? 'bg-[#FF1B6B] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onReviewAdded={fetchReviews}
      />

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default ProductReviews; 