import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTokenLogo, getTokenMetadata, COMMON_TOKENS } from '../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { db } from '../../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useTokenPrices } from '../../../hooks/useTokenPrices';

// Helper function to convert IPFS URLs to HTTP
const ipfsToHttp = (ipfsUrl) => {
  if (!ipfsUrl) return null;
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return ipfsUrl;
};

// Factory and Pair ABIs
const FACTORY_ABI = [
  'function allPairs(uint) external view returns (address)',
  'function allPairsLength() external view returns (uint)',
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)'
];

const PAIR_ABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
];

const TRANSACTION_TYPES = ['All', 'Swaps', 'Adds', 'Removes'];

// Helper function to get token info
const getTokenInfo = async (token, tokenAddress) => {
  try {
    // First try to get token metadata from Firestore
    const firestoreToken = tokenMetadataMap[tokenAddress?.toLowerCase()];
    if (firestoreToken) {
      const logo = await getTokenLogo({ 
        ...firestoreToken,
        address: tokenAddress 
      });
      return {
        ...token,
        ...firestoreToken,
        logo: logo || '/token-default.png'
      };
    }

    // Then try to get from common tokens
    const commonToken = COMMON_TOKENS.find(t => t.address.toLowerCase() === tokenAddress?.toLowerCase());
    if (commonToken) {
      const logo = await getTokenLogo(commonToken);
      return {
        ...commonToken,
        logo: logo || commonToken.logo || '/token-default.png'
      };
    }

    // Finally try to get metadata from the chain
    const metadata = await getTokenMetadata(tokenAddress);
    if (metadata) {
      const logo = await getTokenLogo(metadata);
      return {
        ...metadata,
        logo: logo || '/token-default.png',
        symbol: metadata.symbol || 'ERC20'
      };
    }

    // Return default token info
    return {
      ...token,
      symbol: token?.symbol || 'ERC20',
      decimals: token?.decimals || 18,
      logo: '/token-default.png'
    };
  } catch (error) {
    console.error('Error in getTokenInfo:', error);
    return {
      ...token,
      symbol: token?.symbol || 'ERC20',
      decimals: token?.decimals || 18,
      logo: '/token-default.png'
    };
  }
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [tokenMetadataMap, setTokenMetadataMap] = useState({});
  const [userAddress, setUserAddress] = useState(null);
  const { calculateUSDValue, formatUSD } = useTokenPrices();

  // Get user's address
  useEffect(() => {
    const getUserAddress = async () => {
      if (!window.ethereum) return;
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error getting user address:', error);
      }
    };
    getUserAddress();
  }, []);

  // Add function to fetch token metadata from Firestore
  const fetchFirestoreTokenMetadata = async () => {
    try {
      // First try to get from common tokens
      const metadata = {};
      COMMON_TOKENS.forEach(token => {
        metadata[token.address.toLowerCase()] = {
          ...token,
          logo: token.logo || '/token-default.png'
        };
      });

      // Then try to get additional tokens from Firestore
      try {
        const tokensRef = collection(db, 'tokens');
        const snapshot = await getDocs(tokensRef);
        snapshot.forEach(doc => {
          const data = doc.data();
          metadata[doc.id.toLowerCase()] = {
            ...data,
            address: doc.id,
            logo: data.logo || '/token-default.png'
          };
        });
      } catch (firebaseError) {
        console.warn('Firebase fetch failed:', firebaseError);
      }

      return metadata;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return {};
    }
  };

  // Helper function to get wallet tokens
  const getWalletTokens = async (provider, userAddress) => {
    try {
      // Get tokens directly from the wallet
      const tokens = await provider.request({
        method: 'eth_accounts'
      }).then(async (accounts) => {
        if (accounts.length === 0) return [];

        // Get token balances
        const tokenBalances = await provider.request({
          method: 'wallet_getPermissions'
        }).then(permissions => {
          const tokenPermission = permissions.find(p => p.parentCapability === 'eth_accounts');
          return tokenPermission?.caveats?.[0]?.value || [];
        });

        // Format tokens properly
        return (tokenBalances || [])
          .filter(token => token && typeof token === 'object')
          .map(token => ({
            address: token.address || '',
            symbol: token.symbol || 'Unknown',
            name: token.name || 'Unknown Token',
            decimals: token.decimals || 18,
            logo: token.logo || '/token-default.png',
            verified: true
          }));
      });

      return tokens.filter(token => token && token.address);
    } catch (error) {
      console.error('Error getting wallet tokens:', error);
      return [];
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const firestoreMetadata = await fetchFirestoreTokenMetadata();
      setTokenMetadataMap(firestoreMetadata);
    };
    initialize();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch transactions...');
        
        // First get deployed tokens from Firebase
        const tokensRef = collection(db, 'tokens');
        const snapshot = await getDocs(tokensRef);
        const deployedTokens = new Set();
        snapshot.forEach(doc => {
          deployedTokens.add(doc.id.toLowerCase());
        });
        console.log('Deployed tokens:', deployedTokens);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(
          UNISWAP_ADDRESSES.factory,
          FACTORY_ABI,
          provider
        );

        // Get PairCreated events to find relevant pairs
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock - 10000; // Last ~24 hours
        console.log('Fetching events from block', fromBlock, 'to', latestBlock);

        // Get PairCreated events
        const pairCreatedEvents = await factoryContract.queryFilter('PairCreated', fromBlock);
        console.log('Found pair created events:', pairCreatedEvents.length);

        const relevantPairs = [];
        for (const event of pairCreatedEvents) {
          const token0 = event.args.token0.toLowerCase();
          const token1 = event.args.token1.toLowerCase();
          
          // Only include pairs where at least one token is from our platform
          if (deployedTokens.has(token0) || deployedTokens.has(token1)) {
            relevantPairs.push({
              address: event.args.pair,
              token0,
              token1
            });
          }
        }

        console.log('Relevant pairs:', relevantPairs.length);

        const allEvents = [];
        for (const pair of relevantPairs) {
          try {
            const pairContract = new ethers.Contract(pair.address, PAIR_ABI, provider);

            // Get token info
            const [token0Info, token1Info] = await Promise.all([
              getTokenMetadata(pair.token0),
              getTokenMetadata(pair.token1)
            ]);

            // Get swap events
            const events = await pairContract.queryFilter('Swap', fromBlock);
            console.log(`Found ${events.length} events for pair ${pair.address}`);

            for (const event of events) {
              const block = await event.getBlock();
              
              // Convert BigInt values to strings immediately
              const amount0In = event.args.amount0In.toString();
              const amount1In = event.args.amount1In.toString();
              const amount0Out = event.args.amount0Out.toString();
              const amount1Out = event.args.amount1Out.toString();

              // Check if amount0In or amount1In is greater than 0
              let inputToken, outputToken, inputAmount, outputAmount;
              if (amount0In !== '0') {
                inputToken = token0Info;
                outputToken = token1Info;
                inputAmount = amount0In;
                outputAmount = amount1Out;
              } else {
                inputToken = token1Info;
                outputToken = token0Info;
                inputAmount = amount1In;
                outputAmount = amount0Out;
              }

              // Add the transaction
              allEvents.push({
                type: 'Swaps',
                txHash: event.transactionHash,
                timestamp: block.timestamp * 1000,
                inputToken,
                outputToken,
                inputAmount,
                outputAmount,
                account: event.args.to
              });
            }
          } catch (error) {
            console.error('Error processing pair:', pair.address, error);
          }
        }

        const sortedEvents = allEvents
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50);

        console.log('Final processed events:', sortedEvents.length);
        setTransactions(sortedEvents);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (window.ethereum) {
      fetchTransactions();
    }
  }, []);

  const formatAmount = (amount, decimals) => {
    if (!amount || decimals === undefined) return '0';
    try {
      // Ensure amount is a string and decimals is a number
      const amountStr = amount.toString();
      const decimalNum = parseInt(decimals);
      
      if (isNaN(decimalNum)) {
        console.error('Invalid decimals:', decimals);
        return '0';
      }

      const formattedAmount = ethers.formatUnits(amountStr, decimalNum);
      return parseFloat(formattedAmount).toFixed(6);
    } catch (error) {
      console.error('Error formatting amount:', error);
      return '0';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
        
        {/* Transaction Type Filter */}
        <div className="relative">
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1b1f] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2d2f36] focus:outline-none"
          >
            {selectedType}
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showTypeDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1b1f] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {TRANSACTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setShowTypeDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2f36] first:rounded-t-lg last:rounded-b-lg"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffbd] mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No transactions found
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-[#2d2f36]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {transactions
                  .filter(tx => selectedType === 'All' || tx.type === selectedType)
                  .map((tx, index) => (
                    <tr key={`${tx.txHash}-${index}`} className="hover:bg-gray-50 dark:hover:bg-[#2d2f36]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tx.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={tx.inputToken?.logo || '/token-default.png'}
                            alt={tx.inputToken?.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatAmount(tx.inputAmount, tx.inputToken?.decimals)} {tx.inputToken?.symbol}
                            </div>
                            {tx.inputUSD && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatUSD(tx.inputUSD)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={tx.outputToken?.logo || '/token-default.png'}
                            alt={tx.outputToken?.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatAmount(tx.outputAmount, tx.outputToken?.decimals)} {tx.outputToken?.symbol}
                            </div>
                            {tx.outputUSD && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatUSD(tx.outputUSD)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {tx.inputUSD ? formatUSD(tx.inputUSD) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {tx.account.slice(0, 6)}...{tx.account.slice(-4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions; 