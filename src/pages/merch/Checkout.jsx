import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BiWallet, BiCreditCard, BiNetworkChart } from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
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
            items.push({
              id: cartDoc.id,
              ...cartItem,
              product: {
                id: cartItem.productId,
                ...product
              }
            });

            subtotal += product.price * cartItem.quantity;
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
          console.log('Setting network:', { 
            original: items[0].product.network, 
            converted: networkId 
          });
        }

        // Fetch buyer profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBuyerProfile(userData);
          // Set wallet connection status based on profile
          if (userData.walletAddress) {
            setWalletConnected(true);
            setWalletAddress(userData.walletAddress);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      setWalletAddress(walletAddress);
      setWalletConnected(true);

      // Update the user's profile with the new wallet address
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

  const checkTokenBalance = async () => {
    try {
      if (!walletAddress || !selectedToken || !chainId) {
        console.log('Missing required values:', { walletAddress, selectedToken, chainId });
        return;
      }

      // Check if the token is supported for this chain
      const tokenAddress = SUPPORTED_TOKENS[chainId]?.[selectedToken];
      if (!tokenAddress) {
        console.error('Token not supported on this chain:', { chainId, selectedToken });
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = getTokenContract(provider, chainId, selectedToken);

      console.log('Checking balance for token:', {
        address: tokenAddress,
        wallet: walletAddress
      });

      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = 6; // Fixed decimals for USDT/USDC

      console.log(`Balance for ${selectedToken}:`, {
        raw: balance.toString(),
        decimals,
        formatted: ethers.formatUnits(balance, decimals)
      });

      setTokenBalance(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error('Error checking balance:', error);
      setTokenBalance('0');
    }
  };

  useEffect(() => {
    if (walletConnected && selectedToken && chainId && walletAddress) {
      console.log('Checking balance with:', { walletAddress, selectedToken, chainId });
      checkTokenBalance();
    }
  }, [walletConnected, selectedToken, chainId, walletAddress]);

  const handlePlaceOrder = async () => {
    if (!walletConnected) {
      toast.error('Please connect your wallet in your profile settings first');
      navigate('/merch-store/settings');
      return;
    }

    if (!buyerProfile?.shippingAddress) {
      toast.error('Please add a shipping address in your profile settings');
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

      console.log('Contract addresses:', {
        merchPlatform: merchPlatform.address,
        token: tokenContract.address,
        chainId,
        selectedToken
      });

      // Calculate total amount in smallest token unit (e.g., wei)
      const totalAmount = ethers.parseUnits(orderSummary.total.toString(), 6); // USDT/USDC use 6 decimals

      // Check current allowance
      setTransactionStatus('Checking token approval...');
      const currentAllowance = await tokenContract.allowance(walletAddress, merchPlatform.address);
      
      console.log('Allowance check:', {
        currentAllowance: currentAllowance.toString(),
        needed: totalAmount.toString(),
        merchPlatformAddress: merchPlatform.address
      });

      // If current allowance is less than total amount, request approval
      if (currentAllowance < totalAmount) {
        setTransactionStatus('Approving token spending...');
        console.log('Approving amount:', {
          amount: totalAmount.toString(),
          formatted: ethers.formatUnits(totalAmount, 6)
        });
        const approveTx = await tokenContract.approve(merchPlatform.address, totalAmount);
        await approveTx.wait();
        console.log('Token approval confirmed');
      } else {
        console.log('Sufficient allowance exists:', {
          allowance: currentAllowance.toString(),
          needed: totalAmount.toString()
        });
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
        sellerOrders[sellerId].amount += (item.product.price + (item.product.shippingFee || 0)) * item.quantity;
        sellerOrders[sellerId].items.push(item);
      });

      console.log('Seller orders prepared:', sellerOrders);

      // Process each seller's order
      let orderCount = 0;
      for (const [sellerId, orderData] of Object.entries(sellerOrders)) {
        orderCount++;
        setTransactionStatus(`Processing order ${orderCount}/${Object.keys(sellerOrders).length}...`);
        const amount = ethers.parseUnits(orderData.amount.toString(), 6);
        console.log('Creating order:', {
          seller: orderData.seller,
          token: tokenContract.address,
          amount: amount.toString(),
          formatted: ethers.formatUnits(amount, 6)
        });
        const createOrderTx = await merchPlatform.createOrder(
          orderData.seller,
          tokenContract.address,
          amount
        );
        await createOrderTx.wait();
      }

      setTransactionStatus('Saving order details...');

      // Create separate orders for each seller
      for (const [sellerId, orderData] of Object.entries(sellerOrders)) {
        await addDoc(collection(db, 'orders'), {
          buyerId: user.uid,
          sellerId: sellerId,  // Add sellerId at root level
          sellerName: orderData.items[0].product.sellerName,
          items: orderData.items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            quantity: item.quantity,
            price: item.product.price,
            shippingFee: item.product.shippingFee || 0
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
            phone: buyerProfile.phone
          },
          shippingAddress: buyerProfile.shippingAddress,
          subtotal: orderData.amount,
          total: orderData.amount, // Include fees in total
          createdAt: serverTimestamp()
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
      console.error('Order error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
      setTransactionStatus('');
    }
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ${item.product.price.toFixed(2)} each
                    </p>
                    {item.product.shippingFee > 0 && (
                      <p className="text-sm text-gray-500">
                        Shipping: ${item.product.shippingFee.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            {buyerProfile?.shippingAddress ? (
              <div className="space-y-2">
                <p className="text-gray-600">
                  {buyerProfile.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {buyerProfile.shippingAddress.city}, {buyerProfile.shippingAddress.state} {buyerProfile.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600">
                  {buyerProfile.shippingAddress.country}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                No shipping address found. Please add one in your profile settings.
              </p>
            )}
          </div>
        </motion.div>

        {/* Payment Section */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 space-y-6"
        >
          {/* Connect Wallet */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
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

            <button
              onClick={handlePlaceOrder}
              disabled={!walletConnected || cartItems.length === 0 || !buyerProfile?.shippingAddress || isProcessing || parseFloat(tokenBalance) < orderSummary.total}
              className="w-full mt-6 px-4 py-3 rounded-lg bg-[#FF1B6B] text-white hover:bg-[#D4145A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!buyerProfile?.shippingAddress ? 'Add Shipping Address to Continue' :
               isProcessing ? 'Processing...' :
               parseFloat(tokenBalance) < orderSummary.total ? `Insufficient ${selectedToken} Balance` :
               'Place Order'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout; 