import React from 'react';
import { useState, useEffect, Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Confetti from 'react-confetti';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BiWallet } from 'react-icons/bi';
import { FaExchangeAlt, FaStar, FaGasPump } from 'react-icons/fa';
import { useUnichain } from '../../../../hooks/useUnichain';
import TokenSelectionModal from '../shared/TokenSelectionModal';
import { getTokenLogo } from '../../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { V3PositionManager } from '../../../../services/unichain/v3/positionManager';
import { Contract } from 'ethers';

// Add V3 Constants
const FeeAmount = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.3%
  HIGH: 10000     // 1%
};

// SVG Icons for progress states
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 6v2m0 8v2M6 12h2m8 0h2" strokeLinecap="round" strokeLinejoin="round" className="animate-[pulse_2s_ease-in-out_infinite]" />
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

// Tick spacings for each fee tier
const TICK_SPACINGS = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200
};

// Factory and NFT Position Manager addresses for Unichain Testnet
const UNISWAP_V3_ADDRESSES = {
  factory: '0x1f984000000000000000000000000000000000003',  // Unichain Mainnet factory
  quoter: '0x385a5cf5f83e99f7bb2852b6a19c3538b9f7658',
  router: '0x73855d06de49d0fe49c42638ba8d4d3638a9c62a',
  nftPositionManage: '0xb7610f9b733e7d45184be3a1bc8a847be6ec4f0b'
};

// Add multicall contract address and ABI
const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
const MULTICALL_ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
  'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])'
];

// Add ERC20 interface for encoding calls
const ERC20_INTERFACE = new ethers.Interface([
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)'
]);

// Add NFT Position Manager ABI for name fetching
const NFT_POSITION_MANAGER_ABI = [
  'function positions(uint256 tokenId) view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];

// Add balance display component
const TokenBalance = ({ token }) => {
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const uniswap = useUnichain();
  const { address: userAddress } = useAccount();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !token || !uniswap) return;
      
      try {
        setIsLoading(true);
        // If the token is WETH, show ETH balance instead
        if (token.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const ethBalance = await provider.getBalance(userAddress);
          setBalance(ethers.formatEther(ethBalance));
        } else {
          const balance = await uniswap.getTokenBalance(
            token.address,
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
  }, [token, userAddress, uniswap]);

  if (!token) return null;

  // Show ETH instead of WETH in the display
  const displaySymbol = token.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() 
    ? 'ETH' 
    : token.symbol;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Balance: {isLoading ? 'Loading...' : balance} {displaySymbol}
    </div>
  );
};

// Star Rating Modal Component
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
                  Rate Your Experience
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

// Modify the usePools hook
const usePools = () => {
  const [loading, setLoading] = useState(false);
  const [pools, setPools] = useState([]);
  const [error, setError] = useState(null);
  const { address: userAddress } = useAccount();

  const fetchTokenInfo = useCallback(async (provider, tokens) => {
    try {
      const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
      
      // Create calls array for both symbol and decimals
      const calls = tokens.flatMap(token => ([
        {
          target: token,
          callData: ERC20_INTERFACE.encodeFunctionData('symbol')
        },
        {
          target: token,
          callData: ERC20_INTERFACE.encodeFunctionData('decimals')
        }
      ]));

      const { returnData } = await multicall.aggregate(calls);

      // Process results
      const tokenInfo = {};
      for (let i = 0; i < tokens.length; i++) {
        const tokenAddress = tokens[i].toLowerCase();
        try {
          const symbol = ERC20_INTERFACE.decodeFunctionResult('symbol', returnData[i * 2])[0];
          const decimals = ERC20_INTERFACE.decodeFunctionResult('decimals', returnData[i * 2 + 1])[0];
          tokenInfo[tokenAddress] = { symbol, decimals };
        } catch (err) {
          console.warn(`Error decoding token info for ${tokenAddress}:`, err);
          tokenInfo[tokenAddress] = { symbol: 'Unknown', decimals: 18 };
        }
      }
      return tokenInfo;
    } catch (err) {
      console.warn('Error in multicall:', err);
      return tokens.reduce((acc, token) => {
        acc[token.toLowerCase()] = { symbol: 'Unknown', decimals: 18 };
        return acc;
      }, {});
    }
  }, []);

  const fetchPools = useCallback(async () => {
    if (!userAddress) return;

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const factoryContract = new ethers.Contract(
        UNISWAP_V3_ADDRESSES.factory,
        ['event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)'],
        provider
      );

      // Get pool creation events from last month
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - (7200 * 30)); // Last 30 days
      
      const filter = factoryContract.filters.PoolCreated();
      const events = await factoryContract.queryFilter(filter, fromBlock);
      
      // Extract unique token addresses
      const uniqueTokens = [...new Set(events.flatMap(event => 
        [event.args[0], event.args[1]]
      ))];

      // Fetch all token info in one multicall
      const tokenInfo = await fetchTokenInfo(provider, uniqueTokens);

      // Process pools
      const processedPools = events.map(event => {
        const token0 = event.args[0].toLowerCase();
        const token1 = event.args[1].toLowerCase();
        const fee = event.args[2];
        const poolAddress = event.args[4];

        return {
          poolAddress,
          fee: fee.toString(),
          token0: {
            address: event.args[0],
            symbol: tokenInfo[token0]?.symbol || 'Unknown',
            decimals: tokenInfo[token0]?.decimals || 18,
            isWETH: token0 === UNISWAP_ADDRESSES.WETH.toLowerCase()
          },
          token1: {
            address: event.args[1],
            symbol: tokenInfo[token1]?.symbol || 'Unknown',
            decimals: tokenInfo[token1]?.decimals || 18,
            isWETH: token1 === UNISWAP_ADDRESSES.WETH.toLowerCase()
          }
        };
      });

      setPools(processedPools);
    } catch (err) {
      console.error('Error fetching pools:', err);
      setError(err.message || 'Failed to fetch pools');
    } finally {
      setLoading(false);
    }
  }, [userAddress, fetchTokenInfo]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return { pools, loading, error, refetch: fetchPools };
};

// Update the pool selection modal display
const PoolSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const { pools, loading, error } = usePools();

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
                  Select a Pool
                </Dialog.Title>

                <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      Error loading pools: {error}
                    </div>
                  ) : pools.length > 0 ? (
                    pools.map((pool) => (
                      <button
                        key={pool.poolAddress}
                        onClick={() => onSelect(pool)}
                        className="w-full p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#00ffbd] dark:hover:border-[#00ffbd] transition-colors flex items-center justify-between group"
                      >
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
                          <div className="text-left">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {pool.token0.isWETH ? 'ETH' : pool.token0.symbol}/
                              {pool.token1.isWETH ? 'ETH' : pool.token1.symbol}
                            </span>
                            <div className="text-sm text-gray-500">
                              {(Number(pool.fee) / 10000).toFixed(2)}% fee tier
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No pools available
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, pool, error }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    { id: 'adding', title: 'Adding Liquidity', icon: <Icons.Adding /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);

  const formatErrorMessage = (error) => {
    if (error?.includes('user rejected')) {
      return 'Transaction was rejected. Please try again.';
    }
    if (error?.includes('insufficient')) {
      return 'Insufficient balance for adding liquidity.';
    }
    if (error?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
      return 'Price impact too high, try a smaller amount.';
    }
    if (error?.includes('EXCESSIVE_INPUT_AMOUNT')) {
      return 'Insufficient liquidity for this trade.';
    }
    return error?.replace(/\{"action":"sendTransaction".*$/, '') || 'An error occurred';
  };

  const getTokenPairDisplay = () => {
    if (!pool) return '';

    // Convert WETH to ETH for display
    const displayToken0 = {
      ...pool.token0,
      symbol: pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'ETH' : pool.token0.symbol,
      name: pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'Ethereum' : pool.token0.name
    };

    const displayToken1 = {
      ...pool.token1,
      symbol: pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'ETH' : pool.token1.symbol,
      name: pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'Ethereum' : pool.token1.name
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <img
            src={getTokenLogo(displayToken0)}
            alt={displayToken0.symbol}
            className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
          />
          <img
            src={getTokenLogo(displayToken1)}
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
  const [addLiquidityError, setAddLiquidityError] = useState(null);
  const [selectedRange, setSelectedRange] = useState('full');

  // V3-specific state
  const [feeLevel, setFeeLevel] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

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

  const handleToken0Change = (e) => {
    setToken0Amount(e.target.value);
    setActiveInput('token0');
  };

  const handleToken1Change = (e) => {
    setToken1Amount(e.target.value);
    setActiveInput('token1');
  };

  const handleAddLiquidity = async () => {
    try {
      setLoading(true);
      setShowProgressModal(true);
      setCurrentStep('preparing');
      setAddLiquidityError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const positionManager = new V3PositionManager(signer);

      // Get token addresses (handle ETH/WETH)
      const token0Address = pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() 
        ? UNISWAP_ADDRESSES.WETH 
        : pool.token0.address;
      const token1Address = pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()
        ? UNISWAP_ADDRESSES.WETH
        : pool.token1.address;

      // Parse amounts with proper decimals
      const amount0Desired = ethers.parseUnits(token0Amount, pool.token0.decimals);
      const amount1Desired = ethers.parseUnits(token1Amount, pool.token1.decimals);

      // Calculate fee amount from percentage
      const feeAmount = {
        0.01: FeeAmount.LOWEST,
        0.05: FeeAmount.LOW,
        0.3: FeeAmount.MEDIUM,
        1: FeeAmount.HIGH
      }[feeLevel];

      // Calculate price range ticks
      let tickLower, tickUpper;
      if (selectedRange === 'full') {
        // Use min/max ticks for full range
        tickLower = -887272;  // MIN_TICK
        tickUpper = 887272;   // MAX_TICK
      } else {
        // Convert price range to ticks
        const currentPrice = await positionManager.getCurrentPrice(token0Address, token1Address, feeAmount);
        const minPriceMultiplier = (100 - parseFloat(priceRange.min)) / 100;
        const maxPriceMultiplier = (100 + parseFloat(priceRange.max)) / 100;
        
        tickLower = await positionManager.priceToTick(
          currentPrice * minPriceMultiplier,
          pool.token0.decimals,
          pool.token1.decimals
        );
        tickUpper = await positionManager.priceToTick(
          currentPrice * maxPriceMultiplier,
          pool.token0.decimals,
          pool.token1.decimals
        );

        // Ensure ticks are spaced correctly
        const tickSpacing = TICK_SPACINGS[feeAmount];
        tickLower = Math.ceil(tickLower / tickSpacing) * tickSpacing;
        tickUpper = Math.floor(tickUpper / tickSpacing) * tickSpacing;
      }

      setCurrentStep('approval');
      
      // Ensure token approvals
      await positionManager.ensureTokenApprovals({
        token0: token0Address,
        token1: token1Address,
        amount0Desired,
        amount1Desired,
        ownerAddress: address
      });

      setCurrentStep('adding');

      // Calculate ETH value if needed
      const ethValue = pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() 
        ? amount0Desired 
        : (pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() 
          ? amount1Desired 
          : 0n);

      // Add liquidity
      const { tokenId, liquidity, amount0, amount1 } = await positionManager.mint({
        token0: token0Address,
        token1: token1Address,
        fee: feeAmount,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min: 0, // TODO: Add slippage protection
        amount1Min: 0,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
        value: ethValue
      });

      console.log('Position Created:', {
        tokenId: tokenId.toString(),
        liquidity: liquidity.toString(),
        amount0: ethers.formatUnits(amount0, pool.token0.decimals),
        amount1: ethers.formatUnits(amount1, pool.token1.decimals)
      });

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
          
          // Reset form and cleanup after confetti
          setTimeout(() => {
            setToken0Amount('');
            setToken1Amount('');
            setShowConfetti(false);
          }, 30000);
        }, 100);
      }, 1000);

    } catch (error) {
      console.error('Add liquidity error:', error);
      setAddLiquidityError(error.message);
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating) => {
    console.log('User rating:', rating);
    // Implement rating logic here
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
                {pool.token0.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'ETH' : pool.token0.symbol}/
                {pool.token1.address?.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase() ? 'ETH' : pool.token1.symbol}
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
          {/* Fee Tier Selection (V3-specific) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fee Tier
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0.01, 0.05, 0.3, 1].map((fee) => (
                <button
                  key={fee}
                  onClick={() => setFeeLevel(fee)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${feeLevel === fee
                      ? 'bg-[#00ffbd] text-black'
                      : 'bg-white/5 dark:bg-[#2d2f36] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }
                  `}
                >
                  {fee}%
                </button>
              ))}
            </div>
          </div>

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
                  src={pool.token0.logo}
                  alt={pool.token0.isWETH ? 'ETH' : pool.token0.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token0.isWETH ? 'ETH' : pool.token0.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token0} />
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
                  src={pool.token1.logo}
                  alt={pool.token1.isWETH ? 'ETH' : pool.token1.symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {pool.token1.isWETH ? 'ETH' : pool.token1.symbol}
                </span>
              </div>
            </div>
            <TokenBalance token={pool.token1} />
          </div>

          {/* Price Range (V3-specific) */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Set price range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setSelectedRange('full')}
                className={`p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border transition-colors ${
                  selectedRange === 'full' 
                    ? 'border-[#00ffbd] text-[#00ffbd] dark:text-[#00ffbd]' 
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#00ffbd] dark:hover:border-[#00ffbd]'
                }`}
              >
                Full range
              </button>
              <button 
                onClick={() => setSelectedRange('custom')}
                className={`p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border transition-colors ${
                  selectedRange === 'custom' 
                    ? 'border-[#00ffbd] text-[#00ffbd] dark:text-[#00ffbd]' 
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#00ffbd] dark:hover:border-[#00ffbd]'
                }`}
              >
                Custom range
              </button>
            </div>

            {/* Min/Max Price Inputs - Only show when custom range is selected */}
            {selectedRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Min Price
                  </label>
                  <input
                    type="text"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Max Price
                  </label>
                  <input
                    type="text"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                {selectedRange === 'full' 
                  ? "Providing full range liquidity ensures continuous market participation across all possible prices, offering simplicity but with potential for higher impermanent loss."
                  : "Custom range allows you to concentrate your liquidity within specific price bounds, enhancing capital efficiency and fee earnings but requiring more active management."}
              </p>
            </div>
          </div>

          {/* Add Liquidity Button */}
          <button
            onClick={handleAddLiquidity}
            disabled={loading || !token0Amount || !token1Amount || !feeLevel || !priceRange.min || !priceRange.max}
            className={`w-full px-4 py-3 rounded-xl font-medium text-lg transition-colors
              ${loading || !token0Amount || !token1Amount || !feeLevel || !priceRange.min || !priceRange.max
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                : 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
              }
            `}
          >
            {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
          </button>
        </>
      )}

      {/* Progress Modal */}
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
      />

      {/* Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={handleRating}
      />

      {/* Pool Selection Modal */}
      <PoolSelectionModal
        isOpen={showPoolModal}
        onClose={() => setShowPoolModal(false)}
        onSelect={(selectedPool) => {
          setPool(selectedPool);
          setShowPoolModal(false);
          setToken0Amount('');
          setToken1Amount('');
          setFeeLevel(null);
          setPriceRange({ min: '', max: '' });
        }}
      />
    </div>
  );
} 