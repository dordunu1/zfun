import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTokenLogo, getTokenMetadata } from '../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
        const fromBlock = latestBlock - 10000;
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

            const [token0Metadata, token1Metadata] = await Promise.all([
              getTokenMetadata(token0),
              getTokenMetadata(token1)
            ]);

            // Get swap events
            const events = await pairContract.queryFilter('Swap', fromBlock);
            console.log(`Found ${events.length} events for pair ${pairAddress}`);

            for (const event of events) {
              const block = await event.getBlock();
              const amount0In = event.args.amount0In.toString();
              const amount1In = event.args.amount1In.toString();
              const amount0Out = event.args.amount0Out.toString();
              const amount1Out = event.args.amount1Out.toString();

              let token0Amount, token1Amount;
              if (BigInt(amount0In) > 0n) {
                token0Amount = amount0In;
                token1Amount = amount1Out;
              } else {
                token0Amount = amount0Out;
                token1Amount = amount1In;
              }

              allEvents.push({
                type: 'Swaps',
                txHash: event.transactionHash,
                timestamp: block.timestamp * 1000,
                token0: token0Metadata,
                token1: token1Metadata,
                token0Amount,
                token1Amount,
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
    if (!amount || !decimals) return '0';
    try {
      const bn = ethers.getBigInt(amount);
      const formatted = ethers.formatUnits(bn, decimals);
      const parsed = parseFloat(formatted);
      if (parsed === 0) return '0';
      if (parsed < 0.0001) return '< 0.0001';
      return parsed.toFixed(4).replace(/\.?0+$/, '');
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
              <th className="py-3 px-4 relative">
                <button 
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Type <ChevronDownIcon className="h-4 w-4" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1a1b1f] border border-gray-800 rounded-lg shadow-lg z-10">
                    {TRANSACTION_TYPES.map(type => (
                      <button
                        key={type}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-800"
                        onClick={() => {
                          setSelectedType(type);
                          setShowTypeDropdown(false);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </th>
              <th className="py-3 px-4">USD</th>
              <th className="py-3 px-4">Token amount</th>
              <th className="py-3 px-4">Token amount</th>
              <th className="py-3 px-4">Wallet</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr 
                key={tx.txHash + index}
                className="border-t border-gray-800 text-sm hover:bg-[#1a1b1f]"
              >
                <td className="py-3 px-4 text-gray-500">
                  {formatTimeAgo(tx.timestamp)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src={getTokenLogo(tx.token0)}
                        alt={tx.token0?.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                      <img
                        src={getTokenLogo(tx.token1)}
                        alt={tx.token1?.symbol}
                        className="w-5 h-5 rounded-full"
                      />
                    </div>
                    <span>
                      Swap {tx.token0?.symbol} for {tx.token1?.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">$--</td>
                <td className="py-3 px-4">
                  {formatAmount(tx.token0Amount, tx.token0?.decimals)} {tx.token0?.symbol}
                </td>
                <td className="py-3 px-4">
                  {formatAmount(tx.token1Amount, tx.token1?.decimals)} {tx.token1?.symbol}
                </td>
                <td className="py-3 px-4 text-[#00ffbd]">
                  {formatAddress(tx.account)}
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