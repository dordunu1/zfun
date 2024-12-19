import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from './TokenSelectionModal';
import PoolSelectionModal from './PoolSelectionModal';
import { ethers } from 'ethers';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ipfsToHttp } from '../../utils/ipfs';

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
  const { address } = useAccount();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      if (!address || !token?.address) return;

      setIsLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          token.address,
          [
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)'
          ],
          provider
        );

        const [rawBalance, decimals] = await Promise.all([
          tokenContract.balanceOf(address),
          tokenContract.decimals()
        ]);

        const formattedBalance = ethers.formatUnits(rawBalance, decimals);
        console.log(`Balance loaded for ${token.symbol}:`, {
          raw: rawBalance.toString(),
          formatted: formattedBalance,
          decimals
        });

        setBalance(formattedBalance);
      } catch (error) {
        console.error(`Error loading ${token.symbol} balance:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [address, token]);

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Loading balance...
      </div>
    );
  }

  const formattedBalance = Number(balance).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6
  });

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Balance: {formattedBalance} {token.symbol}
    </div>
  );
};

export default function AddLiquidity() {
  const { address } = useAccount();
  const uniswap = useUniswap();
  const [pool, setPool] = useState(null);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);

  // Add new useEffect for automatic amount calculation
  React.useEffect(() => {
    const calculateOtherAmount = async () => {
      if (!pool || (!token0Amount && !token1Amount)) return;

      try {
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        if (!poolInfo || !poolInfo.reserve0 || !poolInfo.reserve1) return;

        if (token0Amount && !token1Amount) {
          const amount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
          const amount1 = (amount0 * poolInfo.reserve1) / poolInfo.reserve0;
          setToken1Amount(ethers.formatUnits(amount1, pool.token1.decimals));
        } else if (token1Amount && !token0Amount) {
          const amount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);
          const amount0 = (amount1 * poolInfo.reserve0) / poolInfo.reserve1;
          setToken0Amount(ethers.formatUnits(amount0, pool.token0.decimals));
        }
      } catch (error) {
        console.error('Error calculating amounts:', error);
      }
    };

    calculateOtherAmount();
  }, [pool, token0Amount, token1Amount, uniswap]);

  const handleAddLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !token0Amount || !token1Amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Parse amounts with proper decimals
      const parsedAmount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
      const parsedAmount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);

      // First ensure approvals are completed
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const token0Contract = new ethers.Contract(pool.token0.address, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ], signer);
      
      const token1Contract = new ethers.Contract(pool.token1.address, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ], signer);

      // Check allowances
      const allowance0 = await token0Contract.allowance(address, uniswap.router.address);
      const allowance1 = await token1Contract.allowance(address, uniswap.router.address);

      // Handle token0 approval first if needed
      if (allowance0 < parsedAmount0) {
        try {
          toast.loading('Approving ' + pool.token0.symbol + '...', { id: 'approve0' });
          const approve0Tx = await token0Contract.approve(uniswap.router.address, ethers.MaxUint256);
          await approve0Tx.wait();
          toast.success(pool.token0.symbol + ' approved successfully', { id: 'approve0' });
        } catch (error) {
          toast.error('Failed to approve ' + pool.token0.symbol, { id: 'approve0' });
          setLoading(false);
          return; // Exit if approval fails
        }
      }

      // Handle token1 approval after token0 is approved
      if (allowance1 < parsedAmount1) {
        try {
          toast.loading('Approving ' + pool.token1.symbol + '...', { id: 'approve1' });
          const approve1Tx = await token1Contract.approve(uniswap.router.address, ethers.MaxUint256);
          await approve1Tx.wait();
          toast.success(pool.token1.symbol + ' approved successfully', { id: 'approve1' });
        } catch (error) {
          toast.error('Failed to approve ' + pool.token1.symbol, { id: 'approve1' });
          setLoading(false);
          return; // Exit if approval fails
        }
      }

      // Double-check allowances after approvals
      const finalAllowance0 = await token0Contract.allowance(address, uniswap.router.address);
      const finalAllowance1 = await token1Contract.allowance(address, uniswap.router.address);

      if (finalAllowance0 < parsedAmount0 || finalAllowance1 < parsedAmount1) {
        toast.error('Approval process incomplete. Please try again.');
        setLoading(false);
        return;
      }

      // Wait a moment after approvals are confirmed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate minimum amounts (1% slippage tolerance)
      const amount0Min = parsedAmount0 * 99n / 100n;
      const amount1Min = parsedAmount1 * 99n / 100n;

      toast.loading('Adding liquidity...', { id: 'add-liquidity' });

      // Add liquidity only after approvals are confirmed
      const receipt = await uniswap.addLiquidity(
        pool.token0.address,
        pool.token1.address,
        parsedAmount0,
        parsedAmount1,
        amount0Min,
        amount1Min,
        address
      );

      console.log('Liquidity added:', receipt);
      toast.success('Liquidity added successfully!', { id: 'add-liquidity' });
      
      // Reset form
      setToken0Amount('');
      setToken1Amount('');
      setPool(null);
    } catch (error) {
      console.error('Add liquidity error:', error);
      toast.error(
        error.message.includes('insufficient')
          ? 'Insufficient balance for transaction'
          : error.message.includes('chain')
          ? 'Please switch to a supported network'
          : `Failed to add liquidity: ${error.message}`,
        { id: 'add-liquidity' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePoolSelect = (selectedPool) => {
    setPool({
      ...selectedPool,
      token0: {
        ...selectedPool.token0,
        name: selectedPool.token0.name || selectedPool.token0.symbol,
        symbol: selectedPool.token0.symbol,
        logo: selectedPool.token0.logo || selectedPool.token0.logoIpfs,
      },
      token1: {
        ...selectedPool.token1,
        name: selectedPool.token1.name || selectedPool.token1.symbol,
        symbol: selectedPool.token1.symbol,
        logo: selectedPool.token1.logo || selectedPool.token1.logoIpfs,
      }
    });
    setShowPoolModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 dark:bg-[#1a1b1f] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Liquidity</h2>
      
      {/* Pool Selection */}
      <div className="mb-6">
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
          {/* Amount Inputs */}
          <div className="space-y-4">
            {/* Token 0 Input */}
            <div className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getTokenLogo(pool.token0)}
                    alt={pool.token0.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pool.token0.symbol}
                  </span>
                </div>
                <TokenBalance token={pool.token0} />
              </div>
              <input
                type="number"
                value={token0Amount}
                onChange={(e) => setToken0Amount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-white/5 dark:bg-[#2d2f36] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>

            {/* Token 1 Input */}
            <div className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getTokenLogo(pool.token1)}
                    alt={pool.token1.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pool.token1.symbol}
                  </span>
                </div>
                <TokenBalance token={pool.token1} />
              </div>
              <input
                type="number"
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Add Liquidity Button */}
          <button
            onClick={handleAddLiquidity}
            disabled={loading || !token0Amount || !token1Amount}
            className="w-full mt-6 px-6 py-3 bg-[#00ffbd] hover:bg-[#00e6a9] disabled:bg-gray-400 text-black font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Adding Liquidity...
              </>
            ) : (
              'Add Liquidity'
            )}
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
          // Reset amounts when pool changes
          setToken0Amount('');
          setToken1Amount('');
        }}
      />
    </div>
  );
} 