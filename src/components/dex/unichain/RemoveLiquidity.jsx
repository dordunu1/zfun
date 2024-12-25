import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import PoolSelectionModal from './PoolSelectionModal';
import { ethers } from 'ethers';
import { useUnichain } from '../../../hooks/useUnichain';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { ipfsToHttp } from '../../../utils/ipfs';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';

// Icons for progress modal
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6 animate-[spin_3s_linear_infinite]" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 6v2m0 8v2M6 12h2m8 0h2" strokeLinecap="round" className="animate-[pulse_2s_ease-in-out_infinite]" />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path 
          d="M8 12l3 3 5-5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-[draw_1s_ease-in-out_infinite]"
          style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: 'draw 1s ease-in-out forwards' }}
        />
      </g>
    </svg>
  ),
  Removing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path 
          d="M12 8v8M8 12h8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="animate-[spin_2s_linear_infinite]" 
          transform="rotate(45 12 12)"
        />
        <path 
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          className="animate-[pulse_2s_ease-in-out_infinite]"
        />
      </g>
    </svg>
  ),
  Confirming: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path 
          d="M12 6v6l4 4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-[spin_2s_linear_infinite]"
        />
      </g>
    </svg>
  ),
  Completed: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
          className="animate-[fadeIn_0.5s_ease-in-out]"
        />
        <path 
          d="M8 12l3 3 5-5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-[draw_0.5s_ease-in-out_forwards]"
          style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: 'draw 0.5s ease-in-out forwards' }}
        />
      </g>
    </svg>
  )
};

// Add required keyframe animations at the top of the file
const style = document.createElement('style');
style.textContent = `
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, pool }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing Transaction', icon: Icons.Preparing },
    { key: 'approval', label: 'Awaiting Approval', icon: Icons.Approval },
    { key: 'removing', label: 'Removing Liquidity', icon: Icons.Removing },
    { key: 'confirming', label: 'Confirming Transaction', icon: Icons.Confirming },
    { key: 'completed', label: 'Liquidity Removed', icon: Icons.Completed }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

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
          {pool.token0.symbol} {pool.token1.symbol}
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Remove Liquidity Status
                  {pool && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {getTokenPairDisplay()}
                    </div>
                  )}
                </Dialog.Title>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive ? 'bg-[#00ffbd]/10 text-[#00ffbd]' :
                          isCompleted ? 'text-[#00ffbd]' :
                          'text-gray-400'
                        }`}
                      >
                        <Icon />
                        <div className="flex-1">
                          <span className="font-medium">{step.label}</span>
                          {isActive && step.key === 'removing' && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Removing liquidity for {getTokenPairDisplay()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
  const [hoveredRating, setHoveredRating] = useState(0);

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white text-center mb-4">
                  Rate Your Experience
                </Dialog.Title>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(9)].map((_, index) => (
                    <button
                      key={index}
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => {
                        setRating(index + 1);
                        onRate(index + 1);
                        onClose();
                      }}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors ${
                          index + 1 <= (hoveredRating || rating) ? 'text-[#00ffbd]' : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

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

// Add Router ABI
const ROUTER_ABI = [
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)'
];

export default function RemoveLiquidity() {
  const { address } = useAccount();
  const uniswap = useUnichain();
  const [pool, setPool] = useState(null);
  const [lpTokenAmount, setLpTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(null);
  const [token0Amount, setToken0Amount] = useState('0');
  const [token1Amount, setToken1Amount] = useState('0');
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
    console.log('User rated liquidity removal:', rating);
    // Here you can implement the logic to save the rating
  };

  // Load pool info and LP token balance when pool is selected
  useEffect(() => {
    const loadPoolInfo = async () => {
      if (!pool || !address || !uniswap) return;

      setIsLoadingBalance(true);
      try {
        // Get updated pool info
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        if (poolInfo) {
          setPool(prev => ({
            ...prev,
            ...poolInfo,
            token0: { ...prev.token0, ...poolInfo.token0 },
            token1: { ...prev.token1, ...poolInfo.token1 }
          }));
        }

        // Get LP token balance using the same method as token balance
        const balance = await uniswap.getTokenBalance(pool.pairAddress, address);
        setLpTokenBalance(balance);
      } catch (error) {
        console.error('Error loading pool info:', error);
        setLpTokenBalance('0');
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadPoolInfo();
  }, [pool?.pairAddress, address, uniswap]);

  // Add percentage selection effect
  useEffect(() => {
    if (!selectedPercentage || !lpTokenBalance) return;

    const percentage = selectedPercentage;
    const totalLPTokens = parseFloat(lpTokenBalance);
    const lpAmount = (totalLPTokens * percentage) / 100;
    
    setLpTokenAmount(lpAmount.toString());
  }, [selectedPercentage, lpTokenBalance]);

  // Add effect to calculate expected amounts when LP token amount changes
  useEffect(() => {
    const calculateAmounts = async () => {
      if (!pool || !lpTokenAmount || !address) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const pairContract = new ethers.Contract(pool.pairAddress, [
          'function getReserves() view returns (uint112, uint112, uint32)',
          'function totalSupply() view returns (uint256)'
        ], provider);

        const [reserves, totalSupply] = await Promise.all([
          pairContract.getReserves(),
          pairContract.totalSupply()
        ]);

        const parsedAmount = ethers.parseUnits(lpTokenAmount, 18);
        const amount0 = (reserves[0] * parsedAmount) / totalSupply;
        const amount1 = (reserves[1] * parsedAmount) / totalSupply;

        setToken0Amount(ethers.formatUnits(amount0, pool.token0.decimals || 18));
        setToken1Amount(ethers.formatUnits(amount1, pool.token1.decimals || 18));
      } catch (error) {
        console.error('Error calculating amounts:', error);
      }
    };

    calculateAmounts();
  }, [pool, lpTokenAmount, address]);

  const handleRemoveLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !lpTokenAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setShowProgressModal(true);
    setCurrentStep('preparing');

    try {
      console.log('Starting remove liquidity with params:', {
        pool: pool.pairAddress,
        lpTokenAmount,
        userAddress: address,
        expectedAmounts: {
          token0: token0Amount,
          token1: token1Amount
        }
      });

      // Parse amount with proper decimals
      const parsedAmount = ethers.parseUnits(lpTokenAmount, 18);
      console.log('Parsed LP amount:', parsedAmount.toString());

      // First ensure approval is completed
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create router contract instance
      const routerContract = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );
      
      const pairContract = new ethers.Contract(pool.pairAddress, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)',
        'function balanceOf(address) view returns (uint256)'
      ], signer);

      // Check allowance
      const allowance = await pairContract.allowance(address, UNISWAP_ADDRESSES.router);
      console.log('Current allowance:', allowance.toString());

      // Handle approval if needed
      if (allowance < parsedAmount) {
        try {
          console.log('Approving LP tokens...');
          setCurrentStep('approval');
          const approveTx = await pairContract.approve(UNISWAP_ADDRESSES.router, ethers.MaxUint256);
          await approveTx.wait();
          console.log('LP tokens approved');
        } catch (error) {
          console.error('Approval error:', error);
          setShowProgressModal(false);
          setCurrentStep(null);
          setLoading(false);
          return;
        }
      }

      // Calculate minimum amounts (1% slippage)
      const amount0Min = ethers.parseUnits(token0Amount, pool.token0.decimals || 18) * 99n / 100n;
      const amount1Min = ethers.parseUnits(token1Amount, pool.token1.decimals || 18) * 99n / 100n;

      console.log('Minimum amounts (with 1% slippage):', {
        token0Min: ethers.formatUnits(amount0Min, pool.token0.decimals || 18),
        token1Min: ethers.formatUnits(amount1Min, pool.token1.decimals || 18)
      });

      // Set deadline 20 minutes from now
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

      // Check if one of the tokens is WETH
      const isToken0WETH = pool.token0.address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();
      const isToken1WETH = pool.token1.address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();

      // Remove liquidity
      setCurrentStep('removing');
      let receipt;
      if (isToken0WETH || isToken1WETH) {
        // Handle ETH pair
        const token = isToken0WETH ? pool.token1.address : pool.token0.address;
        const amountTokenMin = isToken0WETH ? amount1Min : amount0Min;
        const amountETHMin = isToken0WETH ? amount0Min : amount1Min;

        console.log('Removing ETH liquidity with params:', {
          token,
          liquidity: parsedAmount.toString(),
          amountTokenMin: amountTokenMin.toString(),
          amountETHMin: amountETHMin.toString(),
          to: address,
          deadline: deadline.toString()
        });

        receipt = await routerContract.removeLiquidityETH(
          token,
          parsedAmount,
          amountTokenMin,
          amountETHMin,
          address,
          deadline,
          { gasLimit: ethers.getBigInt(1000000) }
        );
      } else {
        // Handle token-token pair
        console.log('Removing token liquidity with params:', {
          tokenA: pool.token0.address,
          tokenB: pool.token1.address,
          liquidity: parsedAmount.toString(),
          amountAMin: amount0Min.toString(),
          amountBMin: amount1Min.toString(),
          to: address,
          deadline: deadline.toString()
        });

        receipt = await routerContract.removeLiquidity(
          pool.token0.address,
          pool.token1.address,
          parsedAmount,
          amount0Min,
          amount1Min,
          address,
          deadline,
          { gasLimit: ethers.getBigInt(1000000) }
        );
      }

      setCurrentStep('confirming');
      await receipt.wait();
      console.log('Liquidity removed:', receipt);

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
            setLpTokenAmount('');
            setSelectedPercentage(null);
            setShowConfetti(false);
          }, 30000);
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

      // Refresh LP token balance
      const newBalance = await pairContract.balanceOf(address);
      setLpTokenBalance(ethers.formatUnits(newBalance, 18));
    } catch (error) {
      console.error('Remove liquidity error:', error);
      setShowProgressModal(false);
      setCurrentStep(null);
      setShowConfetti(false);
      
      // More detailed error handling
      let errorMessage = 'Failed to remove liquidity';
      if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient balance for transaction';
      } else if (error.message.includes('chain')) {
        errorMessage = 'Please switch to a supported network';
      } else {
        errorMessage = `Transaction failed: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setLpTokenAmount(lpTokenBalance);
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
          {/* Add Percentage Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Percentage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => setSelectedPercentage(percentage)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedPercentage === percentage
                      ? 'bg-[#00ffbd] text-black'
                      : 'bg-white/5 dark:bg-[#2d2f36] text-gray-700 dark:text-gray-300 hover:bg-[#00ffbd]/10'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>

          {/* LP Token Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LP Token Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={lpTokenAmount}
                onChange={(e) => {
                  setLpTokenAmount(e.target.value);
                  setSelectedPercentage(null); // Reset percentage when manually entering amount
                }}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm font-medium text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
              >
                MAX
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Balance: {isLoadingBalance ? 'Loading...' : Number(lpTokenBalance).toLocaleString()} LP Tokens
            </div>
          </div>

          {/* Add Expected Return Display */}
          <div className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              You Will Receive
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={getTokenLogo(pool.token0)}
                    alt={pool.token0.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {pool.token0.symbol}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Number(token0Amount).toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={getTokenLogo(pool.token1)}
                    alt={pool.token1.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {pool.token1.symbol}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Number(token1Amount).toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Remove Liquidity Button */}
          <button
            onClick={handleRemoveLiquidity}
            disabled={loading || !lpTokenAmount}
            className={`w-full px-4 py-3 rounded-xl font-medium text-lg transition-colors
              ${loading || !lpTokenAmount
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
              }
            `}
          >
            {loading ? 'Removing Liquidity...' : 'Remove Liquidity'}
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
          setLpTokenAmount('');
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