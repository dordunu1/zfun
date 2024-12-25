import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { BiWallet } from 'react-icons/bi';
import { useWeb3Modal } from '@web3modal/react';
import { useUnichain } from '../../../hooks/useUnichain';
import TokenSelectionModal from './TokenSelectionModal';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { ERC20_ABI } from '../../../services/erc20';
import { getTokenDeploymentByAddress } from '../../../services/firebase';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';
import { FaStar } from 'react-icons/fa';

// Common tokens with metadata
const COMMON_TOKENS = [
  {
    address: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/usdc.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

// Replace the Icons object with modern DeFi-inspired icons
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path className="animate-[spin_1s_linear_infinite]" 
          d="M12 6v1M12 17v1M7.05 7.05l.707.707M16.243 16.243l.707.707M6 12h1M17 12h1M7.757 16.243l-.707.707M16.95 7.05l-.707.707">
        </path>
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
          strokeOpacity="0.2" 
        />
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" 
          strokeLinecap="round" 
          className="origin-center animate-[spin_1.5s_linear_infinite]" 
        />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path className="animate-[draw_1s_ease-in-out]" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} stroke="currentColor"
        d="M7 11l3 3L19 5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeDasharray="60"
        strokeDashoffset="60">
        <animate
          attributeName="stroke-dashoffset"
          from="60"
          to="0"
          dur="0.6s"
          fill="freeze"
        />
      </path>
    </svg>
  ),
  Creating: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path className="animate-pulse" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path className="animate-[spin_3s_linear_infinite]" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" className="animate-[pulse_2s_ease-in-out_infinite]" />
      </g>
    </svg>
  ),
  Adding: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 8v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.6s_ease-in-out]" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="animate-[pulse_2s_ease-in-out_infinite]" />
      </g>
    </svg>
  ),
  Confirming: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path strokeLinecap="round" className="origin-center animate-[spin_2s_linear_infinite]"
          d="M12 6v6l4 4" />
      </g>
    </svg>
  ),
  Completed: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g>
        <path className="animate-[draw_0.6s_ease-in-out]" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} stroke="currentColor"
          d="M7 13l3 3L17 8" strokeDasharray="60" strokeDashoffset="60">
          <animate
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="0.6s"
            fill="freeze"
          />
        </path>
        <path fill="currentColor" fillOpacity="0.2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      </g>
    </svg>
  ),
  Error: () => (
    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

// Add PoolProgressModal component
const PoolProgressModal = ({ isOpen, onClose, currentStep, token0, token1, isNewPool, error }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    ...(isNewPool ? [{ id: 'creating', title: 'Creating Pool', icon: <Icons.Creating /> }] : []),
    { id: 'adding', title: 'Adding Liquidity', icon: <Icons.Adding /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);

  // Format error message to be more user-friendly
  const formatErrorMessage = (error) => {
    if (error?.includes('user rejected')) {
      return 'Transaction was rejected. Please try again.';
    }
    if (error?.includes('insufficient')) {
      return 'Insufficient balance for transaction.';
    }
    if (error?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
      return 'Price impact too high, try a smaller amount.';
    }
    if (error?.includes('EXCESSIVE_INPUT_AMOUNT')) {
      return 'Insufficient liquidity for this trade.';
    }
    return error?.replace(/\{"action":"sendTransaction".*$/, '') || 'An error occurred';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  {isError ? 'Error Creating Pool' : (isNewPool ? 'Creating New Pool' : 'Adding Initial Liquidity')}
                  {!isError && token0 && token1 && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {token0.symbol} + {token1.symbol}
                    </div>
                  )}
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = !isError && steps.findIndex(s => s.id === currentStep) > index;
                    const isErrorStep = isError && currentStep === step.id;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive && !isErrorStep ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                          isCompleted ? 'text-[#00ffbd]' : 
                          isErrorStep ? 'bg-red-500/10 text-red-500' : 
                          'text-gray-400'
                        }`}
                      >
                        {step.icon}
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">{step.title}</span>
                          {isActive && !isError && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {step.id === 'preparing' && 'Preparing transaction...'}
                              {step.id === 'approval' && `Approving ${token0?.symbol} and ${token1?.symbol}`}
                              {step.id === 'creating' && `Creating ${token0?.symbol}/${token1?.symbol} pool`}
                              {step.id === 'adding' && `Adding liquidity for ${token0?.symbol}/${token1?.symbol}`}
                              {step.id === 'confirming' && 'Waiting for confirmation...'}
                              {step.id === 'completed' && (isNewPool 
                                ? `Successfully created ${token0?.symbol}/${token1?.symbol} pool!`
                                : `Successfully added liquidity to ${token0?.symbol}/${token1?.symbol} pool!`)}
                            </p>
                          )}
                        </div>
                        {isCompleted && (
                          <svg className="w-5 h-5 text-[#00ffbd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isError && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <Icons.Error />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                        <p className="mt-1 text-sm text-red-400">
                          {formatErrorMessage(error)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'completed' && (
                  <div className="mt-6">
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 rounded-xl font-medium bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors text-black"
                    >
                      Close
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Add StarRatingModal component
const StarRatingModal = ({ isOpen, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[99998]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                >
                  Rate Your Pool Creation Experience
                </Dialog.Title>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    {[...Array(9)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={starValue}
                          className="transition-transform hover:scale-110 focus:outline-none"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(0)}
                        >
                          <FaStar
                            size={28}
                            className={`transition-colors ${
                              (hover || rating) >= starValue
                                ? 'text-[#00ffbd]'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {rating === 0 ? 'Select a rating' : `You rated: ${rating} star${rating !== 1 ? 's' : ''}`}
                  </p>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        if (rating > 0) {
                          onRate(rating);
                          onClose();
                        }
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        rating > 0
                          ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
                          : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Submit Rating
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function PoolCreation() {
  const { address: account, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const [currentChainId, setCurrentChainId] = useState(null);
  const uniswap = useUnichain();
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [fee, setFee] = useState('0.3');
  const [loading, setLoading] = useState(false);
  const [showToken0Modal, setShowToken0Modal] = useState(false);
  const [showToken1Modal, setShowToken1Modal] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [isNewPool, setIsNewPool] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [error, setError] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add useEffect to get chain ID and listen for changes
  useEffect(() => {
    const checkChain = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentChainId(parseInt(chainId, 16));
      }
    };
    checkChain();

    window.ethereum?.on('chainChanged', (chainId) => {
      setCurrentChainId(parseInt(chainId, 16));
    });
  }, []);

  // Add function to validate Ethereum address
  const isValidAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Handle token selection
  const handleToken0Select = async (token) => {
    try {
      // Check for WETH and show warning
      if (token.symbol === 'WETH') {
        toast.error('Please use ETH instead of WETH. The router will automatically convert ETH to WETH.', {
          duration: 6000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return;
      }

      if (token.symbol === 'ETH') {
        setToken0({
          ...token,
          address: UNISWAP_ADDRESSES.WETH,
          decimals: 18
        });
      } else {
        // Try to get token info from Firebase first
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(token.address);
          if (tokenDeployment) {
            setToken0({
              ...token,
              name: tokenDeployment.name,
              symbol: tokenDeployment.symbol,
              decimals: tokenDeployment.decimals || 18,
              logo: tokenDeployment.logo,
              logoIpfs: tokenDeployment.logoIpfs
            });
          } else {
            // Fallback to contract info
            const tokenInfo = await uniswap.getTokenInfo(token.address);
            setToken0({ 
              ...token,
              ...tokenInfo,
              name: token.name || tokenInfo.name,
              symbol: token.symbol || tokenInfo.symbol,
              logo: token.logo || '/token-placeholder.png'  // Add fallback logo
            });
          }
        } catch (firebaseError) {
          console.warn('Firebase fetch failed, falling back to contract:', firebaseError);
          // Fallback to contract info
          const tokenInfo = await uniswap.getTokenInfo(token.address);
          setToken0({ 
            ...token,
            ...tokenInfo,
            name: token.name || tokenInfo.name,
            symbol: token.symbol || tokenInfo.symbol,
            logo: token.logo || '/token-placeholder.png'  // Add fallback logo
          });
        }
      }
      setShowToken0Modal(false);
    } catch (error) {
      console.error('Error selecting token:', error);
      toast.error('Failed to load token information. Please try again.');
    }
  };

  const handleToken1Select = async (token) => {
    try {
      // Check for WETH and show warning
      if (token.symbol === 'WETH') {
        toast.error('Please use ETH instead of WETH. The router will automatically convert ETH to WETH.', {
          duration: 6000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        return;
      }

      if (token.symbol === 'ETH') {
        setToken1({
          ...token,
          address: UNISWAP_ADDRESSES.WETH,
          decimals: 18
        });
      } else {
        // Try to get token info from Firebase first
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(token.address);
          if (tokenDeployment) {
            setToken1({
              ...token,
              name: tokenDeployment.name,
              symbol: tokenDeployment.symbol,
              decimals: tokenDeployment.decimals || 18,
              logo: tokenDeployment.logo,
              logoIpfs: tokenDeployment.logoIpfs
            });
          } else {
            // Fallback to contract info
            const tokenInfo = await uniswap.getTokenInfo(token.address);
            setToken1({ 
              ...token,
              ...tokenInfo,
              name: token.name || tokenInfo.name,
              symbol: token.symbol || tokenInfo.symbol,
              logo: token.logo || '/token-placeholder.png'  // Add fallback logo
            });
          }
        } catch (firebaseError) {
          console.warn('Firebase fetch failed, falling back to contract:', firebaseError);
          // Fallback to contract info
          const tokenInfo = await uniswap.getTokenInfo(token.address);
          setToken1({ 
            ...token,
            ...tokenInfo,
            name: token.name || tokenInfo.name,
            symbol: token.symbol || tokenInfo.symbol,
            logo: token.logo || '/token-placeholder.png'  // Add fallback logo
          });
        }
      }
      setShowToken1Modal(false);
    } catch (error) {
      console.error('Error selecting token:', error);
      toast.error('Failed to load token information. Please try again.');
    }
  };

  // Handle amount changes
  const handleAmount0Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount0(value);
    }
  };

  const handleAmount1Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount1(value);
    }
  };

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRating = (rating) => {
    console.log('User rated pool creation:', rating);
    // Here you can implement the logic to save the rating
  };

  // Modify handleCreatePool
  const handleCreatePool = async () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (!token0 || !token1) {
      setError('Please select both tokens');
      setShowProgressModal(true);
      setCurrentStep('preparing');
      return;
    }

    // Check for WETH at the start
    if (token0?.symbol === 'WETH' || token1?.symbol === 'WETH') {
      setError('Please use ETH instead of WETH. The router will automatically convert ETH to WETH.');
      setShowProgressModal(true);
      setCurrentStep('preparing');
      return;
    }

    if (!amount0 || !amount1) {
      setError('Please enter both amounts');
      setShowProgressModal(true);
      setCurrentStep('preparing');
      return;
    }

    setLoading(true);
    setShowProgressModal(true);
    setCurrentStep('preparing');
    setError(null);
    
    try {
      // Parse amounts
      const parsedAmount0 = ethers.parseUnits(amount0, token0.decimals);
      const parsedAmount1 = ethers.parseUnits(amount1, token1.decimals);

      // Check if pool exists
      const poolExists = await uniswap.checkPoolExists(token0.address, token1.address);
      setIsNewPool(!poolExists);

      setCurrentStep('approval');
      
      // Create pool and add liquidity
      if (!poolExists) {
        setCurrentStep('creating');
      }

      setCurrentStep('adding');
      const result = await uniswap.createPool(
        token0.address,
        token1.address,
        parsedAmount0,
        parsedAmount1
      );

      setCurrentStep('confirming');
      // Add small delay to show confirming state
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('completed');
      
      // Show completed state briefly, then close modal and show confetti
      setTimeout(() => {
        setShowProgressModal(false);
        setCurrentStep(null);
        
        // Show confetti after modal is closed
        setTimeout(() => {
          setShowConfetti(true);
          
          // Show rating modal after a short delay
          setTimeout(() => {
            setShowRatingModal(true);
          }, 1000);
          
          // Reset form and cleanup after confetti (30 seconds)
          setTimeout(() => {
            setAmount0('');
            setAmount1('');
            setShowConfetti(false);
          }, 30000); // 30 seconds
        }, 100);
      }, 1000);
      
      // Reset form
      setAmount0('');
      setAmount1('');
      setToken0(null);
      setToken1(null);
    } catch (error) {
      console.error('Error creating pool:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch price ratio when tokens are selected
  useEffect(() => {
    async function fetchPriceRatio() {
      if (!token0 || !token1) return;

      try {
        // For demo purposes, using a simple 1:1 ratio
        setPriceRatio(1);
        
        // If amounts exist and auto-price is enabled, update them
        if (useAutoPrice) {
          if (amount0) {
            setAmount1(calculateOtherAmount(amount0, true));
          } else if (amount1) {
            setAmount0(calculateOtherAmount(amount1, false));
          }
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setPriceRatio(1);
      }
    }

    fetchPriceRatio();
  }, [token0, token1]);

  // Add useEffect to calculate and update price info
  useEffect(() => {
    async function updatePriceInfo() {
      if (!token0 || !token1 || !amount0 || !amount1) {
        setPriceInfo(null);
        return;
      }

      try {
        const parsedAmount0 = ethers.parseUnits(amount0, token0.decimals);
        const parsedAmount1 = ethers.parseUnits(amount1, token1.decimals);

        const prices = uniswap.calculateInitialPoolPrice(
          parsedAmount0,
          parsedAmount1,
          token0.decimals,
          token1.decimals
        );

        setPriceInfo({
          token0Price: prices.token0Price,
          token1Price: prices.token1Price
        });
      } catch (error) {
        console.error('Error calculating price:', error);
        setPriceInfo(null);
      }
    }

    updatePriceInfo();
  }, [token0, token1, amount0, amount1]);

  // Add TokenBalance component
  const TokenBalance = ({ token }) => {
    const [balance, setBalance] = useState('0');
    const { address } = useAccount();

    useEffect(() => {
      async function getBalance() {
        if (!token || !address) return;

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Handle ETH balance differently
          if (token.symbol === 'ETH') {
            const rawBalance = await provider.getBalance(address);
            const formattedBalance = ethers.formatUnits(rawBalance, 18);
            setBalance(formattedBalance);
            return;
          }

          // For ERC20 tokens
          const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const rawBalance = await tokenContract.balanceOf(address);
          const formattedBalance = ethers.formatUnits(rawBalance, token.decimals);
          setBalance(formattedBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('0');
        }
      }

      getBalance();
    }, [token, address]);

    if (!token) return null;

    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Balance: {Number(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Add Confetti component with higher z-index */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.2}
          initialVelocityX={10}
          initialVelocityY={10}
          colors={['#00ffbd', '#00e6a9', '#00cc95', '#00b381', '#00996d']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999,
            pointerEvents: 'none'
          }}
        />
      )}

      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please connect your wallet to create a liquidity pool
            </p>
            <button
              onClick={openConnectModal}
              className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Token 0 Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Token 1
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setShowToken0Modal(true)}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
                >
                  {token0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={token0.logo} alt={token0.symbol} className="w-5 h-5" />
                        <span>{token0.symbol}</span>
                      </div>
                      <TokenBalance token={token0} />
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {token0 && (
                <input
                  type="text"
                  value={amount0}
                  onChange={(e) => handleAmount0Change(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                />
              )}
            </div>

            {/* Token 1 Selection */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Token 2
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setShowToken1Modal(true)}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
                >
                  {token1 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={token1.logo} alt={token1.symbol} className="w-5 h-5" />
                        <span>{token1.symbol}</span>
                      </div>
                      <TokenBalance token={token1} />
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {token1 && (
                <input
                  type="text"
                  value={amount1}
                  onChange={(e) => handleAmount1Change(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                />
              )}
            </div>

            {/* Price Information */}
            {priceInfo && token0 && token1 && (
              <div className="mt-6 p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Initial Pool Price
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      1 {token0.symbol} =
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Number(priceInfo.token0Price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token1.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      1 {token1.symbol} =
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Number(priceInfo.token1Price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token0.symbol}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Tier Selection */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Fee Tier
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['0.01', '0.05', '0.3', '1'].map((feeTier) => (
                  <button
                    key={feeTier}
                    onClick={() => setFee(feeTier)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium
                      ${fee === feeTier
                        ? 'bg-[#00ffbd] text-black'
                        : 'bg-white/10 dark:bg-[#2d2f36] text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80'
                      }
                      transition-colors
                    `}
                  >
                    {feeTier}%
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                About Pool Creation
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Creating a new liquidity pool allows you to be the first liquidity provider.
                The ratio of tokens you add will set the initial price. Make sure to add sufficient liquidity to minimize price impact from trades.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Pool Button */}
      <button
        onClick={handleCreatePool}
        disabled={loading || !token0 || !token1 || !amount0 || !amount1}
        className={`
          w-full px-4 py-4 rounded-xl font-medium text-black text-lg
          ${loading || !token0 || !token1 || !amount0 || !amount1
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
          }
        `}
      >
        {loading ? 'Creating Pool...' : 'Create Pool'}
      </button>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showToken0Modal}
        onClose={() => setShowToken0Modal(false)}
        onSelect={handleToken0Select}
        selectedTokenAddress={token0?.address}
      />
      <TokenSelectionModal
        isOpen={showToken1Modal}
        onClose={() => setShowToken1Modal(false)}
        onSelect={handleToken1Select}
        selectedTokenAddress={token1?.address}
      />

      {/* Add PoolProgressModal */}
      <PoolProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setCurrentStep(null);
          setError(null);
        }}
        currentStep={currentStep}
        token0={token0}
        token1={token1}
        isNewPool={isNewPool}
        error={error}
      />

      {/* Add Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={handleRating}
      />
    </div>
  );
} 