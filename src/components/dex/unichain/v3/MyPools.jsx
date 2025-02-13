import React, { useState, useEffect, Fragment } from 'react';
import { useAccount } from 'wagmi';
import { usePublicClient, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BiWallet, BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaExchangeAlt, FaStar, FaGasPump, FaChartLine } from 'react-icons/fa';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { getTokenLogo } from '../../../../utils/tokens';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { V3PositionManager } from '../../../../services/unichain/v3/positionManager';
import { motion, AnimatePresence } from 'framer-motion';

// NFTPositionManager ABI (we'll need the relevant functions)
const NFT_POSITION_MANAGER_ABI = [
  // ERC721Enumerable functions
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "uint256", "name": "index", "type": "uint256"}],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "positions",
    "outputs": [
      {"internalType": "uint96", "name": "nonce", "type": "uint96"},
      {"internalType": "address", "name": "operator", "type": "address"},
      {"internalType": "address", "name": "token0", "type": "address"},
      {"internalType": "address", "name": "token1", "type": "address"},
      {"internalType": "uint24", "name": "fee", "type": "uint24"},
      {"internalType": "int24", "name": "tickLower", "type": "int24"},
      {"internalType": "int24", "name": "tickUpper", "type": "int24"},
      {"internalType": "uint128", "name": "liquidity", "type": "uint128"},
      {"internalType": "uint256", "name": "feeGrowthInside0LastX128", "type": "uint256"},
      {"internalType": "uint256", "name": "feeGrowthInside1LastX128", "type": "uint256"},
      {"internalType": "uint128", "name": "tokensOwed0", "type": "uint128"},
      {"internalType": "uint128", "name": "tokensOwed1", "type": "uint128"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const FACTORY_ADDRESS = "0x1f984000000000000000000000000000000000003";
const NFT_POSITION_MANAGER_ADDRESS = "0xb7610f9b733e7d45184be3a1bc8a847be6ec4f0b";

// Add Factory ABI at the top with other ABIs
const FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)"
];

// Add Pool ABI for fetching amounts
const POOL_ABI = [
  "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function liquidity() external view returns (uint128)",
  "function positions(bytes32 key) external view returns (uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
  "function ticks(int24 tick) external view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)"
];

// Add NFT metadata ABI
const NFT_METADATA_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Constants for tick math
const Q96 = BigInt(2) ** BigInt(96);
const Q32 = BigInt(2) ** BigInt(32);

// Helper function to calculate sqrt price from tick
const getSqrtRatioAtTick = (tick) => {
  const absTick = tick < 0 ? tick * -1 : tick;
  let ratio = BigInt(1001) * Q32 / BigInt(1000);
  
  if ((absTick & 0x1) !== 0) {
    ratio = (ratio * BigInt(1001)) / BigInt(1000);
  }
  if ((absTick & 0x2) !== 0) {
    ratio = (ratio * BigInt(1002)) / BigInt(1000);
  }
  if ((absTick & 0x4) !== 0) {
    ratio = (ratio * BigInt(1005)) / BigInt(1000);
  }
  if ((absTick & 0x8) !== 0) {
    ratio = (ratio * BigInt(1010)) / BigInt(1000);
  }
  if ((absTick & 0x10) !== 0) {
    ratio = (ratio * BigInt(1020)) / BigInt(1000);
  }
  if ((absTick & 0x20) !== 0) {
    ratio = (ratio * BigInt(1040)) / BigInt(1000);
  }
  if ((absTick & 0x40) !== 0) {
    ratio = (ratio * BigInt(1080)) / BigInt(1000);
  }
  if ((absTick & 0x80) !== 0) {
    ratio = (ratio * BigInt(1160)) / BigInt(1000);
  }
  if ((absTick & 0x100) !== 0) {
    ratio = (ratio * BigInt(1340)) / BigInt(1000);
  }
  if ((absTick & 0x200) !== 0) {
    ratio = (ratio * BigInt(1800)) / BigInt(1000);
  }
  if ((absTick & 0x400) !== 0) {
    ratio = (ratio * BigInt(3240)) / BigInt(1000);
  }
  if ((absTick & 0x800) !== 0) {
    ratio = (ratio * BigInt(10500)) / BigInt(1000);
  }
  if ((absTick & 0x1000) !== 0) {
    ratio = (ratio * BigInt(110000)) / BigInt(1000);
  }
  if ((absTick & 0x2000) !== 0) {
    ratio = (ratio * BigInt(12100000)) / BigInt(1000);
  }

  if (tick > 0) {
    ratio = BigInt("0xffffffffffffffffffffffffffffffff") / ratio;
  }

  return ratio * Q32;
};

const getAmount0FromTick = (sqrtPriceX96, tickLower, tickUpper, liquidity) => {
  try {
    const sqrtPriceCurrent = BigInt(sqrtPriceX96.toString());
    const sqrtPriceLower = getSqrtRatioAtTick(Number(tickLower));
    const sqrtPriceUpper = getSqrtRatioAtTick(Number(tickUpper));
    const liquidityBn = BigInt(liquidity.toString());

    if (sqrtPriceCurrent <= sqrtPriceLower) {
      // Price is below range
      const amount = liquidityBn * Q96 * (sqrtPriceUpper - sqrtPriceLower);
      return amount / (sqrtPriceLower * sqrtPriceUpper);
    } else if (sqrtPriceCurrent < sqrtPriceUpper) {
      // Price is in range
      const amount = liquidityBn * Q96 * (sqrtPriceUpper - sqrtPriceCurrent);
      return amount / (sqrtPriceCurrent * sqrtPriceUpper);
    }
    // Price is above range
    return BigInt(0);
  } catch (error) {
    console.error('Error in getAmount0FromTick:', error);
    return BigInt(0);
  }
};

const getAmount1FromTick = (sqrtPriceX96, tickLower, tickUpper, liquidity) => {
  try {
    const sqrtPriceCurrent = BigInt(sqrtPriceX96.toString());
    const sqrtPriceLower = getSqrtRatioAtTick(Number(tickLower));
    const sqrtPriceUpper = getSqrtRatioAtTick(Number(tickUpper));
    const liquidityBn = BigInt(liquidity.toString());

    if (sqrtPriceCurrent <= sqrtPriceLower) {
      // Price is below range
      return BigInt(0);
    } else if (sqrtPriceCurrent < sqrtPriceUpper) {
      // Price is in range
      return (liquidityBn * (sqrtPriceCurrent - sqrtPriceLower)) / Q96;
    }
    // Price is above range
    return (liquidityBn * (sqrtPriceUpper - sqrtPriceLower)) / Q96;
  } catch (error) {
    console.error('Error in getAmount1FromTick:', error);
    return BigInt(0);
  }
};

const formatBigInt = (value, decimals = 18) => {
  if (!value) return '0';
  try {
    // Remove scientific notation and ensure we have a string
    const valueString = value.toString();
    
    // Convert to a number with proper decimal places
    const formatted = Number(formatUnits(valueString, decimals));
    
    // Format the number based on its size
    if (formatted < 0.0001) {
      return '< 0.0001';
    } else if (formatted < 1) {
      return formatted.toFixed(4);
    } else if (formatted < 1000) {
      return formatted.toFixed(2);
    } else if (formatted < 1000000) {
      return formatted.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    } else {
      // For very large numbers, use K/M/B notation
      if (formatted >= 1000000000) {
        return (formatted / 1000000000).toFixed(2) + 'B';
      } else if (formatted >= 1000000) {
        return (formatted / 1000000).toFixed(2) + 'M';
      } else {
        return (formatted / 1000).toFixed(2) + 'K';
      }
    }
  } catch (error) {
    console.error('Error formatting BigInt:', error);
    return '0';
  }
};

// Helper function to get NFT image URL
const getNFTImageUrl = (tokenId) => {
  return `https://nft.uniswap.org/#/${NFT_POSITION_MANAGER_ADDRESS}/${tokenId}`;
};

// Add helper function to check if position is in range
const isPositionInRange = (position, currentTick) => {
  return currentTick >= position.tickLower && currentTick <= position.tickUpper;
};

// Add progress steps at the top of the file
const PROGRESS_STEPS = {
  PREPARING: 'preparing',
  APPROVAL: 'approval',
  ADDING: 'adding',
  CONFIRMING: 'confirming',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Add Icons at the top of the file
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path className="animate-pulse" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path className="animate-[spin_3s_linear_infinite]" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" className="animate-[pulse_2s_ease-in-out_infinite]" />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 8v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.6s_ease-in-out]" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="animate-[pulse_2s_ease-in-out_infinite]" />
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
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Error: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 8v5M12 16.5v.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

function PositionCard({ position, onAction }) {
  const [nftImage, setNftImage] = useState(null);
  const { data: walletClient } = useWalletClient();
  const [currentTick, setCurrentTick] = useState(null);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      try {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        const nftContract = new ethers.Contract(
          NFT_POSITION_MANAGER_ADDRESS,
          NFT_METADATA_ABI,
          provider
        );

        // Fetch token URI with error handling
        const tokenURI = await nftContract.tokenURI(position.tokenId).catch(() => null);
        
        if (!tokenURI) return;

        // Handle both base64 and IPFS URIs
        let metadata;
        if (tokenURI.startsWith('data:application/json;base64,')) {
          // Base64 encoded metadata
          const base64Data = tokenURI.split(',')[1];
          if (!base64Data) return;
          
          try {
            const jsonString = atob(base64Data);
            metadata = JSON.parse(jsonString);
          } catch {
            return;
          }
        } else {
          // IPFS or HTTP URI
          try {
            const response = await fetch(tokenURI);
            if (!response.ok) return;
            metadata = await response.json();
          } catch {
            return;
          }
        }

        if (metadata?.image) {
          setNftImage(metadata.image);
        }
      } catch {
        // Silent fail - NFT image will show loading state
      }
    };

    if (position?.tokenId && walletClient) {
      fetchNFTMetadata();
    }
  }, [position?.tokenId, walletClient]);

  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          provider
        );
        
        const poolAddress = await factoryContract.getPool(
          position.token0.address,
          position.token1.address,
          position.fee
        );

        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
        const slot0 = await poolContract.slot0();
        setCurrentTick(slot0.tick);
      } catch {
        // Silent fail - UI will handle undefined currentTick gracefully
      }
    };

    if (position && walletClient) {
      fetchPoolData();
    }
  }, [position, walletClient]);

  // Calculate price range for display
  const getPriceRange = () => {
    const priceLower = Math.pow(1.0001, position.tickLower);
    const priceUpper = Math.pow(1.0001, position.tickUpper);
    return {
      min: priceLower < 0.01 ? '< 0.01' : priceLower.toFixed(2),
      max: priceUpper > 999999 ? '∞' : priceUpper.toFixed(2)
    };
  };

  const priceRange = getPriceRange();

  return (
    <div className="p-3 rounded-xl bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 max-w-2xl mx-auto">
      <div className="flex items-start gap-4">
        {/* NFT Preview */}
        <a 
          href={`https://app.uniswap.org/#/pool/${position.tokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-[140px] h-full rounded-lg overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-[#00ffbd] transition-all"
        >
          {nftImage ? (
            <img 
              src={nftImage}
              alt={`Position #${position.tokenId}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
            </div>
          )}
        </a>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img src={getTokenLogo(position.token0)} alt={position.token0.symbol} className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]" />
                <img src={getTokenLogo(position.token1)} alt={position.token1.symbol} className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {position.token0.symbol}/{position.token1.symbol}
                </div>
                <div className="flex items-center gap-2">
                  {currentTick !== null && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${isPositionInRange(position, currentTick) ? 'bg-[#00ffbd] shadow-[0_0_8px_#00ffbd]' : 'bg-gray-400'}`} />
                      <span className="text-xs text-[#00ffbd]">
                        {isPositionInRange(position, currentTick) ? 'In range' : 'Out of range'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1c2433] transition-colors">
                <BiDotsHorizontalRounded className="w-5 h-5 text-[#00ffbd]" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-1 w-60 origin-top-right rounded-2xl bg-white dark:bg-[#1a1b1f] shadow-lg border border-gray-200 dark:border-gray-800 focus:outline-none">
                  <div className="p-2 space-y-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onAction('add', position)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''
                          } group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white`}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00ffbd]/10">
                            <span className="text-lg text-[#00ffbd]">+</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Add liquidity</span>
                            <span className="text-xs text-gray-500">Add more liquidity to this position</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onAction('remove', position)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''
                          } group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white`}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00ffbd]/10">
                            <span className="text-lg text-[#00ffbd]">-</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Remove liquidity</span>
                            <span className="text-xs text-gray-500">Remove liquidity from this position</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onAction('collect', position)}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''
                          } group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white`}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00ffbd]/10">
                            <img 
                              src="/unichain-logo.png" 
                              alt="Unichain" 
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Collect fees</span>
                            <span className="text-xs text-gray-500">Collect accumulated fees</span>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          
          <div className="space-y-2">
            {/* Pool Share */}
            <div className="p-2 rounded-lg bg-[#00ffbd]">
              <div className="text-xs text-black mb-0.5">
                Pool Share
              </div>
              <div className="font-medium text-sm text-black">
                {(position.positionShare * 100).toFixed(4)}%
              </div>
            </div>

            {/* Token Amounts */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1c2433]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  {position.token0.symbol}
                </div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {formatBigInt(position.amount0, position.token0.decimals)}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1c2433]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  {position.token1.symbol}
                </div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {formatBigInt(position.amount1, position.token1.decimals)}
                </div>
              </div>
            </div>

            {/* Unclaimed Fees */}
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-[#1c2433]">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Unclaimed fees
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {formatBigInt(position.fees0, position.token0.decimals)} {position.token0.symbol}
                </div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {formatBigInt(position.fees1, position.token1.decimals)} {position.token1.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddLiquidityModal({ isOpen, onClose, position }) {
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance0, setBalance0] = useState('0');
  const [balance1, setBalance1] = useState('0');
  const [currentTick, setCurrentTick] = useState(null);
  const [sqrtPriceX96, setSqrtPriceX96] = useState(null);
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(PROGRESS_STEPS.PREPARING);
  const [error, setError] = useState(null);

  // Calculate the price from sqrtPriceX96
  const calculatePrice = (sqrtPriceX96) => {
    if (!sqrtPriceX96) return 0;
    const price = (Number(sqrtPriceX96) * Number(sqrtPriceX96) * (10 ** (position?.token0?.decimals - position?.token1?.decimals))) / (2 ** 192);
    return price;
  };

  // Calculate token amounts based on price and position range
  const calculateAmounts = (amount, isToken0) => {
    if (!sqrtPriceX96 || !position) return '0';
    
    const price = calculatePrice(sqrtPriceX96);
    if (isToken0) {
      // If token0 amount is input, calculate token1 amount
      const token1Amount = Number(amount) * price;
      return token1Amount.toFixed(position.token1.decimals);
    } else {
      // If token1 amount is input, calculate token0 amount
      const token0Amount = Number(amount) / price;
      return token0Amount.toFixed(position.token0.decimals);
    }
  };

  // Handle input changes
  const handleAmount0Change = (value) => {
    setAmount0(value);
    if (value && !isNaN(value)) {
      setAmount1(calculateAmounts(value, true));
    } else {
      setAmount1('');
    }
  };

  const handleAmount1Change = (value) => {
    setAmount1(value);
    if (value && !isNaN(value)) {
      setAmount0(calculateAmounts(value, false));
    } else {
      setAmount0('');
    }
  };

  useEffect(() => {
    const fetchPoolData = async () => {
      if (!walletClient || !position) return;
      
      try {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          provider
        );
        
        const poolAddress = await factoryContract.getPool(
          position.token0.address,
          position.token1.address,
          position.fee
        );

        const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
        const slot0 = await poolContract.slot0();
        setCurrentTick(slot0.tick);
        setSqrtPriceX96(slot0.sqrtPriceX96);
      } catch (error) {
        console.error('Error fetching pool data:', error);
      }
    };

    fetchPoolData();
  }, [walletClient, position]);

  const handleAddLiquidity = async () => {
    if (!walletClient || !position) {
      toast.error('Wallet not connected or position not found');
      return;
    }

    setIsLoading(true);
    setCurrentStep(PROGRESS_STEPS.PREPARING);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create position manager instance with signer
      const positionManager = new V3PositionManager(signer);

      // Parse amounts with proper decimals
      const parsedAmount0 = ethers.parseUnits(
        Number(amount0).toFixed(position.token0.decimals),
        position.token0.decimals
      );
      const parsedAmount1 = ethers.parseUnits(
        Number(amount1).toFixed(position.token1.decimals),
        position.token1.decimals
      );

      // Check and set allowances if needed
      setCurrentStep(PROGRESS_STEPS.APPROVAL);

      // Create token contracts with signer for approvals
      const token0Contract = new ethers.Contract(
        position.token0.address,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );
      const token1Contract = new ethers.Contract(
        position.token1.address,
        ["function approve(address spender, uint256 amount) public returns (bool)"],
        signer
      );

      // Approve tokens
      const tx0 = await token0Contract.approve(NFT_POSITION_MANAGER_ADDRESS, ethers.MaxUint256);
      await tx0.wait();
      const tx1 = await token1Contract.approve(NFT_POSITION_MANAGER_ADDRESS, ethers.MaxUint256);
      await tx1.wait();

      setCurrentStep(PROGRESS_STEPS.ADDING);

      // Format parameters for increasing liquidity
      const params = {
        tokenId: position.tokenId,
        amount0Desired: parsedAmount0,
        amount1Desired: parsedAmount1,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 1200 // 20 minutes
      };

      // Create NFT position manager contract
      const nftManager = new ethers.Contract(
        NFT_POSITION_MANAGER_ADDRESS,
        [
          "function increaseLiquidity((uint256 tokenId, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, uint256 deadline)) external payable returns (uint128 liquidity, uint256 amount0, uint256 amount1)"
        ],
        signer
      );

      // Increase liquidity
      const tx = await nftManager.increaseLiquidity(params);
      
      setCurrentStep(PROGRESS_STEPS.CONFIRMING);
      await tx.wait();

      setCurrentStep(PROGRESS_STEPS.COMPLETED);
      toast.success('Successfully added liquidity');
      onClose();
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setError(error.message);
      setCurrentStep(PROGRESS_STEPS.ERROR);
      toast.error('Failed to add liquidity: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletClient || !position || !address) return;
      
      try {
        const provider = new ethers.BrowserProvider(walletClient.transport);
        const token0Contract = new ethers.Contract(
          position.token0.address,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const token1Contract = new ethers.Contract(
          position.token1.address,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );

        const [bal0, bal1] = await Promise.all([
          token0Contract.balanceOf(address),
          token1Contract.balanceOf(address)
        ]);

        setBalance0(formatBigInt(bal0, position.token0.decimals));
        setBalance1(formatBigInt(bal1, position.token1.decimals));
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, [walletClient, position, address]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D0D0D] p-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1 hover:opacity-80">
                <XMarkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex -space-x-1">
                    <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-8 h-8 rounded-full" />
                    <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-8 h-8 rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <img src="/unichain-logo.png" alt="Unichain" className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {position?.token0?.symbol}/{position?.token1?.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentTick !== null && (
                      <span className="text-xs text-[#00ffbd]">
                        {isPositionInRange(position, currentTick) ? 'In range' : 'Out of range'}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      v3 {(position?.fee / 10000).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2D2D2D]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-900 dark:text-white">
                <path d="M12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z" fill="currentColor"/>
                <path d="M19 13.75C19.9665 13.75 20.75 12.9665 20.75 12C20.75 11.0335 19.9665 10.25 19 10.25C18.0335 10.25 17.25 11.0335 17.25 12C17.25 12.9665 18.0335 13.75 19 13.75Z" fill="currentColor"/>
                <path d="M5 13.75C5.9665 13.75 6.75 12.9665 6.75 12C6.75 11.0335 5.9665 10.25 5 10.25C4.0335 10.25 3.25 11.0335 3.25 12C3.25 12.9665 4.0335 13.75 5 13.75Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            {/* Token0 Input */}
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-[#1c1c1c]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-6 h-6 rounded-full" />
                  <span className="text-gray-900 dark:text-white font-medium">{position?.token0?.symbol}</span>
                </div>
                <button 
                  onClick={() => handleAmount0Change(balance0)}
                  className="text-sm text-[#00ffbd] hover:text-[#00ffbd]/80"
                >
                  Balance: {balance0}
                </button>
              </div>
              <input
                type="number"
                value={amount0}
                onChange={(e) => handleAmount0Change(e.target.value)}
                className="w-full bg-transparent text-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                placeholder="0"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">$0</div>
            </div>

            {/* Token1 Input */}
            <div className="p-4 rounded-2xl bg-gray-100 dark:bg-[#1c1c1c]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-6 h-6 rounded-full" />
                  <span className="text-gray-900 dark:text-white font-medium">{position?.token1?.symbol}</span>
                </div>
                <button 
                  onClick={() => handleAmount1Change(balance1)}
                  className="text-sm text-[#00ffbd] hover:text-[#00ffbd]/80"
                >
                  Balance: {balance1}
                </button>
              </div>
              <input
                type="number"
                value={amount1}
                onChange={(e) => handleAmount1Change(e.target.value)}
                className="w-full bg-transparent text-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                placeholder="0"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">$0</div>
            </div>

            {/* Current Position Details */}
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1c] space-y-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Position</div>
              
              {/* Pool Share */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Pool Share</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(position?.positionShare * 100).toFixed(4)}%
                </span>
              </div>

              {/* Token 0 Position */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current {position?.token0?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatBigInt(position?.amount0, position?.token0?.decimals)}
                </span>
              </div>

              {/* Token 1 Position */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current {position?.token1?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatBigInt(position?.amount1, position?.token1?.decimals)}
                </span>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddLiquidity}
            disabled={!amount0 || !amount1 || isLoading}
            className={`w-full mt-4 px-4 py-3 text-base font-medium rounded-2xl ${
              !amount0 || !amount1
                ? 'bg-gray-200 dark:bg-[#2D2D2D] text-gray-400 cursor-not-allowed'
                : 'bg-[#00ffbd] text-black hover:bg-[#00ffbd]/90'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add'
            )}
          </button>

          {/* Progress Modal */}
          <Transition appear show={isLoading} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => {
                if (currentStep === PROGRESS_STEPS.COMPLETED || currentStep === PROGRESS_STEPS.ERROR) {
                  setIsLoading(false);
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
                        {error ? 'Error Adding Liquidity' : 'Adding Liquidity'}
                        {!error && position && (
                          <div className="mt-2 text-base font-normal text-gray-500 dark:text-[#98A1C0]">
                            {position.token0.symbol}/{position.token1.symbol}
                          </div>
                        )}
                      </Dialog.Title>

                      <div className="space-y-4">
                        {[
                          { step: PROGRESS_STEPS.PREPARING, title: 'Preparing', icon: Icons.Preparing },
                          { step: PROGRESS_STEPS.APPROVAL, title: 'Token Approval', icon: Icons.Approval },
                          { step: PROGRESS_STEPS.ADDING, title: 'Adding Liquidity', icon: Icons.Adding },
                          { step: PROGRESS_STEPS.CONFIRMING, title: 'Confirming', icon: Icons.Confirming },
                          { step: PROGRESS_STEPS.COMPLETED, title: 'Completed', icon: Icons.Completed }
                        ].map(({ step, title, icon: Icon }) => {
                          const isActive = currentStep === step;
                          const isCompleted = !error && Object.values(PROGRESS_STEPS).indexOf(currentStep) > Object.values(PROGRESS_STEPS).indexOf(step);
                          const isErrorStep = error && currentStep === step;
                          
                          return (
                            <div
                              key={step}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive
                                  ? 'bg-[#00ffbd]/10 text-[#00ffbd]'
                                  : isCompleted
                                  ? 'text-[#00ffbd]'
                                  : isErrorStep
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'text-gray-400'
                              }`}
                            >
                              <Icon />
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                                {isActive && !error && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {step === PROGRESS_STEPS.PREPARING && 'Preparing transaction...'}
                                    {step === PROGRESS_STEPS.APPROVAL && `Approving ${position?.token0?.symbol} and ${position?.token1?.symbol}`}
                                    {step === PROGRESS_STEPS.ADDING && (
                                      <span className="flex items-center gap-2">
                                        Adding liquidity to {position?.token0?.symbol}/{position?.token1?.symbol} pool
                                      </span>
                                    )}
                                    {step === PROGRESS_STEPS.CONFIRMING && 'Waiting for confirmation...'}
                                    {step === PROGRESS_STEPS.COMPLETED && (
                                      <span className="flex items-center gap-2">
                                        Successfully added liquidity to {position?.token0?.symbol}/{position?.token1?.symbol} pool!
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

                        {error && (
                          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-3">
                              <Icons.Error />
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                                <p className="mt-1 text-sm text-red-400">
                                  {error}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(currentStep === PROGRESS_STEPS.COMPLETED || error) && (
                        <div className="mt-6">
                          <button
                            onClick={() => setIsLoading(false)}
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function RemoveLiquidityModal({ isOpen, onClose, position }) {
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [currentStep, setCurrentStep] = useState(PROGRESS_STEPS.PREPARING);
  const [error, setError] = useState(null);
  const [amount0, setAmount0] = useState('0');
  const [amount1, setAmount1] = useState('0');

  // Calculate amounts based on percentage
  useEffect(() => {
    if (position && percentage) {
      const amount0Value = (BigInt(position.amount0) * BigInt(percentage)) / BigInt(100);
      const amount1Value = (BigInt(position.amount1) * BigInt(percentage)) / BigInt(100);
      setAmount0(formatBigInt(amount0Value, position.token0.decimals));
      setAmount1(formatBigInt(amount1Value, position.token1.decimals));
    } else {
      setAmount0('0');
      setAmount1('0');
    }
  }, [percentage, position]);

  const handleRemoveLiquidity = async () => {
    if (!walletClient || !position) {
      toast.error('Wallet not connected or position not found');
      return;
    }

    setIsLoading(true);
    setCurrentStep(PROGRESS_STEPS.PREPARING);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Calculate liquidity to remove based on percentage
      const liquidityToRemove = (BigInt(position.liquidity) * BigInt(percentage)) / BigInt(100);

      setCurrentStep(PROGRESS_STEPS.ADDING);

      // Create NFT position manager contract
      const nftManager = new ethers.Contract(
        NFT_POSITION_MANAGER_ADDRESS,
        [
          "function decreaseLiquidity((uint256 tokenId, uint128 liquidity, uint256 amount0Min, uint256 amount1Min, uint256 deadline)) external payable returns (uint256 amount0, uint256 amount1)"
        ],
        signer
      );

      // Format parameters for decreasing liquidity
      const params = {
        tokenId: position.tokenId,
        liquidity: liquidityToRemove,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 1200 // 20 minutes
      };

      // Remove liquidity
      const tx = await nftManager.decreaseLiquidity(params);
      
      setCurrentStep(PROGRESS_STEPS.CONFIRMING);
      await tx.wait();

      setCurrentStep(PROGRESS_STEPS.COMPLETED);
      toast.success('Successfully removed liquidity');
      onClose();
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setError(error.message);
      setCurrentStep(PROGRESS_STEPS.ERROR);
      toast.error('Failed to remove liquidity: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D0D0D] p-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1 hover:opacity-80">
                <XMarkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex -space-x-1">
                    <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-8 h-8 rounded-full" />
                    <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-8 h-8 rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <img src="/unichain-logo.png" alt="Unichain" className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      {position?.token0?.symbol}/{position?.token1?.symbol}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    v3 {(position?.fee / 10000).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Percentage Selection */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Amount to remove</span>
                <span className="text-sm text-[#00ffbd]">{percentage}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() => setPercentage(value)}
                    className={`p-2 text-sm font-medium rounded-xl transition-colors ${
                      percentage === value
                        ? 'bg-[#00ffbd] text-black'
                        : 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-900 dark:text-white hover:bg-[#00ffbd]/10 dark:hover:bg-[#00ffbd]/10'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>

            {/* Current Position Details */}
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1c] space-y-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Position</div>
              
              {/* Pool Share */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Pool Share</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(position?.positionShare * 100).toFixed(4)}%
                </span>
              </div>

              {/* Token 0 Position */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current {position?.token0?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatBigInt(position?.amount0, position?.token0?.decimals)}
                </span>
              </div>

              {/* Token 1 Position */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current {position?.token1?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatBigInt(position?.amount1, position?.token1?.decimals)}
                </span>
              </div>
            </div>

            {/* Amount Preview */}
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1c] space-y-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">You will receive:</div>
              
              {/* Token 0 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {position?.token0?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {amount0}
                </span>
              </div>

              {/* Token 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-5 h-5 rounded-full" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {position?.token1?.symbol}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {amount1}
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemoveLiquidity}
              disabled={!percentage || isLoading}
              className={`w-full mt-2 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                !percentage
                  ? 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-400 cursor-not-allowed'
                  : 'bg-[#00ffbd] text-black hover:bg-[#00ffbd]/90'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                  <span>Removing...</span>
                </div>
              ) : (
                'Remove'
              )}
            </button>
          </div>

          {/* Progress Modal */}
          <Transition appear show={isLoading} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => {
                if (currentStep === PROGRESS_STEPS.COMPLETED || currentStep === PROGRESS_STEPS.ERROR) {
                  setIsLoading(false);
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
                        {error ? 'Error Removing Liquidity' : 'Removing Liquidity'}
                        {!error && position && (
                          <div className="mt-2 text-base font-normal text-gray-500 dark:text-[#98A1C0]">
                            {position.token0.symbol}/{position.token1.symbol}
                          </div>
                        )}
                      </Dialog.Title>

                      <div className="space-y-4">
                        {[
                          { step: PROGRESS_STEPS.PREPARING, title: 'Preparing', icon: Icons.Preparing },
                          { step: PROGRESS_STEPS.ADDING, title: 'Removing Liquidity', icon: () => (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <g strokeWidth={1.5} stroke="currentColor">
                                <path d="M8 12h8" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.6s_ease-in-out]" />
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="animate-[pulse_2s_ease-in-out_infinite]" />
                              </g>
                            </svg>
                          ) },
                          { step: PROGRESS_STEPS.CONFIRMING, title: 'Confirming', icon: Icons.Confirming },
                          { step: PROGRESS_STEPS.COMPLETED, title: 'Completed', icon: Icons.Completed }
                        ].map(({ step, title, icon: Icon }) => {
                          const isActive = currentStep === step;
                          const isCompleted = !error && Object.values(PROGRESS_STEPS).indexOf(currentStep) > Object.values(PROGRESS_STEPS).indexOf(step);
                          const isErrorStep = error && currentStep === step;
                          
                          return (
                            <div
                              key={step}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive && !isErrorStep ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                                isCompleted ? 'text-[#00ffbd]' : 
                                isErrorStep ? 'bg-red-500/10 text-red-500' : 
                                'text-gray-400'
                              }`}
                            >
                              <Icon />
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                                {isActive && !error && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {step === PROGRESS_STEPS.PREPARING && 'Preparing transaction...'}
                                    {step === PROGRESS_STEPS.ADDING && (
                                      <span className="flex items-center gap-2">
                                        Removing {percentage}% liquidity from {position?.token0?.symbol}/{position?.token1?.symbol} pool
                                      </span>
                                    )}
                                    {step === PROGRESS_STEPS.CONFIRMING && 'Waiting for confirmation...'}
                                    {step === PROGRESS_STEPS.COMPLETED && (
                                      <span className="flex items-center gap-2">
                                        Successfully removed liquidity from {position?.token0?.symbol}/{position?.token1?.symbol} pool!
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

                        {error && (
                          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-3">
                              <Icons.Error />
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                                <p className="mt-1 text-sm text-red-400">
                                  {error}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(currentStep === PROGRESS_STEPS.COMPLETED || error) && (
                        <div className="mt-6">
                          <button
                            onClick={() => setIsLoading(false)}
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function CollectFeesModal({ isOpen, onClose, position }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [currentStep, setCurrentStep] = useState(PROGRESS_STEPS.PREPARING);
  const [error, setError] = useState(null);

  const handleCollectFees = async () => {
    if (!walletClient || !position) {
      toast.error('Wallet not connected or position not found');
      return;
    }

    setIsLoading(true);
    setCurrentStep(PROGRESS_STEPS.PREPARING);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setCurrentStep(PROGRESS_STEPS.ADDING);

      // Create NFT position manager contract
      const nftManager = new ethers.Contract(
        NFT_POSITION_MANAGER_ADDRESS,
        [
          "function collect((uint256 tokenId, address recipient, uint128 amount0Max, uint128 amount1Max)) external payable returns (uint256 amount0, uint256 amount1)"
        ],
        signer
      );

      // Format parameters for collecting fees
      const params = {
        tokenId: position.tokenId,
        recipient: await signer.getAddress(),
        amount0Max: position.fees0,
        amount1Max: position.fees1
      };

      // Collect fees
      const tx = await nftManager.collect(params);
      
      setCurrentStep(PROGRESS_STEPS.CONFIRMING);
      await tx.wait();

      setCurrentStep(PROGRESS_STEPS.COMPLETED);
      toast.success('Successfully collected fees');
      onClose();
    } catch (error) {
      console.error('Error collecting fees:', error);
      setError(error.message);
      setCurrentStep(PROGRESS_STEPS.ERROR);
      toast.error('Failed to collect fees: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D0D0D] p-4 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1 hover:opacity-80">
                <XMarkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex -space-x-1">
                    <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-8 h-8 rounded-full" />
                    <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-8 h-8 rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <img src="/unichain-logo.png" alt="Unichain" className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900 dark:text-white">
                      Collect Fees
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {position?.token0?.symbol}/{position?.token1?.symbol} • {(position?.fee / 10000).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fees Preview */}
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-[#1c1c1c] space-y-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Uncollected fees</div>
            
            {/* Token 0 Fees */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={getTokenLogo(position?.token0)} alt={position?.token0?.symbol} className="w-5 h-5 rounded-full" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {position?.token0?.symbol}
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatBigInt(position?.fees0, position?.token0?.decimals)}
              </span>
            </div>

            {/* Token 1 Fees */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={getTokenLogo(position?.token1)} alt={position?.token1?.symbol} className="w-5 h-5 rounded-full" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {position?.token1?.symbol}
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatBigInt(position?.fees1, position?.token1?.decimals)}
              </span>
            </div>
          </div>

          {/* Collect Button */}
          <button
            onClick={handleCollectFees}
            disabled={!position?.fees0 && !position?.fees1 || isLoading}
            className={`w-full mt-4 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
              !position?.fees0 && !position?.fees1
                ? 'bg-gray-100 dark:bg-[#1c1c1c] text-gray-400 cursor-not-allowed'
                : 'bg-[#00ffbd] text-black hover:bg-[#00ffbd]/90'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                <span>Collecting...</span>
              </div>
            ) : (
              'Collect'
            )}
          </button>

          {/* Progress Modal */}
          <Transition appear show={isLoading} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => {
                if (currentStep === PROGRESS_STEPS.COMPLETED || currentStep === PROGRESS_STEPS.ERROR) {
                  setIsLoading(false);
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
                        {error ? 'Error Collecting Fees' : 'Collecting Fees'}
                        {!error && position && (
                          <div className="mt-2 text-base font-normal text-gray-500 dark:text-[#98A1C0]">
                            {position.token0.symbol}/{position.token1.symbol}
                          </div>
                        )}
                      </Dialog.Title>

                      <div className="space-y-4">
                        {[
                          { step: PROGRESS_STEPS.PREPARING, title: 'Preparing', icon: Icons.Preparing },
                          { step: PROGRESS_STEPS.ADDING, title: 'Collecting Fees', icon: () => (
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <g strokeWidth={1.5} stroke="currentColor">
                                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.6s_ease-in-out]" />
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="animate-[pulse_2s_ease-in-out_infinite]" />
                              </g>
                            </svg>
                          ) },
                          { step: PROGRESS_STEPS.CONFIRMING, title: 'Confirming', icon: Icons.Confirming },
                          { step: PROGRESS_STEPS.COMPLETED, title: 'Completed', icon: Icons.Completed }
                        ].map(({ step, title, icon: Icon }) => {
                          const isActive = currentStep === step;
                          const isCompleted = !error && Object.values(PROGRESS_STEPS).indexOf(currentStep) > Object.values(PROGRESS_STEPS).indexOf(step);
                          const isErrorStep = error && currentStep === step;
                          
                          return (
                            <div
                              key={step}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive && !isErrorStep ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                                isCompleted ? 'text-[#00ffbd]' : 
                                isErrorStep ? 'bg-red-500/10 text-red-500' : 
                                'text-gray-400'
                              }`}
                            >
                              <Icon />
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">{title}</span>
                                {isActive && !error && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {step === PROGRESS_STEPS.PREPARING && 'Preparing transaction...'}
                                    {step === PROGRESS_STEPS.ADDING && (
                                      <span className="flex items-center gap-2">
                                        Collecting fees from {position?.token0?.symbol}/{position?.token1?.symbol} position
                                      </span>
                                    )}
                                    {step === PROGRESS_STEPS.CONFIRMING && 'Waiting for confirmation...'}
                                    {step === PROGRESS_STEPS.COMPLETED && (
                                      <span className="flex items-center gap-2">
                                        Successfully collected fees!
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

                        {error && (
                          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-3">
                              <Icons.Error />
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                                <p className="mt-1 text-sm text-red-400">
                                  {error}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(currentStep === PROGRESS_STEPS.COMPLETED || error) && (
                        <div className="mt-6">
                          <button
                            onClick={() => setIsLoading(false)}
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Update the animation variants at the top of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      mass: 0.8,
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Add this near the top with other imports
const SkeletonCard = () => (
  <motion.div 
    className="p-3 rounded-xl bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 max-w-2xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="flex items-start gap-4">
      {/* NFT Preview Skeleton */}
      <div className="relative w-[140px] h-[140px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />

      <div className="flex-1 space-y-3">
        {/* Title Skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Details Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function MyPools() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false);
  const [showRemoveLiquidityModal, setShowRemoveLiquidityModal] = useState(false);
  const [showCollectFeesModal, setShowCollectFeesModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (address && publicClient) {
      fetchPositions();
    }
  }, [address, publicClient]);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      
      if (!address || !walletClient) {
        throw new Error('Wallet not connected');
      }

      const provider = new ethers.BrowserProvider(walletClient.transport);
      const positionManagerContract = new ethers.Contract(
        NFT_POSITION_MANAGER_ADDRESS,
        NFT_POSITION_MANAGER_ABI,
        provider
      );

      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        provider
      );

      // Get number of positions
      const balance = await positionManagerContract.balanceOf(address);

      if (Number(balance) === 0) {
        setPositions([]);
        return;
      }

      // ERC20 ABI for token details
      const ERC20_ABI = [
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)"
      ];
      
      // Create promises for all positions
      const positionPromises = Array.from({ length: Number(balance) }, async (_, i) => {
        try {
          const tokenId = await positionManagerContract.tokenOfOwnerByIndex(address, i);
          
          const position = await positionManagerContract.positions(tokenId);
          
          // Get pool address
          const poolAddress = await factoryContract.getPool(
            position.token0,
            position.token1,
            position.fee
          );

          // Get pool contract
          const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
          const [slot0Data, poolLiquidity] = await Promise.all([
            poolContract.slot0(),
            poolContract.liquidity()
          ]);

          // Get token details
          const token0Contract = new ethers.Contract(position.token0, ERC20_ABI, provider);
          const token1Contract = new ethers.Contract(position.token1, ERC20_ABI, provider);

          const [token0Symbol, token0Decimals, token1Symbol, token1Decimals] = await Promise.all([
            token0Contract.symbol(),
            token0Contract.decimals(),
            token1Contract.symbol(),
            token1Contract.decimals()
          ]);

          // Calculate amounts in the position
          const amount0 = getAmount0FromTick(
            slot0Data.sqrtPriceX96,
            position.tickLower,
            position.tickUpper,
            position.liquidity
          );

          const amount1 = getAmount1FromTick(
            slot0Data.sqrtPriceX96,
            position.tickLower,
            position.tickUpper,
            position.liquidity
          );

          // Calculate position's share
          const positionShare = Number(position.liquidity) / Number(poolLiquidity);
          
          return {
            id: tokenId.toString(),
            tokenId: tokenId.toString(),
            token0: {
              address: position.token0,
              symbol: token0Symbol,
              decimals: Number(token0Decimals)
            },
            token1: {
              address: position.token1,
              symbol: token1Symbol,
              decimals: Number(token1Decimals)
            },
            fee: Number(position.fee),
            tickLower: Number(position.tickLower),
            tickUpper: Number(position.tickUpper),
            liquidity: position.liquidity.toString(),
            amount0: amount0.toString(),
            amount1: amount1.toString(),
            fees0: position.tokensOwed0.toString(),
            fees1: position.tokensOwed1.toString(),
            positionShare: positionShare
          };
        } catch (positionError) {
          console.error(`Error fetching position ${i}:`, positionError);
          return null;
        }
      });

      // Fetch all positions in parallel
      const results = await Promise.all(positionPromises);
      const validPositions = results.filter(position => position !== null);

      setPositions(validPositions);

    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.error('Failed to fetch positions: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePositionAction = (action, position) => {
    setSelectedPosition(position);
    switch (action) {
      case 'add':
        setShowAddLiquidityModal(true);
        break;
      case 'remove':
        setShowRemoveLiquidityModal(true);
        break;
      case 'collect':
        setShowCollectFeesModal(true);
        break;
      case 'info':
        // Handle pool info action
        break;
    }
  };

  if (!isConnected) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <BiWallet className="mx-auto h-12 w-12 text-gray-400" />
        <motion.h3 
          className="mt-2 text-sm font-medium text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No positions
        </motion.h3>
        <motion.p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Connect your wallet to view your positions
        </motion.p>
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={open}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-black bg-[#00ffbd] hover:bg-[#00ffbd]/90"
          >
            Connect Wallet
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {positions.length > 0 ? (
        <AnimatePresence>
          {positions.map((position) => (
            <motion.div
              key={position.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout="position"
              layoutId={position.id}
            >
              <PositionCard
                position={position}
                onAction={handlePositionAction}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <FaChartLine className="mx-auto h-12 w-12 text-gray-400" />
          <motion.h3 
            className="mt-2 text-sm font-medium text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No positions found
          </motion.h3>
          <motion.p 
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create a position to provide liquidity and earn fees
          </motion.p>
        </motion.div>
      )}

      <AddLiquidityModal
        isOpen={showAddLiquidityModal}
        onClose={() => setShowAddLiquidityModal(false)}
        position={selectedPosition}
      />
      
      <RemoveLiquidityModal
        isOpen={showRemoveLiquidityModal}
        onClose={() => setShowRemoveLiquidityModal(false)}
        position={selectedPosition}
      />
      
      <CollectFeesModal
        isOpen={showCollectFeesModal}
        onClose={() => setShowCollectFeesModal(false)}
        position={selectedPosition}
      />
    </motion.div>
  );
} 