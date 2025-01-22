import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BiStore, BiUser, BiDollar, BiShield, BiCreditCard, BiPackage } from 'react-icons/bi';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { toast } from 'react-hot-toast';
import detectEthereumProvider from '@metamask/detect-provider';
import ReactCountryFlag from 'react-country-flag';
import countryList from 'react-select-country-list';
import Select from 'react-select';

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

const SettingsSkeleton = () => {
  const { isDarkMode } = useTheme();
  return (
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
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-sm`}>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-32 h-10">
              <SkeletonPulse />
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm space-y-6`}>
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
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
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
};

const Settings = () => {
  const { user } = useMerchAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showNetworkConfirm, setShowNetworkConfirm] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState({
    fullName: '',
    email: user?.email || '',
    phoneNumber: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      country: {
        name: '',
        code: '',
        flag: ''
      },
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

  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);

  const [buyerProfileHasChanges, setBuyerProfileHasChanges] = useState(false);
  const [originalBuyerProfile, setOriginalBuyerProfile] = useState(null);

  const countries = useMemo(() => countryList().getData(), []);
  
  const countryOptions = useMemo(() => 
    countries.map(country => ({
      value: country.value,
      label: (
        <div className="flex items-center gap-2">
          <ReactCountryFlag 
            countryCode={country.value} 
            svg 
            style={{
              width: '1.5em',
              height: '1.5em',
            }}
          />
          {country.label}
        </div>
      ),
      searchLabel: country.label
    })), 
    [countries]
  );

  const customStyles = useMemo(() => ({
    control: (provided, state) => ({
      ...provided,
      padding: '2px',
      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
      backgroundColor: isDarkMode ? '#374151' : 'white',
      '&:hover': {
        borderColor: '#FF1B6B'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#FF1B6B' 
        : state.isFocused 
          ? isDarkMode ? '#4B5563' : '#FFE4E4'
          : isDarkMode ? '#374151' : 'white',
      color: state.isSelected 
        ? 'white' 
        : isDarkMode ? '#E5E7EB' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#FF1B6B' : isDarkMode ? '#4B5563' : '#FFE4E4',
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#374151' : 'white',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? '#E5E7EB' : '#374151',
    }),
    input: (provided) => ({
      ...provided,
      color: isDarkMode ? '#E5E7EB' : '#374151',
    })
  }), [isDarkMode]);

  const handleCountryChange = (selectedOption) => {
    const newProfile = {
      ...buyerProfile,
      shippingAddress: {
        ...buyerProfile.shippingAddress,
        country: {
          name: selectedOption.searchLabel,
          code: selectedOption.value,
          flag: `https://flagcdn.com/${selectedOption.value.toLowerCase()}.svg`
        }
      }
    };
    setBuyerProfile(newProfile);
    setBuyerProfileHasChanges(JSON.stringify(newProfile) !== JSON.stringify(originalBuyerProfile));
  };

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
        const profileData = {
          fullName: userData.fullName || '',
          email: userData.email || user?.email || '',
          phoneNumber: userData.phoneNumber || '',
          walletAddress: userData.walletAddress || '',
          shippingAddress: {
            street: userData.shippingAddress?.street || '',
            city: userData.shippingAddress?.city || '',
            state: userData.shippingAddress?.state || '',
            country: userData.shippingAddress?.country || {
              name: '',
              code: '',
              flag: ''
            },
            postalCode: userData.shippingAddress?.postalCode || ''
          }
        };
        setBuyerProfile(profileData);
        setOriginalBuyerProfile(JSON.parse(JSON.stringify(profileData)));
        setBuyerProfileHasChanges(false);

        // Check if MetaMask is installed and connected
        if (userData.walletAddress && window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0 && accounts[0].toLowerCase() === userData.walletAddress.toLowerCase()) {
              // Wallet is still connected, no need to reconnect
              setBuyerProfile(prev => ({
                ...prev,
                walletAddress: accounts[0]
              }));
            }
          } catch (error) {
            console.error('Error checking wallet connection:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching buyer profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleBuyerInputChange = (e) => {
    const { name, value } = e.target;
    let newProfile;
    if (name.includes('shippingAddress.')) {
      const field = name.split('.')[1];
      newProfile = {
        ...buyerProfile,
        shippingAddress: {
          ...buyerProfile.shippingAddress,
          [field]: value
        }
      };
    } else {
      newProfile = {
        ...buyerProfile,
        [name]: value
      };
    }
    setBuyerProfile(newProfile);
    setBuyerProfileHasChanges(JSON.stringify(newProfile) !== JSON.stringify(originalBuyerProfile));
  };

  const handleBuyerProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...buyerProfile,
        updatedAt: new Date()
      }, { merge: true });
      setOriginalBuyerProfile(JSON.parse(JSON.stringify(buyerProfile)));
      setBuyerProfileHasChanges(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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
          country: {
            name: '',
            code: '',
            flag: ''
          },
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
        setOriginalSettings(initialSellerData);
        setWalletSettings({
          walletAddress: userData.walletAddress || '',
          preferredToken: initialSellerData.preferredToken
        });
      } else {
        const sellerData = sellerDoc.data();
        // Ensure country data is in the correct format
        const formattedSellerData = {
          ...sellerData,
          country: sellerData.country?.code ? sellerData.country : {
            name: sellerData.country || '',
            code: '',
            flag: ''
          }
        };
        setStoreSettings(formattedSellerData);
        setOriginalSettings(formattedSellerData);
        setWalletSettings({
          walletAddress: sellerData.walletAddress || '',
          preferredToken: sellerData.preferredToken || 'USDC'
        });
      }
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to load seller settings');
    }
  };

  const handleConnectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      // Request account access and permissions
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
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
      setOriginalSettings(storeSettings);
      setHasChanges(false);
      toast.success('Store settings updated successfully');
    } catch (error) {
      toast.error('Failed to update store settings');
    }
  };

  const handleStoreInputChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => {
      const newSettings = {
        ...prev,
        [name]: value
      };
      // Compare with original settings to determine if there are changes
      const hasChanged = JSON.stringify(newSettings) !== JSON.stringify(originalSettings);
      setHasChanges(hasChanged);
      return newSettings;
    });
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
          Manage your {user?.isSeller ? 'store settings' : 'profile'} and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-sm mb-6`}>
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
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700'
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
                    : isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700'
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
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Store Details</h3>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="storeName"
                        value={storeSettings.storeName}
                        onChange={handleStoreInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Contact Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={storeSettings.contactEmail}
                        onChange={handleStoreInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Store Description
                    </label>
                    <textarea
                      name="description"
                      value={storeSettings.description}
                      onChange={handleStoreInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Country
                      </label>
                      <div className="w-full px-4 py-2 border rounded-lg flex items-center gap-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200' 
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }">
                        {storeSettings.country?.code && (
                          <ReactCountryFlag
                            countryCode={storeSettings.country.code}
                            svg
                            style={{
                              width: '1.5em',
                              height: '1.5em',
                            }}
                          />
                        )}
                        <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {storeSettings.country?.name || 'Country not set'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={storeSettings.city}
                        onChange={handleStoreInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={storeSettings.postalCode}
                        onChange={handleStoreInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Shipping Settings</h3>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
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
                        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
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
                    disabled={!hasChanges}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      hasChanges 
                        ? 'bg-[#FF1B6B] text-white hover:bg-[#D4145A]' 
                        : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                    }`}
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Wallet Settings */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Wallet Settings</h3>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg p-4`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Connected Wallet</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
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
                              className={`px-4 py-2 ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              } rounded-lg transition-colors text-sm`}
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
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Network Settings</h3>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
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
                              ? `border-[#FF1B6B] ${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'}` 
                              : (storeSettings.preferredNetwork === 'polygon' || storeSettings.preferredNetwork === 'unichain')
                                ? `border-gray-200 opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`
                                : `border-gray-200 hover:border-[#FF1B6B] ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`
                          }`}
                        >
                          <img 
                            src={network.logo}
                            alt={`${network.name} logo`}
                            className="w-6 h-6"
                          />
                          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{network.name}</span>
                        </button>
                      ))}
                    </div>
                    {showNetworkConfirm && selectedNetwork && (
                      <div className={`mt-4 border border-[#FF1B6B] rounded-lg p-4 ${isDarkMode ? 'bg-pink-900/20' : 'bg-pink-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className="text-[#FF1B6B] mt-1">⚠️</div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                              Confirm Network Selection
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                              Are you sure you want to build your store on {selectedNetwork.name}? This is a one-time choice and all your products and transactions will only operate on this network.
                            </p>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setShowNetworkConfirm(false);
                                  setSelectedNetwork(null);
                                }}
                                className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
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
                      <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
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
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Security Settings</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security settings coming soon</p>
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
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-6`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Connected Wallet</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
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
                              className={`px-4 py-2 ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              } rounded-lg transition-colors text-sm`}
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
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={buyerProfile.fullName}
                        onChange={handleBuyerInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={buyerProfile.email}
                        onChange={handleBuyerInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={buyerProfile.phoneNumber}
                        onChange={handleBuyerInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-100' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!buyerProfileHasChanges}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      buyerProfileHasChanges 
                        ? 'bg-[#FF1B6B] text-white hover:bg-[#D4145A]' 
                        : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                    }`}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'shipping' && (
              <form onSubmit={handleBuyerProfileSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={buyerProfile.shippingAddress.street}
                    onChange={handleBuyerInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      City
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={buyerProfile.shippingAddress.city}
                      onChange={handleBuyerInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.state"
                      value={buyerProfile.shippingAddress.state}
                      onChange={handleBuyerInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Country
                    </label>
                    <Select
                      options={countryOptions}
                      styles={customStyles}
                      onChange={handleCountryChange}
                      required
                      placeholder="Select country"
                      className="country-select"
                      value={buyerProfile.shippingAddress.country?.code ? 
                        countryOptions.find(option => option.value === buyerProfile.shippingAddress.country.code) 
                        : null}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.postalCode"
                      value={buyerProfile.shippingAddress.postalCode}
                      onChange={handleBuyerInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF1B6B] focus:border-[#FF1B6B] transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!buyerProfileHasChanges}
                    className={`w-full px-4 py-2 rounded-lg transition-colors ${
                      buyerProfileHasChanges 
                        ? 'bg-[#FF1B6B] text-white hover:bg-[#D4145A]' 
                        : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                    }`}
                  >
                    Save Shipping Address
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-8">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>Security Settings</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Security settings coming soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Settings; 