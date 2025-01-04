import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BiStore, BiUser, BiDollar, BiShield, BiCreditCard, BiPackage } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';

const SkeletonPulse = () => (
  <motion.div
    className="w-full h-full bg-gray-200 rounded-lg"
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

const SettingsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-2">
      <div className="w-32 h-8">
        <SkeletonPulse />
      </div>
      <div className="w-64 h-5">
        <SkeletonPulse />
      </div>
    </div>

    {/* Navigation Skeleton */}
    <div className="bg-white rounded-xl p-2 shadow-sm">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-32 h-10">
            <SkeletonPulse />
          </div>
        ))}
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-32 h-5">
              <SkeletonPulse />
            </div>
            <div className="w-full h-10">
              <SkeletonPulse />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="w-40 h-5">
          <SkeletonPulse />
        </div>
        <div className="w-full h-32">
          <SkeletonPulse />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-24 h-5">
              <SkeletonPulse />
            </div>
            <div className="w-full h-10">
              <SkeletonPulse />
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Section */}
      <div className="space-y-4">
        <div className="w-48 h-6">
          <SkeletonPulse />
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="w-32 h-5">
                <SkeletonPulse />
              </div>
              <div className="w-48 h-4">
                <SkeletonPulse />
              </div>
            </div>
            <div className="w-32 h-10">
              <SkeletonPulse />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <div className="w-full h-10">
          <SkeletonPulse />
        </div>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const { user } = useMerchAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [buyerProfile, setBuyerProfile] = useState({
    name: '',
    email: '',
    phone: '',
    walletAddress: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: '',
    description: '',
    contactEmail: '',
    phoneNumber: '',
    country: '',
    city: '',
    postalCode: '',
    shippingCountries: [],
    shippingFee: 0,
    preferredToken: 'USDC'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    withdrawalThreshold: 100,
    autoWithdraw: false
  });

  const [walletSettings, setWalletSettings] = useState({
    walletAddress: '',
    preferredToken: 'USDT'
  });

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Set default tab based on user type
        if (user.isSeller) {
          setActiveTab('store');
          await fetchSellerSettings();
        } else {
          setActiveTab('profile');
          await fetchBuyerProfile();
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    initializeSettings();
  }, [user]);

  const fetchBuyerProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBuyerProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          walletAddress: userData.walletAddress || '',
          shippingAddress: userData.shippingAddress || {
            street: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const fetchSellerSettings = async () => {
    if (!user?.sellerId) return;

    try {
      const sellerRef = doc(db, 'sellers', user.sellerId);
      const sellerDoc = await getDoc(sellerRef);
      
      if (!sellerDoc.exists()) {
        // Create initial seller document if it doesn't exist
        const initialSellerData = {
          sellerId: user.sellerId,
          userId: user.uid,
          storeName: '',
          description: '',
          contactEmail: user.email,
          phoneNumber: '',
          country: '',
          city: '',
          postalCode: '',
          shippingCountries: [],
          shippingFee: 0,
          preferredToken: 'USDC',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(sellerRef, initialSellerData);
        setStoreSettings(initialSellerData);
        setWalletSettings({
          walletAddress: '',
          preferredToken: initialSellerData.preferredToken
        });
      } else {
        const sellerData = sellerDoc.data();
        setStoreSettings(sellerData);
        setWalletSettings({
          walletAddress: sellerData.walletAddress || '',
          preferredToken: sellerData.preferredToken || 'USDC'
        });
      }
    } catch (error) {
      toast.error('Failed to load seller settings');
    }
  };

  const handleBuyerProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...buyerProfile,
        updatedAt: new Date()
      }, { merge: true });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleBuyerInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBuyerProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBuyerProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleWalletConnect = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      // Request user to select an account
      const accounts = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      }).then(() => 
        window.ethereum.request({
          method: 'eth_requestAccounts'
        })
      );
      
      if (accounts.length === 0) {
        toast.error('Please connect your wallet');
        return;
      }

      const walletAddress = accounts[0];
      setBuyerProfile(prev => ({
        ...prev,
        walletAddress
      }));

      await setDoc(doc(db, 'users', user.uid), {
        walletAddress,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Wallet connected successfully');
    } catch (error) {
      if (error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      setBuyerProfile(prev => ({
        ...prev,
        walletAddress: ''
      }));
      await setDoc(doc(db, 'users', user.uid), {
        walletAddress: '',
        updatedAt: new Date()
      }, { merge: true });
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      toast.error('Failed to disconnect wallet');
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'sellers', user.sellerId), {
        ...storeSettings,
        updatedAt: new Date()
      });
      toast.success('Store settings updated successfully');
    } catch (error) {
      toast.error('Failed to update store settings');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'sellers', user.sellerId), {
        ...paymentSettings,
        updatedAt: new Date()
      });
      toast.success('Payment settings updated successfully');
    } catch (error) {
      toast.error('Failed to update payment settings');
    }
  };

  const handleStoreInputChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConnectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      // Request user to select an account
      const accounts = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      }).then(() => 
        window.ethereum.request({
          method: 'eth_requestAccounts'
        })
      );
      
      if (accounts.length === 0) {
        toast.error('Please connect your wallet');
        return;
      }

      const walletAddress = accounts[0];
      setBuyerProfile(prev => ({
        ...prev,
        walletAddress
      }));

      await setDoc(doc(db, 'users', user.uid), {
        walletAddress,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Wallet connected successfully');
    } catch (error) {
      if (error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your {user?.isSeller ? 'store settings' : 'profile'} and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl p-2 shadow-sm">
        <nav className="flex gap-2">
          {user?.isSeller ? (
            // Seller Tabs
            [
              { id: 'store', label: 'Store Settings', icon: BiStore },
              { id: 'payment', label: 'Payment', icon: BiDollar },
              { id: 'account', label: 'Account', icon: BiUser },
              { id: 'security', label: 'Security', icon: BiShield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF1B6B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))
          ) : (
            // Buyer Tabs
            [
              { id: 'profile', label: 'Profile', icon: BiUser },
              { id: 'shipping', label: 'Shipping', icon: BiPackage },
              { id: 'security', label: 'Security', icon: BiShield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF1B6B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))
          )}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {user?.isSeller ? (
          // Seller Settings Content
          <>
            {activeTab === 'store' && (
              <form onSubmit={handleStoreSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={storeSettings.contactEmail}
                      onChange={handleStoreInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Description
                  </label>
                  <textarea
                    name="description"
                    value={storeSettings.description}
                    onChange={handleStoreInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={storeSettings.country}
                      onChange={handleStoreInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={storeSettings.city}
                      onChange={handleStoreInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={storeSettings.postalCode}
                      onChange={handleStoreInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Fee (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="shippingFee"
                          min="0"
                          step="0.01"
                          value={storeSettings.shippingFee}
                          onChange={handleStoreInputChange}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        This fee will be added to all orders from your store
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Payment Token
                      </label>
                      <select
                        name="preferredToken"
                        value={storeSettings.preferredToken}
                        onChange={handleStoreInputChange}
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
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            )}
            {activeTab === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={paymentSettings.bankName}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={paymentSettings.accountNumber}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        name="routingNumber"
                        value={paymentSettings.routingNumber}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={paymentSettings.accountHolderName}
                        onChange={handlePaymentInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Withdrawal Threshold (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="withdrawalThreshold"
                        min="0"
                        step="0.01"
                        value={paymentSettings.withdrawalThreshold}
                        onChange={handlePaymentInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum amount required for automatic withdrawal
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="autoWithdraw"
                      checked={paymentSettings.autoWithdraw}
                      onChange={handlePaymentInputChange}
                      className="w-4 h-4 text-[#FF1B6B] border-gray-300 rounded focus:ring-[#FF1B6B]"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Enable automatic withdrawals
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                  >
                    Save Payment Settings
                  </button>
                </div>
              </form>
            )}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Wallet Settings</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Connected Wallet</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {walletSettings.walletAddress 
                            ? `${walletSettings.walletAddress.slice(0, 6)}...${walletSettings.walletAddress.slice(-4)}`
                            : 'No wallet connected'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {walletSettings.walletAddress ? (
                          <>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  setWalletSettings(prev => ({
                                    ...prev,
                                    walletAddress: ''
                                  }));
                                  await updateDoc(doc(db, 'sellers', user.sellerId), {
                                    walletAddress: '',
                                    updatedAt: new Date()
                                  });
                                  toast.success('Wallet disconnected successfully');
                                } catch (error) {
                                  console.error('Error disconnecting wallet:', error);
                                  toast.error('Failed to disconnect wallet');
                                }
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                              Disconnect
                            </button>
                            <button
                              type="button"
                              onClick={handleWalletConnect}
                              className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
                            >
                              Change Wallet
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={handleWalletConnect}
                            className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
                          >
                            Connect Wallet
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Token
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {['USDT', 'USDC'].map(token => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => {
                            setWalletSettings(prev => ({ ...prev, preferredToken: token }));
                            updateDoc(doc(db, 'sellers', user.sellerId), {
                              preferredToken: token
                            });
                          }}
                          className={`p-4 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                            walletSettings.preferredToken === token 
                              ? 'border-[#FF1B6B] bg-pink-50' 
                              : 'border-gray-200 hover:border-[#FF1B6B]'
                          }`}
                        >
                          <img 
                            src={`/${token.toLowerCase()}.png`} 
                            alt={`${token} logo`}
                            className="w-6 h-6"
                          />
                          <span className="font-medium">{token}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'security' && (
              <div className="text-center py-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h2>
                <p className="text-gray-500">Security settings coming soon</p>
              </div>
            )}
          </>
        ) : (
          // Buyer Settings Content
          <>
            {activeTab === 'profile' && (
              <form onSubmit={handleBuyerProfileSubmit} className="space-y-6">
                {/* Wallet Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Wallet</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Connected Wallet</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {buyerProfile.walletAddress 
                            ? `${buyerProfile.walletAddress.slice(0, 6)}...${buyerProfile.walletAddress.slice(-4)}`
                            : 'No wallet connected'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {buyerProfile.walletAddress ? (
                          <>
                            <button
                              type="button"
                              onClick={handleDisconnectWallet}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                              Disconnect
                            </button>
                            <button
                              type="button"
                              onClick={handleConnectWallet}
                              className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
                            >
                              Change Wallet
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={handleConnectWallet}
                            className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
                          >
                            Connect Wallet
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={buyerProfile.name}
                        onChange={handleBuyerInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={buyerProfile.email}
                        onChange={handleBuyerInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={buyerProfile.phone}
                        onChange={handleBuyerInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'shipping' && (
              <form onSubmit={handleBuyerProfileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={buyerProfile.shippingAddress.street}
                    onChange={handleBuyerInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={buyerProfile.shippingAddress.city}
                      onChange={handleBuyerInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      value={buyerProfile.shippingAddress.state}
                      onChange={handleBuyerInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.country"
                      value={buyerProfile.shippingAddress.country}
                      onChange={handleBuyerInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.postalCode"
                      value={buyerProfile.shippingAddress.postalCode}
                      onChange={handleBuyerInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF1B6B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                  >
                    Save Shipping Address
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Security Settings</h2>
                <p className="text-gray-500">Security settings coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Settings; 