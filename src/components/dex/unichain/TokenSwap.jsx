import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BiWallet } from 'react-icons/bi';
import { FaExchangeAlt } from 'react-icons/fa';
import { useWeb3Modal } from '@web3modal/react';
import { useUnichain } from '../../../hooks/useUnichain';
import TokenSelector from './TokenSelector';
import { getTokenLogo } from '../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';

export default function TokenSwap() {
  const { address, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const uniswap = useUnichain();
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(null);
  const [networkCost, setNetworkCost] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [slippage, setSlippage] = useState(2.0);
  const [customSlippage, setCustomSlippage] = useState('');
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);
  const [routeError, setRouteError] = useState(null);

  // Add balance display component
  const TokenBalance = ({ token }) => {
    const { address: userAddress } = useAccount();
    const [balance, setBalance] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

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

  // Update useEffect for route calculation
  useEffect(() => {
    const updateRoute = async () => {
      if (!fromToken || !toToken || !fromAmount || !uniswap) {
        setToAmount('');
        setRoute(null);
        setRouteError(null);
        return;
      }

      try {
        const { route: newRoute, toAmount: newToAmount, path } = await uniswap.updateRoute(
          fromToken,
          toToken,
          fromAmount
        );

        if (!newRoute || !newToAmount || newToAmount === '0') {
          setToAmount('');
          setRoute(null);
          setRouteError('No valid route found. Liquidity pools might not exist for this pair.');
          return;
        }

        setRoute(newRoute);
        setToAmount(newToAmount);
        setRouteError(null);
      } catch (error) {
        console.error('Error updating route:', error);
        setToAmount('');
        setRoute(null);
        setRouteError('Error finding route');
      }
    };

    updateRoute();
  }, [fromToken, toToken, fromAmount, uniswap]);

  const handleTokenSelect = (token) => {
    if (activeSide === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenSelector(false);
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Parse amounts
      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
      const amountOutMinRaw = ethers.parseUnits(toAmount, toToken.decimals);
      
      // Calculate slippage
      const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100));
      const amountOutMin = (amountOutMinRaw * slippageMultiplier) / 10000n;

      const path = [fromToken.address, toToken.address];
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      const tx = await uniswap.swap(
        fromToken,
        toToken,
        amountIn,
        amountOutMin,
        path,
        deadline
      );

      await tx.wait();
      toast.success('Swap successful!');
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Error swapping tokens:', error);
      toast.error(error.reason || 'Failed to swap tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleSlippageChange = (value) => {
    if (value === 'custom') {
      setShowCustomSlippage(true);
    } else {
      setSlippage(parseFloat(value));
      setShowCustomSlippage(false);
      setCustomSlippage('');
    }
  };

  const handleCustomSlippageChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)) {
      setCustomSlippage(value);
      if (value !== '') {
        setSlippage(parseFloat(value));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Card Container */}
      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please connect your wallet to start swapping tokens
            </p>
            <button
              onClick={openConnectModal}
              className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
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
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setFromAmount(value);
                    }
                  }}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    setActiveSide('from');
                    setShowTokenSelector(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
                >
                  {fromToken ? (
                    <div className="flex items-center gap-2">
                      <img src={getTokenLogo(fromToken)} alt={fromToken.symbol} className="w-5 h-5" />
                      <span>{fromToken.symbol}</span>
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {fromToken && <TokenBalance token={fromToken} />}
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
                  onClick={() => {
                    setActiveSide('to');
                    setShowTokenSelector(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
                >
                  {toToken ? (
                    <div className="flex items-center gap-2">
                      <img src={getTokenLogo(toToken)} alt={toToken.symbol} className="w-5 h-5" />
                      <span>{toToken.symbol}</span>
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {toToken && <TokenBalance token={toToken} />}
            </div>

            {/* Trade Details Section */}
            <div className="mt-4 p-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
              {/* Compact View (Always Visible) */}
              <div className="space-y-2 text-sm mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Fee (0.3%)</span>
                    <span className="text-gray-500 cursor-help" title="A portion of each trade (0.3%) goes to liquidity providers as a protocol incentive.">ⓘ</span>
                  </div>
                  <span className="text-gray-200">
                    {fromAmount ? `${(Number(fromAmount) * 0.003).toFixed(6)} ${fromToken?.symbol}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Network cost</span>
                    <span className="text-gray-500 cursor-help" title="Estimated cost of the transaction on Ethereum">ⓘ</span>
                  </div>
                  <span className="text-gray-200">{networkCost || '~0.003 ETH'}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

              {/* Show More Button */}
              <button
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-400"
              >
                {showMoreDetails ? 'Hide Details' : 'Show Details'} 
                <svg
                  className={`w-4 h-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Details */}
              {showMoreDetails && (
                <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected Output</span>
                    <span className="text-gray-200">{toAmount} {toToken?.symbol}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minimum received after slippage ({slippage}%)</span>
                    <span className="text-gray-200">
                      {toAmount && Number(toAmount * (1 - slippage/100)).toFixed(6)} {toToken?.symbol}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Route</span>
                    <span className="text-gray-200">{route || '--'}</span>
                  </div>

                  {exchangeRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rate</span>
                      <span className="text-gray-200">
                        1 {fromToken?.symbol} = {exchangeRate.toFixed(6)} {toToken?.symbol}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Slippage Settings */}
      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Slippage Tolerance
            </span>
            <div className="flex space-x-2">
              {[0.5, 1.0, 2.0].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSlippageChange(value.toString())}
                  className={`px-3 py-1.5 text-sm rounded-xl transition-all
                    ${slippage === value && !showCustomSlippage
                      ? 'bg-[#00ffbd] text-black font-medium shadow-lg shadow-[#00ffbd]/20'
                      : 'bg-white/5 dark:bg-[#2d2f36] text-gray-900 dark:text-gray-100 hover:bg-[#00ffbd]/10'
                    } border border-gray-200 dark:border-gray-800`}
                >
                  {value}%
                </button>
              ))}
              <button
                onClick={() => handleSlippageChange('custom')}
                className={`px-3 py-1.5 text-sm rounded-xl transition-all
                  ${showCustomSlippage
                    ? 'bg-[#00ffbd] text-black font-medium shadow-lg shadow-[#00ffbd]/20'
                    : 'bg-white/5 dark:bg-[#2d2f36] text-gray-900 dark:text-gray-100 hover:bg-[#00ffbd]/10'
                  } border border-gray-200 dark:border-gray-800`}
              >
                Custom
              </button>
            </div>
          </div>
          
          {showCustomSlippage && (
            <div className="flex items-center space-x-2 bg-white/5 dark:bg-[#2d2f36] rounded-xl p-2 border border-gray-200 dark:border-gray-800">
              <input
                type="text"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
                placeholder="Enter slippage %"
                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <span className="text-gray-900 dark:text-gray-100 pr-2">%</span>
            </div>
          )}
        </div>
      </div>

      {/* Add error message display */}
      {routeError && (
        <div className="mt-4 p-3 bg-red-500/10 dark:bg-red-500/5 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Route Unavailable
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {routeError}
              </p>
              {fromToken && toToken && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Suggestion: Try using an intermediate token like USDT or create a liquidity pool for this pair.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading || !fromToken || !toToken || !fromAmount || !toAmount || routeError}
        className={`
          w-full px-4 py-4 rounded-xl font-medium text-lg
          ${loading || !fromToken || !toToken || !fromAmount || !toAmount || routeError
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
            : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors text-black'
          }
        `}
      >
        {loading ? 'Swapping...' : 
         !fromToken || !toToken ? 'Select Tokens' :
         !fromAmount ? 'Enter Amount' :
         routeError ? 'No Route Available' :
         'Swap'}
      </button>

      {/* Token Selector Modal */}
      <TokenSelector
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
        excludeToken={activeSide === 'from' ? toToken : fromToken}
      />
    </div>
  );
} 