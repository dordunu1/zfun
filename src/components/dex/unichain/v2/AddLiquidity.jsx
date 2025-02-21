import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from '../shared/TokenSelectionModal';
import PoolSelectionModal from '../shared/PoolSelectionModal';
import { ethers } from 'ethers';
import { useUnichain } from '../../../../hooks/useUnichain';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { ipfsToHttp } from '../../../../utils/ipfs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

// Common tokens with metadata
const getCommonTokens = (chainId) => {
  switch (chainId) {
    case 10143: // Monad testnet
      return [
        {
          symbol: 'MON',
          name: 'Monad',
          decimals: 18,
          logo: '/monad.png',
          isNative: true
        },
        {
          address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
          symbol: 'WMONAD',
          name: 'Wrapped Monad',
          decimals: 18,
          logo: '/monad.png'
        },
        {
          address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
          symbol: 'WETH',
          name: 'Wrapped Ether',
          decimals: 18,
          logo: '/eth.png'
        }
      ];
    case 1301: // Unichain testnet
      return [
        // ... existing Unichain testnet tokens ...
      ];
    case 130: // Unichain mainnet
      return [
        // ... existing Unichain mainnet tokens ...
      ];
    default:
      return [];
  }
};

// Update getTokenLogo to use the function
const getTokenLogo = (token, chainId) => {
  if (!token) return '/token-default.png';
  
  // Check if it's a common token
  const commonTokens = getCommonTokens(chainId);
  if (!commonTokens) return '/token-default.png';
  
  const commonToken = commonTokens.find(t => 
    t.address?.toLowerCase() === token?.address?.toLowerCase() ||
    (chainId && UNISWAP_ADDRESSES[chainId]?.WETH?.toLowerCase() === token?.address?.toLowerCase())
  );
  
  if (commonToken) {
    return commonToken.logo;
  }

  // Check for IPFS or direct logo from token data
  if (token?.logo || token?.logoIpfs) {
    return token.logo || ipfsToHttp(token.logoIpfs);
  }

  // Default token logo
  return '/token-default.png';
};

// Add balance display component
const TokenBalance = ({ token, chainId }) => {
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const uniswap = useUnichain();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !token) return;
      
      try {
        setIsLoading(true);
        if (chainId === 10143) {
          // Handle Monad testnet
          const provider = new ethers.BrowserProvider(window.ethereum);
          if (token.isNative) {
            // For native MON token
            const balance = await provider.getBalance(userAddress);
            setBalance(ethers.formatEther(balance));
          } else {
            // For other tokens
            const tokenContract = new ethers.Contract(
              token.address,
              ['function balanceOf(address) view returns (uint256)'],
              provider
            );
            const balance = await tokenContract.balanceOf(userAddress);
            setBalance(ethers.formatUnits(balance, token.decimals));
          }
        } else {
          // Original logic for Unichain networks
          const balance = await uniswap.getTokenBalance(
            token.symbol === 'ETH' ? 'ETH' : token.address,
            userAddress
          );
          setBalance(balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [token, userAddress, uniswap, chainId]);

  if (!token || !userAddress || !chainId) return null;

  // Get display symbol (convert WETH to ETH)
  const commonTokens = getCommonTokens(chainId);
  const wethToken = commonTokens.find(t => t.symbol === 'WETH');
  const isWETH = wethToken && token.address?.toLowerCase() === wethToken.address?.toLowerCase();
  const displaySymbol = isWETH ? 'ETH' : token.symbol;

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 dark:text-gray-400">Balance:</span>
      {isLoading ? (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-20 rounded"></div>
      ) : (
        <span className="text-gray-900 dark:text-white font-medium">
          {Number(balance).toLocaleString()} {displaySymbol}
        </span>
      )}
    </div>
  );
};

// Router ABI for the functions we need
const ROUTER_ABI = [
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
  'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external view returns (uint amountOut)'
];

// Add PAIR_ABI at the top with other ABIs
const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)'
];

const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) view returns (address)'
];

// Icons for progress modal
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
  Error: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor" style={{ animation: 'shake 0.5s ease-in-out' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" className="text-red-500" />
        <path d="M12 8v5" strokeLinecap="round" className="text-red-500" />
        <path d="M12 16v.01" strokeLinecap="round" className="text-red-500" />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.6s_ease-in-out]" />
      </g>
    </svg>
  ),
  Adding: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 8v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'draw 2s ease-in-out infinite' }} />
        <circle cx="12" cy="12" r="3" style={{ animation: 'rotate 4s linear infinite', opacity: 0.2 }} />
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
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" className="animate-[fadeIn_0.5s_ease-in-out]" />
        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.5s_ease-in-out_forwards]" style={{ strokeDasharray: 20, strokeDashoffset: 20 }} />
      </g>
    </svg>
  )
};

// Update ProgressModal to accept chainId prop
const ProgressModal = ({ isOpen, onClose, currentStep, pool, error, chainId }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    { id: 'adding', title: 'Adding Liquidity', icon: <Icons.Adding /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);

  const formatErrorMessage = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    return error.message || 'An unknown error occurred';
  };

  const getTokenPairDisplay = () => {
    if (!pool) return '';

    // Convert WETH to ETH for display
    const displayToken0 = {
      ...pool.token0,
      symbol: chainId && pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES[chainId]?.WETH?.toLowerCase() ? 'ETH' : pool.token0.symbol,
      name: chainId && pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES[chainId]?.WETH?.toLowerCase() ? 'Ethereum' : pool.token0.name
    };

    const displayToken1 = {
      ...pool.token1,
      symbol: chainId && pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES[chainId]?.WETH?.toLowerCase() ? 'ETH' : pool.token1.symbol,
      name: chainId && pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES[chainId]?.WETH?.toLowerCase() ? 'Ethereum' : pool.token1.name
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <img
            src={getTokenLogo(displayToken0, chainId)}
            alt={displayToken0.symbol}
            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
          <img
            src={getTokenLogo(displayToken1, chainId)}
            alt={displayToken1.symbol}
            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
        </div>
        <span>
          {displayToken0.symbol} {displayToken1.symbol}
        </span>
      </div>
    );
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
                  {isError ? 'Error Adding Liquidity' : 'Adding Liquidity'}
                  {!isError && pool && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {getTokenPairDisplay()}
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
                              {step.id === 'approval' && `Approving ${pool?.token0?.symbol} and ${pool?.token1?.symbol}`}
                              {step.id === 'adding' && (
                                <span className="flex items-center gap-2">
                                  Adding liquidity to {getTokenPairDisplay()} pool
                                </span>
                              )}
                              {step.id === 'confirming' && 'Waiting for confirmation...'}
                              {step.id === 'completed' && (
                                <span className="flex items-center gap-2">
                                  Successfully added liquidity to {getTokenPairDisplay()} pool!
                                </span>
                              )}
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

// Star Rating Modal Component
const StarRatingModal = ({ isOpen, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

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
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                >
                  Rate Your Experience
                </Dialog.Title>

                <div className="flex justify-center space-x-2 mb-6 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((star) => (
                    <button
                      key={star}
                      className={`text-3xl transition-colors ${
                        (hover || rating) >= star ? 'text-[#00ffbd]' : 'text-gray-300 dark:text-gray-600'
                      }`}
                      onClick={() => {
                        setRating(star);
                        onRate(star);
                        setTimeout(() => onClose(), 500);
                      }}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p className="text-center text-gray-500 dark:text-gray-400">
                  How was your experience adding liquidity?
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function AddLiquidity() {
  const { address } = useAccount();
  const uniswap = useUnichain();
  const [pool, setPool] = useState(null);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [chainId, setChainId] = useState(null);
  const calculateTimeoutRef = React.useRef(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [addLiquidityError, setAddLiquidityError] = useState(null);
  const [currentChainId, setCurrentChainId] = useState(null);
  const navigate = useNavigate();

  // Effect to get and track chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    };

    getChainId();

    // Listen for chain changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        getChainId();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', getChainId);
      }
    };
  }, []);

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
    console.log('User rated liquidity addition:', rating);
    // Here you can implement the logic to save the rating
  };

  // Load pool info when pool is selected
  useEffect(() => {
    const loadPoolInfo = async () => {
      if (!pool || !uniswap) return;

      try {
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        if (poolInfo) {
          setPool(prev => ({
            ...prev,
            ...poolInfo,
            token0: { ...prev.token0, ...poolInfo.token0 },
            token1: { ...prev.token1, ...poolInfo.token1 }
          }));
        }
      } catch (error) {
        console.error('Error loading pool info:', error);
      }
    };

    loadPoolInfo();
  }, [pool?.pairAddress, uniswap]);

  // Single useEffect for calculations
  React.useEffect(() => {
    const calculateAmount = async () => {
      if (!pool || !activeInput) return;

      try {
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        if (!poolInfo || !poolInfo.reserves) {
          console.log('No pool info or reserves found');
          return;
        }

        // Get reserves from the poolInfo object
        const reserve0 = BigInt(poolInfo.reserves.reserve0.toString());
        const reserve1 = BigInt(poolInfo.reserves.reserve1.toString());
        
        console.log('Reserves:', {
          reserve0: reserve0.toString(),
          reserve1: reserve1.toString()
        });

        if (activeInput === 'token0' && token0Amount && token0Amount !== '0') {
          console.log('Calculating token1 amount based on token0 input:', token0Amount);
          const amount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
          console.log('Parsed amount0:', amount0.toString());
          
          // Use BigInt arithmetic
          const amount1 = (amount0 * reserve1) / reserve0;
          console.log('Calculated amount1:', amount1.toString());
          
          const formattedAmount1 = ethers.formatUnits(amount1, pool.token1.decimals);
          console.log('Formatted amount1:', formattedAmount1);
          
          setToken1Amount(formattedAmount1);
        } else if (activeInput === 'token1' && token1Amount && token1Amount !== '0') {
          console.log('Calculating token0 amount based on token1 input:', token1Amount);
          const amount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);
          console.log('Parsed amount1:', amount1.toString());
          
          // Use BigInt arithmetic
          const amount0 = (amount1 * reserve0) / reserve1;
          console.log('Calculated amount0:', amount0.toString());
          
          const formattedAmount0 = ethers.formatUnits(amount0, pool.token0.decimals);
          console.log('Formatted amount0:', formattedAmount0);
          
          setToken0Amount(formattedAmount0);
        }
      } catch (error) {
        console.error('Error calculating amounts:', error);
      }
    };

    // Clear any existing timeout
    if (calculateTimeoutRef.current) {
      clearTimeout(calculateTimeoutRef.current);
    }

    // Set new timeout for calculation
    calculateTimeoutRef.current = setTimeout(calculateAmount, 500);

    // Cleanup
    return () => {
      if (calculateTimeoutRef.current) {
        clearTimeout(calculateTimeoutRef.current);
      }
    };
  }, [pool, token0Amount, token1Amount, activeInput, uniswap]);

  const handleToken0Change = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setActiveInput('token0');
      setToken0Amount(value);
      if (!value || value === '0') {
        setToken1Amount('');
      }
    }
  };

  const handleToken1Change = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setActiveInput('token1');
      setToken1Amount(value);
      if (!value || value === '0') {
        setToken0Amount('');
      }
    }
  };

  const handleAddLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !token0Amount || !token1Amount || !chainId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setShowProgressModal(true);
    setCurrentStep('preparing');
    setAddLiquidityError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const chainId = await provider.getNetwork().then(n => Number(n.chainId));
      
      if (chainId === 10143) {
        // Handle Monad testnet
        const signer = await provider.getSigner();
        const routerAddress = UNISWAP_ADDRESSES[10143].router;
        const routerInterface = new ethers.Interface([
          'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
          'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)'
        ]);

        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
        const parsedAmount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
        const parsedAmount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);

        setCurrentStep('approval');

        if (pool.token0.isNative || pool.token1.isNative) {
          // Handle native MON + token pair
          const tokenAddress = pool.token0.isNative ? pool.token1.address : pool.token0.address;
          const tokenAmount = pool.token0.isNative ? parsedAmount1 : parsedAmount0;
          const ethAmount = pool.token0.isNative ? parsedAmount0 : parsedAmount1;

          // Approve token first if needed
          if (!pool.token0.isNative) {
            const tokenContract = new ethers.Contract(
              pool.token0.address,
              ['function approve(address spender, uint256 amount) external returns (bool)'],
              signer
            );
            await tokenContract.approve(routerAddress, parsedAmount0);
          } else if (!pool.token1.isNative) {
            const tokenContract = new ethers.Contract(
              pool.token1.address,
              ['function approve(address spender, uint256 amount) external returns (bool)'],
              signer
            );
            await tokenContract.approve(routerAddress, parsedAmount1);
          }

          setCurrentStep('adding');
          const tx = await signer.sendTransaction({
            to: routerAddress,
            data: routerInterface.encodeFunctionData('addLiquidityETH', [
              tokenAddress,
              tokenAmount,
              tokenAmount,
              ethAmount,
              await signer.getAddress(),
              deadline
            ]),
            value: ethAmount
          });

          setCurrentStep('confirming');
          await tx.wait();
        } else {
          // Handle token + token pair
          // Approve both tokens
          const token0Contract = new ethers.Contract(
            pool.token0.address,
            ['function approve(address spender, uint256 amount) external returns (bool)'],
            signer
          );
          const token1Contract = new ethers.Contract(
            pool.token1.address,
            ['function approve(address spender, uint256 amount) external returns (bool)'],
            signer
          );

          await token0Contract.approve(routerAddress, parsedAmount0);
          await token1Contract.approve(routerAddress, parsedAmount1);

          setCurrentStep('adding');
          const tx = await signer.sendTransaction({
            to: routerAddress,
            data: routerInterface.encodeFunctionData('addLiquidity', [
              pool.token0.address,
              pool.token1.address,
              parsedAmount0,
              parsedAmount1,
              parsedAmount0,
              parsedAmount1,
              await signer.getAddress(),
              deadline
            ])
          });

          setCurrentStep('confirming');
          await tx.wait();
        }
      } else {
        // Original logic for Unichain networks
        await uniswap.addLiquidity(
          pool.token0.address,
          pool.token1.address,
          parsedAmount0,
          parsedAmount1,
          address
        );
      }

      setCurrentStep('completed');
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowProgressModal(false);
        setCurrentStep(null);
        setShowRatingModal(true);
      }, 1000);
      
      setTimeout(() => {
        setToken0Amount('');
        setToken1Amount('');
        setShowConfetti(false);
      }, 30000);
    } catch (error) {
      console.error('Add liquidity error:', error);
      setAddLiquidityError(error.message);
      setCurrentStep(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Pool Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Pool
        </label>
        <button
          onClick={() => setShowPoolModal(true)}
          className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#00ffbd] dark:hover:border-[#00ffbd] transition-colors flex items-center justify-between group"
        >
          {pool ? (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src={getTokenLogo(pool.token0, chainId)}
                  alt={pool.token0.symbol}
                  className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                />
                <img
                  src={getTokenLogo(pool.token1, chainId)}
                  alt={pool.token1.symbol}
                  className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {(() => {
                  if (!chainId) return `${pool.token0.symbol}/${pool.token1.symbol}`;
                  const commonTokens = getCommonTokens(chainId);
                  const wethToken = commonTokens.find(t => t.symbol === 'WETH');
                  if (!wethToken) return `${pool.token0.symbol}/${pool.token1.symbol}`;
                  const token0Symbol = pool.token0.address?.toLowerCase() === wethToken.address?.toLowerCase() ? 'ETH' : pool.token0.symbol;
                  const token1Symbol = pool.token1.address?.toLowerCase() === wethToken.address?.toLowerCase() ? 'ETH' : pool.token1.symbol;
                  return `${token0Symbol}/${token1Symbol}`;
                })()}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">Select a pool</span>
          )}
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-[#00ffbd] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {pool && (
        <>
          {/* Token 0 Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {pool.token0.isWETH ? 'ETH' : pool.token0.symbol} Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={token0Amount}
                onChange={handleToken0Change}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img
                  src={getTokenLogo(pool.token0, chainId)}
                  alt={pool.token0.isWETH ? 'ETH' : pool.token0.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token0.isWETH ? 'ETH' : pool.token0.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token0} chainId={chainId} />
          </div>

          {/* Token 1 Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {pool.token1.isWETH ? 'ETH' : pool.token1.symbol} Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={token1Amount}
                onChange={handleToken1Change}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <img
                  src={getTokenLogo(pool.token1, chainId)}
                  alt={pool.token1.isWETH ? 'ETH' : pool.token1.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token1.isWETH ? 'ETH' : pool.token1.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token1} chainId={chainId} />
          </div>

          {/* Add Liquidity Button */}
          <button
            onClick={handleAddLiquidity}
            disabled={loading || !token0Amount || !token1Amount}
            className={`w-full px-4 py-3 rounded-xl font-medium text-lg transition-colors
              ${loading || !token0Amount || !token1Amount
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
              }
            `}
          >
            {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
          </button>
        </>
      )}

      {/* Pool Selection Modal */}
      <PoolSelectionModal
        isOpen={showPoolModal}
        onClose={() => setShowPoolModal(false)}
        onSelect={(selectedPool) => {
          setPool(selectedPool);
          setShowPoolModal(false);
          setToken0Amount('');
          setToken1Amount('');
        }}
      />

      {/* Add Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setCurrentStep(null);
          setAddLiquidityError(null);
        }}
        currentStep={currentStep}
        pool={pool}
        error={addLiquidityError}
        chainId={chainId}
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