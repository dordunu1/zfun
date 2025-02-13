import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useNetwork, useContractRead } from 'wagmi';
import { motion } from 'framer-motion';
import { BiCopy, BiRefresh, BiRocket, BiMoney, BiWater, BiLinkExternal } from 'react-icons/bi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';
import MemeTokenABI from '../abi/MemeToken.json';
import { useDeployments } from '../context/DeploymentsContext';

// Meme-themed animations
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  }
};

// Add DEX trading URLs mapping
const DEX_TRADING_URLS = {
  11155111: {
    name: 'Uniswap V2',
    network: 'Sepolia',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=sepolia`
  },
  137: {
    name: 'QuickSwap',
    network: 'Polygon',
    getTradeUrl: (tokenAddress) => `https://quickswap.exchange/#/swap?outputCurrency=${tokenAddress}`
  },
  1301: {
    name: 'Uniswap V2',
    network: 'Unichain',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=unichain`
  },
  1828369849: {
    name: 'Uniswap V2',
    network: 'Moonwalker',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=moonwalker`
  }
};

// Add DEX images mapping
const DEX_IMAGES = {
  'QuickSwap': '/quickswap.png',
  'Uniswap V2': '/uniswap.png'
};

const TokenInfo = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { chain } = useNetwork();

  // Read total supply
  const { data: totalSupply } = useContractRead({
    address: tokenAddress,
    abi: MemeTokenABI.abi,
    functionName: 'totalSupply',
    watch: true,
  });

  const fetchTokenInfo = async () => {
    if (!tokenAddress) return;
    
    setLoading(true);
    setError('');
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(tokenAddress, MemeTokenABI.abi, provider);

      // Fetch basic token info and features
      const [
        name,
        symbol,
        totalSupply,
        marketingWallet,
        communityFee,
        liquidityFee,
        burnFee,
        deadBalance,
        marketingBalance,
        contractBalance,
        pair,
        minTokensBeforeSwap,
        antiBotEnabled,
        autoLiquidityEnabled,
        tradingEnabled,
        maxWalletAmount,
        maxTxAmount
      ] = await Promise.all([
        token.name(),
        token.symbol(),
        token.totalSupply(),
        token.marketingWallet(),
        token.communityFeePercent(),
        token.liquidityFeePercent(),
        token.burnFeePercent(),
        token.balanceOf("0x000000000000000000000000000000000000dEaD"),
        token.balanceOf(await token.marketingWallet()),
        token.balanceOf(tokenAddress),
        token.uniswapV2Pair(),
        token.minTokensBeforeSwap(),
        token.antiBotEnabled(),
        token.autoLiquidityEnabled(),
        token.tradingEnabled(),
        token.maxWalletAmount(),
        token.maxTransactionAmount()
      ]);

      setTokenData({
        name,
        symbol,
        totalSupply: ethers.formatUnits(totalSupply, 18),
        marketingWallet,
        fees: {
          community: communityFee.toString(),
          liquidity: liquidityFee.toString(),
          burn: burnFee.toString()
        },
        balances: {
          dead: ethers.formatUnits(deadBalance, 18),
          marketing: ethers.formatUnits(marketingBalance, 18),
          contract: ethers.formatUnits(contractBalance, 18)
        },
        pair,
        minTokensBeforeSwap: ethers.formatUnits(minTokensBeforeSwap, 18),
        features: {
          antiBotEnabled,
          autoLiquidityEnabled,
          tradingEnabled,
          maxWalletAmount: ethers.formatUnits(maxWalletAmount, 18),
          maxTxAmount: ethers.formatUnits(maxTxAmount, 18)
        }
      });
    } catch (err) {
      console.error('Error fetching token info:', err);
      setError('Failed to fetch token info. Is this a valid meme token?');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard! 📋');
    } catch (err) {
      toast.error('Failed to copy 😢');
    }
  };

  return (
    <div className="p-6 h-full bg-white dark:bg-[#1a1b1f] rounded-xl transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="meme-title text-3xl mb-4 text-[#00ffbd]">Check Token Info</h2>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Enter any meme token address to view stats
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="Enter token address"
              className="flex-1 bg-gray-50 dark:bg-[#2d2f36] text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchTokenInfo}
              disabled={loading}
              className="px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#00ffbd]/10"
            >
              {loading ? (
                <BiRefresh className="animate-spin" />
              ) : (
                <BiRocket className="animate-bounce" />
              )}
              {loading ? "Loading..." : "Check"}
            </motion.button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {!tokenData && !error && !loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            <p>Enter a token address to view information</p>
          </div>
        )}

        {tokenData && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Token Identity Card */}
            <motion.div
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2d2f36] dark:to-[#24262b] border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tokenData.name} ({tokenData.symbol}) 🚀
                </h2>
                <div className="flex items-center gap-2">
                  {tokenData.features?.tradingEnabled ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                      Trading Enabled
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                      Trading Disabled
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Total Supply:</span>
                  <span className="font-mono text-gray-900 dark:text-white">{Number(tokenData.totalSupply).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Contract:</span>
                  <span className="font-mono text-gray-900 dark:text-white truncate text-sm">{tokenAddress}</span>
                  <button
                    onClick={() => copyToClipboard(tokenAddress)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <BiCopy className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Honeypot Detection Card */}
            <motion.div
              variants={itemVariants}
              className="p-4 rounded-xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🍯</span> Honeypot Detection
                </h3>
                {tokenData.features?.tradingEnabled ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Safe to Trade
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-500">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Caution
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Max Transaction:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {tokenData.features?.maxTxAmount ? `${Number(tokenData.features.maxTxAmount).toLocaleString()} tokens` : 'No Limit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Max Wallet:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {tokenData.features?.maxWalletAmount ? `${Number(tokenData.features.maxWalletAmount).toLocaleString()} tokens` : 'No Limit'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Anti-Bot:</span>
                    <span className={`text-sm font-medium ${tokenData.features?.antiBotEnabled ? 'text-yellow-500' : 'text-green-500'}`}>
                      {tokenData.features?.antiBotEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Fee:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Number(tokenData.fees.community) + Number(tokenData.fees.liquidity) + Number(tokenData.fees.burn)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  <span className="font-medium">Note:</span> Always test with a small amount first and check the contract on a blockchain explorer before making large trades.
                </p>
              </div>
            </motion.div>

            {/* Features and Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Marketing Fee Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500 dark:text-amber-400 text-xl">✉</span>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Marketing Fee</h3>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee: {tokenData.fees.community}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="block text-xs text-gray-500 dark:text-gray-500">Collected:</span>
                    {Number(tokenData.balances.marketing).toLocaleString()} tokens
                  </p>
                </div>
              </div>

              {/* Burn Fee Card with Enhanced Flame Effect */}
              <div className="relative p-4 rounded-2xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-200">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-red-500 dark:text-red-400 text-xl">🔥</span>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Burn Fee</h3>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fee: {tokenData.fees.burn}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="block text-xs text-gray-500 dark:text-gray-500">Burned:</span>
                      {Number(tokenData.balances.dead).toLocaleString()} tokens
                    </p>
                  </div>
                </div>
                {/* Enhanced Flame Effects */}
                <div className="absolute inset-0">
                  <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-red-500/20 via-orange-400/10 to-transparent dark:from-red-600/40 dark:via-orange-500/20"></div>
                  <div className="absolute inset-x-0 -bottom-2 h-48 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 dark:from-red-600 dark:via-orange-500 dark:to-yellow-500 opacity-20 dark:opacity-30 animate-flame"></div>
                  <div className="absolute inset-x-4 -bottom-2 h-40 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 dark:from-red-700 dark:via-orange-600 dark:to-yellow-600 opacity-30 dark:opacity-40 animate-flame-slow"></div>
                  <div className="absolute inset-x-8 -bottom-2 h-32 bg-gradient-to-t from-red-700 via-orange-600 to-yellow-500 dark:from-red-800 dark:via-orange-700 dark:to-yellow-700 opacity-40 dark:opacity-50 animate-flame-slower"></div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 blur-xl"></div>
                </div>
              </div>

              {/* Liquidity Fee Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-500 dark:text-blue-400 text-xl">💧</span>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Liquidity Fee</h3>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee: {tokenData.fees.liquidity}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="block text-xs text-gray-500 dark:text-gray-500">Balance:</span>
                    {Number(tokenData.balances.contract).toLocaleString()} tokens
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-Liquidity Progress Bar */}
            {tokenData.features.autoLiquidityEnabled && (
              <motion.div
                variants={itemVariants}
                className="mt-4 p-4 rounded-xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ffbd]">💧</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress to Auto-Liquidity</h3>
                  </div>
                  <span className="text-[#00ffbd] font-mono">
                    {((Number(tokenData.balances.contract) / Number(tokenData.minTokensBeforeSwap)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00ffbd] rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(
                        (Number(tokenData.balances.contract) / Number(tokenData.minTokensBeforeSwap)) * 100, 
                        100
                      )}%` 
                    }}
                  />
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-mono">
                    {Number(tokenData.balances.contract).toLocaleString()} / {Number(tokenData.minTokensBeforeSwap).toLocaleString()} tokens
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Recently Created Meme Tokens Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <RecentlyCreatedTokens />
      </div>
    </div>
  );
};

// New RecentlyCreatedTokens component
const RecentlyCreatedTokens = () => {
  const { deployments } = useDeployments();
  const { chain } = useNetwork();
  const [page, setPage] = useState(1);
  const tokensPerPage = 10;

  // Get the most recent tokens
  const recentTokens = useMemo(() => {
    return deployments
      ?.sort((a, b) => b.timestamp - a.timestamp)
      .slice((page - 1) * tokensPerPage, page * tokensPerPage) || [];
  }, [deployments, page]);

  // Get trading URL based on chain
  const getTradeUrl = (tokenAddress, chainId) => {
    const dexInfo = DEX_TRADING_URLS[chainId];
    return dexInfo ? dexInfo.getTradeUrl(tokenAddress) : '#';
  };

  // Get DEX name based on chain
  const getDexInfo = (chainId) => {
    return DEX_TRADING_URLS[chainId] || {
      name: 'Unknown DEX',
      network: 'Unknown'
    };
  };

  if (!recentTokens.length) {
    return (
      <div className="text-center py-8">
        <h3 className="meme-title text-2xl mb-4 text-[#00ffbd]">Recently Created Meme Tokens 🚀</h3>
        <p className="text-gray-500 dark:text-gray-400">No meme tokens created yet. Be the first! 🎉</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="meme-title text-2xl mb-6 text-center text-[#00ffbd]">Recently Created Meme Tokens 🚀</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentTokens.map((token) => (
          <motion.div
            key={token.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2d2f36] dark:to-[#24262b] border border-gray-200 dark:border-gray-700 hover:border-[#00ffbd] dark:hover:border-[#00ffbd] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{token.name}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{token.symbol}</p>
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src={DEX_IMAGES[getDexInfo(token.chainId).name]} 
                  alt={getDexInfo(token.chainId).name}
                  className="w-6 h-6"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getDexInfo(token.chainId).network}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Supply: {Number(token.totalSupply).toLocaleString()}
              </div>
              <a
                href={getTradeUrl(token.address, token.chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#00ffbd] hover:bg-[#00e6a9] text-black text-sm font-medium rounded-lg transition-colors"
              >
                Trade <BiLinkExternal />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {deployments?.length > tokensPerPage && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-600 dark:text-gray-400">
            Page {page} of {Math.ceil(deployments.length / tokensPerPage)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(deployments.length / tokensPerPage)}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenInfo;