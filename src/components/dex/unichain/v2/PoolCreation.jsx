import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import Confetti from 'react-confetti';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnichain } from '../../../../hooks/useUnichain';
import TokenSelectionModal from '../shared/TokenSelectionModal';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { ERC20_ABI } from '../../../../services/erc20';
import { getTokenDeploymentByAddress } from '../../../../services/firebase';
import { BiWallet } from 'react-icons/bi';
import { useWeb3Modal } from '@web3modal/react';
import { toast } from 'react-hot-toast';

// Add CSS keyframes at the top of the file
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(0.8);
      opacity: 0.5;
    }
  }
`;
document.head.appendChild(style);

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
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" style={{ animation: 'rotate 2s linear infinite' }}>
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 6v2m0 8v2M6 12h2m8 0h2" strokeLinecap="round" style={{ animation: 'bounce 1.5s ease-in-out infinite' }} />
        <path d="M7.75 7.75l1.5 1.5m5.5 5.5l1.5 1.5m0-8.5l-1.5 1.5m-5.5 5.5l-1.5 1.5" strokeLinecap="round" style={{ animation: 'bounce 1.5s ease-in-out infinite', animationDelay: '0.2s' }} />
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
  ),
  Info: () => (
    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

// Add PoolProgressModal component
const PoolProgressModal = ({ isOpen, onClose, currentStep, token0, token1, isNewPool, error, poolExists, setActiveTab }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    ...(isNewPool ? [{ id: 'creating', title: 'Creating Pool', icon: <Icons.Creating /> }] : []),
    { id: 'adding', title: 'Adding Liquidity', icon: <Icons.Adding /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);
  const isExistingPool = error === 'pool exists';

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
                  {isExistingPool ? 'Pool Already Exists' : (isNewPool ? 'Creating New Pool' : 'Adding Initial Liquidity')}
                </Dialog.Title>

                {isExistingPool && poolExists ? (
                  <ExistingPoolMessage 
                    token0={token0} 
                    token1={token1} 
                    poolAddress={poolExists.address} 
                    onClose={onClose} 
                    setActiveTab={setActiveTab} 
                  />
                ) : (
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
                                {step.id === 'creating' && 'Creating new liquidity pool...'}
                                {step.id === 'adding' && 'Adding initial liquidity...'}
                                {step.id === 'confirming' && 'Waiting for confirmation...'}
                                {step.id === 'completed' && 'Transaction completed!'}
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

const ExistingPoolMessage = ({ token0, token1, poolAddress, onClose, setActiveTab }) => {
  const navigate = useNavigate();

  const handleAddLiquidity = () => {
    onClose();
    // Set the active tab to 'liquidity'
    setActiveTab('liquidity', {
      selectedTokens: { token0, token1 },
      poolAddress: poolAddress
    });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(poolAddress);
    toast.success('Pool address copied to clipboard!', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[#00ffbd]/5 dark:bg-[#00ffbd]/10 border border-[#00ffbd]/10 dark:border-[#00ffbd]/20">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#00ffbd] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pool Already Exists</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              A liquidity pool for {token0?.symbol}/{token1?.symbol} already exists.
            </p>
            <div className="mt-2 p-2 bg-white/50 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">Pool Address:</span>
                <button 
                  onClick={handleCopyAddress} 
                  className="text-xs text-[#00ffbd] hover:text-[#00ffbd]/80 transition-colors truncate"
                  title={poolAddress}
                >
                  {poolAddress.slice(0, 6)}...{poolAddress.slice(-4)} (Click to Copy)
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddLiquidity}
            className="px-4 py-2 text-sm font-medium text-black dark:text-black bg-[#00ffbd] rounded-lg hover:bg-[#00ffbd]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffbd] focus-visible:ring-offset-2 transition-colors"
          >
            Add Liquidity
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this function at the top level, before the PoolCreation component
const fetchPriceRatio = async (token0, token1, amount0, amount1) => {
  if (!token0 || !token1 || !amount0 || !amount1) {
    return null;
  }

  try {
    const price = parseFloat(amount1) / parseFloat(amount0);
    return price;
  } catch (error) {
    console.error('Error calculating price ratio:', error);
    return null;
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98
  }
};

export default function PoolCreation({ setActiveTab }) {
  const { address: isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const navigate = useNavigate();
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
  const [priceRatio, setPriceRatio] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [isNewPool, setIsNewPool] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [error, setError] = useState(null);
  const [poolExists, setPoolExists] = useState(null);
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

      let selectedToken;
      if (token.symbol === 'ETH') {
        selectedToken = {
          ...token,
          address: UNISWAP_ADDRESSES.WETH,
          decimals: 18
        };
      } else {
        // Try to get token info from Firebase first
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(token.address);
          if (tokenDeployment) {
            selectedToken = {
              ...token,
              name: tokenDeployment.name,
              symbol: tokenDeployment.symbol,
              decimals: tokenDeployment.decimals || 18,
              logo: tokenDeployment.logo,
              logoIpfs: tokenDeployment.logoIpfs
            };
          } else {
            // Fallback to contract info
            const tokenInfo = await uniswap.getTokenInfo(token.address);
            selectedToken = { 
              ...token,
              ...tokenInfo,
              name: token.name || tokenInfo.name,
              symbol: token.symbol || tokenInfo.symbol,
              logo: token.logo || '/token-placeholder.png'
            };
          }
        } catch (firebaseError) {
          console.warn('Firebase fetch failed, falling back to contract:', firebaseError);
          const tokenInfo = await uniswap.getTokenInfo(token.address);
          selectedToken = { 
            ...token,
            ...tokenInfo,
            name: token.name || tokenInfo.name,
            symbol: token.symbol || tokenInfo.symbol,
            logo: token.logo || '/token-placeholder.png'
          };
        }
      }
      
      setToken0(selectedToken);
      setShowToken0Modal(false);

      // Check for pool existence if both tokens are selected
      if (token1) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(
          '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
          ['function getPair(address tokenA, address tokenB) external view returns (address pair)'],
          provider
        );
        
        console.log('Checking pool existence for:', {
          token0: selectedToken.address,
          token1: token1.address
        });
        
        const poolAddress = await factoryContract.getPair(selectedToken.address, token1.address);
        console.log('Pool address:', poolAddress);
        
        if (poolAddress && poolAddress !== ethers.ZeroAddress) {
          console.log('Pool exists at address:', poolAddress);
          setPoolExists({ address: poolAddress });
          setError('pool exists');
          setShowProgressModal(true);
          setCurrentStep('preparing');
        } else {
          console.log('Pool does not exist');
          setPoolExists(null);
          setError(null);
        }
      }
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

      let selectedToken;
      if (token.symbol === 'ETH') {
        selectedToken = {
          ...token,
          address: UNISWAP_ADDRESSES.WETH,
          decimals: 18
        };
      } else {
        // Try to get token info from Firebase first
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(token.address);
          if (tokenDeployment) {
            selectedToken = {
              ...token,
              name: tokenDeployment.name,
              symbol: tokenDeployment.symbol,
              decimals: tokenDeployment.decimals || 18,
              logo: tokenDeployment.logo,
              logoIpfs: tokenDeployment.logoIpfs
            };
          } else {
            // Fallback to contract info
            const tokenInfo = await uniswap.getTokenInfo(token.address);
            selectedToken = { 
              ...token,
              ...tokenInfo,
              name: token.name || tokenInfo.name,
              symbol: token.symbol || tokenInfo.symbol,
              logo: token.logo || '/token-placeholder.png'
            };
          }
        } catch (firebaseError) {
          console.warn('Firebase fetch failed, falling back to contract:', firebaseError);
          const tokenInfo = await uniswap.getTokenInfo(token.address);
          selectedToken = { 
            ...token,
            ...tokenInfo,
            name: token.name || tokenInfo.name,
            symbol: token.symbol || tokenInfo.symbol,
            logo: token.logo || '/token-placeholder.png'
          };
        }
      }
      
      setToken1(selectedToken);
      setShowToken1Modal(false);

      // Check for pool existence if both tokens are selected
      if (token0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(
          '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
          ['function getPair(address tokenA, address tokenB) external view returns (address pair)'],
          provider
        );
        
        console.log('Checking pool existence for:', {
          token0: token0.address,
          token1: selectedToken.address
        });
        
        const poolAddress = await factoryContract.getPair(token0.address, selectedToken.address);
        console.log('Pool address:', poolAddress);
        
        if (poolAddress && poolAddress !== ethers.ZeroAddress) {
          console.log('Pool exists at address:', poolAddress);
          setPoolExists({ address: poolAddress });
          setError('pool exists');
          setShowProgressModal(true);
          setCurrentStep('preparing');
        } else {
          console.log('Pool does not exist');
          setPoolExists(null);
          setError(null);
        }
      }
    } catch (error) {
      console.error('Error selecting token:', error);
      toast.error('Failed to load token information. Please try again.');
    }
  };

  // Handle amount changes
  const handleAmount0Change = (value) => {
    setAmount0(value);
    if (value && token0 && token1) {
      // Update price info when amount0 changes
      const calculatedAmount1 = amount1 || value; // Use existing amount1 or same as input
      setPriceInfo({
        token0Price: parseFloat(calculatedAmount1) / parseFloat(value),
        token1Price: parseFloat(value) / parseFloat(calculatedAmount1)
      });
    }
  };

  const handleAmount1Change = (value) => {
    setAmount1(value);
    if (value && token0 && token1 && amount0) {
      // Update price info when amount1 changes
      setPriceInfo({
        token0Price: parseFloat(value) / parseFloat(amount0),
        token1Price: parseFloat(amount0) / parseFloat(value)
      });
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
      // Check if pool exists FIRST
      const provider = new ethers.JsonRpcProvider(window.ethereum);
      const factoryContract = new ethers.Contract(
        '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        ['function getPair(address tokenA, address tokenB) external view returns (address pair)'],
        provider
      );
      
      const poolAddress = await factoryContract.getPair(token0.address, token1.address);
      console.log('Pool address:', poolAddress);
      
      if (poolAddress && poolAddress !== ethers.ZeroAddress) {
        console.log('Pool exists at address:', poolAddress);
        setPoolExists({ address: poolAddress });
        setError('pool exists');
        setCurrentStep('preparing');
        setLoading(false);
        return;
      }

      // Continue with pool creation if pool doesn't exist
      console.log('Creating new pool...');
      setIsNewPool(true);
      setCurrentStep('approval');
      
      // Parse amounts
      const parsedAmount0 = ethers.parseUnits(amount0, token0.decimals);
      const parsedAmount1 = ethers.parseUnits(amount1, token1.decimals);

      // Create pool and add liquidity
      const result = await uniswap.createPool(
        token0.address,
        token1.address,
        parsedAmount0,
        parsedAmount1
      );

      setCurrentStep('completed');
      
      // Show completed state briefly, then close modal and show confetti
      setTimeout(() => {
        setShowProgressModal(false);
        setCurrentStep(null);
        setShowConfetti(true);
        
        // Show rating modal after a short delay
        setTimeout(() => {
          setShowRatingModal(true);
        }, 1000);
        
        // Reset form and cleanup after confetti
        setTimeout(() => {
          setAmount0('');
          setAmount1('');
          setShowConfetti(false);
        }, 30000);
      }, 1000);
    } catch (error) {
      console.error('Error creating pool:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect for price ratio calculation
  useEffect(() => {
    const updatePriceRatio = async () => {
      if (token0 && token1 && amount0 && amount1) {
        const ratio = await fetchPriceRatio(token0, token1, amount0, amount1);
        setPriceRatio(ratio);
        
        // Calculate and set price info
        setPriceInfo({
          token0Price: parseFloat(amount1) / parseFloat(amount0),
          token1Price: parseFloat(amount0) / parseFloat(amount1)
        });
      } else {
        setPriceRatio(null);
        setPriceInfo(null);
      }
    };

    updatePriceRatio();
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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-lg mx-auto"
    >
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

      <motion.div 
        variants={itemVariants}
        className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        {!isConnected ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-8"
          >
            <motion.div 
              className="mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
            </motion.div>
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Connect Your Wallet
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-500 dark:text-gray-400 mb-6"
            >
              Please connect your wallet to create a liquidity pool
            </motion.p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={openConnectModal}
              className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
            >
              Connect Wallet
            </motion.button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              variants={itemVariants}
              className="space-y-4"
            >
              {/* Token 0 Selection */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Token 1
                </label>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
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
                </motion.button>
                {token0 && (
                  <motion.input
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text"
                    value={amount0}
                    onChange={(e) => handleAmount0Change(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                  />
                )}
              </motion.div>

              {/* Token 1 Selection */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Token 2
                </label>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
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
                </motion.button>
                {token1 && (
                  <motion.input
                    variants={itemVariants}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text"
                    value={amount1}
                    onChange={(e) => handleAmount1Change(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                  />
                )}
              </motion.div>

              {/* Add Price Information Display right after Token 2 */}
              {priceInfo && token0 && token1 && amount0 && amount1 && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-4 bg-white/5 dark:bg-[#2d2f36]/50 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Initial Prices</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      The ratio of tokens you add will set the initial price of the pool.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/5 dark:bg-black/20 p-2 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1 {token0.symbol} =</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {priceInfo.token0Price.toFixed(6)} {token1.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 dark:bg-black/20 p-2 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">1 {token1.symbol} =</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {priceInfo.token1Price.toFixed(6)} {token0.symbol}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Fee Tier Selection */}
              <motion.div variants={itemVariants} className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Fee Tier
                </label>
                <motion.div 
                  variants={itemVariants}
                  className="w-full"
                >
                  <div className="px-4 py-3 bg-[#00ffbd]/10 rounded-xl text-sm font-medium text-[#00ffbd] flex items-center justify-center">
                    0.3% (Fixed Fee Tier)
                  </div>
                </motion.div>
              </motion.div>

              {/* Info Box */}
              <motion.div 
                variants={itemVariants}
                className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  About Pool Creation
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Creating a new liquidity pool allows you to be the first liquidity provider.
                  The ratio of tokens you add will set the initial price. Make sure to add sufficient liquidity to minimize price impact from trades.
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Create Pool Button */}
      {!poolExists && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
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
        </motion.button>
      )}

      {/* Keep existing modals */}
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
        poolExists={poolExists}
        setActiveTab={setActiveTab}
      />
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={handleRating}
      />
    </motion.div>
  );
} 