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
  const [showNetworkConfirm, setShowNetworkConfirm] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
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
    preferredNetwork: ''
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
        // Get user document to check for existing wallet address
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

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
          preferredNetwork: '',
          walletAddress: userData.walletAddress || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(sellerRef, initialSellerData);
        setStoreSettings(initialSellerData);
        setWalletSettings({
          walletAddress: userData.walletAddress || '',
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
      console.log('Connecting wallet:', walletAddress);

      // Update local state immediately
      if (user.isSeller) {
        console.log('Updating seller state with wallet:', walletAddress);
        setWalletSettings(prev => {
          console.log('Previous wallet settings:', prev);
          return {
            ...prev,
            walletAddress
          };
        });
        setStoreSettings(prev => {
          console.log('Previous store settings:', prev);
          return {
            ...prev,
            walletAddress
          };
        });
      } else {
        setBuyerProfile(prev => ({
          ...prev,
          walletAddress
        }));
      }

      // Update Firestore
      try {
        if (user.isSeller) {
          console.log('Updating seller document with wallet:', walletAddress);
          // Update seller document
          const sellerRef = doc(db, 'sellers', user.sellerId);
          await updateDoc(sellerRef, {
            walletAddress,
            updatedAt: new Date()
          });

          // Also update user document for consistency
          await updateDoc(doc(db, 'users', user.uid), {
            walletAddress,
            updatedAt: new Date()
          });

          // Fetch updated seller data to ensure UI is in sync
          const updatedSellerDoc = await getDoc(sellerRef);
          if (updatedSellerDoc.exists()) {
            const sellerData = updatedSellerDoc.data();
            console.log('Updated seller data:', sellerData);
            setStoreSettings(sellerData);
            setWalletSettings(prev => ({
              ...prev,
              walletAddress: sellerData.walletAddress
            }));
          }
        } else {
          await updateDoc(doc(db, 'users', user.uid), {
            walletAddress,
            updatedAt: new Date()
          });
        }
        toast.success('Wallet connected successfully');
      } catch (error) {
        console.error('Error updating Firestore:', error);
        toast.error('Failed to save wallet connection');
        // Revert local state if Firestore update fails
        if (user.isSeller) {
          setWalletSettings(prev => ({
            ...prev,
            walletAddress: ''
          }));
          setStoreSettings(prev => ({
            ...prev,
            walletAddress: ''
          }));
        } else {
          setBuyerProfile(prev => ({
            ...prev,
            walletAddress: ''
          }));
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      if (error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      // Update local state immediately
      if (user.isSeller) {
        setWalletSettings(prev => ({
          ...prev,
          walletAddress: ''
        }));
        setStoreSettings(prev => ({
          ...prev,
          walletAddress: ''
        }));
      } else {
        setBuyerProfile(prev => ({
          ...prev,
          walletAddress: ''
        }));
      }

      // Update Firestore
      if (user.isSeller) {
        await updateDoc(doc(db, 'sellers', user.sellerId), {
          walletAddress: '',
          updatedAt: new Date()
        });
      } else {
        await updateDoc(doc(db, 'users', user.uid), {
          walletAddress: '',
          updatedAt: new Date()
        });
      }
      toast.success('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
      // Restore previous state if Firestore update fails
      if (user.isSeller) {
        setWalletSettings(prev => ({
          ...prev,
          walletAddress: walletSettings.walletAddress
        }));
        setStoreSettings(prev => ({
          ...prev,
          walletAddress: walletSettings.walletAddress
        }));
      } else {
        setBuyerProfile(prev => ({
          ...prev,
          walletAddress: buyerProfile.walletAddress
        }));
      }
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

  const handleStoreInputChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mb-6">Manage your {user?.isSeller ? 'store settings' : 'profile'} and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl p-2 shadow-sm mb-6">
        <nav className="flex gap-2">
          {user?.isSeller ? (
            // Seller Tabs
            [
              { id: 'store', label: 'Store Settings', icon: BiStore },
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
      <div className="space-y-6">
        {user?.isSeller ? (
          <>
            {activeTab === 'store' && (
              <form onSubmit={handleStoreSubmit} className="space-y-6">
                {/* Store Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Details</h3>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="storeName"
                        value={storeSettings.storeName}
                        onChange={handleStoreInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Description
                    </label>
                    <textarea
                      name="description"
                      value={storeSettings.description}
                      onChange={handleStoreInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Fee (USD)
                    </label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="shippingFee"
                        min="0"
                        step="0.01"
                        value={storeSettings.shippingFee}
                        onChange={handleStoreInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      This fee will be added to all orders from your store
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Wallet Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Settings</h3>
                  <div className="bg-white rounded-lg p-4">
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

                {/* Network Selection */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Network
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'polygon', name: 'Polygon', logo: '/polygon.png' },
                        { id: 'unichain', name: 'Unichain Testnet', logo: '/unichain-logo.png' }
                      ].map(network => (
                        <button
                          key={network.id}
                          type="button"
                          disabled={storeSettings.preferredNetwork === 'polygon' || storeSettings.preferredNetwork === 'unichain'}
                          onClick={() => {
                            if (storeSettings.preferredNetwork !== 'polygon' && storeSettings.preferredNetwork !== 'unichain') {
                              setSelectedNetwork(network);
                              setShowNetworkConfirm(true);
                            }
                          }}
                          className={`p-4 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                            storeSettings.preferredNetwork === network.id 
                              ? 'border-[#FF1B6B] bg-pink-50' 
                              : (storeSettings.preferredNetwork === 'polygon' || storeSettings.preferredNetwork === 'unichain')
                                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-[#FF1B6B]'
                          }`}
                        >
                          <img 
                            src={network.logo}
                            alt={`${network.name} logo`}
                            className="w-6 h-6"
                          />
                          <span className="font-medium">{network.name}</span>
                        </button>
                      ))}
                    </div>
                    {showNetworkConfirm && selectedNetwork && (
                      <div className="mt-4 border border-[#FF1B6B] rounded-lg p-4 bg-pink-50">
                        <div className="flex items-start gap-3">
                          <div className="text-[#FF1B6B] mt-1">⚠️</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Confirm Network Selection
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                              Are you sure you want to build your store on {selectedNetwork.name}? This is a one-time choice and all your products and transactions will only operate on this network.
                            </p>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setShowNetworkConfirm(false);
                                  setSelectedNetwork(null);
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setStoreSettings(prev => ({ ...prev, preferredNetwork: selectedNetwork.id }));
                                  updateDoc(doc(db, 'sellers', user.sellerId), {
                                    preferredNetwork: selectedNetwork.id,
                                    updatedAt: new Date()
                                  });
                                  toast.success(`Your store has been permanently set to operate on ${selectedNetwork.name} network`, {
                                    style: {
                                      background: '#FF1B6B',
                                      color: '#fff',
                                      padding: '16px',
                                      borderRadius: '10px',
                                    },
                                    iconTheme: {
                                      primary: '#fff',
                                      secondary: '#FF1B6B',
                                    },
                                    duration: 5000
                                  });
                                  setShowNetworkConfirm(false);
                                  setSelectedNetwork(null);
                                }}
                                className="px-4 py-2 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors text-sm"
                              >
                                Confirm Selection
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        {storeSettings.preferredNetwork 
                          ? `Your store operates on ${storeSettings.preferredNetwork === 'polygon' ? 'Polygon' : 'Unichain Testnet'} network.`
                          : "Select the network you want to build your store on. This is a one-time choice and cannot be changed later."}
                      </p>
                      {!storeSettings.preferredNetwork && (
                        <p className="mt-2 text-sm text-[#FF1B6B]">
                          ⚠️ Warning: Once you select a network, you cannot change it later. All your products and transactions will operate only on the selected network.
                        </p>
                      )}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors"
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