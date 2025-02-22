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
import { Contract } from 'ethers';
import { getChainTokens } from '../../../../utils/tokens';

// Add RPC URL constant at the top
const UNICHAIN_RPC_URLS = {
  1301: 'https://sepolia.unichain.org',
  130: 'https://mainnet.unichain.org',
  10143: 'https://monad-testnet.drpc.org'
};

// Add chain ID constant at the top
const UNICHAIN_CHAIN_IDS = {
  TESTNET: 1301,
  MAINNET: 130,
  MONAD_TESTNET: 10143
};

// Common tokens with metadata
const COMMON_TOKENS = {
  // Monad Testnet tokens (10143)
  10143: [
    {
      symbol: 'MON',
      name: 'Monad',
      decimals: 18,
      logo: '/monad.png',
      isNative: true
    },
    {
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      symbol: 'WMONAD',
      name: 'Wrapped Monad',
      decimals: 18,
      logo: '/monad.png'
    },
    {
      address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logo: '/eth.png'
    }
  ],
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
    // Handle Monad testnet differently
    if (chainId === UNICHAIN_CHAIN_IDS.MONAD_TESTNET) {
      const commonTokens = getChainTokens(chainId);
      const tokens = [...commonTokens];

      // Get token balances
      for (const token of tokens) {
        try {
          if (token.isNative) {
            // For native MON token
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [userAddress, 'latest']
            });
            const balanceBigInt = BigInt(balance);
            token.balance = balanceBigInt.toString();
            token.formatted = ethers.formatEther(balanceBigInt);
          } else {
            // For other tokens
            const tokenContract = new ethers.Contract(
              token.address,
              [
                'function balanceOf(address) view returns (uint256)',
                'function decimals() view returns (uint8)'
              ],
              provider
            );
            const balance = await tokenContract.balanceOf(userAddress);
            token.balance = balance.toString();
            token.formatted = ethers.formatUnits(balance, token.decimals);
          }
        } catch (error) {
          console.warn(`Error fetching balance for token ${token.symbol}:`, error);
          token.balance = '0';
          token.formatted = '0';
        }
      }

      return tokens;
    }

    // Original Blockscout logic for Unichain networks
    const blockscoutUrl = chainId === UNICHAIN_CHAIN_IDS.TESTNET 
      ? 'https://unichain-sepolia.blockscout.com'
      : 'https://unichain.blockscout.com';

    const response = await fetch(
      `${blockscoutUrl}/api/v2/addresses/${userAddress}/token-balances`
    );

    if (!response.ok) {
      console.warn(`Blockscout API error: ${response.status}`);
      return getChainTokens(chainId);
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
    const commonTokens = getChainTokens(chainId);
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
    return getChainTokens(chainId);
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

const getTokenBalance = async (tokenAddress, userAddress) => {
  try {
    if (!provider) await init();

    // Handle native token balance (ETH or MN)
    if (tokenAddress === 'ETH' || tokenAddress === 'MN') {
      const balance = await provider.getBalance(userAddress);
      return ethers.formatEther(balance);
    }

    // Handle ERC20 token balance
    const token = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const [balance, decimals] = await Promise.all([
      token.balanceOf(userAddress),
      token.decimals()
    ]);

    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    throw error;
  }
};

// Add Multicall ABI
const MULTICALL_ABI = [
  'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)'
];

// Add ERC20 interface
const ERC20_INTERFACE = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

// Add Multicall addresses
const MULTICALL_ADDRESSES = {
  10143: '0x6a49F8E8d4F21F4A6Fb9A1d3D67E793f5676eEf0', // Monad testnet
  1301: '0x6a49F8E8d4F21F4A6Fb9A1d3D67E793f5676eEf0',  // Unichain testnet
  130: '0x6a49F8E8d4F21F4A6Fb9A1d3D67E793f5676eEf0'    // Unichain mainnet
};

// Add balance cache
const balanceCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Update Blockscout API endpoints
const BLOCKSCOUT_URLS = {
  1301: 'https://unichain-sepolia.blockscout.com/api/v2/addresses',
  130: 'https://unichain.blockscout.com/api/v2/addresses'
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

  const fetchTokensAndBalances = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Check if ethereum provider exists
      if (!window.ethereum) {
        console.warn('No ethereum provider found');
        setError('Please install a Web3 wallet like MetaMask');
        setIsLoading(false);
        return;
      }

      // Wait for provider to be ready
      let retries = 0;
      while (!window.ethereum.request && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }

      if (!window.ethereum.request) {
        throw new Error('Ethereum provider not initialized');
      }

      // Get chainId directly from ethereum provider
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' }).catch(err => {
        console.error('Error getting chainId:', err);
        throw new Error('Could not get network information');
      });
      
      const chainId = parseInt(chainIdHex, 16);
      console.log('Current chain ID:', chainId);
      setCurrentChainId(chainId);

      // Check cache first
      const cacheKey = `${userAddress}-${chainId}`;
      const cachedData = balanceCache.get(cacheKey);
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log('Using cached balances:', cachedData);
        setTokenBalances(cachedData.balances);
        setTokensWithBalance(cachedData.tokensWithBalance);
        setIsLoading(false);
        return;
      }

      // Get both common tokens and Blockscout tokens
      let allTokens = getChainTokens(chainId);
      const newBalances = {};

      // Fetch additional tokens from Blockscout for Unichain networks
      if (chainId === 1301 || chainId === 130) {
        try {
          const blockscoutUrl = BLOCKSCOUT_URLS[chainId];
          console.log('Fetching tokens from Blockscout:', `${blockscoutUrl}/${userAddress}/token-balances`);
          
          const response = await fetch(
            `${blockscoutUrl}/${userAddress}/token-balances`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          console.log('Blockscout response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('Blockscout tokens data:', data);

            const blockscoutTokens = data
              .filter(item => {
                const isValidToken = item.token?.type === 'ERC-20' && 
                                   ethers.isAddress(item.token?.address) && 
                                   !item.token?.symbol?.includes('LP') && 
                                   !item.token?.symbol?.includes('UNI-V2');
                
                // Check for TEMP in various forms
                const hasTemp = (str) => {
                  if (!str) return false;
                  const lowerStr = str.toLowerCase();
                  return lowerStr.includes('temp') || 
                         lowerStr.includes('tmp') ||
                         lowerStr.includes('temporary');
                };
                
                const isNotTempToken = !hasTemp(item.token?.symbol) && !hasTemp(item.token?.name);
                
                // Don't add tokens that are already in common tokens
                const isDuplicate = allTokens.some(t => 
                  t.address?.toLowerCase() === item.token?.address?.toLowerCase()
                );
                
                return isValidToken && isNotTempToken && !isDuplicate;
              })
              .map(item => ({
                address: item.token.address,
                symbol: item.token.symbol || 'Unknown',
                name: item.token.name || 'Unknown Token',
                decimals: parseInt(item.token.decimals || '18'),
                logo: item.token.icon_url || '/token-default.png',
                balance: item.value || '0'
              }));
            
            console.log('Processed Blockscout tokens:', blockscoutTokens);
            allTokens = [...allTokens, ...blockscoutTokens];
          }
        } catch (err) {
          console.warn('Error fetching Blockscout tokens:', err);
        }
      }

      // Get native token balance (MON for Monad testnet, ETH for Unichain)
      try {
        console.log('Fetching native token balance...');
        const nativeBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [userAddress, 'latest']
        });
        console.log('Raw native balance:', nativeBalance);
        const balanceBigInt = BigInt(nativeBalance);
        const nativeSymbol = chainId === 10143 ? 'MON' : 'ETH';
        const formattedBalance = ethers.formatEther(balanceBigInt);
        console.log('Formatted native balance:', { symbol: nativeSymbol, balance: formattedBalance });
        
        newBalances[nativeSymbol] = {
          raw: balanceBigInt.toString(),
          formatted: formattedBalance
        };
      } catch (err) {
        console.error('Error fetching native balance:', err);
        const nativeSymbol = chainId === 10143 ? 'MON' : 'ETH';
        newBalances[nativeSymbol] = { raw: '0', formatted: '0' };
      }

      // Get ERC20 token balances
      console.log('Starting ERC20 token balance fetching for all tokens:', allTokens);
      const tokenPromises = allTokens
        .filter(token => !token.isNative && token.address && token.address !== 'ETH')
        .map(async (token) => {
          try {
            console.log('Fetching balance for token:', token);
            
            // Use direct RPC calls for all networks to avoid ENS issues
            const data = ethers.AbiCoder.defaultAbiCoder().encode(
              ['address'],
              [userAddress]
            ).slice(2);
            
            const balanceOfSelector = '0x70a08231'; // balanceOf(address)
            const callData = balanceOfSelector + data;
            
            console.log('Making RPC call with data:', {
              to: token.address,
              data: callData
            });
            
            const result = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: token.address,
                data: callData
              }, 'latest']
            });
            
            console.log('Raw balance result:', result);
            const balance = BigInt(result || '0');
            const formatted = ethers.formatUnits(balance, token.decimals || 18);

            console.log('Token balance fetched:', {
              token: token.symbol,
              balance: balance.toString(),
              formatted
            });

            return {
              token,
              balance: balance.toString(),
              formatted
            };
          } catch (err) {
            console.error(`Error fetching balance for token ${token.symbol}:`, err);
            return {
              token,
              balance: '0',
              formatted: '0'
            };
          }
        });

      console.log('Waiting for all token balances...');
      const tokenResults = await Promise.all(tokenPromises);
      console.log('All token balances received:', tokenResults);

      // Update balances object
      tokenResults.forEach(({ token, balance, formatted }) => {
        newBalances[token.address] = {
          raw: balance,
          formatted
        };
      });

      // Update tokens with balances
      const tokensWithBalances = allTokens.map(token => {
        let balance;
        if (token.isNative || token.address === 'ETH') {
          // For native token (ETH/MON)
          balance = newBalances[chainId === 10143 ? 'MON' : 'ETH']?.formatted || '0';
        } else if (token.symbol === 'WETH' && chainId === 1301) {
          // Special case for WETH on Unichain testnet
          balance = newBalances[UNISWAP_ADDRESSES[1301].WETH]?.formatted || '0';
        } else {
          // For other ERC20 tokens
          balance = newBalances[token.address]?.formatted || '0';
        }
        
        console.log('Mapping token balance:', {
          token: token.symbol,
          isNative: token.isNative,
          address: token.address,
          balance
        });

        return {
          ...token,
          balance
        };
      });

      console.log('Final balances:', {
        newBalances,
        tokensWithBalances
      });

      // Update cache
      balanceCache.set(cacheKey, {
        timestamp: Date.now(),
        balances: newBalances,
        tokensWithBalance: tokensWithBalances
      });

      setTokenBalances(newBalances);
      setTokensWithBalance(tokensWithBalances);
    } catch (error) {
      console.error('Error in fetchTokensAndBalances:', error);
      setError('Failed to fetch tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect for chainId
  useEffect(() => {
    const getChainId = async () => {
      // Check if provider exists and is ready
      if (!window.ethereum?.request) {
        console.warn('Ethereum provider not ready');
        return;
      }

      try {
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const decimalChainId = parseInt(hexChainId, 16);
        setCurrentChainId(decimalChainId);
      } catch (error) {
        console.error('Error getting chain ID:', error);
      }
    };

    // Add event listener for provider
    const handleProviderChange = () => {
      if (window.ethereum?.request) {
        getChainId();
      }
    };

    // Check periodically for provider
    const checkForProvider = setInterval(() => {
      if (window.ethereum?.request) {
        getChainId();
        clearInterval(checkForProvider);
      }
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(checkForProvider);
    };
  }, []);

  // Update useEffect to trigger on searchQuery changes
  useEffect(() => {
    fetchTokensAndBalances();
  }, [isOpen, userAddress, refreshTrigger, searchQuery]);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!tokensWithBalance) return [];
    
    // If search query is a valid address, only show that token
    if (ethers.isAddress(searchQuery)) {
      const token = tokensWithBalance.find(t => 
        t.address?.toLowerCase() === searchQuery.toLowerCase()
      );
      return token ? [token] : [];
    }

    const searchLower = searchQuery.toLowerCase();
    return tokensWithBalance.filter(token => {
      if (!token) return false;
      return (
        token.symbol?.toLowerCase().includes(searchLower) ||
        token.name?.toLowerCase().includes(searchLower) ||
        token.address?.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, tokensWithBalance]);

  // Update useEffect to fetch token info when address is pasted
  useEffect(() => {
    const fetchCustomTokenInfo = async () => {
      if (!ethers.isAddress(searchQuery) || !window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const chainId = await provider.getNetwork().then(n => Number(n.chainId));

        // For Monad testnet, use direct RPC calls
        if (chainId === 10143) {
          const tokenContract = new ethers.Contract(
            searchQuery,
            [
              'function symbol() view returns (string)',
              'function name() view returns (string)',
              'function decimals() view returns (uint8)',
              'function balanceOf(address) view returns (uint256)'
            ],
            provider
          );

          const [symbol, name, decimals, balance] = await Promise.all([
            window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: searchQuery,
                data: tokenContract.interface.encodeFunctionData('symbol')
              }, 'latest']
            }).then(data => tokenContract.interface.decodeFunctionResult('symbol', data)[0]),
            window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: searchQuery,
                data: tokenContract.interface.encodeFunctionData('name')
              }, 'latest']
            }).then(data => tokenContract.interface.decodeFunctionResult('name', data)[0]),
            window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: searchQuery,
                data: tokenContract.interface.encodeFunctionData('decimals')
              }, 'latest']
            }).then(data => tokenContract.interface.decodeFunctionResult('decimals', data)[0]),
            window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: searchQuery,
                data: tokenContract.interface.encodeFunctionData('balanceOf', [userAddress])
              }, 'latest']
            }).then(data => tokenContract.interface.decodeFunctionResult('balanceOf', data)[0])
          ]);

          const customToken = {
            address: searchQuery,
            symbol,
            name,
            decimals,
            balance: ethers.formatUnits(balance, decimals)
          };

          setTokensWithBalance([customToken]);
          setTokenBalances({
            [searchQuery]: {
              raw: balance.toString(),
              formatted: ethers.formatUnits(balance, decimals)
            }
          });
        } else {
          const tokenContract = new ethers.Contract(
            searchQuery,
            [
              'function symbol() view returns (string)',
              'function name() view returns (string)',
              'function decimals() view returns (uint8)',
              'function balanceOf(address) view returns (uint256)'
            ],
            provider
          );

          const [symbol, name, decimals, balance] = await Promise.all([
            tokenContract.symbol().catch(() => 'Unknown'),
            tokenContract.name().catch(() => 'Unknown Token'),
            tokenContract.decimals().catch(() => 18),
            tokenContract.balanceOf(userAddress).catch(() => '0')
          ]);

          const customToken = {
            address: searchQuery,
            symbol,
            name,
            decimals,
            balance: ethers.formatUnits(balance, decimals)
          };

          setTokensWithBalance([customToken]);
          setTokenBalances({
            [searchQuery]: {
              raw: balance.toString(),
              formatted: ethers.formatUnits(balance, decimals)
            }
          });
        }

        setError('');
      } catch (err) {
        console.error('Error fetching custom token:', err);
        setError('Could not fetch token information. Please verify the contract address.');
      }
    };

    fetchCustomTokenInfo();
  }, [searchQuery, userAddress]);

  const TokenRow = ({ token, onSelect, isSelected }) => {
    const tokenBalance = token.isNative ? 
      tokenBalances['MON']?.formatted || '0' : 
      tokenBalances[token.address]?.formatted || '0';
    const isTokenLoading = token.isNative ? 
      !tokenBalances['MON'] : 
      !tokenBalances[token.address];

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
          {isTokenLoading ? (
            <motion.div 
              className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ) : (
            tokenBalance
          )}
        </div>
      </motion.button>
    );
  };

  const hasBalance = token => {
    const balance = token.isNative ? 
      tokenBalances['MON']?.formatted || '0' : 
      tokenBalances[token.address]?.formatted || '0';
    return parseFloat(balance) > 0;
  };

  // Move renderTokenLogo outside of TokenRow
  const renderTokenLogo = (token) => {
    // For common tokens, use their predefined logos
    const commonToken = COMMON_TOKENS[currentChainId]?.find(t => t.address === token.address);
    if (commonToken?.logo) {
      return (
        <div className="relative w-8 h-8">
          <img src={commonToken.logo} alt={commonToken.symbol} className="w-8 h-8 rounded-full" />
          <img 
            src={currentChainId === 10143 ? '/monad.png' : '/unichain-logo.png'} 
            alt="Chain Logo" 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-1 ring-black"
          />
        </div>
      );
    }

    // For tokens with direct logo or IPFS logo
    const logoUrl = token.logo || (token.logoIpfs ? ipfsToHttp(token.logoIpfs) : null);
    if (logoUrl && !logoUrl.includes('token-default.png')) {
      return (
        <div className="relative w-8 h-8">
          <img 
            src={logoUrl}
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-[#1a1b1f] flex items-center justify-center relative">
                  <span class="text-[#00ffbd] font-bold text-sm">${token.symbol?.slice(0, 2).toUpperCase() || '??'}</span>
                  <img 
                    src="${currentChainId === 10143 ? '/monad.png' : '/unichain-logo.png'}" 
                    alt="Chain Logo" 
                    class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-1 ring-black"
                  />
                </div>
              `;
            }}
          />
        </div>
      );
    }

    // Default case: show initials with chain logo
    return (
      <div className="w-8 h-8 rounded-full bg-[#1a1b1f] flex items-center justify-center relative">
        <span className="text-[#00ffbd] font-bold text-sm">{token.symbol?.slice(0, 2).toUpperCase() || '??'}</span>
        <img 
          src={currentChainId === 10143 ? '/monad.png' : '/unichain-logo.png'} 
          alt="Chain Logo" 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-1 ring-black"
        />
      </div>
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
      
      // Handle native MON token
      if (token.isNative && token.symbol === 'MON') {
        finalToken = {
          ...token,
          address: 'MON', // Special identifier for native token
          decimals: 18,
          verified: true
        };
      }
      // Handle ETH/WETH case
      else if (token.symbol === 'ETH') {
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

      // Final validation - allow 'MON' as a valid address for native token
      if (!finalToken.address || (finalToken.address !== 'MON' && !ethers.isAddress(finalToken.address))) {
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
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div 
                          className="w-full flex items-center justify-between p-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-2">
                              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                          </div>
                          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={listContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="min-h-[400px]"
                      >
                        {ethers.isAddress(searchQuery) ? (
                          // When searching by address, show only the token
                          <motion.div className="space-y-2">
                            {filteredTokens.map((token) => (
                              <TokenRow
                                key={token.address || token.symbol}
                                token={token}
                                onSelect={handleTokenSelect}
                                isSelected={selectedTokenAddress === token.address}
                              />
                            ))}
                          </motion.div>
                        ) : (
                          // Normal search view with sections
                          <>
                            {/* Your Tokens Section */}
                            <motion.div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <FaCoins className="text-[#00ffbd] w-4 h-4" />
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                  Your Tokens
                                </h3>
                              </div>
                              <motion.div className="space-y-2">
                                {filteredTokens
                                  .filter(hasBalance)
                                  .map((token) => (
                                    <TokenRow
                                      key={token.address || token.symbol}
                                      token={token}
                                      onSelect={handleTokenSelect}
                                      isSelected={selectedTokenAddress === token.address}
                                    />
                                  ))}
                              </motion.div>
                            </motion.div>

                            {/* Separator */}
                            <motion.div 
                              className="my-4 border-t border-gray-200 dark:border-gray-700"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                            />

                            {/* Other Tokens Section */}
                            <motion.div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                Other Tokens
                              </h3>
                              <motion.div className="space-y-2">
                                {filteredTokens
                                  .filter(token => !hasBalance(token))
                                  .map((token) => (
                                    <TokenRow
                                      key={token.address || token.symbol}
                                      token={token}
                                      onSelect={handleTokenSelect}
                                      isSelected={selectedTokenAddress === token.address}
                                    />
                                  ))}
                              </motion.div>
                            </motion.div>
                          </>
                        )}
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