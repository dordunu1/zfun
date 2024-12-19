import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTokenLogo, getTokenMetadata, COMMON_TOKENS } from '../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [tokenMetadataMap, setTokenMetadataMap] = useState({});

  // Add function to fetch token metadata from Firestore
  const fetchFirestoreTokenMetadata = async () => {
    try {
      const tokensRef = collection(db, 'tokens');
      const snapshot = await getDocs(tokensRef);
      const metadata = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        metadata[doc.id.toLowerCase()] = {
          ...data,
          address: doc.id,
          logo: data.logo || '/token-default.png'
        };
      });
      return metadata;
    } catch (error) {
      console.error('Error fetching Firestore token metadata:', error);
      return {};
    }
  };

  // Update getTokenInfo function
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
        console.log('Starting to fetch transactions...');
        console.log('Factory address:', UNISWAP_ADDRESSES.factory);
        
        const provider = new ethers.JsonRpcProvider(
          `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`
        );

        const factoryContract = new ethers.Contract(
          UNISWAP_ADDRESSES.factory,
          FACTORY_ABI,
          provider
        );

        const pairsLength = await factoryContract.allPairsLength();
        console.log('Total pairs:', pairsLength.toString());

        const latestBlock = await provider.getBlockNumber();
        const fromBlock = latestBlock - 10000; // Last ~24 hours
        console.log('Fetching events from block', fromBlock, 'to', latestBlock);

        const pairPromises = [];
        for (let i = 0; i < pairsLength; i++) {
          pairPromises.push(factoryContract.allPairs(i));
        }
        const pairs = await Promise.all(pairPromises);

        const allEvents = [];
        for (const pairAddress of pairs) {
          try {
            const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);
            
            const [token0, token1] = await Promise.all([
              pairContract.token0(),
              pairContract.token1()
            ]);

            // Get token metadata with proper Firestore integration
            const [token0Info, token1Info] = await Promise.all([
              getTokenMetadata({ address: token0 }),
              getTokenMetadata({ address: token1 })
            ]);

            // Get swap events
            const events = await pairContract.queryFilter('Swap', fromBlock);
            console.log(`Found ${events.length} events for pair ${pairAddress}`);

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
            console.error('Error processing pair:', pairAddress, error);
          }
        }

        const sortedEvents = allEvents
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 50);

        console.log('Final processed events:', sortedEvents.map(event => ({
          ...event,
          formattedInputAmount: formatAmount(event.inputAmount, event.inputToken?.decimals),
          formattedOutputAmount: formatAmount(event.outputAmount, event.outputToken?.decimals)
        })));

        setTransactions(sortedEvents);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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

      const bn = ethers.getBigInt(amountStr);
      const formatted = ethers.formatUnits(bn, decimalNum);
      const parsed = parseFloat(formatted);
      
      // Log the formatting process
      console.log('Formatting amount:', {
        original: amountStr,
        decimals: decimalNum,
        formatted,
        parsed
      });

      if (parsed === 0) return '0';
      if (parsed < 0.0001) return '< 0.0001';
      
      // Format with appropriate decimal places based on the value
      const decimalPlaces = parsed < 1 ? 6 : 2;
      const formatted_number = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces,
        useGrouping: true
      }).format(parsed);

      console.log('Final formatted number:', formatted_number);
      return formatted_number;
    } catch (error) {
      console.error('Error formatting amount:', error, { amount, decimals });
      return '0';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredTransactions = transactions.filter(tx => 
    selectedType === 'All' || tx.type === selectedType
  );

  // Update renderTokenLogo function to use the token's logo directly
  const renderTokenLogo = (token) => {
    if (!token) return '/token-default.png';
    return token.logo || '/token-default.png';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffbd]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="py-3 px-4">↓ Time</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Token Amount</th>
              <th className="py-3 px-4">Token Amount</th>
              <th className="py-3 px-4">Value USD</th>
              <th className="py-3 px-4">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr 
                key={tx.txHash + index}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-white/10 dark:hover:bg-[#2d2f36] transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(tx.timestamp)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Swap</span>
                    <div className="flex items-center gap-1">
                      <img 
                        src={renderTokenLogo(tx.inputToken)}
                        alt={tx.inputToken?.symbol}
                        className="w-4 h-4 rounded-full ring-1 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {tx.inputToken?.symbol}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">for</span>
                    <div className="flex items-center gap-1">
                      <img 
                        src={renderTokenLogo(tx.outputToken)}
                        alt={tx.outputToken?.symbol}
                        className="w-4 h-4 rounded-full ring-1 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {tx.outputToken?.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {formatAmount(tx.inputAmount, tx.inputToken?.decimals)} {tx.inputToken?.symbol}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {formatAmount(tx.outputAmount, tx.outputToken?.decimals)} {tx.outputToken?.symbol}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {tx.outputToken?.symbol === 'USDC' || tx.outputToken?.symbol === 'USDT' 
                    ? `$${formatAmount(tx.outputAmount, tx.outputToken?.decimals)}`
                    : tx.inputToken?.symbol === 'USDC' || tx.inputToken?.symbol === 'USDT'
                    ? `$${formatAmount(tx.inputAmount, tx.inputToken?.decimals)}`
                    : '-'}
                </td>
                <td className="py-3 px-4">
                  <a 
                    href={`https://sepolia.etherscan.io/address/${tx.account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
                  >
                    {formatAddress(tx.account)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions; 