import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from './TokenSelectionModal';
import PoolSelectionModal from './PoolSelectionModal';
import { ethers } from 'ethers';
import { useUnichain } from '../../../hooks/useUnichain';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { ipfsToHttp } from '../../../utils/ipfs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';

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
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

const getTokenLogo = (token) => {
  // Check if it's a common token
  const commonToken = COMMON_TOKENS.find(t => t.address?.toLowerCase() === token?.address?.toLowerCase());
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
const TokenBalance = ({ token }) => {
  const { address: userAddress } = useAccount();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const uniswap = useUnichain();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !token || !uniswap) return;
      
      try {
        setIsLoading(true);
        const balance = await uniswap.getTokenBalance(
          token.symbol === 'ETH' ? 'ETH' : token.address,
          userAddress
        );
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [token, userAddress, uniswap]);

  if (!token) return null;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Balance: {isLoading ? 'Loading...' : balance} {token.symbol}
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
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 6v2m0 8v2M6 12h2m8 0h2" strokeLinecap="round" />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
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
  )
};

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, pool }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    { id: 'adding', title: 'Adding Liquidity', icon: <Icons.Adding /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const getTokenPairDisplay = () => {
    if (!pool) return '';
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <img
            src={getTokenLogo(pool.token0)}
            alt={pool.token0.symbol}
            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
          <img
            src={getTokenLogo(pool.token1)}
            alt={pool.token1.symbol}
            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
        </div>
        <span>
          {pool.token0.symbol}/{pool.token1.symbol}
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
                  Adding Liquidity
                  {pool && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {getTokenPairDisplay()}
                    </div>
                  )}
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : 
                          isCompleted ? 'bg-gray-100 dark:bg-gray-800/50' : 
                          'bg-gray-50 dark:bg-gray-800/20'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                            isActive ? 'text-[#00ffbd] animate-pulse' : 
                            isCompleted ? 'text-[#00ffbd]' : 
                            'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h4>
                          {isActive && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {step.id === 'preparing' && 'Preparing transaction...'}
                              {step.id === 'approval' && `Approving ${pool?.token0?.symbol} and ${pool?.token1?.symbol}`}
                              {step.id === 'adding' && `Adding liquidity for ${pool?.token0?.symbol}/${pool?.token1?.symbol}`}
                              {step.id === 'confirming' && 'Waiting for confirmation...'}
                              {step.id === 'completed' && `Successfully added liquidity to ${pool?.token0?.symbol}/${pool?.token1?.symbol} pool!`}
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
  const calculateTimeoutRef = React.useRef(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
        if (!poolInfo || !poolInfo.reserve0 || !poolInfo.reserve1) return;

        if (activeInput === 'token0' && token0Amount && token0Amount !== '0') {
          const amount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
          const amount1 = (amount0 * poolInfo.reserve1) / poolInfo.reserve0;
          const formattedAmount1 = ethers.formatUnits(amount1, pool.token1.decimals);
          setToken1Amount(formattedAmount1);
        } else if (activeInput === 'token1' && token1Amount && token1Amount !== '0') {
          const amount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);
          const amount0 = (amount1 * poolInfo.reserve0) / poolInfo.reserve1;
          const formattedAmount0 = ethers.formatUnits(amount0, pool.token0.decimals);
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
    if (!pool || !token0Amount || !token1Amount) return;

    setLoading(true);
    setShowProgressModal(true);
    setCurrentStep('preparing');

    try {
      // Get the provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // Create router contract instance
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      // Create factory contract instance
      const factory = new ethers.Contract(
        UNISWAP_ADDRESSES.factory,
        FACTORY_ABI,
        provider
      );

      // Parse initial amounts
      let parsedAmount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
      let parsedAmount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);
      let token0Address = pool.token0.address;
      let token1Address = pool.token1.address;

      // Get pair address and check if it exists
      const pairAddress = await factory.getPair(token0Address, token1Address);
      console.log('Pair address:', pairAddress);

      // If pair exists, adjust amounts based on reserves
      if (pairAddress !== '0x0000000000000000000000000000000000000000') {
        console.log('Pair exists, checking current pool ratio...');
        const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);
        const [reserve0, reserve1] = await pairContract.getReserves();
        console.log('Current reserves:', {
          reserve0: reserve0.toString(),
          reserve1: reserve1.toString()
        });

        // Get actual token order in the pair
        const token0InPair = await pairContract.token0();
        
        // Adjust amounts if token order is different
        if (token0Address.toLowerCase() !== token0InPair.toLowerCase()) {
          console.log('Token order swapped to match pair');
          [parsedAmount0, parsedAmount1] = [parsedAmount1, parsedAmount0];
          [token0Address, token1Address] = [token1Address, token0Address];
        }

        // Calculate the optimal ratio based on reserves
        if (reserve0 > 0n && reserve1 > 0n) {
          try {
            // Use the router's quote function to get the exact amount needed
            const quote = await router.quote(
              parsedAmount0,
              reserve0,
              reserve1
            );
            
            // If the quoted amount is significantly different, adjust amount1
            const difference = (quote - parsedAmount1) * 100n / parsedAmount1;
            if (difference > 5n || difference < -5n) {
              parsedAmount1 = quote;
              console.log('Adjusted amount1 based on pool ratio:', parsedAmount1.toString());
            }
          } catch (error) {
            console.error('Error getting quote:', error);
            throw new Error('Failed to calculate optimal amounts for the pool ratio');
          }
        }
      }

      // Calculate minimum amounts (1% slippage)
      const amount0Min = (parsedAmount0 * 990n) / 1000n;
      const amount1Min = (parsedAmount1 * 990n) / 1000n;

      // Calculate deadline (20 minutes from now)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

      // Check if either token is ETH/WETH
      const isToken0WETH = token0Address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() || pool.token0.symbol === 'ETH';
      const isToken1WETH = token1Address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() || pool.token1.symbol === 'ETH';
      const isETHPair = isToken0WETH || isToken1WETH;

      let tx;

      if (isETHPair) {
        // For ETH pairs, we need to handle the token order correctly
        const tokenAddress = isToken0WETH ? token1Address : token0Address;
        const ethAmount = isToken0WETH ? parsedAmount0 : parsedAmount1;
        const tokenAmount = isToken0WETH ? parsedAmount1 : parsedAmount0;
        const tokenAmountMin = isToken0WETH ? amount1Min : amount0Min;
        const ethAmountMin = isToken0WETH ? amount0Min : amount1Min;

        setCurrentStep('approval');
        // Only approve the token (not ETH)
        await uniswap.approveToken(tokenAddress, tokenAmount);

        console.log('Adding ETH liquidity with params:', {
          tokenAddress,
          tokenAmount: tokenAmount.toString(),
          ethAmount: ethAmount.toString(),
          tokenAmountMin: tokenAmountMin.toString(),
          ethAmountMin: ethAmountMin.toString(),
          account,
          deadline: deadline.toString()
        });

        setCurrentStep('adding');
        // Call addLiquidityETH
        tx = await router.addLiquidityETH(
          tokenAddress,
          tokenAmount,
          tokenAmountMin,
          ethAmountMin,
          account,
          deadline,
          {
            value: ethAmount,
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else {
        // Regular ERC20-ERC20 pair
        setCurrentStep('approval');
        // Approve both tokens first
        await Promise.all([
          uniswap.approveToken(token0Address, parsedAmount0),
          uniswap.approveToken(token1Address, parsedAmount1)
        ]);

        console.log('Adding ERC20 liquidity with params:', {
          token0: token0Address,
          token1: token1Address,
          amount0: parsedAmount0.toString(),
          amount1: parsedAmount1.toString(),
          amount0Min: amount0Min.toString(),
          amount1Min: amount1Min.toString(),
          account,
          deadline: deadline.toString()
        });

        setCurrentStep('adding');
        // Add liquidity for ERC20-ERC20 pair
        tx = await router.addLiquidity(
          token0Address,
          token1Address,
          parsedAmount0,
          parsedAmount1,
          amount0Min,
          amount1Min,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      }

      setCurrentStep('confirming');
      const receipt = await tx.wait();
      console.log('Liquidity added:', receipt);

      // Add small delay to show confirming state
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('completed');
      
      // Close the Manage Liquidity UI by emitting a custom event
      window.dispatchEvent(new CustomEvent('closeManageLiquidity'));

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
            setToken0Amount('');
            setToken1Amount('');
            setShowConfetti(false);
          }, 30000); // 30 seconds
        }, 100);
      }, 1000);

      // Reset form and refresh pool info
      const updatedPool = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
      setPool(prev => ({
        ...prev,
        ...updatedPool,
        token0: {
          ...prev.token0,
          ...updatedPool.token0,
          logo: prev.token0.logo || getTokenLogo(updatedPool.token0)
        },
        token1: {
          ...prev.token1,
          ...updatedPool.token1,
          logo: prev.token1.logo || getTokenLogo(updatedPool.token1)
        }
      }));
    } catch (error) {
      console.error('Add liquidity error:', error);
      setShowProgressModal(false);
      setCurrentStep(null);
      setShowConfetti(false);
      
      // More detailed error handling
      let errorMessage = 'Failed to add liquidity';
      if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient balance for transaction';
      } else if (error.message.includes('chain')) {
        errorMessage = 'Please switch to a supported network';
      } else if (error.message.includes('INSUFFICIENT_A_AMOUNT')) {
        errorMessage = 'Insufficient amount for token A';
      } else if (error.message.includes('INSUFFICIENT_B_AMOUNT')) {
        errorMessage = 'Insufficient amount for token B';
      } else if (error.message.includes('K')) {
        errorMessage = 'Price impact too high. Try a different ratio.';
      } else if (error.message.includes('optimal amounts')) {
        errorMessage = 'Failed to calculate optimal amounts. Try a different ratio.';
      } else {
        errorMessage = `Transaction failed: ${error.message}`;
      }
      
      toast.error(errorMessage, { id: 'add-liquidity' });
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
                  src={getTokenLogo(pool.token0)}
                  alt={pool.token0.symbol}
                  className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                />
                <img
                  src={getTokenLogo(pool.token1)}
                  alt={pool.token1.symbol}
                  className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {pool.token0.symbol}/{pool.token1.symbol}
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
              {pool.token0.symbol} Amount
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
                  src={getTokenLogo(pool.token0)}
                  alt={pool.token0.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token0.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token0} />
          </div>

          {/* Token 1 Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {pool.token1.symbol} Amount
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
                  src={getTokenLogo(pool.token1)}
                  alt={pool.token1.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token1.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token1} />
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
        }}
        currentStep={currentStep}
        pool={pool}
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