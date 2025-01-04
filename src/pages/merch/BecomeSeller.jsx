import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BiStore, BiCheckCircle, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const [step, setStep] = useState(1);
  const listingFee = 49.99;

  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    description: '',
    contactEmail: '',
    phoneNumber: '',
    country: '',
    city: '',
    postalCode: '',
    shippingCountries: [],
    preferredToken: 'USDC'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSellerId = () => {
    // Generate a seller ID with prefix SELL_ and random numbers
    const randomNum = Math.floor(Math.random() * 100000);
    return `SELL_${randomNum.toString().padStart(6, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!user) {
        toast.error('Please login first');
        return;
      }

      // Generate a unique seller ID
      const sellerId = generateSellerId();

      // Create seller profile
      await setDoc(doc(db, 'sellers', sellerId), {
        sellerId,
        userId: user.uid,
        ...storeInfo,
        status: 'active',
        createdAt: serverTimestamp(),
        statistics: {
          totalSales: 0,
          totalOrders: 0,
          rating: 0
        },
        balance: {
          available: 0,
          pending: 0
        }
      });

      // Update user profile to mark as seller
      await updateDoc(doc(db, 'users', user.uid), {
        isSeller: true,
        sellerId,
        updatedAt: serverTimestamp()
      });

      // Reload user data to update the context
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Force a page reload to update the context
        window.location.href = '/merch-store/dashboard';
      }

      toast.success('Store created successfully!');
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Failed to create store. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-[#FF1B6B]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 ${step >= 1 ? 'border-[#FF1B6B] bg-pink-50' : 'border-gray-300'} flex items-center justify-center font-semibold transition-colors duration-300`}>
              1
            </div>
            <span className="ml-2">Payment</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-[#FF1B6B] transition-all duration-300"
              style={{ width: step > 1 ? '100%' : '0%' }}
            />
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-[#FF1B6B]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 ${step >= 2 ? 'border-[#FF1B6B] bg-pink-50' : 'border-gray-300'} flex items-center justify-center font-semibold transition-colors duration-300`}>
              2
            </div>
            <span className="ml-2">Store Info</span>
          </div>
        </div>
      </div>

      {/* Step 1: Payment */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <BiStore className="w-16 h-16 text-[#FF1B6B] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Become a Seller
            </h1>
            <p className="text-gray-600">
              Start selling your merchandise with a one-time listing fee
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-pink-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What's Included:
              </h2>
              <ul className="space-y-3">
                {[
                  'List unlimited products',
                  'Manage your orders easily',
                  'Secure payment processing',
                  'Direct customer communication',
                  'Flexible withdrawal options'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <BiCheckCircle className="w-5 h-5 text-[#FF1B6B] mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${listingFee}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  one-time fee
                </span>
              </div>
              
              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#FF1B6B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4145A] transition-colors duration-300"
              >
                Continue to Payment
              </button>
              
              <p className="mt-4 text-sm text-gray-500">
                Secure payment powered by Paystack
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Store Info */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-gray-600 hover:text-[#FF1B6B] mb-6 transition-colors"
          >
            <BiArrowBack className="w-5 h-5 mr-2" />
            Back to Payment
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Store Information</h2>
            <p className="text-gray-600">Tell us about your business</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Store Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={storeInfo.storeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  placeholder="Your store name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={storeInfo.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  placeholder="Tell customers about your store"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={storeInfo.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="contact@yourstore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={storeInfo.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={storeInfo.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="Your country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={storeInfo.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={storeInfo.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Payment Token *
                </label>
                <select
                  name="preferredToken"
                  value={storeInfo.preferredToken}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                >
                  <option value="USDC">USDC (USD Coin)</option>
                  <option value="USDT">USDT (Tether)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Token you want to receive payments in
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-[#FF1B6B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4145A] transition-colors duration-300"
              >
                Complete Registration
              </button>
              <p className="mt-4 text-sm text-gray-500 text-center">
                You can set up your payment withdrawal details later in your dashboard
              </p>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
} 