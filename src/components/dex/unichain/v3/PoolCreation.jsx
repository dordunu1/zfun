import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { BiWallet } from 'react-icons/bi';
import { useUnichain } from '../../../../hooks/useUnichain';
import TokenSelectionModal from '../shared/TokenSelectionModal';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap';
import { ERC20_ABI } from '../../../../services/erc20';
import { getTokenDeploymentByAddress } from '../../../../services/firebase';
import { getTokenLogo } from '../../../../utils/tokens';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';
import { FaStar } from 'react-icons/fa';
import { V3PositionManager, TICK_SPACINGS, computePoolAddress } from '../../../../services/unichain/v3/positionManager';


// Get WETH9 address from UNISWAP_ADDRESSES
const WETH9_ADDRESS = UNISWAP_ADDRESSES.WETH;

// V3-specific constants
const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
};

// Add these modern DeFi-inspired icons for pool creation steps
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

// Update balance display format
const formatBalance = (balance) => {
  const num = Number(balance);
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  return Math.floor(num).toLocaleString('en-US');
};

// Add helper function for token symbol display
const getDisplaySymbol = (token) => {
  return token?.symbol === 'ETH' ? 'WETH' : token?.symbol;
};

export default function PoolCreation() {
  const { address } = useAccount();
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [selectedFeeTier, setSelectedFeeTier] = useState(FEE_TIERS.MEDIUM);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const [currentStep, setCurrentStep] = useState('select-pair');
  const [error, setError] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isFeeTierExpanded, setIsFeeTierExpanded] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // Initial price state
  const [initialPrice, setInitialPrice] = useState('');
  const [priceRangeType, setPriceRangeType] = useState('full');
  const [tickLower, setTickLower] = useState(null);
  const [tickUpper, setTickUpper] = useState(null);
  const [showPriceRangeModal, setShowPriceRangeModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState('full');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  // Add state for fee tier details visibility
  const [showFeeTierDetails, setShowFeeTierDetails] = useState(true);

  // Add state for token order toggle
  const [showTokenOrder, setShowTokenOrder] = useState(false);

  // Add balance reading functionality
  const [token0Balance, setToken0Balance] = useState('0');
  const [token1Balance, setToken1Balance] = useState('0');

  const { uniswap } = useUnichain();

  // Add state for pool data
  const [poolData, setPoolData] = useState(null);
  const [isLoadingPoolData, setIsLoadingPoolData] = useState(false);

  // Update price formatting function to match Uniswap exactly
  const formatPrice = (price, inverted = false) => {
    if (!price || price === 0) return '0';
    if (!Number.isFinite(price)) return '∞';
    
    let num = inverted ? 1 / price : price;
    if (num === 0) return '0';
    if (!Number.isFinite(num)) return '∞';
    
    // For very small numbers
    if (Math.abs(num) < 0.0001) {
      return '< 0.0001';
    }
    
    // For regular numbers (under 1 trillion)
    if (num < 1e12) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    }
    
    // For very large numbers, use scientific notation
    return num.toExponential(4).replace('e+', 'E');
  };

  // Update the price display section
  const renderPriceSection = () => {
    if (isLoadingPoolData) {
      return (
        <div className="mb-4 text-sm text-gray-500 dark:text-[#98A1C0]">
          Loading pool data...
        </div>
      );
    }

    if (!poolData?.exists) {
      return (
        <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-[#131A2A] text-gray-500 dark:text-[#98A1C0]">
          This pool does not exist yet. You will be the first liquidity provider.
        </div>
      );
    }

    const price = poolData.price;
    const invertedPrice = 1 / price;

    return (
      <div className="mt-4 p-4 rounded-lg bg-gray-100 dark:bg-[#131A2A] text-gray-900 dark:text-white">
        <div className="text-lg mb-2">Current price:</div>
        <div className="text-2xl font-bold mb-4">
          1 {getDisplaySymbol(token0)} = {formatPrice(price)} {getDisplaySymbol(token1)}
        </div>
        <div className="text-base text-gray-500 dark:text-[#98A1C0]">
          1 {getDisplaySymbol(token1)} = {formatPrice(invertedPrice)} {getDisplaySymbol(token0)}
        </div>
      </div>
    );
  };

  // Update function to fetch pool data with proper price calculation
  const fetchPoolData = async () => {
    if (!token0 || !token1 || !selectedFeeTier) return;

    setIsLoadingPoolData(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const positionManager = new V3PositionManager(provider);

      // Get addresses (handle ETH/WETH conversion)
      const token0Address = token0.symbol === 'ETH' ? WETH9_ADDRESS : token0.address;
      const token1Address = token1.symbol === 'ETH' ? WETH9_ADDRESS : token1.address;

      const data = await positionManager.getPoolData(token0Address, token1Address, selectedFeeTier);
      
      if (data.exists && data.sqrtPriceX96) {
        // Check if our token order matches the pool's token order
        const poolToken0IsOurToken0 = data.token0.toLowerCase() === token0Address.toLowerCase();

        // Convert sqrtPriceX96 to price following Uniswap's method
        const sqrtPriceX96 = BigInt(data.sqrtPriceX96);
        const Q96 = BigInt(2) ** BigInt(96);
        
        // Calculate price = (sqrtPriceX96/Q96)^2 * 10^(decimals0-decimals1)
        const price = Number(sqrtPriceX96) / Number(Q96);
        const squaredPrice = price * price;
        
        // Get decimals based on actual pool token order
        const token0Decimals = poolToken0IsOurToken0 ? token0.decimals : token1.decimals;
        const token1Decimals = poolToken0IsOurToken0 ? token1.decimals : token0.decimals;
        
        // Adjust for decimals
        const decimalAdjustment = Math.pow(10, token0Decimals - token1Decimals);
        let adjustedPrice = squaredPrice * decimalAdjustment;

        // If our token order is different from pool's token order, invert the price
        if (!poolToken0IsOurToken0) {
          adjustedPrice = 1 / adjustedPrice;
        }

        console.log('Price calculation:', {
          sqrtPriceX96: sqrtPriceX96.toString(),
          Q96: Q96.toString(),
          price,
          squaredPrice,
          decimalAdjustment,
          adjustedPrice,
          poolAddress: data.poolAddress,
          token0: {
            address: token0Address,
            decimals: token0.decimals,
            isPoolToken0: poolToken0IsOurToken0
          },
          token1: {
            address: token1Address,
            decimals: token1.decimals,
            isPoolToken1: !poolToken0IsOurToken0
          }
        });
        
        data.price = adjustedPrice;
      }
      
      setPoolData(data);

      // If pool exists, set initial price based on current pool price
      if (data?.exists && data?.price) {
        const formattedPrice = formatPrice(data.price);
        setInitialPrice(formattedPrice);
      }
    } catch (error) {
      console.error('Error fetching pool data:', error);
      setPoolData(null);
    } finally {
      setIsLoadingPoolData(false);
    }
  };

  // Update useEffect to fetch pool data when tokens or fee tier changes
  useEffect(() => {
    fetchPoolData();
  }, [token0?.address, token1?.address, selectedFeeTier]);

  // Add useEffect to handle initial price based on pool existence
  useEffect(() => {
    if (poolData) {
      if (poolData.exists && poolData.price) {
        // If pool exists, set initial price to current pool price
        const formattedPrice = formatPrice(poolData.price);
        setInitialPrice(formattedPrice);
      } else {
        // If pool doesn't exist, reset initial price to allow user input
        setInitialPrice('');
      }
    }
  }, [poolData]);

  // Update amount handlers to calculate based on pool price
  const handleAmount0Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount0(value);
      // Calculate amount1 based on pool price or initial price
      if (value) {
        const price = poolData?.price || Number(initialPrice);
        const calculatedAmount1 = parseFloat(value) * price;
        setAmount1(calculatedAmount1.toString());
      } else {
        setAmount1('');
      }
    }
  };

  const handleAmount1Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount1(value);
      // Calculate amount0 based on pool price or initial price
      if (value) {
        const price = poolData?.price || Number(initialPrice);
        const calculatedAmount0 = parseFloat(value) / price;
        setAmount0(calculatedAmount0.toString());
      } else {
        setAmount0('');
      }
    }
  };

  // Add initial price handler
  const handleInitialPriceChange = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInitialPrice(value);
      // Calculate amounts based on initial price if needed
      if (amount0 && value) {
        const calculatedAmount1 = parseFloat(amount0) * parseFloat(value);
        setAmount1(calculatedAmount1.toString());
      } else if (amount1 && value) {
        const calculatedAmount0 = parseFloat(amount1) / parseFloat(value);
        setAmount0(calculatedAmount0.toString());
      }
    }
  };

  // Function to move to next step
  const nextStep = () => {
    if (currentStep === 'select-pair' && token0 && token1 && selectedFeeTier) {
      setCurrentStep('set-price');
    } else if (currentStep === 'set-price' && initialPrice) {
      setCurrentStep('deposit-amounts');
    }
  };

  // Function to go back to previous step
  const prevStep = () => {
    if (currentStep === 'set-price') {
      setCurrentStep('select-pair');
    } else if (currentStep === 'deposit-amounts') {
      setCurrentStep('set-price');
    }
  };

  const handleTokenSelect = (token) => {
    if (activeSide === 'token0') {
      setToken0(token);
    } else {
      setToken1(token);
    }
    setShowTokenSelector(false);
  };

  const handleCreatePool = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!token0 || !token1 || !amount0 || !amount1 || !initialPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setShowProgressModal(true);
    setCurrentStep('preparing');
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const positionManager = new V3PositionManager(signer);

      // Parse amounts with proper decimals, ensuring we don't exceed the token's decimal places
      const parsedAmount0 = ethers.parseUnits(
        Number(amount0).toFixed(token0.decimals), 
        token0.decimals
      );
      const parsedAmount1 = ethers.parseUnits(
        Number(amount1).toFixed(token1.decimals), 
        token1.decimals
      );

      // Check and set allowances if needed
      setCurrentStep('approval');
      
      // Ensure token approvals
      await positionManager.ensureTokenApprovals({
        token0: token0.address,
        token1: token1.address,
        amount0Desired: parsedAmount0,
        amount1Desired: parsedAmount1,
        ownerAddress: address
      });

      setCurrentStep('creating');
      
      // Handle ETH/WETH conversion first
      const token0IsEth = token0.symbol === 'ETH';
      const token1IsEth = token1.symbol === 'ETH';
      
      // Get actual addresses for comparison (using WETH9 for ETH)
      const token0Address = token0IsEth ? WETH9_ADDRESS : token0.address;
      const token1Address = token1IsEth ? WETH9_ADDRESS : token1.address;

      // Determine which amount corresponds to ETH (if any)
      const ethValue = token0IsEth ? parsedAmount0 : (token1IsEth ? parsedAmount1 : 0n);

      // Get pool data and determine token ordering
      const poolData = await positionManager.getPoolData(
        token0Address,
        token1Address,
        selectedFeeTier
      );

      // Set final tokens and amounts based on pool data
      const shouldOrderByAddress = token0Address.toLowerCase() > token1Address.toLowerCase();
      const finalToken0 = poolData.exists 
        ? (token0Address.toLowerCase() === poolData.token0.toLowerCase() ? token0 : token1)
        : (shouldOrderByAddress ? token1 : token0);
      const finalToken1 = poolData.exists
        ? (token0Address.toLowerCase() === poolData.token0.toLowerCase() ? token1 : token0)
        : (shouldOrderByAddress ? token0 : token1);
      const finalAmount0 = finalToken0.address === token0.address ? parsedAmount0 : parsedAmount1;
      const finalAmount1 = finalToken0.address === token0.address ? parsedAmount1 : parsedAmount0;

      // Calculate sqrtPriceX96 from initial price
      const token0Decimals = finalToken0.decimals;
      const token1Decimals = finalToken1.decimals;
      
      // If pool exists, use its actual price data
      let sqrtPriceX96;
      if (poolData.exists) {
        sqrtPriceX96 = BigInt(poolData.sqrtPriceX96);
        console.log('Using existing pool price:', {
          sqrtPriceX96: sqrtPriceX96.toString(),
          poolData
        });
      } else {
        // For new pools, calculate price
        let rawPrice;
        if (typeof initialPrice === 'string' && initialPrice.startsWith('< ')) {
          // For very small numbers, use a more precise minimum value
          rawPrice = 1e-12; // Much smaller minimum that won't distort the pool ratio
        } else {
          rawPrice = parseFloat(initialPrice.toString());
        }

        // Validate raw price
        if (isNaN(rawPrice) || rawPrice <= 0) {
          console.error('Invalid initial price:', {
            initialPrice,
            rawPrice,
            type: typeof initialPrice
          });
          throw new Error('Invalid initial price: must be a positive number');
        }

        // Calculate decimal adjustment
        const decimalAdjustment = 10 ** (token1Decimals - token0Decimals);
        
        // Calculate adjusted price based on token order
        const adjustedPrice = shouldOrderByAddress ? 
          1 / (rawPrice * decimalAdjustment) : 
          rawPrice * decimalAdjustment;
        
        // Calculate sqrtPriceX96 = sqrt(price) * 2^96
        const sqrtPrice = Math.sqrt(adjustedPrice);
        const Q96 = BigInt('79228162514264337593543950336'); // 2^96
        sqrtPriceX96 = BigInt(Math.floor(sqrtPrice * Number(Q96)));
      }

      console.log('Price calculation:', {
        sqrtPriceX96: sqrtPriceX96.toString(),
        token0: {
          address: finalToken0.address,
          decimals: token0Decimals,
          isPoolToken0: finalToken0.address === (poolData.exists ? poolData.token0 : finalToken0.address)
        },
        token1: {
          address: finalToken1.address,
          decimals: token1Decimals,
          isPoolToken1: finalToken1.address === (poolData.exists ? poolData.token1 : finalToken1.address)
        }
      });

      // Validate the result
      if (sqrtPriceX96 <= 0n) {
        throw new Error('Invalid price: must be greater than 0');
      }

      // Calculate ticks based on selected range
      let tickLower, tickUpper;

      if (selectedRange === 'full') {
        const fullRange = V3PositionManager.getFullRangeTicks(selectedFeeTier);
        tickLower = fullRange.tickLower;
        tickUpper = fullRange.tickUpper;
      } else {
        const { tickLower: lower, tickUpper: upper } = V3PositionManager.getPriceRangeTicks({
          basePrice: finalInitialPrice,
          lowerPricePercent: Number(priceRange.min || 0),
          upperPricePercent: Number(priceRange.max || 0),
          decimals0: finalToken0.decimals,
          decimals1: finalToken1.decimals,
          feeAmount: selectedFeeTier
        });
        tickLower = lower;
        tickUpper = upper;
      }

      // Create the multicall array
      const calls = [];

      // First call: create and initialize pool
      const createPoolCall = positionManager.contract.interface.encodeFunctionData(
        'createAndInitializePoolIfNecessary',
        [
          finalToken0.address,
          finalToken1.address,
          selectedFeeTier,
          sqrtPriceX96
        ]
      );
      calls.push(createPoolCall);

      // Second call: mint position
      const mintCall = positionManager.contract.interface.encodeFunctionData(
        'mint',
        [{
          token0: finalToken0.address,
          token1: finalToken1.address,
          fee: selectedFeeTier,
          tickLower: Math.ceil(tickLower / TICK_SPACINGS[selectedFeeTier]) * TICK_SPACINGS[selectedFeeTier],
          tickUpper: Math.floor(tickUpper / TICK_SPACINGS[selectedFeeTier]) * TICK_SPACINGS[selectedFeeTier],
          amount0Desired: finalAmount0,
          amount1Desired: finalAmount1,
          amount0Min: 0,
          amount1Min: 0,
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 1200 // 20 minutes from now
        }]
      );
      calls.push(mintCall);

      // If using ETH, add refundETH and unwrapWETH9 calls
      if (ethValue > 0n) {
        calls.push(positionManager.contract.interface.encodeFunctionData('refundETH'));
        calls.push(
          positionManager.contract.interface.encodeFunctionData('unwrapWETH9', [
            0,
            address
          ])
        );
      }

      // Execute the multicall with the correct ETH value
      const tx = await positionManager.contract.multicall(calls, {
        value: ethValue,
        gasLimit: ethValue > 0n ? 12000000 : 10000000
      });

      setCurrentStep('confirming');
      
      const receipt = await tx.wait();

      // Parse events and handle completion
      const events = receipt.logs.map(log => {
        try {
          return positionManager.contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      // Find the NFT token ID from the Transfer event
      const transferEvent = events.find(event => event.name === 'Transfer');
      const tokenId = transferEvent?.args?.tokenId || transferEvent?.args?.id;

      // Find liquidity info from the IncreaseLiquidity event
      const liquidityEvent = events.find(event => 
        event.name === 'IncreaseLiquidity' || 
        event.fragment?.name === 'IncreaseLiquidity'
      );

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
            setAmount0('');
            setAmount1('');
            setShowConfetti(false);
          }, 30000);
        }, 100);
      }, 1000);
    } catch (error) {
      console.error('Pool creation error:', error);
      setError(error.message);
      setCurrentStep('error');
      toast.error('Failed to create pool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add function to read token balances
  const readTokenBalances = async () => {
    if (!address || !token0 || !token1) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Read token0 balance
      if (token0.symbol === 'ETH') {
        const balance = await provider.getBalance(address);
        setToken0Balance(ethers.formatEther(balance));
      } else {
        const token0Contract = new ethers.Contract(token0.address, ERC20_ABI, signer);
        const balance = await token0Contract.balanceOf(address);
        setToken0Balance(ethers.formatUnits(balance, token0.decimals));
      }

      // Read token1 balance
      if (token1.symbol === 'ETH') {
        const balance = await provider.getBalance(address);
        setToken1Balance(ethers.formatEther(balance));
      } else {
        const token1Contract = new ethers.Contract(token1.address, ERC20_ABI, signer);
        const balance = await token1Contract.balanceOf(address);
        setToken1Balance(ethers.formatUnits(balance, token1.decimals));
      }
    } catch (error) {
      console.error('Error reading balances:', error);
    }
  };

  // Update useEffect to read balances when tokens change
  useEffect(() => {
    readTokenBalances();
  }, [token0, token1, address]);

  // Add balance fetching function
  const fetchBalance = async (token) => {
    if (!address || !token) return '0';

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Handle ETH balance
      if (token.symbol === 'ETH') {
        const ethBalance = await provider.getBalance(address);
        return ethers.formatEther(ethBalance);
      }
      // Handle ERC20 tokens
      else {
        const tokenContract = new ethers.Contract(
          token.address,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );

        const [rawBalance, decimals] = await Promise.all([
          tokenContract.balanceOf(address),
          tokenContract.decimals().catch(() => 18)
        ]);

        return ethers.formatUnits(rawBalance, decimals);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  };

  // Add useEffect to fetch balances
  useEffect(() => {
    const updateBalances = async () => {
      if (token0) {
        const balance = await fetchBalance(token0);
        setToken0Balance(balance);
      }
      if (token1) {
        const balance = await fetchBalance(token1);
        setToken1Balance(balance);
      }
    };

    updateBalances();
  }, [token0, token1, address]);

  // Add formatBalance helper
  const formatBalance = (balance) => {
    if (!balance) return '0';
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    return num.toFixed(4);
  };

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
            <div className="fixed inset-0 bg-black/25 dark:bg-black/80 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#0a0b0f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-[#00ffbd]/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                  >
                    How was your experience?
                  </Dialog.Title>
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, index) => {
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

                    <p className="text-sm text-gray-500 dark:text-[#98A1C0]">
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
                            ? 'bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-[#98A1C0] cursor-not-allowed'
                        }`}
                      >
                        Submit Rating
                      </button>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl font-medium bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-gray-900 dark:text-white transition-colors"
                      >
                        Close
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

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">New position</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!token0 && !token1) return;
              setToken0(null);
              setToken1(null);
              setAmount0('');
              setAmount1('');
              setInitialPrice('');
              setCurrentStep('select-pair');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              token0 || token1 
                ? 'bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black' 
                : 'bg-gray-100 dark:bg-[#131A2A] text-gray-400 dark:text-[#98A1C0] cursor-not-allowed'
            }`}
            disabled={!token0 && !token1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12h8M11 9l-3 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-sm font-medium text-black">
            v3 position
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left side - Steps */}
        <div className="w-[240px] h-fit rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20 p-4 sticky top-4">
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => setCurrentStep('select-pair')}
              className={`flex items-start gap-3 ${currentStep === 'select-pair' ? 'text-[#00ffbd]' : 'text-gray-500 dark:text-[#5D6785] hover:text-[#00ffbd]/70'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00ffbd] text-black flex items-center justify-center font-medium">1</div>
              <div>
                <div className="font-medium">Step 1</div>
                <div className="text-sm">Select token pair and fees</div>
            </div>
            </button>
            <button
              onClick={() => token0 && token1 && setCurrentStep('set-price')}
              className={`flex items-start gap-3 ${!token0 || !token1 ? 'opacity-50 cursor-not-allowed' : ''} ${currentStep === 'set-price' ? 'text-[#00ffbd]' : 'text-gray-500 dark:text-[#5D6785] hover:text-[#00ffbd]/70'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00ffbd] text-black flex items-center justify-center font-medium">2</div>
              <div>
                <div className="font-medium">Step 2</div>
                <div className="text-sm">Set price range</div>
              </div>
            </button>
            <button 
              onClick={() => initialPrice && setCurrentStep('deposit-amounts')}
              className={`flex items-start gap-3 ${!initialPrice ? 'opacity-50 cursor-not-allowed' : ''} ${currentStep === 'deposit-amounts' ? 'text-[#00ffbd]' : 'text-gray-500 dark:text-[#5D6785] hover:text-[#00ffbd]/70'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00ffbd] text-black flex items-center justify-center font-medium">3</div>
              <div>
                <div className="font-medium">Step 3</div>
                <div className="text-sm">Enter deposit amounts</div>
          </div>
            </button>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 max-w-[700px]">
          {/* Step 1: Select Pair */}
          {currentStep === 'select-pair' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {token0 && token1 && (
                      <>
                        <div className="w-6 h-6 rounded-full bg-[#00ffbd] flex items-center justify-center text-xs font-medium text-black">
                          {token0.symbol.slice(0, 3)}
                        </div>
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {token0.symbol} / {token1.symbol}
                        </span>
                        <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                          v3
                        </div>
                        <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                          {selectedFeeTier / 10000}%
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setShowTokenSelector(false)}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Token 0 selector */}
                <button
                  onClick={() => {
                    setActiveSide('token0');
                    setShowTokenSelector(true);
                  }}
                    className="p-4 rounded-xl bg-[#00ffbd] dark:bg-[#131A2A] hover:bg-[#00ffbd]/90 dark:hover:bg-[#1c2433] text-left text-black dark:text-white"
                >
                  {token0 ? (
                    <div className="flex items-center gap-2">
                        <img src={getTokenLogo(token0)} alt={token0.symbol} className="w-6 h-6 rounded-full" />
                        <span className="font-medium">{token0.symbol}</span>
                    </div>
                  ) : (
                      <div className="text-gray-500 dark:text-[#98A1C0]">Select token</div>
                  )}
                </button>

                  {/* Token 1 selector */}
                <button
                  onClick={() => {
                    setActiveSide('token1');
                    setShowTokenSelector(true);
                  }}
                    className="p-4 rounded-xl bg-[#00ffbd] dark:bg-[#131A2A] hover:bg-[#00ffbd]/90 dark:hover:bg-[#1c2433] text-left text-black dark:text-white"
                >
                  {token1 ? (
                    <div className="flex items-center gap-2">
                        <img src={getTokenLogo(token1)} alt={token1.symbol} className="w-6 h-6 rounded-full" />
                        <span className="font-medium">{token1.symbol}</span>
                    </div>
                  ) : (
                      <div className="text-gray-500 dark:text-[#98A1C0]">Select token</div>
                  )}
                </button>
              </div>
            </div>

              {/* Fee tier selector */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fee tier</h3>
                    <p className="text-sm text-gray-500 dark:text-[#98A1C0]">
                    The amount earned providing liquidity. Choose an amount that suits your risk tolerance and strategy.
                  </p>
                </div>
                <button 
                    onClick={() => setShowFeeTierDetails(!showFeeTierDetails)}
                    className="px-4 py-2 rounded-xl bg-[#00ffbd] dark:bg-[#131A2A] hover:bg-[#00ffbd]/90 dark:hover:bg-[#1c2433] text-sm font-medium text-black dark:text-white"
                >
                    {showFeeTierDetails ? (
                    <>
                      Less
                        <span className="ml-1 inline-block transform rotate-180">▼</span>
                    </>
                  ) : (
                    <>
                      More
                        <span className="ml-1 inline-block">▼</span>
                    </>
                  )}
                </button>
              </div>

                {showFeeTierDetails ? (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { value: FEE_TIERS.LOWEST, label: '0.01%', description: 'Best for very stable pairs.' },
                      { value: FEE_TIERS.LOW, label: '0.05%', description: 'Best for stable pairs.' },
                      { value: FEE_TIERS.MEDIUM, label: '0.3%', description: 'Best for most pairs.' },
                      { value: FEE_TIERS.HIGH, label: '1%', description: 'Best for exotic pairs.' }
                    ].map((tier) => (
                  <button
                        key={tier.value}
                        onClick={() => setSelectedFeeTier(tier.value)}
                        className={`p-4 rounded-xl text-left transition-colors ${
                          selectedFeeTier === tier.value
                            ? 'bg-[#00ffbd] dark:bg-[#131A2A] border border-[#00ffbd] text-black dark:text-[#00ffbd]'
                            : 'bg-white dark:bg-[#0a0b0f] hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A] text-black dark:text-white'
                        }`}
                      >
                        <div className="text-base font-medium text-gray-900 dark:text-white">
                          {tier.label} fee tier
                        </div>
                        <div className="text-sm text-gray-500 dark:text-[#98A1C0]">{tier.description}</div>
                        <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">0 TVL</div>
                  </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-[#00ffbd] dark:bg-[#131A2A] rounded-xl mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-medium text-gray-900 dark:text-white">
                          {(selectedFeeTier / 10000).toFixed(2)}% fee tier
                        </div>
                        <div className="text-sm text-gray-500 dark:text-[#98A1C0]">
                          {selectedFeeTier === FEE_TIERS.LOWEST && 'Best for very stable pairs.'}
                          {selectedFeeTier === FEE_TIERS.LOW && 'Best for stable pairs.'}
                          {selectedFeeTier === FEE_TIERS.MEDIUM && 'Best for most pairs.'}
                          {selectedFeeTier === FEE_TIERS.HIGH && 'Best for exotic pairs.'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0]">0 TVL</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Creating new pool notice */}
              {token0 && token1 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-[#00ffbd] dark:bg-[#131A2A]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Creating new pool</div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                        Your selections will create a new liquidity pool which may result in lower initial liquidity and increased volatility. Consider adding to an existing pool to minimize these risks.
                      </div>
                    </div>
                  </div>
                </div>
              )}

                  <button
                onClick={nextStep}
                disabled={!token0 || !token1 || !selectedFeeTier}
                className={`w-full p-4 rounded-xl font-medium text-center ${
                  !token0 || !token1 || !selectedFeeTier
                    ? 'bg-gray-100 dark:bg-[#131A2A] text-gray-400 dark:text-[#98A1C0] cursor-not-allowed'
                    : 'bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black'
                }`}
              >
                Continue
              </button>
                      </div>
                    )}

          {/* Step 2: Set Price Range */}
          {currentStep === 'set-price' && (
            <div className="space-y-6">
              {/* Token pair header */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00ffbd] flex items-center justify-center text-xs font-medium text-black">
                      {getDisplaySymbol(token0).slice(0, 3)}
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {getDisplaySymbol(token0)} / {getDisplaySymbol(token1)}
                    </span>
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                      v3
                    </div>
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                      {selectedFeeTier / 10000}%
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTokenSelector(false)}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Initial price input */}
              {(!poolData?.exists || isLoadingPoolData) && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Initial price</h3>
                    <div className="flex gap-1">
                  <button
                        onClick={() => setShowTokenOrder(false)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          !showTokenOrder ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white' : 'hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A] text-black dark:text-white'
                        }`}
                      >
                        {token0.symbol}
                      </button>
                      <button
                        onClick={() => setShowTokenOrder(true)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          showTokenOrder ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white' : 'hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A] text-black dark:text-white'
                        }`}
                      >
                        {token1.symbol}
                  </button>
                </div>
                      </div>
                  <p className="text-sm text-gray-500 dark:text-[#98A1C0] mb-4">
                    Set the starting exchange rate between the two tokens you are providing.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={initialPrice}
                      onChange={(e) => handleInitialPriceChange(e.target.value)}
                      placeholder="0"
                      className="w-full p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#98A1C0] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#98A1C0]">
                      {showTokenOrder ? `${token1.symbol} per ${token0.symbol}` : `${token0.symbol} per ${token1.symbol}`}
                      </div>
                    </div>
                  {initialPrice && (
                    <div className="mt-2 text-sm text-gray-500 dark:text-[#98A1C0]">
                      1 {showTokenOrder ? token1.symbol : token0.symbol} = {initialPrice} {showTokenOrder ? token0.symbol : token1.symbol}
                      </div>
                    )}
                </div>
              )}

              {/* Price range selector */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Set price range</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowTokenOrder(false)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        !showTokenOrder ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white' : 'hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A] text-black dark:text-white'
                      }`}
                    >
                      {token0.symbol}
                    </button>
                    <button
                      onClick={() => setShowTokenOrder(true)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        showTokenOrder ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white' : 'hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A] text-black dark:text-white'
                      }`}
                    >
                      {token1.symbol}
                    </button>
                </div>
            </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={() => setSelectedRange('full')}
                    className={`p-4 rounded-xl text-center transition-colors ${
                    selectedRange === 'full' 
                        ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white'
                        : 'bg-white dark:bg-[#0a0b0f] text-gray-500 dark:text-[#98A1C0] hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A]'
                  }`}
                >
                  Full range
                </button>
                <button 
                  onClick={() => setSelectedRange('custom')}
                    className={`p-4 rounded-xl text-center transition-colors ${
                    selectedRange === 'custom' 
                        ? 'bg-[#00ffbd] dark:bg-[#131A2A] text-black dark:text-white'
                        : 'bg-white dark:bg-[#0a0b0f] text-gray-500 dark:text-[#98A1C0] hover:bg-[#00ffbd]/90 dark:hover:bg-[#131A2A]'
                  }`}
                >
                  Custom range
                </button>
              </div>

              {selectedRange === 'full' && (
                <>
                  <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-4">
                    Providing full range liquidity ensures continuous market participation across all possible prices, offering simplicity but with potential for higher impermanent loss.
                  </div>

                  {/* Current price display with token symbols */}
                  {renderPriceSection()}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl">
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-1">Min Price</div>
                      <div className="text-2xl font-medium text-gray-900 dark:text-white">0</div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                        {getDisplaySymbol(token1)} per {getDisplaySymbol(token0)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl">
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-1">Max Price</div>
                      <div className="text-2xl font-medium text-gray-900 dark:text-white">∞</div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                        {getDisplaySymbol(token1)} per {getDisplaySymbol(token0)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                      <label className="block text-sm text-gray-500 dark:text-[#98A1C0] mb-2">
                        Min price
                    </label>
                    <input
                      type="text"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        placeholder="0"
                        className="w-full p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#98A1C0] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                    />
                      <div className="mt-1 text-sm text-gray-500 dark:text-[#98A1C0]">
                        {token1.symbol} per {token0.symbol}
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm text-gray-500 dark:text-[#98A1C0] mb-2">
                        Max price
                    </label>
                    <input
                      type="text"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        placeholder="∞"
                        className="w-full p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl text-lg font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#98A1C0] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                    />
                      <div className="mt-1 text-sm text-gray-500 dark:text-[#98A1C0]">
                        {token1.symbol} per {token0.symbol}
                      </div>
                  </div>
                </div>
              )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 p-4 rounded-xl font-medium text-center border border-[#00ffbd] text-[#00ffbd] hover:bg-[#00ffbd]/10 bg-white dark:bg-transparent"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!initialPrice}
                  className={`flex-1 p-4 rounded-xl font-medium text-center ${
                    !initialPrice
                      ? 'bg-gray-100 dark:bg-[#131A2A] text-gray-400 dark:text-[#98A1C0] cursor-not-allowed'
                      : 'bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Deposit Amounts */}
          {currentStep === 'deposit-amounts' && (
            <div className="space-y-6">
              {/* Token pair header */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00ffbd] flex items-center justify-center text-xs font-medium text-black">
                      {getDisplaySymbol(token0).slice(0, 3)}
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {getDisplaySymbol(token0)} / {getDisplaySymbol(token1)}
                    </span>
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                      v3
                    </div>
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-[#131A2A] text-xs font-medium text-gray-900 dark:text-white">
                      {selectedFeeTier / 10000}%
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTokenSelector(false)}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Price range display */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Full range</h3>
                  <button
                    onClick={() => setCurrentStep('set-price')}
                    className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Edit
                  </button>
                </div>

                {selectedRange === 'full' && (
                  <>
                    <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-4">
                    The price of {getDisplaySymbol(token0)} can go from 0 to ∞ relative to {getDisplaySymbol(token1)}
                  </div>

                  {/* Current price display with token symbols */}
                  {renderPriceSection()}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl">
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-1">Min Price</div>
                      <div className="text-2xl font-medium text-gray-900 dark:text-white">0</div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                        {getDisplaySymbol(token1)} per {getDisplaySymbol(token0)}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl">
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mb-1">Max Price</div>
                      <div className="text-2xl font-medium text-gray-900 dark:text-white">∞</div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                        {getDisplaySymbol(token1)} per {getDisplaySymbol(token0)}
                      </div>
                    </div>
                  </div>
                </>
                )}
              </div>

              {/* Deposit amounts */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0b0f] border border-gray-200 dark:border-[#00ffbd]/20">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Deposit tokens</h3>
                <p className="text-sm text-gray-500 dark:text-[#98A1C0] mb-4">
                  Specify the token amounts for your liquidity contribution.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl border border-[#00ffbd]/10">
                    <input
                      type="text"
                      value={amount0}
                      onChange={(e) => handleAmount0Change(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#98A1C0] focus:outline-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <img src={getTokenLogo(token0)} alt={token0.symbol} className="w-5 h-5 rounded-full" />
                        <span className="font-medium text-gray-900 dark:text-white">{token0.symbol}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0]">
                        Balance: {formatBalance(token0Balance)} {token0.symbol}
                      </div>
              </div>
            </div>

                  <div className="p-4 bg-gray-100 dark:bg-[#131A2A] rounded-xl border border-[#00ffbd]/10">
                    <input
                      type="text"
                      value={amount1}
                      onChange={(e) => handleAmount1Change(e.target.value)}
                      placeholder="0"
                      className="w-full bg-transparent text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#98A1C0] focus:outline-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <img src={getTokenLogo(token1)} alt={token1.symbol} className="w-5 h-5 rounded-full" />
                        <span className="font-medium text-gray-900 dark:text-white">{token1.symbol}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-[#98A1C0]">
                        Balance: {formatBalance(token1Balance)} {token1.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 p-4 rounded-xl font-medium text-center border border-[#00ffbd] text-[#00ffbd] hover:bg-[#00ffbd]/10 bg-white dark:bg-transparent"
                >
                  Back
                </button>
            <button
              onClick={handleCreatePool}
                  disabled={!amount0 || !amount1}
                  className={`flex-1 p-4 rounded-xl font-medium text-center ${
                    !amount0 || !amount1
                      ? 'bg-gray-100 dark:bg-[#131A2A] text-gray-400 dark:text-[#98A1C0] cursor-not-allowed'
                      : 'bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black'
                  }`}
                >
                  Create Pool
            </button>
              </div>
            </div>
        )}
        </div>
      </div>

      {/* Token Selector Modal */}
      <TokenSelectionModal
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
        selectedToken={activeSide === 'token0' ? token0 : token1}
        excludeToken={activeSide === 'token0' ? token1 : token0}
      />

      {/* Progress Modal */}
      <Transition appear show={showProgressModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (currentStep === 'completed' || currentStep === 'error') {
              setShowProgressModal(false);
            }
          }}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#0a0b0f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-[#00ffbd]/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                  >
                    {error ? 'Error Creating Pool' : 'Creating Pool'}
                    {!error && token0 && token1 && (
                      <div className="mt-2 text-base font-normal text-gray-500 dark:text-[#98A1C0]">
                        {token0.symbol}/{token1.symbol}
                      </div>
                    )}
                  </Dialog.Title>

                  <div className="space-y-4">
                    {['preparing', 'approval', 'creating', 'confirming', 'completed'].map((step) => {
                      const isActive = currentStep === step;
                      const isCompleted = currentStep === 'completed' || (
                        ['completed', 'confirming', 'creating', 'approval'].indexOf(currentStep) >
                        ['completed', 'confirming', 'creating', 'approval'].indexOf(step)
                      );
                      
                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            isActive && !error ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                            isCompleted ? 'text-[#00ffbd]' : 
                            error && currentStep === step ? 'bg-red-500/10 text-red-500' : 
                            'text-gray-500 dark:text-[#5D6785]'
                          }`}
                        >
                          {Icons[step.charAt(0).toUpperCase() + step.slice(1)]?.()}
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 dark:text-white capitalize">{step}</span>
                            {isActive && !error && (
                              <p className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">
                                {step === 'preparing' && 'Preparing transaction...'}
                                {step === 'approval' && `Approving ${token0?.symbol} and ${token1?.symbol}`}
                                {step === 'creating' && `Creating ${token0?.symbol}/${token1?.symbol} pool`}
                                {step === 'confirming' && 'Waiting for confirmation...'}
                                {step === 'completed' && `Successfully created ${token0?.symbol}/${token1?.symbol} pool!`}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {error && (
                      <div className="p-4 bg-red-500/10 rounded-xl text-red-500 text-sm">
                        {error}
                      </div>
                    )}
                  </div>

                  {(currentStep === 'completed' || error) && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowProgressModal(false)}
                        className="w-full p-4 bg-[#00ffbd] hover:bg-[#00ffbd]/90 text-black rounded-xl font-medium"
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

      {/* Rating Modal */}
      <Transition appear show={showRatingModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowRatingModal(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0a0b0f] p-6 text-left align-middle shadow-xl transition-all border border-[#00ffbd]/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white text-center"
                  >
                    How was your experience?
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => {
                            console.log('User rated:', rating);
                            setShowRatingModal(false);
                          }}
                          className="p-2 hover:bg-[#00ffbd]/10 rounded-full transition-colors"
                        >
                          <FaStar
                            size={24}
                            className={rating <= 3 ? 'text-yellow-500' : 'text-[#00ffbd]'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="w-full p-4 bg-gray-100 dark:bg-[#131A2A] hover:bg-gray-200 dark:hover:bg-[#1c2433] text-gray-900 dark:text-white rounded-xl font-medium"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Price Range Modal */}
      <Transition appear show={showPriceRangeModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowPriceRangeModal(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0a0b0f] p-6 text-left align-middle shadow-xl transition-all border border-[#00ffbd]/20">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Set Price Range
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    {V3PositionManager.getPriceRangePresets().map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          if (preset.value === 'full') {
                            const { tickLower, tickUpper } = V3PositionManager.getFullRangeTicks(selectedFeeTier);
                            setTickLower(tickLower);
                            setTickUpper(tickUpper);
                          } else {
                            const { tickLower, tickUpper } = V3PositionManager.getPriceRangeTicks({
                              basePrice: Number(amount1) / Number(amount0),
                              lowerPricePercent: preset.lowerPricePercent,
                              upperPricePercent: preset.upperPricePercent,
                              decimals0: token0?.decimals,
                              decimals1: token1?.decimals,
                              feeAmount: selectedFeeTier
                            });
                            setTickLower(tickLower);
                            setTickUpper(tickUpper);
                          }
                          setShowPriceRangeModal(false);
                        }}
                        className="w-full p-4 text-left rounded-xl bg-[#131A2A] hover:bg-[#1c2433] border border-[#00ffbd]/10 transition-colors"
                      >
                        <div className="text-base font-semibold text-white">{preset.label}</div>
                        <div className="text-sm text-gray-500 dark:text-[#98A1C0] mt-1">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 