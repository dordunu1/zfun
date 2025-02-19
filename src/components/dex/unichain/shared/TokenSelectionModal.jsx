import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../../../services/unichain/uniswap.js';
import { useUnichain } from '../../../../hooks/useUnichain';
import { FaSearch, FaCoins } from 'react-icons/fa';
import { getTokenDeploymentByAddress, getAllTokenDeployments } from '../../../../services/firebase';
import { ipfsToHttp } from '../../../../utils/ipfs';
import { motion, AnimatePresence } from 'framer-motion';

// Add RPC URL constant at the top
const UNICHAIN_RPC_URLS = {
  1301: 'https://sepolia.unichain.org',
  130: 'https://mainnet.unichain.org'
};

// Add chain ID constant at the top
const UNICHAIN_CHAIN_IDS = {
  TESTNET: 1301,
  MAINNET: 130
};

// Common tokens with metadata
const COMMON_TOKENS = {
  // Testnet tokens (1301)
  1301: [
    {
      address: 'ETH',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: UNISWAP_ADDRESSES[1301].WETH,
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: '/usdc.png'
    },
    {
      address: UNISWAP_ADDRESSES[1301].USDT,
      symbol: 'USDT',
      name: 'Test USDT',
      decimals: 6,
      logo: '/usdt.png'
    }
  ],
  // Mainnet tokens (130)
  130: [
    {
      address: 'ETH',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: UNISWAP_ADDRESSES[130].WETH,
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      logo: '/eth.png'
    },
    {
      address: UNISWAP_ADDRESSES[130].USDT,
      symbol: 'USDT',
      name: 'USDT',
      decimals: 6,
      logo: '/usdt.png'
    }
  ]
};

// Add CSS for custom scrollbar
const scrollbarStyles = `
  .token-list-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .token-list-scrollbar::-webkit-scrollbar-track {
    background: #2d2f36;
    border-radius: 3px;
  }
  .token-list-scrollbar::-webkit-scrollbar-thumb {
    background: #00ffbd;
    border-radius: 3px;
  }
  .token-list-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #00ffbd #2d2f36;
  }
`;

const formatBalance = (balance, decimals = 18) => {
  if (!balance) return '0';
  return Number(ethers.formatUnits(balance, decimals)).toString();
};

const scanForTokens = async (provider, userAddress, chainId) => {
  try {
    // Get tokens from Blockscout API
    const blockscoutUrl = chainId === UNICHAIN_CHAIN_IDS.TESTNET 
      ? 'https://unichain-sepolia.blockscout.com'
      : 'https://unichain.blockscout.com';

    const response = await fetch(
      `${blockscoutUrl}/api/v2/addresses/${userAddress}/token-balances`
    );

    if (!response.ok) {
      console.warn(`Blockscout API error: ${response.status}`);
      return COMMON_TOKENS[chainId] || [];
    }

    const data = await response.json();
    
    // Filter and format tokens
    const tokens = data
      .filter(item => {
        const isERC20 = item.token?.type === 'ERC-20' && item.token?.address;
        const isValidAddress = ethers.isAddress(item.token?.address || '');
        const isNotLP = !item.token?.symbol?.includes('LP') && !item.token?.symbol?.includes('UNI-V2');
        return isERC20 && isValidAddress && isNotLP;
      })
      .map(item => ({
        address: item.token.address,
        symbol: item.token.symbol || 'Unknown',
        name: item.token.name || 'Unknown Token',
        decimals: parseInt(item.token.decimals || '18'),
        balance: item.value,
        verified: true
      }));

    // Add common tokens if they're not already included
    const commonTokens = COMMON_TOKENS[chainId] || [];
    const allTokens = [...tokens];
    
    for (const commonToken of commonTokens) {
      if (commonToken.address === 'ETH' || (commonToken.address && !allTokens.some(t => t.address?.toLowerCase() === commonToken.address?.toLowerCase()))) {
        allTokens.push(commonToken);
      }
    }

    return allTokens;
  } catch (error) {
    console.error('Token scanning error:', error);
    // Return common tokens as fallback
    return COMMON_TOKENS[chainId] || [];
  }
};

const getWalletTokens = async (provider, userAddress, chainId) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    
    // Get tokens from wallet and from scanning
    const [walletTokens, scannedTokens] = await Promise.all([
      provider.request({
        method: 'wallet_getPermissions'
      }).then(permissions => {
        const tokenPermission = permissions.find(p => p.parentCapability === 'eth_accounts');
        return tokenPermission?.caveats?.[0]?.value || [];
      }).catch(() => []),
      scanForTokens(ethersProvider, userAddress, chainId)
    ]);

    // Combine and format tokens
    const formattedWalletTokens = (walletTokens || [])
      .filter(token => token && typeof token === 'object' && token.address)
      .map(token => ({
        address: token.address,
        symbol: token.symbol || 'Unknown',
        name: token.name || 'Unknown Token',
        decimals: token.decimals || 18,
        logo: token.logo || '/token-default.png',
        verified: true
      }));

    // Combine tokens and remove duplicates
    const allTokens = [...formattedWalletTokens, ...scannedTokens].filter(token => token && token.address);
    const uniqueTokens = Array.from(
      new Map(allTokens.map(token => [token.address.toLowerCase(), token]))
    ).values();

    return Array.from(uniqueTokens);
  } catch (error) {
    console.error('Error getting wallet tokens:', error);
    return [];
  }
};

export default function TokenSelectionModal({ isOpen, onClose, onSelect, selectedTokenAddress }) {
  const { address: userAddress } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [customToken, setCustomToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [tokenBalances, setTokenBalances] = useState({});
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [tokensWithBalance, setTokensWithBalance] = useState([]);
  const [currentChainId, setCurrentChainId] = useState(null);

  // Get current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (!window.ethereum) return;
      try {
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const decimalChainId = parseInt(hexChainId, 16);
        setCurrentChainId(decimalChainId);
      } catch (error) {
        console.error('Error getting chain ID:', error);
      }
    };
    getChainId();
  }, []);

  // Fetch tokens and balances
  useEffect(() => {
    const fetchTokensAndBalances = async () => {
      if (!isOpen || !userAddress || !window.ethereum) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const chainId = await provider.getNetwork().then(n => n.chainId);
        
        // Get tokens list
        const tokens = await scanForTokens(provider, userAddress, Number(chainId));
        
        // Fetch balances
        const newBalances = {};
        
        await Promise.all(
          tokens.map(async (token) => {
            try {
              if (!token.address) return;
              
              if (token.address === 'ETH') {
                const balance = await provider.getBalance(userAddress);
                newBalances[token.address] = {
                  raw: balance.toString(),
                  formatted: formatBalance(balance, 18)
                };
              } else if (ethers.isAddress(token.address)) {
                const tokenContract = new ethers.Contract(
                  token.address,
                  ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
                  provider
                );
                
                const [balance, decimals] = await Promise.all([
                  tokenContract.balanceOf(userAddress).catch(() => ethers.parseUnits('0', token.decimals || 18)),
                  tokenContract.decimals().catch(() => token.decimals || 18)
                ]);
                
                newBalances[token.address] = {
                  raw: balance.toString(),
                  formatted: formatBalance(balance, decimals)
                };
              }
            } catch (err) {
              console.warn(`Error fetching balance for token ${token.address}:`, err);
              newBalances[token.address] = {
                raw: '0',
                formatted: '0'
              };
            }
          })
        );
        
        setTokenBalances(newBalances);
        
        // Filter and sort tokens
        const tokensWithBalances = tokens
          .filter(token => token && (token.address === 'ETH' || ethers.isAddress(token.address)))
          .map(token => ({
            ...token,
            balance: newBalances[token.address]?.formatted || '0'
          }))
          .sort((a, b) => {
            const balanceA = parseFloat(a.balance) || 0;
            const balanceB = parseFloat(b.balance) || 0;
            return balanceB - balanceA;
          });
        
        setTokensWithBalance(tokensWithBalances);
      } catch (error) {
        console.error('Error fetching tokens and balances:', error);
        setError('Failed to fetch tokens. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokensAndBalances();
  }, [isOpen, userAddress, refreshTrigger]);

  const TokenRow = ({ token, onSelect, isSelected }) => {
    const balance = tokenBalances[token.address]?.formatted || '0';
    const isLoadingBalance = !tokenBalances[token.address];

    return (
      <motion.button
        onClick={() => onSelect(token)}
        className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#2d2f36] rounded-xl transition-colors ${
          isSelected ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {renderTokenLogo(token)}
          <div className="text-left">
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {token.symbol || 'Unknown'}
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {token.name || 'Unknown Token'}
            </div>
          </div>
        </div>
        <div className="text-right text-sm font-medium text-gray-900 dark:text-white">
          {isLoadingBalance ? (
            <motion.div 
              className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : (
            balance
          )}
        </div>
      </motion.button>
    );
  };

  const hasBalance = token => {
    const balance = tokenBalances[token.address]?.formatted;
    return parseFloat(balance || '0') > 0;
  };

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!tokensWithBalance) return [];
    
    const searchLower = (searchQuery || '').toLowerCase();
    return tokensWithBalance.filter(token => {
      if (!token) return false;
      return (
        (token.symbol || '').toLowerCase().includes(searchLower) ||
        (token.name || '').toLowerCase().includes(searchLower) ||
        (token.address || '').toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, tokensWithBalance]);

  // Move renderTokenLogo outside of TokenRow
  const renderTokenLogo = (token) => {
    // For common tokens, use their predefined logos
    const commonToken = COMMON_TOKENS[currentChainId]?.find(t => t.address === token.address);
    if (commonToken) {
      return <img src={commonToken.logo} alt={commonToken.symbol} className="w-8 h-8 rounded-full" />;
    }

    // For tokens with IPFS logo or direct logo
    const logoUrl = token.logo || (token.logoIpfs ? ipfsToHttp(token.logoIpfs) : null);
    if (logoUrl) {
      return (
        <img 
          src={logoUrl}
          alt={token.symbol}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }

    // Default token logo
    return (
      <img 
        src="/token-default.png"
        alt={token.symbol || 'Unknown'}
        className="w-8 h-8 rounded-full"
      />
    );
  };

  const handleTokenSelect = async (token) => {
    try {
      if (!token) {
        console.error('No token provided to handleTokenSelect');
        setError('Invalid token selection');
        return;
      }

      let finalToken;
      
      // Handle ETH/WETH case
      if (token.symbol === 'ETH') {
        if (!currentChainId || !UNISWAP_ADDRESSES[currentChainId]?.WETH) {
          console.error('No WETH address found for current chain');
          setError('WETH address not configured for this chain');
          return;
        }
        finalToken = {
          ...token,
          address: UNISWAP_ADDRESSES[currentChainId].WETH
        };
      } 
      // Handle custom token address search
      else if (ethers.isAddress(searchQuery)) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const tokenContract = new ethers.Contract(
            searchQuery,
            [
              'function symbol() view returns (string)',
              'function name() view returns (string)',
              'function decimals() view returns (uint8)'
            ],
            provider
          );

          const [symbol, name, decimals] = await Promise.all([
            tokenContract.symbol().catch(() => 'Unknown'),
            tokenContract.name().catch(() => 'Unknown Token'),
            tokenContract.decimals().catch(() => 18)
          ]);

          finalToken = {
            address: searchQuery,
            symbol,
            name,
            decimals,
            verified: true
          };
        } catch (err) {
          console.error('Error fetching custom token info:', err);
          setError('Invalid token address or token not found');
          return;
        }
      }
      // Handle regular token selection
      else {
        if (!token.address) {
          console.error('Token has no address:', token);
          setError('Invalid token: no address found');
          return;
        }
        finalToken = {
          ...token,
          decimals: token.decimals || 18,
          verified: true
        };
      }

      // Final validation
      if (!finalToken.address || !ethers.isAddress(finalToken.address)) {
        console.error('Invalid final token address:', finalToken);
        setError('Invalid token address');
        return;
      }

      onSelect(finalToken);
      onClose();
    } catch (error) {
      console.error('Error in handleTokenSelect:', error);
      setError('Error selecting token: ' + error.message);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <style>{scrollbarStyles}</style>
          
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
            aria-hidden="true"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Dialog.Panel className="mx-auto w-[448px] rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Select Token
                </Dialog.Title>

                {/* Search Input */}
                <motion.div 
                  className="relative mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or paste address"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        className="mt-2 text-sm text-red-500"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Token List Container */}
                <div className="token-list-scrollbar overflow-y-auto overflow-x-hidden h-[60vh]">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div 
                        className="space-y-2 min-h-[400px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Loading State Header */}
                        <motion.div className="flex items-center gap-2 mb-3 px-3">
                          <FaCoins className="text-[#00ffbd]/20 w-4 h-4" />
                          <motion.div 
                            className="h-4 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </motion.div>

                        {/* Loading Token Rows */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <motion.div 
                            key={i}
                            className="w-full flex items-center justify-between p-3 bg-white dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#2d2f36]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                              />
                              <div className="space-y-2">
                                <motion.div 
                                  className="h-4 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                />
                                <motion.div 
                                  className="h-3 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                />
                              </div>
                            </div>
                            <motion.div 
                              className="w-24 h-4 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="min-h-[400px]"
                      >
                        {/* Your Tokens Section */}
                        <motion.div 
                          className="mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <FaCoins className="text-[#00ffbd] w-4 h-4" />
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              Your Tokens
                            </h3>
                          </div>
                          <motion.div className="space-y-2">
                            <AnimatePresence>
                              {filteredTokens
                                .filter(hasBalance)
                                .map((token) => (
                                  <TokenRow
                                    key={`${token.address}-${refreshTrigger}`}
                                    token={token}
                                    onSelect={handleTokenSelect}
                                    isSelected={selectedTokenAddress === (token.symbol === 'ETH' ? UNISWAP_ADDRESSES[currentChainId].WETH : token.address)}
                                  />
                                ))}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>

                        {/* Separator */}
                        <motion.div 
                          className="my-4 border-t border-gray-200 dark:border-gray-700"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.4 }}
                        />

                        {/* Other Tokens Section */}
                        <motion.div 
                          className="mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                            Other Tokens
                          </h3>
                          <motion.div className="space-y-2">
                            <AnimatePresence>
                              {filteredTokens
                                .filter(token => !hasBalance(token))
                                .map((token) => (
                                  <TokenRow
                                    key={`${token.address}-${refreshTrigger}`}
                                    token={token}
                                    onSelect={handleTokenSelect}
                                    isSelected={selectedTokenAddress === (token.symbol === 'ETH' ? UNISWAP_ADDRESSES[currentChainId].WETH : token.address)}
                                  />
                                ))}
                            </AnimatePresence>
                          </motion.div>
                        </motion.div>

                        {/* Custom Token Section */}
                        <AnimatePresence>
                          {customToken && !error && (
                            <motion.div 
                              className="mt-4"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Custom Token
                              </h3>
                              <TokenRow
                                token={customToken}
                                onSelect={handleTokenSelect}
                                isSelected={selectedTokenAddress === customToken.address}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
} 