import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useUniswap } from '../../hooks/useUniswap';
import PoolSelectionModal from './PoolSelectionModal';
import { getTokenLogo } from '../../utils/tokens';

export default function RemoveLiquidity() {
  const { address } = useAccount();
  const uniswap = useUniswap();
  const [pool, setPool] = useState(null);
  const [lpBalance, setLpBalance] = useState('0');
  const [removePercentage, setRemovePercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [token0Amount, setToken0Amount] = useState('0');
  const [token1Amount, setToken1Amount] = useState('0');

  // Fetch LP token balance and pool info when pool is selected
  useEffect(() => {
    let isMounted = true;

    const fetchPoolInfo = async () => {
      if (!pool || !address || !pool.pairAddress) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Get LP token contract
        const lpContract = new ethers.Contract(
          pool.pairAddress,
          [
            'function balanceOf(address) view returns (uint256)',
            'function totalSupply() view returns (uint256)',
            'function allowance(address, address) view returns (uint256)'
          ],
          provider
        );

        // Get current reserves and other pool info
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        
        // Get user's LP balance and total supply
        const [balance, totalSupply] = await Promise.all([
          lpContract.balanceOf(address),
          lpContract.totalSupply()
        ]);

        if (!isMounted) return;

        // Calculate user's share and token amounts
        const userShare = (balance * BigInt(10000)) / totalSupply;
        const sharePercentage = Number(userShare) / 100;

        // Calculate token amounts based on share
        const token0Amount = (poolInfo.reserve0 * balance) / totalSupply;
        const token1Amount = (poolInfo.reserve1 * balance) / totalSupply;

        setLpBalance(ethers.formatEther(balance));
        setToken0Amount(ethers.formatUnits(token0Amount, pool.token0.decimals));
        setToken1Amount(ethers.formatUnits(token1Amount, pool.token1.decimals));

        // Store total supply for share calculation
        setPool(prev => ({
          ...prev,
          totalSupply: ethers.formatEther(totalSupply),
          userShare: sharePercentage
        }));

      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching pool info:', error);
        toast.error('Failed to fetch pool information');
      }
    };

    fetchPoolInfo();
    return () => {
      isMounted = false;
    };
  }, [pool?.pairAddress, address, uniswap]);

  // Update token amounts based on remove percentage
  useEffect(() => {
    if (!pool || !lpBalance || !removePercentage || !token0Amount || !token1Amount) {
      return;
    }

    try {
      const percentage = parseFloat(removePercentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) return;

      // Calculate amounts based on percentage of user's total holdings
      const baseToken0Amount = parseFloat(token0Amount);
      const baseToken1Amount = parseFloat(token1Amount);
      
      const newToken0Amount = (baseToken0Amount * percentage) / 100;
      const newToken1Amount = (baseToken1Amount * percentage) / 100;

      setToken0Amount(newToken0Amount.toFixed(pool.token0.decimals));
      setToken1Amount(newToken1Amount.toFixed(pool.token1.decimals));

    } catch (error) {
      console.error('Error calculating token amounts:', error);
    }
  }, [removePercentage, lpBalance, pool?.token0?.decimals]);

  const handleRemoveLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !removePercentage) {
      toast.error('Please select a pool and enter amount to remove');
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Calculate LP tokens to remove
      const totalLPTokens = ethers.parseEther(lpBalance);
      const lpTokensToRemove = (totalLPTokens * BigInt(Math.floor(parseFloat(removePercentage)))) / 100n;

      // Calculate minimum amounts with 1% slippage
      const amount0Min = (ethers.parseUnits(token0Amount, pool.token0.decimals) * 99n) / 100n;
      const amount1Min = (ethers.parseUnits(token1Amount, pool.token1.decimals) * 99n) / 100n;

      console.log('Remove Liquidity Params:', {
        lpTokensToRemove: lpTokensToRemove.toString(),
        amount0Min: amount0Min.toString(),
        amount1Min: amount1Min.toString()
      });

      // First approve LP tokens if needed
      const lpContract = new ethers.Contract(
        pool.pairAddress,
        ['function approve(address, uint256) returns (bool)', 'function allowance(address, address) view returns (uint256)'],
        signer
      );

      const allowance = await lpContract.allowance(address, uniswap.router.address);
      if (allowance < lpTokensToRemove) {
        toast.loading('Approving LP tokens...', { id: 'approve-lp' });
        const approveTx = await lpContract.approve(uniswap.router.address, ethers.MaxUint256);
        await approveTx.wait();
        toast.success('LP tokens approved', { id: 'approve-lp' });
      }

      // Remove liquidity
      toast.loading('Removing liquidity...', { id: 'remove-liquidity' });
      const receipt = await uniswap.removeLiquidity(
        pool.token0.address,
        pool.token1.address,
        lpTokensToRemove,
        amount0Min,
        amount1Min,
        address
      );

      console.log('Liquidity removed:', receipt);
      toast.success('Liquidity removed successfully!', { id: 'remove-liquidity' });

      // Reset form and refresh pool info
      setRemovePercentage('');
      const updatedPool = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
      setPool(prev => ({ ...prev, ...updatedPool }));
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
          {/* LP Balance Display */}
          <div className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Your Pool Tokens</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {parseFloat(lpBalance).toFixed(6)} LP Tokens
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Your Pool Share</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {pool.userShare ? `${pool.userShare.toFixed(2)}%` : '0%'}
              </span>
            </div>
          </div>

          {/* Remove Percentage Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount to Remove
            </label>
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percentage) => (
                <button
                  key={percentage}
                  onClick={() => setRemovePercentage(percentage.toString())}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${removePercentage === percentage.toString()
                      ? 'bg-[#00ffbd] text-black'
                      : 'bg-white/5 dark:bg-[#2d2f36] text-gray-700 dark:text-gray-300 hover:bg-[#00ffbd]/10'
                    }
                  `}
                >
                  {percentage}%
                </button>
              ))}
            </div>
            <input
              type="number"
              value={removePercentage}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                  setRemovePercentage(value);
                }
              }}
              placeholder="Enter percentage (0-100)"
              className="w-full px-4 py-3 bg-white/5 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* You Will Receive */}
          <div className="p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">You Will Receive</h3>
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
                  {parseFloat(token0Amount).toFixed(6)}
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
                  {parseFloat(token1Amount).toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Remove Liquidity Button */}
          <button
            onClick={handleRemoveLiquidity}
            disabled={loading || !removePercentage || parseFloat(removePercentage) <= 0}
            className={`
              w-full px-4 py-3 rounded-xl font-medium text-black
              ${loading || !removePercentage || parseFloat(removePercentage) <= 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
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
          setRemovePercentage('');
        }}
      />
    </div>
  );
} 