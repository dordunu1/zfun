import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import PoolSelectionModal from './PoolSelectionModal';
import { ethers } from 'ethers';
import { useUnichain } from '../../../hooks/useUnichain';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { ipfsToHttp } from '../../../utils/ipfs';

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

export default function RemoveLiquidity() {
  const { address } = useAccount();
  const uniswap = useUnichain();
  const [pool, setPool] = useState(null);
  const [lpTokenAmount, setLpTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

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
    try {
      // Parse amount with proper decimals
      const parsedAmount = ethers.parseUnits(lpTokenAmount, 18); // LP tokens typically have 18 decimals

      // First ensure approval is completed
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const pairContract = new ethers.Contract(pool.pairAddress, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ], signer);

      // Check allowance
      const allowance = await pairContract.allowance(address, uniswap.router.address);

      // Handle approval if needed
      if (allowance < parsedAmount) {
        try {
          toast.loading('Approving LP token...', { id: 'approve-lp' });
          const approveTx = await pairContract.approve(uniswap.router.address, ethers.MaxUint256);
          await approveTx.wait();
          toast.success('LP token approved successfully', { id: 'approve-lp' });
        } catch (error) {
          toast.error('Failed to approve LP token', { id: 'approve-lp' });
          setLoading(false);
          return; // Exit if approval fails
        }
      }

      // Remove liquidity
      toast.loading('Removing liquidity...', { id: 'remove-liquidity' });
      const receipt = await uniswap.removeLiquidity(
        pool.token0.address,
        pool.token1.address,
        parsedAmount,
        address
      );

      console.log('Liquidity removed:', receipt);
      toast.success('Liquidity removed successfully!', { id: 'remove-liquidity' });

      // Reset form and refresh pool info
      setLpTokenAmount('');
      const updatedPool = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
      setPool(prev => ({ ...prev, ...updatedPool }));

      // Refresh LP token balance
      const newBalance = await pairContract.balanceOf(address);
      setLpTokenBalance(ethers.formatUnits(newBalance, 18));
    } catch (error) {
      console.error('Remove liquidity error:', error);
      toast.error(
        error.message.includes('insufficient')
          ? 'Insufficient balance for transaction'
          : error.message.includes('chain')
          ? 'Please switch to a supported network'
          : `Failed to remove liquidity: ${error.message}`,
        { id: 'remove-liquidity' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    setLpTokenAmount(lpTokenBalance);
  };

  return (
    <div className="space-y-6">
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
          {/* LP Token Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LP Token Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={lpTokenAmount}
                onChange={(e) => setLpTokenAmount(e.target.value)}
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
    </div>
  );
} 