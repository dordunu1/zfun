import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import TokenSelectionModal from './TokenSelectionModal';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';

export default function TokenSwap() {
  const { address } = useAccount();
  const uniswap = useUniswap();
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState(null);
  const [route, setRoute] = useState(null);
  const [showFromTokenModal, setShowFromTokenModal] = useState(false);
  const [showToTokenModal, setShowToTokenModal] = useState(false);

  // Get quote when amount or tokens change
  useEffect(() => {
    async function getQuote() {
      if (!uniswap || !fromToken || !toToken || !fromAmount || fromAmount === '0') {
        setToAmount('');
        setPriceImpact(null);
        setRoute(null);
        return;
      }

      try {
        // Convert amount to wei based on token decimals
        const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
        const path = [fromToken.address, toToken.address];

        // Get quote from Uniswap
        const amountOut = await uniswap.getAmountOut(amountIn, path);
        setToAmount(ethers.utils.formatUnits(amountOut, toToken.decimals));

        // Get pool info for price impact
        const poolInfo = await uniswap.getPoolInfo(fromToken.address, toToken.address);
        if (poolInfo) {
          // Calculate price impact
          const impact = calculatePriceImpact(amountIn, amountOut, poolInfo);
          setPriceImpact(impact);
          setRoute(`${fromToken.symbol} → ${toToken.symbol}`);
        }
      } catch (error) {
        console.error('Error getting quote:', error);
        setToAmount('');
        setPriceImpact(null);
        setRoute(null);
      }
    }

    getQuote();
  }, [uniswap, fromToken, toToken, fromAmount]);

  const calculatePriceImpact = (amountIn, amountOut, poolInfo) => {
    const { reserve0, reserve1 } = poolInfo;
    const isToken0 = fromToken.address.toLowerCase() === poolInfo.token0.toLowerCase();
    
    const reserveIn = isToken0 ? reserve0 : reserve1;
    const reserveOut = isToken0 ? reserve1 : reserve0;
    
    // Calculate price impact using reserves
    const priceBeforeSwap = reserveOut.mul(ethers.constants.WeiPerEther).div(reserveIn);
    const priceAfterSwap = amountOut.mul(ethers.constants.WeiPerEther).div(amountIn);
    const impact = priceBeforeSwap.sub(priceAfterSwap).mul(100).div(priceBeforeSwap);
    
    return Number(ethers.utils.formatUnits(impact, 2)); // Return as percentage
  };

  const handleSwap = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!fromToken || !toToken || !fromAmount) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const amountIn = ethers.utils.parseUnits(fromAmount, fromToken.decimals);
      const amountOutMin = ethers.utils.parseUnits(toAmount, toToken.decimals)
        .mul(95) // 5% slippage tolerance
        .div(100);

      const path = [fromToken.address, toToken.address];
      
      const receipt = await uniswap.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        address
      );

      toast.success('Swap successful!');
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      toast.error(error.reason || 'Failed to swap tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleFromTokenSelect = async (token) => {
    if (token.symbol === 'ETH') {
      // For ETH, we don't need to get token info
      setFromToken({
        ...token,
        address: UNISWAP_ADDRESSES.WETH, // Use WETH address for Uniswap
        decimals: 18
      });
    } else {
      // For other tokens, get token info
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setFromToken({ ...token, ...tokenInfo });
    }
    setShowFromTokenModal(false);
  };

  const handleToTokenSelect = async (token) => {
    if (token.symbol === 'ETH') {
      // For ETH, we don't need to get token info
      setToToken({
        ...token,
        address: UNISWAP_ADDRESSES.WETH, // Use WETH address for Uniswap
        decimals: 18
      });
    } else {
      // For other tokens, get token info
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setToToken({ ...token, ...tokenInfo });
    }
    setShowToTokenModal(false);
  };

  return (
    <>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Card Container */}
        <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          {/* From Token */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimals
                    setFromAmount(value);
                  }
                }}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={() => setShowFromTokenModal(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
              >
                {fromToken ? (
                  <div className="flex items-center gap-2">
                    <img src={fromToken.logo} alt={fromToken.symbol} className="w-5 h-5" />
                    <span>{fromToken.symbol}</span>
                  </div>
                ) : (
                  'Select Token'
                )}
              </button>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center my-4">
            <button
              onClick={() => {
                const tempToken = fromToken;
                const tempAmount = fromAmount;
                setFromToken(toToken);
                setFromAmount(toAmount);
                setToToken(tempToken);
                setToAmount(tempAmount);
              }}
              className="p-2.5 rounded-xl bg-[#00ffbd]/10 text-[#00ffbd] hover:bg-[#00ffbd]/20 transition-colors border border-[#00ffbd]/20"
            >
              <FaExchangeAlt size={16} />
            </button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.0"
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={() => setShowToTokenModal(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
              >
                {toToken ? (
                  <div className="flex items-center gap-2">
                    <img src={toToken.logo} alt={toToken.symbol} className="w-5 h-5" />
                    <span>{toToken.symbol}</span>
                  </div>
                ) : (
                  'Select Token'
                )}
              </button>
            </div>
          </div>

          {/* Price Impact & Route */}
          <div className="mt-4 p-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price Impact</span>
                <span className={`text-gray-900 dark:text-gray-100 ${
                  priceImpact && priceImpact > 5 ? 'text-red-500' : ''
                }`}>
                  {priceImpact ? `${priceImpact}%` : '--'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Route</span>
                <span className="text-gray-900 dark:text-gray-100">{route || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={loading || !fromToken || !toToken || !fromAmount || !toAmount}
          className={`
            w-full px-4 py-4 rounded-xl font-medium text-black text-lg
            ${loading || !fromToken || !toToken || !fromAmount || !toAmount
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
            }
          `}
        >
          {loading ? 'Swapping...' : 'Swap'}
        </button>
      </div>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showFromTokenModal}
        onClose={() => setShowFromTokenModal(false)}
        onSelect={handleFromTokenSelect}
        selectedTokenAddress={fromToken?.address}
      />
      <TokenSelectionModal
        isOpen={showToTokenModal}
        onClose={() => setShowToTokenModal(false)}
        onSelect={handleToTokenSelect}
        selectedTokenAddress={toToken?.address}
      />
    </>
  );
} 