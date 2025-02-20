import React, { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useNetwork, useContractRead } from 'wagmi';
import { motion } from 'framer-motion';
import { BiCopy, BiRefresh, BiRocket, BiMoney, BiWater, BiLinkExternal } from 'react-icons/bi';
import { FaFire } from 'react-icons/fa';
import toast from 'react-hot-toast';
import MemeTokenABI from '../abi/MemeToken.json';
import { useDeployments } from '../context/DeploymentsContext';
import TokenFactoryABI from '../contracts/TokenFactory.json';

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
  },
  10143: {
    name: 'Uniswap V2',
    network: 'Monad Testnet',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=monad-testnet`
  }
};

// Add DEX images mapping
const DEX_IMAGES = {
  'QuickSwap': '/quickswap.png',
  'Uniswap V2': '/uniswap.png'
};

// Add factory addresses mapping
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137,
  1301: import.meta.env.VITE_FACTORY_ADDRESS_1301,
  130: import.meta.env.VITE_FACTORY_ADDRESS_130,
  1828369849: import.meta.env.VITE_FACTORY_ADDRESS_1828369849,
  10143: import.meta.env.VITE_FACTORY_ADDRESS_10143
};

// Add getFactoryAddress function
const getFactoryAddress = () => {
  const chainId = window.ethereum?.networkVersion ? parseInt(window.ethereum.networkVersion) : null;
  const factoryAddress = FACTORY_ADDRESSES[chainId];
  if (!factoryAddress) {
    console.error(`No factory address found for chain ID ${chainId}`);
  }
  return factoryAddress;
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

      // Fetch basic token info and features with new contract features
      const [
        name,
        symbol,
        totalSupply,
        treasuryAddress,
        devAddress,
        marketingWallet,
        liquidityAddress,
        burnFee,
        treasuryFee,
        devFee,
        marketingFee,
        liquidityFee,
        buyFees,
        sellFees,
        router,
        deadBalance,
        treasuryBalance,
        devBalance,
        marketingBalance,
        liquidityBalance,
        contractBalance,
        pair,
        tradingEnabled,
        owner
      ] = await Promise.all([
        token.name(),
        token.symbol(),
        token.totalSupply(),
        token.TREASURY_ADDRESS(),
        token.DEV_ADDRESS(),
        token.MARKETING_WALLET(),
        token.LIQUIDITY_ADDRESS(),
        token.burnFee(),
        token.treasuryFee(),
        token.devFee(),
        token.marketingFee(),
        token.liquidityFee(),
        token.buyFees(),
        token.sellFees(),
        token.uniswapV2Router(),
        token.balanceOf("0x000000000000000000000000000000000000dEaD"),
        token.balanceOf(await token.TREASURY_ADDRESS()),
        token.balanceOf(await token.DEV_ADDRESS()),
        token.balanceOf(await token.MARKETING_WALLET()),
        token.balanceOf(await token.LIQUIDITY_ADDRESS()),
        token.balanceOf(tokenAddress),
        token.uniswapV2Pair(),
        token.tradingActive(),
        token.owner()
      ]);

      setTokenData({
        name,
        symbol,
        totalSupply: ethers.formatUnits(totalSupply, 18),
        owner,
        addresses: {
          treasury: treasuryAddress,
          dev: devAddress,
          marketing: marketingWallet,
          liquidity: liquidityAddress
        },
        fees: {
          burn: Number(burnFee) / 100,
          treasury: Number(treasuryFee) / 100,
          dev: Number(devFee) / 100,
          marketing: Number(marketingFee) / 100,
          liquidity: Number(liquidityFee) / 100,
          buy: Number(buyFees) / 100,
          sell: Number(sellFees) / 100
        },
        balances: {
          dead: ethers.formatUnits(deadBalance, 18),
          treasury: ethers.formatUnits(treasuryBalance, 18),
          dev: ethers.formatUnits(devBalance, 18),
          marketing: ethers.formatUnits(marketingBalance, 18),
          liquidity: ethers.formatUnits(liquidityBalance, 18),
          contract: ethers.formatUnits(contractBalance, 18)
        },
        router,
        pair,
        features: {
          tradingEnabled
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Buy Tax:</span>
                    <span className="text-sm font-medium text-green-500">{tokenData.fees.buy}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sell Tax:</span>
                    <span className="text-sm font-medium text-red-500">{tokenData.fees.sell}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Renounced:</span>
                    {tokenData.owner === "0x0000000000000000000000000000000000000000" ? (
                      <span className="text-sm font-medium text-green-500">✓</span>
                    ) : (
                      <span className="text-sm font-medium text-red-500">✗</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mintable:</span>
                    <span className="text-sm font-medium text-red-500">✗</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  <span className="font-medium">Note:</span> Always test with a small amount first and check the contract on a blockchain explorer before making large trades.
                </p>
              </div>
            </motion.div>

            {/* Trading Fees Overview Card */}
            <motion.div
              variants={itemVariants}
              className="col-span-3 p-6 rounded-2xl bg-gradient-to-r from-[#2d2f36] via-[#1a1b1f] to-[#2d2f36] border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💰</span> Trading Fees Distribution
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Buy Fee</span>
                    <span className="text-[#00ffbd] font-bold">{tokenData.fees.buy}%</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 mb-2">Distribution of {tokenData.fees.buy}% buy fee:</p>
                    {Object.entries({
                      Burn: tokenData.fees.burn,
                      Treasury: tokenData.fees.treasury,
                      Dev: tokenData.fees.dev,
                      Marketing: tokenData.fees.marketing,
                      Liquidity: tokenData.fees.liquidity
                    }).map(([name, value]) => (
                      <div key={name} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{name}</span>
                        <span className="text-gray-300">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Sell Fee</span>
                    <span className="text-[#00ffbd] font-bold">{tokenData.fees.sell}%</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 mb-2">Distribution of {tokenData.fees.sell}% sell fee:</p>
                    {Object.entries({
                      Burn: tokenData.fees.burn,
                      Treasury: tokenData.fees.treasury,
                      Dev: tokenData.fees.dev,
                      Marketing: tokenData.fees.marketing,
                      Liquidity: tokenData.fees.liquidity
                    }).map(([name, value]) => (
                      <div key={name} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{name}</span>
                        <span className="text-gray-300">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400">
                  <span className="text-[#00ffbd] font-medium">Note:</span> The percentages shown for each fee type represent their share of the total buy/sell fee.
                </p>
              </div>
            </motion.div>

            {/* Enhanced Burn Card with Flames */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/20"
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaFire className="text-2xl text-red-500 animate-pulse" />
                  <h3 className="text-xl font-bold text-white">Burn Stats</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Burn Fee</span>
                    <span className="text-red-400 font-bold">{tokenData.fees.burn}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Burned</span>
                    <span className="text-red-400 font-mono">
                      {Number(tokenData.balances.dead).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Burn Rate</span>
                    <span className="text-red-400 font-mono">
                      {((Number(tokenData.balances.dead) / Number(tokenData.totalSupply)) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                {/* Animated flames */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-500/20 to-transparent animate-flame" />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-500/20 to-transparent animate-flame-slow" />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-500/20 to-transparent animate-flame-slower" />
                </div>
              </div>
            </motion.div>

            {/* Treasury & Dev Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <BiMoney className="text-2xl text-blue-400" />
                <h3 className="text-xl font-bold text-white">Treasury & Dev</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Treasury Fee</span>
                  <span className="text-blue-400 font-bold">{tokenData.fees.treasury}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dev Fee</span>
                  <span className="text-blue-400 font-bold">{tokenData.fees.dev}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Treasury Balance</span>
                  <span className="text-blue-400 font-mono">
                    {Number(tokenData.balances.treasury).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dev Balance</span>
                  <span className="text-blue-400 font-mono">
                    {Number(tokenData.balances.dev).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Marketing & Liquidity Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-500/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <BiWater className="text-2xl text-green-400" />
                <h3 className="text-xl font-bold text-white">Marketing & Liquidity</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Marketing Fee</span>
                  <span className="text-green-400 font-bold">{tokenData.fees.marketing}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Liquidity Fee</span>
                  <span className="text-green-400 font-bold">{tokenData.fees.liquidity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Marketing Balance</span>
                  <span className="text-green-400 font-mono">
                    {Number(tokenData.balances.marketing).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Liquidity Balance</span>
                  <span className="text-green-400 font-mono">
                    {Number(tokenData.balances.liquidity).toLocaleString()}
                  </span>
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

// RecentlyCreatedTokens component
const RecentlyCreatedTokens = () => {
  const [recentTokens, setRecentTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chain } = useNetwork();
  const [page, setPage] = useState(1);
  const tokensPerPage = 10;

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryAddress = getFactoryAddress();
        
        if (!factoryAddress) {
          console.error('Factory address not found for this chain');
          return;
        }

        const factory = new ethers.Contract(factoryAddress, TokenFactoryABI.abi, provider);
        const latestBlock = await provider.getBlockNumber();
        
        // Initialize array to store all events
        let allEvents = [];
        
        // Handle different block range limitations per chain
        const BLOCK_RANGE = chain?.id === 10143 ? 100 : 5000; // 100 blocks for Monad, 5000 for others
        let fromBlock = Math.max(0, latestBlock - 10000); // Look back 10000 blocks max
        
        while (fromBlock < latestBlock) {
          const toBlock = Math.min(fromBlock + BLOCK_RANGE, latestBlock);
          try {
            const filter = factory.filters.TokenCreated();
            const events = await factory.queryFilter(filter, fromBlock, toBlock);
            allEvents = [...allEvents, ...events];
          } catch (error) {
            console.error(`Error fetching events for blocks ${fromBlock} to ${toBlock}:`, error);
          }
          fromBlock = toBlock + 1;
        }

        // Sort and process events
        const sortedTokens = await Promise.all(allEvents.map(async (event) => {
          const decimals = Number(event.args[4]);
          const rawSupply = event.args[5].toString();
          
          let totalSupply;
          if (rawSupply.length <= decimals) {
            totalSupply = rawSupply;
          } else {
            totalSupply = ethers.formatUnits(rawSupply, decimals);
          }

          return {
            creator: event.args[0],
            address: event.args[1],
            name: event.args[2],
            symbol: event.args[3],
            decimals: decimals,
            totalSupply: totalSupply,
            logoURI: event.args[6],
            isMeme: event.args[7],
            timestamp: (await event.getBlock()).timestamp
          };
        }));

        // Sort by timestamp
        sortedTokens.sort((a, b) => b.timestamp - a.timestamp);
        setRecentTokens(sortedTokens);
      } catch (error) {
        console.error('Error fetching recent tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    if (chain?.id) {
      fetchTokens();
    }
  }, [chain?.id]);

  // Get the current page of tokens
  const currentTokens = useMemo(() => {
    return recentTokens.slice((page - 1) * tokensPerPage, page * tokensPerPage);
  }, [recentTokens, page]);

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <h3 className="meme-title text-2xl mb-4 text-[#00ffbd]">Recently Created Meme Tokens 🚀</h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]"></div>
        </div>
      </div>
    );
  }

  if (!currentTokens.length) {
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
        {currentTokens.map((token) => (
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
                  src={chain?.id ? (DEX_IMAGES[getDexInfo(chain.id).name] || '/token-default.png') : '/token-default.png'} 
                  alt={chain?.id ? getDexInfo(chain.id).name : 'Unknown DEX'}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/token-default.png';
                  }}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {chain?.id ? getDexInfo(chain.id).network : 'Unknown Network'}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Supply: {Number(token.totalSupply).toLocaleString()}
              </div>
              <a
                href={chain?.id ? getTradeUrl(token.address, chain.id) : '#'}
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
      {recentTokens.length > tokensPerPage && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-600 dark:text-gray-400">
            Page {page} of {Math.ceil(recentTokens.length / tokensPerPage)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(recentTokens.length / tokensPerPage)}
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