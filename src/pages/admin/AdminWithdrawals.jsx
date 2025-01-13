import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc, getDoc, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiCheck, FiX, FiAlertTriangle, FiLoader } from 'react-icons/fi';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { NETWORK_NAMES } from '../../contracts/MerchPlatform';
import { getMerchPlatformContract } from '../../contracts/MerchPlatform';
import detectEthereumProvider from '@metamask/detect-provider';
import AdminRecentWithdrawals from './AdminRecentWithdrawals';
import { motion } from 'framer-motion';

const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF";

// Skeleton Components
const WithdrawalRequestSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </motion.div>
);

const PlatformFeeSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
  >
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full mr-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded flex-grow"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Get token addresses from environment variables
const getTokenAddresses = (chainId) => {
  if (chainId === 1301) { // Unichain
    return {
      USDT: import.meta.env.VITE_UNICHAIN_USDT_ADDRESS,
      USDC: import.meta.env.VITE_UNICHAIN_USDC_ADDRESS
    };
  } else if (chainId === 137) { // Polygon
    return {
      USDT: import.meta.env.VITE_USDT_ADDRESS_POLYGON,
      USDC: import.meta.env.VITE_USDC_ADDRESS_POLYGON
    };
  }
  return null;
};

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const theme = localStorage.getItem('admin-theme') || 'light';
  const [platformFeeAmounts, setPlatformFeeAmounts] = useState({
    unichain: {
      USDT: { fees: '0', amount: '', loading: false, error: null },
      USDC: { fees: '0', amount: '', loading: false, error: null }
    },
    polygon: {
      USDT: { fees: '0', amount: '', loading: false, error: null },
      USDC: { fees: '0', amount: '', loading: false, error: null }
    }
  });

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      try {
        const provider = await detectEthereumProvider();
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0 && accounts[0].toLowerCase() === ADMIN_WALLET.toLowerCase()) {
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0 || accounts[0].toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
          setWalletConnected(false);
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (walletConnected && walletAddress.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
      fetchWithdrawals();
    } else {
      setLoading(false);
    }
  }, [walletConnected, walletAddress]);

  const fetchWithdrawals = async () => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) return;
    try {
      const withdrawalsQuery = query(
        collection(db, 'withdrawals'),
        where('status', '==', 'pending'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(withdrawalsQuery);
      
      // Fetch all unique seller IDs
      const sellerIds = [...new Set(snapshot.docs.map(doc => doc.data().sellerId))];
      
      // Fetch seller details in parallel
      const sellerDetailsPromises = sellerIds.map(sellerId => 
        getDoc(doc(db, 'sellers', sellerId))
      );
      const sellerDetailsSnapshots = await Promise.all(sellerDetailsPromises);
      
      // Create a map of seller details
      const sellerDetailsMap = {};
      sellerDetailsSnapshots.forEach(sellerDoc => {
        if (sellerDoc.exists()) {
          sellerDetailsMap[sellerDoc.id] = sellerDoc.data();
        }
      });

      // Map withdrawals with seller details
      const withdrawalData = snapshot.docs.map(doc => {
        const data = doc.data();
        const sellerDetails = sellerDetailsMap[data.sellerId] || {};
        return {
          id: doc.id,
          ...data,
          storeName: sellerDetails.storeName || 'Unknown Store',
          storeId: `SELL_${data.sellerId}`,
          storeAvatar: sellerDetails.avatarUrl || null
        };
      });

      setWithdrawals(withdrawalData);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error('Failed to fetch withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawal) => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      toast.error('Please connect your admin wallet');
      return;
    }
    
    setProcessingId(withdrawal.id);

    try {
      // Get the network for this withdrawal
      const network = withdrawal.network === 'unichain' ? '1301' : '137';
      const chainId = Number(network);

      // Only switch network if we're on a different network
      if (chain?.id !== chainId && switchNetwork) {
        try {
          await switchNetwork(chainId);
          // Wait for network switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          throw new Error(`Failed to switch to ${network === '1301' ? 'Unichain' : 'Polygon'} network`);
        }
      }

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get contract with signer - note the order: provider first, then chainId
      const contract = await getMerchPlatformContract(signer, chainId);
      if (!contract) {
        throw new Error('Could not get contract instance');
      }

      // Convert amount to proper decimals (6 for USDT/USDC)
      const amount = ethers.parseUnits(withdrawal.amount.toString(), 6);
      
      // Get token address based on network and token type
      const tokenAddress = withdrawal.token === 'USDT' 
        ? (chainId === 1301 ? import.meta.env.VITE_UNICHAIN_USDT_ADDRESS : import.meta.env.VITE_USDT_ADDRESS_POLYGON)
        : (chainId === 1301 ? import.meta.env.VITE_UNICHAIN_USDC_ADDRESS : import.meta.env.VITE_USDC_ADDRESS_POLYGON);

      // Show pending toast
      toast.loading('Please confirm the transaction in MetaMask...', { id: 'withdrawal' });

      // Approve withdrawal on-chain
      const tx = await contract.approveWithdrawal(
        withdrawal.walletAddress,
        tokenAddress,
        amount
      );

      // Update toast to show transaction is processing
      toast.loading('Processing withdrawal...', { id: 'withdrawal' });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Update withdrawal status
        await updateDoc(doc(db, 'withdrawals', withdrawal.id), {
          status: 'completed',
          completedAt: serverTimestamp(),
          transactionHash: tx.hash
        });

        // Update seller's balance
        const sellerRef = doc(db, 'sellers', withdrawal.sellerId);
        const sellerDoc = await getDoc(sellerRef);
        if (sellerDoc.exists()) {
          const currentBalance = sellerDoc.data().balance || 0;
          await updateDoc(sellerRef, {
            balance: Math.max(0, currentBalance - withdrawal.amount) // Ensure balance doesn't go below 0
          });
        }

        toast.success('Withdrawal approved successfully', { id: 'withdrawal' });
        
        // Refresh the withdrawals list
        await fetchWithdrawals();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error(
        error.message.includes('user rejected') 
          ? 'Transaction was rejected'
          : error.message || 'Failed to approve withdrawal',
        { id: 'withdrawal' }
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (withdrawalId) => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) return;
    try {
      await updateDoc(doc(db, 'withdrawals', withdrawalId), {
        status: 'rejected',
        processedAt: new Date()
      });
      toast.success('Withdrawal rejected');
      fetchWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast.error('Failed to reject withdrawal');
    }
  };

  const fetchPlatformFees = async () => {
    console.log('Starting to fetch platform fees...');
    
    // Set loading states
    setPlatformFeeAmounts(prev => ({
      unichain: {
        USDT: { ...prev.unichain.USDT, loading: true, error: null },
        USDC: { ...prev.unichain.USDC, loading: true, error: null }
      },
      polygon: {
        USDT: { ...prev.polygon.USDT, loading: true, error: null },
        USDC: { ...prev.polygon.USDC, loading: true, error: null }
      }
    }));

    try {
      // Token ABI for balance checking
      const tokenABI = ["function balanceOf(address) view returns (uint256)"];

      // Get Unichain balances
      console.log('Connecting to Unichain network...');
      const unichainProvider = new ethers.JsonRpcProvider('https://sepolia.unichain.org');
      const unichainContract = await getMerchPlatformContract(unichainProvider, '1301');
      const unichainAddresses = getTokenAddresses(1301);

      // Get Polygon balances
      console.log('Connecting to Polygon network...');
      const polygonProvider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/' + import.meta.env.VITE_ALCHEMY_API_KEY);
      const polygonContract = await getMerchPlatformContract(polygonProvider, '137');
      const polygonAddresses = getTokenAddresses(137);

      let newFeeAmounts = {
        unichain: {
          USDT: { amount: '', fees: '0', loading: false, error: null },
          USDC: { amount: '', fees: '0', loading: false, error: null }
        },
        polygon: {
          USDT: { amount: '', fees: '0', loading: false, error: null },
          USDC: { amount: '', fees: '0', loading: false, error: null }
        }
      };

      // Fetch Unichain balances
      if (unichainContract && unichainAddresses) {
        try {
          // Get USDT balance
          const unichainUSDTContract = new ethers.Contract(
            unichainAddresses.USDT,
            tokenABI,
            unichainProvider
          );
          const unichainUSDTBalance = await unichainUSDTContract.balanceOf(unichainContract.target);
          newFeeAmounts.unichain.USDT = {
            amount: '',
            fees: ethers.formatUnits(unichainUSDTBalance, 6),
            loading: false,
            error: null
          };

          // Get USDC balance
          const unichainUSDCContract = new ethers.Contract(
            unichainAddresses.USDC,
            tokenABI,
            unichainProvider
          );
          const unichainUSDCBalance = await unichainUSDCContract.balanceOf(unichainContract.target);
          newFeeAmounts.unichain.USDC = {
            amount: '',
            fees: ethers.formatUnits(unichainUSDCBalance, 6),
            loading: false,
            error: null
          };
        } catch (error) {
          console.error('Error fetching Unichain balances:', error);
          newFeeAmounts.unichain.USDT.error = 'Failed to fetch balance';
          newFeeAmounts.unichain.USDC.error = 'Failed to fetch balance';
        }
      }

      // Fetch Polygon balances
      if (polygonContract && polygonAddresses) {
        try {
          // Get USDT balance
          const polygonUSDTContract = new ethers.Contract(
            polygonAddresses.USDT,
            tokenABI,
            polygonProvider
          );
          const polygonUSDTBalance = await polygonUSDTContract.balanceOf(polygonContract.target);
          newFeeAmounts.polygon.USDT = {
            amount: '',
            fees: ethers.formatUnits(polygonUSDTBalance, 6),
            loading: false,
            error: null
          };

          // Get USDC balance
          const polygonUSDCContract = new ethers.Contract(
            polygonAddresses.USDC,
            tokenABI,
            polygonProvider
          );
          const polygonUSDCBalance = await polygonUSDCContract.balanceOf(polygonContract.target);
          newFeeAmounts.polygon.USDC = {
            amount: '',
            fees: ethers.formatUnits(polygonUSDCBalance, 6),
            loading: false,
            error: null
          };
        } catch (error) {
          console.error('Error fetching Polygon balances:', error);
          newFeeAmounts.polygon.USDT.error = 'Failed to fetch balance';
          newFeeAmounts.polygon.USDC.error = 'Failed to fetch balance';
        }
      }

      setPlatformFeeAmounts(newFeeAmounts);
    } catch (error) {
      console.error('Error in fetchPlatformFees:', error);
      toast.error('Failed to fetch platform fees');
    }
  };

  useEffect(() => {
    let intervalId;
    
    const fetchAndSetFees = async () => {
      if (!walletConnected) return;
      
      try {
        await fetchPlatformFees();
      } catch (error) {
        console.error('Error in fetchAndSetFees:', error);
      }
    };

    // Initial fetch
    fetchAndSetFees();

    // Only set up interval if wallet is connected
    if (walletConnected) {
      intervalId = setInterval(fetchAndSetFees, 60000); // Fetch every minute instead of every 30 seconds
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        console.log('Clearing platform fees interval');
        clearInterval(intervalId);
      }
    };
  }, [walletConnected]); // Only re-run when wallet connection status changes

  // Add a manual refresh button
  const handleManualRefresh = () => {
    console.log('Manually refreshing platform fees...');
    fetchPlatformFees();
  };

  const handleAmountChange = (network, token, value) => {
    setPlatformFeeAmounts(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        [token]: { ...prev[network][token], amount: value }
      }
    }));
  };

  const handleWithdrawPlatformFees = async (network, token) => {
    if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      toast.error('Please connect your admin wallet');
      return;
    }

    const amount = platformFeeAmounts[network][token].amount;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Show pending toast early to indicate processing
      toast.loading('Preparing transaction...', { id: 'platform-fee-withdrawal' });

      const chainId = network === 'unichain' ? 1301 : 137;
      console.log('Starting withdrawal process:', { network, token, chainId, amount });

      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Check if we need to switch networks
      const currentChainId = Number(window.ethereum.networkVersion);
      if (currentChainId !== chainId) {
        console.log('Switching network to:', chainId);
        try {
          if (chainId === 137) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }], // 137 in hex
            });
          } else {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x515' }], // 1301 in hex
            });
          }
          // Wait for network switch to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          // Handle the case where the network needs to be added first
          if (error.code === 4902) {
            try {
              if (chainId === 137) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x89',
                    chainName: 'Polygon Mainnet',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/']
                  }]
                });
              } else {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x515',
                    chainName: 'Unichain Testnet',
                    nativeCurrency: { name: 'UNW', symbol: 'UNW', decimals: 18 },
                    rpcUrls: [import.meta.env.VITE_UNICHAIN_RPC_URL],
                    blockExplorerUrls: [import.meta.env.VITE_UNICHAIN_EXPLORER_URL]
                  }]
                });
              }
              // Wait after adding network
              await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (addError) {
              console.error('Failed to add network:', addError);
              toast.error(`Failed to add ${network} network to MetaMask`, { id: 'platform-fee-withdrawal' });
              return;
            }
          }
          console.error('Network switch failed:', error);
          toast.error(`Failed to switch to ${network} network`, { id: 'platform-fee-withdrawal' });
          return;
        }
      }

      // Verify we're on the correct network after switching
      const finalChainId = Number(window.ethereum.networkVersion);
      if (finalChainId !== chainId) {
        toast.error(`Please switch to ${network} network in MetaMask`, { id: 'platform-fee-withdrawal' });
        return;
      }

      console.log('Getting provider and signer...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      console.log('Getting contract instance...');
      const contract = await getMerchPlatformContract(signer, chainId.toString());
      
      if (!contract) {
        toast.error('Could not get contract instance', { id: 'platform-fee-withdrawal' });
        return;
      }

      // Get token addresses for the current chain
      const tokenAddresses = getTokenAddresses(chainId);
      if (!tokenAddresses) {
        toast.error(`No token addresses found for chain ${chainId}`, { id: 'platform-fee-withdrawal' });
        return;
      }

      const tokenAddress = tokenAddresses[token];
      if (!tokenAddress) {
        toast.error(`No address found for token ${token} on chain ${chainId}`, { id: 'platform-fee-withdrawal' });
        return;
      }

      console.log('Contract and token details:', {
        contractAddress: contract.target,
        tokenAddress,
        withdrawAmount: amount
      });

      const parsedAmount = ethers.parseUnits(amount.toString(), 6);

      // Update toast before transaction
      toast.loading('Please confirm the transaction in MetaMask...', { id: 'platform-fee-withdrawal' });
      
      // Call withdrawPlatformFees function with explicit gas limit
      const tx = await contract.withdrawPlatformFees(
        tokenAddress,
        parsedAmount,
        { gasLimit: 500000 } // Add explicit gas limit
      );

      console.log('Transaction submitted:', tx.hash);
      toast.loading(`Processing platform fee withdrawal...`, { id: 'platform-fee-withdrawal' });

      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      if (receipt.status === 1) {
        // Create a withdrawal record in Firestore
        const withdrawalRef = doc(collection(db, 'withdrawals'));
        await setDoc(withdrawalRef, {
          id: withdrawalRef.id,
          amount: parseFloat(amount),
          token,
          network,
          status: 'completed',
          type: 'platform_fee',
          walletAddress: walletAddress,
          timestamp: new Date(),
          transactionHash: tx.hash,
          processedAt: new Date(),
          processedBy: walletAddress
        });

        toast.success(`Successfully withdrew ${amount} ${token}`, { id: 'platform-fee-withdrawal' });
        
        // Clear the input field
        setPlatformFeeAmounts(prev => ({
          ...prev,
          [network]: {
            ...prev[network],
            [token]: {
              ...prev[network][token],
              amount: ''
            }
          }
        }));

        // Refresh platform fees
        fetchPlatformFees();
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error withdrawing platform fees:', error);
      toast.error(
        error.message || 'Failed to withdraw platform fees',
        { id: 'platform-fee-withdrawal' }
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"
          />
          <motion.div 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"
          />
        </div>
        <PlatformFeeSkeleton />
        {[...Array(3)].map((_, i) => (
          <WithdrawalRequestSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!walletConnected || walletAddress.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FiAlertTriangle className="w-16 h-16 text-[#FF1B6B] mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Please connect your admin wallet to access the withdrawals page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Withdrawal Requests</h1>
        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 text-sm font-medium text-white bg-[#FF1B6B] rounded hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
        >
          Refresh Balances
        </button>
      </div>
      
      {/* Platform Fee Withdrawal Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Fee Withdrawals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unichain Network */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img src="/unichain-logo.png" alt="Unichain" className="w-6 h-6 mr-2" />
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Unichain Network</h3>
            </div>
            <div className="space-y-4">
              {/* USDT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/logos/usdt.png" alt="USDT" className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">USDT</span>
                  </div>
                  <div className="text-right">
                    {platformFeeAmounts.unichain.USDT.loading ? (
                      <div className="w-4 h-4 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin ml-auto" />
                    ) : platformFeeAmounts.unichain.USDT.error ? (
                      <div className="text-sm text-red-500 dark:text-red-400">{platformFeeAmounts.unichain.USDT.error}</div>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Platform Fees: ${parseFloat(platformFeeAmounts.unichain.USDT.fees || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={platformFeeAmounts.unichain.USDT.amount}
                    onChange={(e) => handleAmountChange('unichain', 'USDT', e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-1 text-sm rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleWithdrawPlatformFees('unichain', 'USDT')}
                    className="px-3 py-1 text-sm font-medium text-white bg-[#FF1B6B] rounded hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              
              {/* USDC */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/logos/usdc.png" alt="USDC" className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">USDC</span>
                  </div>
                  <div className="text-right">
                    {platformFeeAmounts.unichain.USDC.loading ? (
                      <div className="w-4 h-4 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin ml-auto" />
                    ) : platformFeeAmounts.unichain.USDC.error ? (
                      <div className="text-sm text-red-500 dark:text-red-400">{platformFeeAmounts.unichain.USDC.error}</div>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Platform Fees: ${parseFloat(platformFeeAmounts.unichain.USDC.fees || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={platformFeeAmounts.unichain.USDC.amount}
                    onChange={(e) => handleAmountChange('unichain', 'USDC', e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-1 text-sm rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleWithdrawPlatformFees('unichain', 'USDC')}
                    className="px-3 py-1 text-sm font-medium text-white bg-[#FF1B6B] rounded hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Polygon Network */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <img src="/polygon.png" alt="Polygon" className="w-6 h-6 mr-2" />
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Polygon Network</h3>
            </div>
            <div className="space-y-4">
              {/* USDT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/logos/usdt.png" alt="USDT" className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">USDT</span>
                  </div>
                  <div className="text-right">
                    {platformFeeAmounts.polygon.USDT.loading ? (
                      <div className="w-4 h-4 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin ml-auto" />
                    ) : platformFeeAmounts.polygon.USDT.error ? (
                      <div className="text-sm text-red-500 dark:text-red-400">{platformFeeAmounts.polygon.USDT.error}</div>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Platform Fees: ${parseFloat(platformFeeAmounts.polygon.USDT.fees || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={platformFeeAmounts.polygon.USDT.amount}
                    onChange={(e) => handleAmountChange('polygon', 'USDT', e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-1 text-sm rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleWithdrawPlatformFees('polygon', 'USDT')}
                    className="px-3 py-1 text-sm font-medium text-white bg-[#FF1B6B] rounded hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              
              {/* USDC */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/logos/usdc.png" alt="USDC" className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">USDC</span>
                  </div>
                  <div className="text-right">
                    {platformFeeAmounts.polygon.USDC.loading ? (
                      <div className="w-4 h-4 border-2 border-[#FF1B6B] border-t-transparent rounded-full animate-spin ml-auto" />
                    ) : platformFeeAmounts.polygon.USDC.error ? (
                      <div className="text-sm text-red-500 dark:text-red-400">{platformFeeAmounts.polygon.USDC.error}</div>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Platform Fees: ${parseFloat(platformFeeAmounts.polygon.USDC.fees || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={platformFeeAmounts.polygon.USDC.amount}
                    onChange={(e) => handleAmountChange('polygon', 'USDC', e.target.value)}
                    placeholder="Enter amount"
                    className="block w-full px-3 py-1 text-sm rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleWithdrawPlatformFees('polygon', 'USDC')}
                    className="px-3 py-1 text-sm font-medium text-white bg-[#FF1B6B] rounded hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        {withdrawals.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No pending withdrawal requests
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Network</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {withdrawal.storeAvatar ? (
                        <img 
                          src={withdrawal.storeAvatar} 
                          alt={withdrawal.storeName || 'Store'}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#FF1B6B] bg-opacity-10 flex items-center justify-center mr-3">
                          <span className="text-[#FF1B6B] text-sm font-medium">
                            {(withdrawal.storeName || 'S').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {withdrawal.storeName || 'Unknown Store'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {withdrawal.storeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${withdrawal.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <img 
                        src={`/logos/${withdrawal.token.toLowerCase()}.png`}
                        alt={withdrawal.token}
                        className="w-5 h-5 mr-2"
                      />
                      {withdrawal.token}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <img 
                        src={withdrawal.network === 'unichain' ? '/unichain-logo.png' : '/polygon.png'}
                        alt={withdrawal.network === 'unichain' ? 'Unichain Testnet' : 'Polygon'}
                        className="w-5 h-5 mr-2"
                      />
                      {withdrawal.network === 'unichain' ? 'Unichain Testnet' : 'Polygon'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <span className="truncate max-w-[120px]">{withdrawal.walletAddress}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(withdrawal.walletAddress);
                          toast.success('Wallet address copied!');
                        }}
                        className="text-[#FF1B6B] hover:text-[#D4145A] dark:hover:text-[#FF1B6B]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(withdrawal.timestamp?.toDate()).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {processingId === withdrawal.id ? (
                      <button
                        disabled
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#FF1B6B] opacity-50 cursor-not-allowed"
                      >
                        <FiLoader className="mr-1 animate-spin" />
                        Processing...
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(withdrawal)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] dark:focus:ring-offset-gray-800"
                        >
                          <FiCheck className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(withdrawal.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                        >
                          <FiX className="mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Withdrawals Section */}
      <AdminRecentWithdrawals />
    </div>
  );
} 