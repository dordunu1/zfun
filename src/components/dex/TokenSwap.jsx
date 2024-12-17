import React, { useState, useEffect } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import TokenSelectionModal from './TokenSelectionModal';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import axios from 'axios';
import { ERC20_ABI } from '../../services/erc20';

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
  
  // New state for liquidity amounts
  const [liquidityAmount0, setLiquidityAmount0] = useState('');
  const [liquidityAmount1, setLiquidityAmount1] = useState('');
  const [showLiquidityInputs, setShowLiquidityInputs] = useState(false);

  const [poolCreationState, setPoolCreationState] = useState({
    showInputs: false,
    token0Amount: '',
    token1Amount: '',
    loading: false,
    priceRatio: null,
    error: null
  });

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
        // Check if pool exists
        const poolInfo = await uniswap.getPoolInfo(fromToken.address, toToken.address);
        console.log('Pool info:', poolInfo);
        
        if (!poolInfo) {
          console.log('No liquidity pool exists for this pair');
          setToAmount('');
          setPriceImpact(null);
          setRoute('No liquidity pool exists');
          return;
        }

        // Convert amount to wei based on token decimals
        const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
        const path = [fromToken.address, toToken.address];

        try {
          // Get quote from Uniswap
          const amountOut = await uniswap.getAmountOut(amountIn, path);
          const formattedAmount = ethers.formatUnits(amountOut, toToken.decimals);
          setToAmount(formattedAmount);

          // Calculate price impact
          const impact = calculatePriceImpact(amountIn, amountOut, poolInfo);
          setPriceImpact(impact);
          setRoute(`${fromToken.symbol} → ${toToken.symbol}`);
        } catch (quoteError) {
          console.error('Error getting quote:', quoteError);
          setToAmount('');
          setPriceImpact(null);
          setRoute('Error: Failed to get quote');
        }
      } catch (error) {
        console.error('Error checking pool:', error);
        setToAmount('');
        setPriceImpact(null);
        setRoute('Error: ' + (error.reason || 'Failed to check pool'));
      }
    }

    getQuote();
  }, [uniswap, fromToken, toToken, fromAmount]);

  const calculatePriceImpact = (amountIn, amountOut, poolInfo) => {
    try {
      const { reserve0, reserve1 } = poolInfo;
      const isToken0 = fromToken.address.toLowerCase() === poolInfo.token0.toLowerCase();
      
      const reserveIn = isToken0 ? reserve0 : reserve1;
      const reserveOut = isToken0 ? reserve1 : reserve0;
      
      // Calculate price impact using reserves
      const priceBeforeSwap = reserveOut * BigInt(1e18) / reserveIn;
      const priceAfterSwap = amountOut * BigInt(1e18) / amountIn;
      const impact = ((priceBeforeSwap - priceAfterSwap) * BigInt(100)) / priceBeforeSwap;
      
      return Number(ethers.formatUnits(impact.toString(), 2));
    } catch (error) {
      console.error('Error calculating price impact:', error);
      return null;
    }
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
      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
      const amountOutMinRaw = ethers.parseUnits(toAmount, toToken.decimals);
      // Calculate 5% slippage tolerance using BigInt arithmetic
      const amountOutMin = (amountOutMinRaw * BigInt(95)) / BigInt(100);

      const path = [fromToken.address, toToken.address];
      
      let receipt;
      // Check if we're swapping from ETH
      if (fromToken.symbol === 'ETH') {
        receipt = await uniswap.swapExactETHForTokens(
          amountIn,
          amountOutMin,
          path,
          address
        );
      } else {
        receipt = await uniswap.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          address
        );
      }

      toast.success('Swap successful!');
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Ledger')) {
        toast.error('Please make sure your Ledger is connected and the Ethereum app is open');
      } else if (error.message.includes('insufficient')) {
        toast.error('Insufficient balance for swap');
      } else if (error.message.includes('INSUFFICIENT_INPUT_AMOUNT')) {
        toast.error('The input amount is too small for this swap');
      } else if (error.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        toast.error('The output amount is too small due to slippage or price impact');
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction was rejected');
      } else {
        toast.error(error.reason || 'Failed to swap tokens');
      }
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

  // Fetch price ratio from CoinGecko when tokens are selected
  useEffect(() => {
    async function fetchPriceRatio() {
      if (!fromToken || !toToken) return;

      try {
        // Get token addresses in lowercase
        const token0Address = fromToken.address.toLowerCase();
        const token1Address = toToken.address.toLowerCase();

        // Fetch token info from CoinGecko using contract addresses
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${token0Address},${token1Address}&vs_currencies=usd`
        );

        // If token is ETH, use ETH price endpoint
        let token0Price = response.data[token0Address]?.usd;
        let token1Price = response.data[token1Address]?.usd;

        // If either token is ETH (WETH), fetch ETH price
        if (fromToken.address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
          const ethResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
          token0Price = ethResponse.data.ethereum.usd;
        }
        if (toToken.address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
          const ethResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
          token1Price = ethResponse.data.ethereum.usd;
        }

        if (!token0Price || !token1Price) {
          console.log('Could not fetch prices for tokens');
          return;
        }

        const ratio = token0Price / token1Price;
        console.log('Price ratio:', ratio);

        setPoolCreationState(prev => ({
          ...prev,
          priceRatio: ratio
        }));
      } catch (error) {
        console.error('Error fetching prices:', error);
        setPoolCreationState(prev => ({
          ...prev,
          error: 'Failed to fetch token prices'
        }));
      }
    }

    if (route === 'No liquidity pool exists') {
      fetchPriceRatio();
    }
  }, [fromToken, toToken, route]);

  // Calculate other token amount based on price ratio
  const calculateOtherAmount = (amount, isToken0) => {
    if (!poolCreationState.priceRatio || !amount) return '';
    const ratio = poolCreationState.priceRatio;
    return isToken0 
      ? (Number(amount) * ratio).toFixed(6)
      : (Number(amount) / ratio).toFixed(6);
  };

  // Update pool creation UI
  const renderPoolCreation = () => {
    if (route !== 'No liquidity pool exists') return null;

    return (
      <div className="mt-4 space-y-4">
        {!poolCreationState.showInputs ? (
          <button
            onClick={() => setPoolCreationState(prev => ({ ...prev, showInputs: true }))}
            className="w-full px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black rounded-xl font-medium transition-colors"
          >
            Create Pool & Add Liquidity
          </button>
        ) : (
          <>
            <div className="space-y-2">
              <label className="block text-sm text-gray-500">
                {fromToken?.symbol} Amount
              </label>
              <input
                type="text"
                value={poolCreationState.token0Amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setPoolCreationState(prev => ({
                      ...prev,
                      token0Amount: value,
                      token1Amount: calculateOtherAmount(value, true)
                    }));
                  }
                }}
                placeholder={`Enter ${fromToken?.symbol} amount`}
                className="w-full px-3 py-2 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-500">
                {toToken?.symbol} Amount
              </label>
              <input
                type="text"
                value={poolCreationState.token1Amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setPoolCreationState(prev => ({
                      ...prev,
                      token1Amount: value,
                      token0Amount: calculateOtherAmount(value, false)
                    }));
                  }
                }}
                placeholder={`Enter ${toToken?.symbol} amount`}
                className="w-full px-3 py-2 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-white"
              />
            </div>
            {poolCreationState.error && (
              <div className="text-red-500 text-sm">
                {poolCreationState.error}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => createPoolAndAddLiquidity(
                  poolCreationState.token0Amount,
                  poolCreationState.token1Amount
                )}
                disabled={poolCreationState.loading || !poolCreationState.token0Amount || !poolCreationState.token1Amount}
                className="flex-1 px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {poolCreationState.loading ? 'Creating Pool...' : 'Confirm'}
              </button>
              <button
                onClick={() => setPoolCreationState({
                  showInputs: false,
                  token0Amount: '',
                  token1Amount: '',
                  loading: false,
                  priceRatio: null,
                  error: null
                })}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Update the createPoolAndAddLiquidity function
  const createPoolAndAddLiquidity = async (amount0, amount1) => {
    if (!address || !fromToken || !toToken || !amount0 || !amount1) {
      toast.error('Please enter both liquidity amounts');
      return;
    }
    
    setPoolCreationState(prev => ({ ...prev, loading: true }));
    try {
      console.log('Creating pool for:', fromToken.symbol, toToken.symbol);
      
      // Parse amounts
      const parsedAmount0 = ethers.parseUnits(amount0, fromToken.decimals);
      const parsedAmount1 = ethers.parseUnits(amount1, toToken.decimals);

      // First approve both tokens
      const token0Contract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);
      const token1Contract = new ethers.Contract(toToken.address, ERC20_ABI, signer);

      console.log('Approving tokens...');
      
      // Approve token0
      const approve0Tx = await token0Contract.approve(UNISWAP_ADDRESSES.router, parsedAmount0);
      await approve0Tx.wait();
      toast.success(`Approved ${fromToken.symbol}`);

      // Approve token1
      const approve1Tx = await token1Contract.approve(UNISWAP_ADDRESSES.router, parsedAmount1);
      await approve1Tx.wait();
      toast.success(`Approved ${toToken.symbol}`);

      console.log('Creating pool...');
      const result = await uniswap.createPoolAndAddLiquidity(
        fromToken.address,
        toToken.address,
        parsedAmount0,
        parsedAmount1,
        address,
        0.05 // 5% slippage tolerance
      );
      
      console.log('Pool created at:', result.pairAddress);
      
      // Save the created pool address to localStorage
      const userPools = JSON.parse(localStorage.getItem('userCreatedPools') || '[]');
      if (!userPools.includes(result.pairAddress)) {
        userPools.push(result.pairAddress);
        localStorage.setItem('userCreatedPools', JSON.stringify(userPools));
      }

      toast.success('Pool created and liquidity added successfully!');
      setPoolCreationState({
        showInputs: false,
        token0Amount: '',
        token1Amount: '',
        loading: false,
        priceRatio: null,
        error: null
      });
      getQuote();
    } catch (error) {
      console.error('Error creating pool:', error);
      setPoolCreationState(prev => ({
        ...prev,
        loading: false,
        error: error.reason || 'Failed to create pool'
      }));
      toast.error(error.reason || 'Failed to create pool');
    }
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
              {renderPoolCreation()}
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