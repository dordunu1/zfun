import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BiWallet, BiCreditCard, BiNetworkChart, BiX } from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { useMerchAuth } from '../../context/MerchAuthContext';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { getMerchPlatformContract, getTokenContract, parseTokenAmount, NETWORK_NAMES, SUPPORTED_TOKENS } from '../../contracts/MerchPlatform';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useMerchAuth();
  const [cartItems, setCartItems] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [chainId, setChainId] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingTotal: 0,
    total: 0
  });
  const [tokenBalance, setTokenBalance] = useState('0');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart items
        const cartQuery = query(
          collection(db, 'cart'),
          where('userId', '==', user.uid)
        );
        const cartSnapshot = await getDocs(cartQuery);
        const items = [];
        let subtotal = 0;
        let shippingTotal = 0;

        for (const cartDoc of cartSnapshot.docs) {
          const cartItem = cartDoc.data();
          const productDoc = await getDoc(doc(db, 'products', cartItem.productId));
          
          if (productDoc.exists()) {
            const product = productDoc.data();
            const isDiscountValid = product.hasDiscount && new Date() < new Date(product.discountEndsAt);
            const price = isDiscountValid ? product.discountedPrice : product.price;
            
            items.push({
              id: cartDoc.id,
              ...cartItem,
              product: {
                id: cartItem.productId,
                ...product
              }
            });

            subtotal += price * cartItem.quantity;
            shippingTotal += (product.shippingFee || 0);
          }
        }

        setCartItems(items);
        setOrderSummary({
          subtotal,
          shippingTotal,
          total: subtotal + shippingTotal
        });

        // Set chainId from the first product's network
        if (items.length > 0) {
          const networkId = items[0].product.network === 'unichain' ? 1301 : 
                          items[0].product.network === 'polygon' ? 137 : 
                          Number(items[0].product.network);
          setChainId(networkId);
          setSelectedToken(items[0].product.acceptedToken);
          
          // Immediately try to switch to the correct network
          if (window.ethereum && window.ethereum.networkVersion !== networkId.toString()) {
            try {
              if (networkId === 1301) {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x515' }],
                }).catch(async () => {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: '0x515',
                      chainName: 'Unichain Testnet',
                      nativeCurrency: {
                        name: 'UNW',
                        symbol: 'UNW',
                        decimals: 18
                      },
                      rpcUrls: [import.meta.env.VITE_UNICHAIN_RPC_URL],
                      blockExplorerUrls: [import.meta.env.VITE_UNICHAIN_EXPLORER_URL]
                    }]
                  });
                });
              } else {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: '0x89' }],
                }).catch(async () => {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: '0x89',
                      chainName: 'Polygon Mainnet',
                      nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                      },
                      rpcUrls: ['https://polygon-rpc.com/'],
                      blockExplorerUrls: ['https://polygonscan.com/']
                    }]
                  });
                });
              }
            } catch (error) {
              // Silently handle network switching errors
            }
          }
        }

        // Fetch buyer profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Check if we have a complete shipping address
          const hasCompleteAddress = userData.shippingAddress && 
            userData.shippingAddress.street && 
            userData.shippingAddress.city && 
            userData.shippingAddress.state && 
            userData.shippingAddress.postalCode && 
            userData.shippingAddress.country;

          // If we have a complete address but no flag, add the flag
          if (hasCompleteAddress && !userData.flag && userData.shippingAddress?.country) {
            try {
              // Handle country whether it's a string or object
              const countryValue = typeof userData.shippingAddress.country === 'object' 
                ? userData.shippingAddress.country.code 
                : userData.shippingAddress.country;
              
              // Get country code and ensure it's a string and properly formatted
              const country = String(countryValue);
              // Some countries might have spaces or special characters, so we clean it
              const countryCode = country.trim().toLowerCase().split(' ')[0].slice(0, 2);
              
              if (countryCode) {
                const flagUrl = `https://flagcdn.com/${countryCode}.svg`;
                await updateDoc(doc(db, 'users', user.uid), {
                  flag: flagUrl
                });
                userData.flag = flagUrl;
              }
            } catch (error) {
              console.error('Error setting flag URL:', error);
              // Don't throw the error, just log it and continue
            }
          }

          setBuyerProfile({
            ...userData,
            hasCompleteAddress
          });

          // Set wallet connection status based on profile
          if (userData.walletAddress) {
            setWalletConnected(true);
            setWalletAddress(userData.walletAddress);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading checkout data:', error);
        toast.error('Failed to load checkout data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleConnectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast.error('Please install MetaMask to connect your wallet');
        return;
      }

      // Automatically switch to the correct network without prompting
      if (window.ethereum.networkVersion !== chainId.toString()) {
        if (chainId === 1301) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x515',
              chainName: 'Unichain Testnet',
              nativeCurrency: {
                name: 'UNW',
                symbol: 'UNW',
                decimals: 18
              },
              rpcUrls: [import.meta.env.VITE_UNICHAIN_RPC_URL],
              blockExplorerUrls: [import.meta.env.VITE_UNICHAIN_EXPLORER_URL]
            }]
          }).catch(async () => {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x515' }],
            });
          });
        } else {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                  },
                  rpcUrls: ['https://polygon-rpc.com/'],
                  blockExplorerUrls: ['https://polygonscan.com/']
                }]
              });
            }
          }
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        toast.error('Please connect your wallet');
        return;
      }

      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
      setWalletConnected(true);

      await setDoc(doc(db, 'users', user.uid), {
        walletAddress,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Wallet connected successfully');
      await checkTokenBalance();
    } catch (error) {
      if (error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    }
  };

  const checkTokenBalance = async () => {
    try {
      if (!walletAddress || !selectedToken || !chainId) return;

      if (window.ethereum.networkVersion !== chainId.toString()) {
        if (chainId === 1301) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x515' }],
          }).catch(async () => {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x515',
                chainName: 'Unichain Testnet',
                nativeCurrency: {
                  name: 'UNW',
                  symbol: 'UNW',
                  decimals: 18
                },
                rpcUrls: [import.meta.env.VITE_UNICHAIN_RPC_URL],
                blockExplorerUrls: [import.meta.env.VITE_UNICHAIN_EXPLORER_URL]
              }]
            });
          });
        } else {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }],
          }).catch(async () => {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          });
        }
      }

      const tokenAddress = SUPPORTED_TOKENS[chainId]?.[selectedToken];
      if (!tokenAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = getTokenContract(provider, chainId, selectedToken);
      const balance = await tokenContract.balanceOf(walletAddress);
      setTokenBalance(ethers.formatUnits(balance, 6));
    } catch (error) {
      setTokenBalance('0');
    }
  };

  useEffect(() => {
    if (walletConnected && selectedToken && chainId && walletAddress) {
      checkTokenBalance();
    }
  }, [walletConnected, selectedToken, chainId, walletAddress]);

  const handlePlaceOrder = async () => {
    // Check for complete shipping address first
    if (!buyerProfile?.shippingAddress ||
        !buyerProfile?.shippingAddress?.street ||
        !buyerProfile?.shippingAddress?.city ||
        !buyerProfile?.shippingAddress?.state ||
        !buyerProfile?.shippingAddress?.postalCode ||
        !buyerProfile?.shippingAddress?.country) {
      toast.error('Please add a complete shipping address in your profile settings');
      navigate('/merch-store/settings');
      return;
    }

    if (!walletConnected) {
      toast.error('Please connect your wallet in your profile settings first');
      navigate('/merch-store/settings');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if balance is sufficient
    if (parseFloat(tokenBalance) < orderSummary.total) {
      toast.error(`Insufficient ${selectedToken} balance`);
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing your order...');

    try {
      // Switch to the correct network if needed
      if (window.ethereum.networkVersion !== chainId.toString()) {
        setTransactionStatus('Switching network...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(chainId).toString(16)}` }],
          });
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error(`Please switch to ${NETWORK_NAMES[chainId]} network in MetaMask`);
          setIsProcessing(false);
          return;
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get contracts
      const merchPlatform = getMerchPlatformContract(signer, chainId);
      const tokenContract = getTokenContract(signer, chainId, selectedToken);

      // Verify contract addresses
      if (!merchPlatform.address || !tokenContract.address) {
        throw new Error('Invalid contract addresses');
      }

      // Calculate total amount in smallest token unit (e.g., wei)
      const totalAmount = ethers.parseUnits(
        // Round to 6 decimal places and ensure we don't exceed the approved amount
        orderSummary.total.toFixed(6),
        6 // USDT/USDC use 6 decimals
      );

      // Check current allowance
      setTransactionStatus('Checking token approval...');
      const currentAllowance = await tokenContract.allowance(walletAddress, merchPlatform.address);
      
      // If current allowance is less than total amount, request approval
      if (currentAllowance < totalAmount) {
        setTransactionStatus('Approving token spending...');
        // Add a small buffer to the approval amount to account for rounding
        // For discounted prices, we still add the 0.01 buffer to ensure sufficient allowance
        const approvalBuffer = ethers.parseUnits('0.01', 6); // 0.01 USDT buffer
        const approvalAmount = totalAmount + approvalBuffer;
        
        // Log the amounts for debugging
        console.log('Total Amount:', ethers.formatUnits(totalAmount, 6));
        console.log('Approval Amount with buffer:', ethers.formatUnits(approvalAmount, 6));
        
        const approveTx = await tokenContract.approve(merchPlatform.address, approvalAmount);
        await approveTx.wait();
      }

      // Create order on-chain for each seller
      const sellerOrders = {};
      
      // First, fetch all seller wallets
      const sellerPromises = cartItems.map(async item => {
        const sellerId = item.product.sellerId;
        if (!sellerOrders[sellerId]) {
          // Fetch seller data from Firestore
          const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
          if (!sellerDoc.exists()) {
            throw new Error(`Seller ${sellerId} not found`);
          }
          const sellerData = sellerDoc.data();
          if (!sellerData.walletAddress) {
            throw new Error(`Seller ${sellerId} has no wallet connected`);
          }
          const sellerWallet = ethers.getAddress(sellerData.walletAddress); // Ensure proper address format
          sellerOrders[sellerId] = {
            seller: sellerWallet,
            amount: 0,
            items: []
          };
        }
        return sellerId;
      });

      // Wait for all seller data to be fetched
      await Promise.all(sellerPromises);

      // Now group items by seller
      cartItems.forEach(item => {
        const sellerId = item.product.sellerId;
        // Check if discount is valid and use discounted price if applicable
        const isDiscountValid = item.product.hasDiscount && new Date() < new Date(item.product.discountEndsAt);
        const price = isDiscountValid ? item.product.discountedPrice : item.product.price;
        const itemTotal = (price * item.quantity) + (item.product.shippingFee || 0);
        sellerOrders[sellerId].amount += itemTotal;
        sellerOrders[sellerId].items.push(item);
      });

      // Process each seller's order
      let orderCount = 0;
      for (const [sellerId, orderData] of Object.entries(sellerOrders)) {
        orderCount++;
        setTransactionStatus(`Processing order ${orderCount}/${Object.keys(sellerOrders).length}...`);
        
        // The contract will deduct the platform fee from this amount, so we send the full amount
        // Add extra buffer to each seller's amount to handle any rounding
        const amount = ethers.parseUnits(orderData.amount.toFixed(6), 6);
        
        // Log the order amount for debugging
        console.log('Seller order amount:', ethers.formatUnits(amount, 6));
        
        const createOrderTx = await merchPlatform.createOrder(
          orderData.seller,
          tokenContract.address,
          amount
        );
        const receipt = await createOrderTx.wait();
        console.log('Transaction receipt:', receipt);

        // Look for OrderCreated event
        const event = receipt.logs.find(log => {
          try {
            const parsedLog = merchPlatform.interface.parseLog(log);
            console.log('Parsed log:', parsedLog);
            return parsedLog.name === 'OrderCreated';
          } catch (e) {
            return false;
          }
        });

        if (!event) {
          console.error('OrderCreated event not found in logs');
          console.log('All logs:', receipt.logs);
          throw new Error('Failed to get order ID from transaction');
        }

        // Parse the event data
        const parsedEvent = merchPlatform.interface.parseLog(event);
        console.log('Parsed OrderCreated event:', parsedEvent);
        
        // The orderId is the first indexed parameter
        const numericOrderId = parsedEvent.args.orderId.toString();
        console.log('Order ID from event:', numericOrderId);

        setTransactionStatus('Saving order details...');

        // Update product quantities
        const updateQuantityPromises = orderData.items.map(async (item) => {
          const productRef = doc(db, 'products', item.product.id);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const currentQuantity = productDoc.data().quantity;
            const newQuantity = Math.max(0, currentQuantity - item.quantity);
            await updateDoc(productRef, { quantity: newQuantity });
          }
        });
        await Promise.all(updateQuantityPromises);

        // Create Firebase order for THIS seller only
        const orderRef = await addDoc(collection(db, 'orders'), {
          numericOrderId, // Store the numeric order ID from the contract
          buyerId: user.uid,
          sellerId: sellerId,
          sellerName: orderData.items[0].product.sellerName,
          items: orderData.items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            quantity: item.quantity,
            price: item.product.price,
            shippingFee: item.product.shippingFee || 0,
            size: item.size || null,
            color: item.color || null
          })),
          status: 'processing',
          paymentStatus: 'completed',
          paymentMethod: {
            type: 'crypto',
            token: selectedToken,
            network: chainId,
            buyerWallet: walletAddress
          },
          buyerInfo: {
            name: buyerProfile.name,
            email: buyerProfile.email,
            phone: buyerProfile.phoneNumber || null
          },
          flag: typeof buyerProfile.shippingAddress.country === 'object' && buyerProfile.shippingAddress.country.code
            ? `https://flagcdn.com/${buyerProfile.shippingAddress.country.code.toLowerCase()}.svg`
            : null,
          shippingAddress: buyerProfile.shippingAddress,
          subtotal: orderData.amount,
          total: orderData.amount,
          createdAt: serverTimestamp(),
          shippingConfirmed: false,
          shippingConfirmedAt: null,
          fundsAvailable: false,
          fundsAvailableAt: null,
          shippingDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours (3 days)
          fundsReleaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
        });
      }

      // Clear cart
      const deletePromises = cartItems.map(item => 
        deleteDoc(doc(db, 'cart', item.id))
      );
      await Promise.all(deletePromises);

      toast.dismiss(loadingToast);
      toast.success('Order placed successfully!');
      navigate(`/merch-store/orders`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
      setTransactionStatus('');
    }
  };

  // Update the shipping address check in the render section
  const hasValidShippingAddress = buyerProfile?.hasCompleteAddress;

  // Update the place order button disabled condition
  const isOrderButtonDisabled = 
    !walletConnected || 
    cartItems.length === 0 || 
    !hasValidShippingAddress ||
    isProcessing || 
    parseFloat(tokenBalance) < orderSummary.total;

  // Update the shipping address section render
  const renderShippingAddress = () => {
    if (hasValidShippingAddress) {
      // Get the country code for the flag
      const getCountryCode = () => {
        const country = buyerProfile.shippingAddress.country;
        if (typeof country === 'object' && country.code) {
          return country.code.toLowerCase();
        }
        return null;
      };

      const countryCode = getCountryCode();
      const flagUrl = countryCode ? `https://flagcdn.com/${countryCode}.svg` : null;

      return (
        <div className="space-y-2">
          <p className="text-gray-600">
            {buyerProfile.shippingAddress.street}
          </p>
          <p className="text-gray-600">
            {buyerProfile.shippingAddress.city}, {buyerProfile.shippingAddress.state} {buyerProfile.shippingAddress.postalCode}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              {typeof buyerProfile.shippingAddress.country === 'object' 
                ? buyerProfile.shippingAddress.country.name 
                : buyerProfile.shippingAddress.country}
            </p>
            {flagUrl && (
              <img 
                src={flagUrl}
                alt={typeof buyerProfile.shippingAddress.country === 'object' 
                  ? buyerProfile.shippingAddress.country.name 
                  : buyerProfile.shippingAddress.country}
                className="w-5 h-4 object-cover rounded-sm shadow-sm"
              />
            )}
          </div>
          <button
            onClick={() => navigate('/merch-store/settings')}
            className="mt-4 text-sm text-[#FF1B6B] hover:text-[#D4145A] transition-colors"
          >
            Edit Address
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[#FF1B6B]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#FF1B6B]">Shipping Address Required</h3>
              <p className="mt-1 text-sm text-gray-600">
                Please add your shipping address to continue with the checkout process.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/merch-store/settings')}
          className="w-full px-4 py-3 bg-[#FF1B6B] text-white rounded-lg hover:bg-[#D4145A] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Add Shipping Address
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 rounded-full border-4 border-[#FF1B6B] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FFF5F7] p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div variants={itemVariants} className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 mb-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Quantity: {item.quantity}</p>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && (
                          <div className="flex items-center gap-2 mt-1">
                            <span>Color:</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ 
                                  backgroundColor: item.color.toLowerCase(),
                                  borderColor: item.color.toLowerCase() === '#ffffff' ? '#e5e7eb' : 'transparent'
                                }}
                              />
                              {item.color}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {item.product.hasDiscount && new Date() < new Date(item.product.discountEndsAt) ? (
                        <>
                          <p className="text-gray-800">
                            ${(item.product.discountedPrice * item.quantity).toFixed(2)}
                            <span className="text-sm text-gray-400 line-through ml-1">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                      )}
                      {item.product.shippingFee > 0 && (
                        <p className="text-sm text-gray-600">+ ${item.product.shippingFee.toFixed(2)} shipping</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${orderSummary.shippingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              {renderShippingAddress()}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-4"
          >
            {/* Connect Wallet */}
            <div className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              {!walletConnected ? (
                <div className="space-y-4">
                  <p className="text-gray-600">Please connect your wallet in your profile settings first.</p>
                  <button
                    onClick={() => navigate('/merch-store/settings')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FF1B6B] text-white hover:bg-[#D4145A] transition-colors"
                  >
                    <BiWallet className="w-5 h-5" />
                    <span>Go to Settings</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BiWallet className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/merch-store/settings')}
                      className="text-sm text-[#FF1B6B] hover:text-[#D4145A]"
                    >
                      Change in Settings
                    </button>
                  </div>

                  {/* Network Information */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BiNetworkChart className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-600">Network Required:</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {NETWORK_NAMES[chainId]}
                      </span>
                    </div>
                  </div>

                  {/* Token Balance */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Payment Token
                    </p>
                    <div className="p-3 rounded-lg border-2 border-[#FF1B6B] bg-pink-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={cartItems[0]?.product?.tokenLogo} 
                            alt={selectedToken}
                            className="w-5 h-5"
                          />
                          <span>{selectedToken}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Balance: {parseFloat(tokenBalance).toFixed(2)} {selectedToken}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Status */}
                  {transactionStatus && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                        <span className="text-sm text-blue-600">{transactionStatus}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <div className="flex items-center gap-1">
                    <img 
                      src={cartItems[0]?.product?.tokenLogo} 
                      alt={selectedToken}
                      className="w-4 h-4"
                    />
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <div className="flex items-center gap-1">
                    <img 
                      src={cartItems[0]?.product?.tokenLogo} 
                      alt={selectedToken}
                      className="w-4 h-4"
                    />
                    <span>${orderSummary.shippingTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between font-medium text-gray-900">
                  <span>Total</span>
                  <div className="flex items-center gap-1">
                    <img 
                      src={cartItems[0]?.product?.tokenLogo} 
                      alt={selectedToken}
                      className="w-4 h-4"
                    />
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!buyerProfile?.shippingAddress && (
                <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-[#FF1B6B] mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#FF1B6B]">Shipping Address Required</p>
                      <p className="text-sm text-gray-600 mt-1">Please add your shipping address in settings to enable order placement.</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isOrderButtonDisabled}
                className={`w-full mt-6 px-4 py-3 rounded-lg text-white transition-colors ${
                  isOrderButtonDisabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#FF1B6B] hover:bg-[#D4145A] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isOrderButtonDisabled ? 'Add Shipping Address Required' : isProcessing ? 'Processing...' :
                   parseFloat(tokenBalance) < orderSummary.total ? `Insufficient ${selectedToken} Balance` :
                   'Place Order'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout; 