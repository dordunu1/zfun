import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { useAccount, useBalance } from 'wagmi';
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
  
  // State declarations
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [showFromTokenModal, setShowFromTokenModal] = useState(false);
  const [showToTokenModal, setShowToTokenModal] = useState(false);
  const [fromTokenBalance, setFromTokenBalance] = useState('0');
  const [toTokenBalance, setToTokenBalance] = useState('0');
  const [slippage, setSlippage] = useState(2.0);
  const [customSlippage, setCustomSlippage] = useState('');
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(null);
  const [networkCost, setNetworkCost] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Calculate exchange rate and fees
  const calculateTradeDetails = useCallback(() => {
    if (!fromAmount || !toAmount || !fromToken || !toToken) {
      setEstimatedFee(null);
      setExchangeRate(null);
      return;
    }

    try {
      // Calculate exchange rate
      const fromAmountDecimal = Number(fromAmount);
      const toAmountDecimal = Number(toAmount);
      const rate = toAmountDecimal / fromAmountDecimal;
      
      // Calculate estimated fee (0.3% for Uniswap V2)
      const fee = fromAmountDecimal * 0.003;
      
      setEstimatedFee(fee);
      setExchangeRate(rate);
      
      // Estimate network cost (this would normally come from the provider)
      setNetworkCost('~0.003 ETH');
    } catch (error) {
      console.error('Error calculating trade details:', error);
    }
  }, [fromAmount, toAmount, fromToken, toToken]);

  // Update trade details when amounts change
  useEffect(() => {
    calculateTradeDetails();
  }, [calculateTradeDetails, fromAmount, toAmount]);

  // Quote effect
  useEffect(() => {
    async function getQuote() {
      if (!uniswap || !fromToken || !toToken || !fromAmount || fromAmount === '0') {
        setToAmount('');
        setRoute(null);
        return;
      }

      try {
        const poolInfo = await uniswap.getPoolInfo(fromToken.address, toToken.address);
        console.log('Pool info:', poolInfo);
        
        if (!poolInfo?.token0) {
          console.log('No liquidity pool exists for this pair');
          setToAmount('');
          setRoute('No liquidity pool exists');
          return;
        }

        const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
        const path = [fromToken.address, toToken.address];
        const amountOut = await uniswap.getAmountOut(amountIn, path);
        const formattedAmount = ethers.formatUnits(amountOut, toToken.decimals);
        setToAmount(formattedAmount);
        
        setRoute(`${fromToken.symbol} → ${toToken.symbol}`);
      } catch (error) {
        console.error('Error in getQuote:', error);
        setToAmount('');
        setRoute('Error: ' + (error.reason || 'Failed to get quote'));
      }
    }

    getQuote();
  }, [uniswap, fromToken, toToken, fromAmount]);

  // Render trade details section
  const renderTradeDetails = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) return null;

    return (
      <div className="space-y-3">
        <button
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-400"
        >
          {showMoreDetails ? 'Show less' : 'Show more'} 
          <svg
            className={`w-4 h-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMoreDetails && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Expected Output</span>
              <span className="text-gray-200">{toAmount} {toToken.symbol}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Fee</span>
              <span className="text-gray-200">
                {estimatedFee ? `${estimatedFee.toFixed(6)} ${fromToken.symbol} (0.3%)` : '--'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Network Cost</span>
              <span className="text-gray-200">{networkCost || '--'}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="text-gray-200">{route || '--'}</span>
            </div>

            {exchangeRate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Exchange Rate</span>
                <span className="text-gray-200">
                  1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add updateBalances function
  const updateBalances = async () => {
    if (!address || !fromToken || !toToken) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get ETH balance if either token is ETH
      if (fromToken.symbol === 'ETH') {
        const ethBalance = await provider.getBalance(address);
        setFromTokenBalance(ethers.formatEther(ethBalance));
      } else {
        const fromTokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, provider);
        const fromBalance = await fromTokenContract.balanceOf(address);
        setFromTokenBalance(ethers.formatUnits(fromBalance, fromToken.decimals));
      }

      if (toToken.symbol === 'ETH') {
        const ethBalance = await provider.getBalance(address);
        setToTokenBalance(ethers.formatEther(ethBalance));
      } else {
        const toTokenContract = new ethers.Contract(toToken.address, ERC20_ABI, provider);
        const toBalance = await toTokenContract.balanceOf(address);
        setToTokenBalance(ethers.formatUnits(toBalance, toToken.decimals));
      }
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  // Add useEffect to update balances when tokens change or after refresh trigger
  useEffect(() => {
    updateBalances();
  }, [address, fromToken, toToken, refreshTrigger]);

  // Update handleSwap function to call updateBalances after successful swap
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
      
      // Parse input amount with proper decimals
      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
      
      // Parse output amount with proper decimals (especially for USDC)
      const amountOutMinRaw = ethers.parseUnits(toAmount, toToken.decimals);
      
      // Calculate slippage using user-defined slippage value
      const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100)); // Convert percentage to basis points
      const amountOutMin = (amountOutMinRaw * slippageMultiplier) / 10000n;

      const path = [fromToken.address, toToken.address];
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      // Create router contract
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        [
          'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
          'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
          'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
        ],
        signer
      );

      console.log('Swap parameters:', {
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
        path,
        to: address,
        deadline: deadline.toString()
      });

      let tx;
      if (fromToken.symbol === 'ETH') {
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          path,
          address,
          deadline,
          { value: amountIn, gasLimit: 300000 }
        );
      } else if (toToken.symbol === 'ETH') {
        tx = await router.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          address,
          deadline,
          { gasLimit: 300000 }
        );
      } else {
        // For token to token swaps (including USDC)
        // First approve if needed
        if (fromToken.symbol !== 'ETH') {
          const tokenContract = new ethers.Contract(
            fromToken.address,
            [
              'function approve(address spender, uint256 amount) external returns (bool)',
              'function allowance(address owner, address spender) external view returns (uint256)'
            ],
            signer
          );
          
          const allowance = await tokenContract.allowance(address, UNISWAP_ADDRESSES.router);
          if (allowance < amountIn) {
            console.log('Approving tokens...');
            const approveTx = await tokenContract.approve(UNISWAP_ADDRESSES.router, amountIn);
            await approveTx.wait();
            console.log('Tokens approved');
          }
        }

        tx = await router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          address,
          deadline,
          { gasLimit: 300000 }
        );
      }

      console.log('Swap transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Swap receipt:', receipt);
      
      // Update balances after successful swap
      await updateBalances();
      
      toast.success('Swap successful!');
      setFromAmount('');
      setToAmount('');
      
      // Refresh balances
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Swap error:', error);
      
      // Handle specific error messages
      if (error.message.includes('insufficient')) {
        toast.error('Insufficient balance for swap');
      } else if (error.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        toast.error('Price impact too high, try a smaller amount');
      } else if (error.message.includes('EXCESSIVE_INPUT_AMOUNT')) {
        toast.error('Insufficient liquidity for this trade');
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction rejected');
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
      // For other tokens, get token info but preserve name and symbol
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setFromToken({ 
        ...token,
        ...tokenInfo,
        name: token.name || tokenInfo.name,
        symbol: token.symbol || tokenInfo.symbol,
        logo: token.logo || tokenInfo.logo,
        logoIpfs: token.logoIpfs || tokenInfo.logoIpfs
      });
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
      // For other tokens, get token info but preserve name and symbol
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setToToken({ 
        ...token,
        ...tokenInfo,
        name: token.name || tokenInfo.name,
        symbol: token.symbol || tokenInfo.symbol,
        logo: token.logo || tokenInfo.logo,
        logoIpfs: token.logoIpfs || tokenInfo.logoIpfs
      });
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
                onClick={() => handleCreatePool()}
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

  const handleCreatePool = async () => {
    if (!fromToken || !toToken) {
      toast.error('Please select both tokens');
      return;
    }

    setPoolCreationState(prev => ({ ...prev, loading: true }));
    try {
      // Parse amounts to BigInt with proper decimals
      const amount0 = ethers.parseUnits(
        poolCreationState.token0Amount,
        fromToken.decimals
      );
      const amount1 = ethers.parseUnits(
        poolCreationState.token1Amount,
        toToken.decimals
      );

      // Create pool and add initial liquidity
      const result = await uniswap.createPool(
        fromToken.address,
        toToken.address,
        amount0,
        amount1
      );

      toast.success('Pool created and initial liquidity added successfully!');
      console.log('Pool address:', result.pairAddress);

      // Save the created pool address to localStorage
      const userPools = JSON.parse(localStorage.getItem('userCreatedPools') || '[]');
      if (!userPools.includes(result.pairAddress)) {
        userPools.push(result.pairAddress);
        localStorage.setItem('userCreatedPools', JSON.stringify(userPools));
      }

      // Reset the pool creation state
      setPoolCreationState({
        showInputs: false,
        token0Amount: '',
        token1Amount: '',
        loading: false,
        priceRatio: null,
        error: null
      });

      // Show success message with the pool address
      toast.success(
        'Pool created and liquidity added! You can now start swapping.',
        { duration: 5000 }
      );
      
    } catch (error) {
      console.error('Error creating pool:', error);
      setPoolCreationState(prev => ({
        ...prev,
        loading: false,
        error: error.reason || 'Failed to create pool'
      }));
      
      if (error.message.includes('Pool already exists')) {
        toast.error('Pool already exists. Try adding liquidity instead.');
      } else {
        toast.error(error.reason || 'Failed to create pool');
      }
    }
  };

  // Add useEffect to handle refresh
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Refresh balances and other data
      updateBalances();
      // You can add other refresh logic here
    }
  }, [refreshTrigger]);

  // Add balance display component
  const TokenBalance = ({ token }) => {
    const { address } = useAccount();
    const [balance, setBalance] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      const fetchBalance = async () => {
        if (!address || !token) return;
        
        try {
          setIsLoading(true);
          setError(null);
          const provider = new ethers.BrowserProvider(window.ethereum);

          let rawBalance;
          let decimals;

          if (token.symbol === 'ETH') {
            rawBalance = await provider.getBalance(address);
            decimals = 18;
          } else {
            const contract = new ethers.Contract(
              token.address,
              [
                'function balanceOf(address) view returns (uint256)',
                'function decimals() view returns (uint8)'
              ],
              provider
            );

            [rawBalance, decimals] = await Promise.all([
              contract.balanceOf(address),
              contract.decimals()
            ]);
          }

          console.log(`Balance for ${token.symbol}:`, {
            raw: rawBalance.toString(),
            decimals,
            formatted: ethers.formatUnits(rawBalance, decimals)
          });

          setBalance({
            value: rawBalance,
            decimals
          });
        } catch (err) {
          console.error('Error fetching balance:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBalance();
    }, [token, address]);

    if (error) {
      return (
        <div className="text-sm text-red-500 mt-1">
          Error: {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Loading balance...
        </div>
      );
    }

    const formatBalance = (balance) => {
      if (!balance?.value) return '0';
      
      const formatted = Number(ethers.formatUnits(balance.value, balance.decimals));
      
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6,
        useGrouping: true
      }).format(formatted);
    };

    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Balance: {formatBalance(balance)} {token.symbol}
      </div>
    );
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