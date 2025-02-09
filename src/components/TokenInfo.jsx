import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';
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
        liquidityLocked,
        liquidityUnlockTime,
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
        token.liquidityLocked(),
        token.liquidityUnlockTime(),
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
          liquidityLocked,
          liquidityUnlockTime: liquidityUnlockTime ? Number(liquidityUnlockTime) : 0,
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {tokenData.name} ({tokenData.symbol}) 🚀
              </h2>
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

            {/* Fee Structure */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Marketing Fee */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-500/5 dark:to-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BiMoney className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Marketing Fee</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{tokenData.fees.community}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Collected: {Number(tokenData.balances.marketing).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Burn Fee */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-500/5 dark:to-red-500/10 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <FaFire className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Burn Fee</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{tokenData.fees.burn}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Burned: {Number(tokenData.balances.dead).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Liquidity Fee */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/5 dark:to-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BiWater className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Liquidity Fee</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{tokenData.fees.liquidity}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending: {Number(tokenData.balances.contract).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Auto-adds at: {Number(tokenData.minTokensBeforeSwap).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Progress to Auto-Liquidity */}
            <motion.div
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2d2f36] dark:to-[#24262b] border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Progress to Auto-Liquidity 🌊</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full bg-[#00ffbd]/10 text-[#00ffbd]">
                      {((Number(tokenData.balances.contract) / 300) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-3 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((Number(tokenData.balances.contract) / 300) * 100, 100)}%` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#00ffbd]"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Number(tokenData.balances.contract).toLocaleString()} / 300 tokens
                </div>
              </div>
            </motion.div>

            {/* Token Features Section */}
            <motion.div
              variants={itemVariants}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#2d2f36] dark:to-[#24262b] border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Token Features 🚀</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${tokenData.features?.autoLiquidityEnabled ? 'bg-[#00ffbd]/10' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tokenData.features?.autoLiquidityEnabled ? 'bg-[#00ffbd] text-black' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {tokenData.features?.autoLiquidityEnabled ? '✓' : '×'}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Auto-Liquidity</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${tokenData.features?.antiBotEnabled ? 'bg-[#00ffbd]/10' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tokenData.features?.antiBotEnabled ? 'bg-[#00ffbd] text-black' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {tokenData.features?.antiBotEnabled ? '✓' : '×'}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Anti-Bot Protection</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${tokenData.features?.liquidityLocked ? 'bg-[#00ffbd]/10' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tokenData.features?.liquidityLocked ? 'bg-[#00ffbd] text-black' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {tokenData.features?.liquidityLocked ? '✓' : '×'}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Liquidity Locked {tokenData.features?.liquidityLocked && tokenData.features?.liquidityUnlockTime > 0 && 
                      `(until ${new Date(tokenData.features.liquidityUnlockTime * 1000).toLocaleDateString()})`}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${Number(tokenData.features?.maxWalletAmount) < Number(tokenData.totalSupply) ? 'bg-[#00ffbd]/10' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${Number(tokenData.features?.maxWalletAmount) < Number(tokenData.totalSupply) ? 'bg-[#00ffbd] text-black' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {Number(tokenData.features?.maxWalletAmount) < Number(tokenData.totalSupply) ? '✓' : '×'}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Max Wallet Limit</span>
                </div>
              </div>
            </motion.div>
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