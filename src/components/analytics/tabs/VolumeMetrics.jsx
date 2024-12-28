import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, subDays, subHours, startOfDay, isWithinInterval } from 'date-fns';
import { useTokenPrices } from '../../../hooks/useTokenPrices';
import { getCollection, getTokenDeploymentByAddress } from '../../../services/firebase';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

const TIME_RANGES = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' }
];

// Add ERC1155 ABI for transfer events
const ERC1155_ABI = [
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
  'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)'
];

// Helper function to fetch NFT data from blockchain
const fetchTransferEvents = async (address, network) => {
  try {
    // Create a custom provider
    const provider = new Web3Provider(window.ethereum);
    
    // Create contract instance
    const contract = new Contract(address, ERC1155_ABI, provider);
    
    // Get the current block
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10000 blocks, ensure not negative
    
    console.log('Fetching transfer events:', {
      network,
      address,
      fromBlock,
      currentBlock
    });

    // Get both types of transfer events
    const singleFilter = contract.filters.TransferSingle();
    const batchFilter = contract.filters.TransferBatch();
    
    const [singleEvents, batchEvents] = await Promise.all([
      contract.queryFilter(singleFilter, fromBlock),
      contract.queryFilter(batchFilter, fromBlock)
    ]);

    // Process TransferSingle events
    const singleTransfers = singleEvents.map(event => ({
      timestamp: null, // We'll get this from the block
      type: 'ERC-1155',
      value: event.args.value.toString(),
      blockNumber: event.blockNumber
    }));

    // Process TransferBatch events - each value in the batch is a separate transfer
    const batchTransfers = batchEvents.flatMap(event => {
      return event.args.values.map((value, index) => ({
        timestamp: null,
        type: 'ERC-1155',
        value: value.toString(),
        blockNumber: event.blockNumber
      }));
    });

    // Combine all transfers
    const allTransfers = [...singleTransfers, ...batchTransfers];

    // Get timestamps for all unique blocks
    const uniqueBlocks = [...new Set(allTransfers.map(t => t.blockNumber))];
    const blockData = await Promise.all(
      uniqueBlocks.map(blockNumber => provider.getBlock(blockNumber))
    );
    const blockTimestamps = Object.fromEntries(
      blockData.map(block => [block.number, block.timestamp * 1000]) // Convert to milliseconds
    );

    // Add timestamps to transfers
    return allTransfers.map(transfer => ({
      ...transfer,
      timestamp: new Date(blockTimestamps[transfer.blockNumber])
    }));
  } catch (error) {
    console.error('Error fetching transfer events:', error);
    return [];
  }
};

// Helper function to fetch NFT data from Blockscout
const fetchBlockscoutData = async (address, network) => {
  try {
    const baseUrl = network === 'sepolia' 
      ? 'https://eth-sepolia.blockscout.com'
      : 'https://unichain-sepolia.blockscout.com';
    
    // Ensure the address is properly formatted
    const formattedAddress = address?.toLowerCase();
    
    // Get token info first to determine type
    const tokenEndpoint = `/api/v2/tokens/${formattedAddress}`;
    const tokenResponse = await axios.get(`${baseUrl}${tokenEndpoint}`);
    const tokenData = tokenResponse.data;
    
    if (tokenData.type === 'ERC-1155') {
      // For ERC1155, use blockchain events
      const transfers = await fetchTransferEvents(address, network);
      return { transfers, tokenData };
    }
    
    // For other token types, use Blockscout API
    const transfersEndpoint = `/api/v2/tokens/${formattedAddress}/transfers`;
    const transfersResponse = await axios.get(`${baseUrl}${transfersEndpoint}`);
    const transfers = transfersResponse.data.items || [];

    return { transfers, tokenData };
  } catch (error) {
    console.error(`Error fetching ${network} data:`, error);
    return { transfers: [], tokenData: null };
  }
};

// Helper function to format value
const formatValue = (value, mintToken) => {
  try {
    if (!value || value === '0') return '0';
    
    // For custom tokens, we don't need to convert from Wei
    if (mintToken?.type === 'custom' || 
        mintToken?.type === 'usdc' || 
        mintToken?.type === 'usdt') {
      const numValue = Number(value);
      return isNaN(numValue) ? '0' : numValue.toLocaleString('en-US', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
      });
    }
    
    // For native tokens (ETH/MATIC), ensure we're working with a clean number
    const numValue = typeof value === 'string' ? value.replace(/[^0-9.]/g, '') : value;
    if (!numValue || isNaN(Number(numValue))) return '0';
    
    const floatValue = parseFloat(numValue);
    return floatValue.toLocaleString('en-US', {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    });
  } catch (error) {
    console.error('Error formatting value:', error, typeof value, value);
    return '0';
  }
};

// Helper function to process volume data
const processVolumeData = (data, timeRange, collection) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '24h':
      startDate = subHours(now, 24);
      break;
    case '7d':
      startDate = subDays(now, 7);
      break;
    case '30d':
      startDate = subDays(now, 30);
      break;
    default:
      startDate = new Date(0); // All time
  }

  // Group transactions by day
  const volumeByDay = new Map();
  
  data.transfers.forEach(item => {
    const date = startOfDay(new Date(item.timestamp));
    let volume = 0;
    let ethValue = 0;

    try {
      if (item.type === 'ERC-1155') {
        // For ERC1155, use the actual value from the transfer event
        volume = Number(item.value);
        ethValue = volume * (collection?.mintPrice ? Number(collection.mintPrice) : 0);
      } else if (item.token?.type === 'ERC-721') {
        volume = 1; // Each ERC721 transfer is 1 NFT
        ethValue = collection?.mintPrice ? Number(collection.mintPrice) : 0;
      }
      
      if (isWithinInterval(date, { start: startDate, end: now })) {
        const existing = volumeByDay.get(date.getTime()) || { 
          volume: 0, 
          transactions: 0,
          ethVolume: 0
        };
        volumeByDay.set(date.getTime(), {
          volume: existing.volume + volume,
          transactions: existing.transactions + 1,
          ethVolume: existing.ethVolume + ethValue
        });
      }
    } catch (error) {
      console.error('Error processing transfer:', error, item);
    }
  });

  return Array.from(volumeByDay.entries())
    .map(([timestamp, data]) => ({
      date: new Date(timestamp),
      volume: data.volume,
      transactions: data.transactions,
      ethVolume: formatValue(data.ethVolume, collection?.mintToken)
    }))
    .sort((a, b) => a.date - b.date);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1b1f] border border-gray-700 rounded-lg p-3 shadow-lg"
      >
        <p className="text-white font-medium mb-1">
          {format(new Date(label), 'MMM dd, yyyy')}
        </p>
        <p className="text-[#00ffbd] text-sm">
          Volume: {payload[0].value.toLocaleString()} NFTs
        </p>
        <p className="text-gray-400 text-sm">
          <FaEthereum className="inline mr-1" />
          {payload[0].payload.ethVolume} ETH
        </p>
        <p className="text-gray-400 text-sm">
          Transactions: {payload[0].payload.transactions}
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function VolumeMetrics({ contractAddress, network }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const { prices } = useTokenPrices();
  const { symbol } = useParams();
  const [collection, setCollection] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // First get collection data to get mint price
        const collectionData = await getCollection(symbol);
        setCollection(collectionData);

        // Get token logo if it's a custom token
        if (collectionData?.mintToken?.address) {
          const tokenDeployment = await getTokenDeploymentByAddress(collectionData.mintToken.address);
          if (tokenDeployment?.logo) {
            setTokenLogo(tokenDeployment.logo);
          }
        }
        
        // Then get Blockscout data
        const blockscoutData = await fetchBlockscoutData(contractAddress, network);
        const processedData = processVolumeData(blockscoutData, timeRange, collectionData);
        setMetrics(processedData);
      } catch (error) {
        console.error('Error loading volume metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && symbol) {
      loadData();
    }
  }, [contractAddress, network, timeRange, symbol]);

  const renderTokenIcon = () => {
    if (collection?.mintToken?.type === 'custom' && tokenLogo) {
      return (
        <img 
          src={tokenLogo} 
          alt="Token" 
          className="w-5 h-5 mr-1 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png';
          }}
        />
      );
    }
    return <FaEthereum className="mr-1 text-[#00ffbd]" />;
  };

  // Calculate summary metrics
  const totalVolume = metrics.reduce((sum, m) => sum + m.volume, 0);
  const totalEthVolume = metrics.reduce((sum, m) => sum + Number(m.ethVolume.replace(/,/g, '')), 0);
  const totalTransactions = metrics.reduce((sum, m) => sum + m.transactions, 0);
  const avgVolume = totalTransactions > 0 ? totalVolume / totalTransactions : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {TIME_RANGES.map(range => (
          <motion.button
            key={range.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              timeRange === range.value
                ? 'bg-[#00ffbd] text-black font-medium'
                : 'bg-white/10 dark:bg-[#1a1b1f] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {range.label}
          </motion.button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Market Cap</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {renderTokenIcon()}
            {collection?.mintPrice && totalVolume
              ? (totalVolume * Number(collection.mintPrice)).toFixed(4)
              : '0.0000'
            }
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Volume</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalVolume.toLocaleString()} NFTs
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {collection?.mintToken?.type === 'custom' ? collection.mintToken.symbol : 'ETH'} Volume
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {renderTokenIcon()}
            {totalEthVolume.toFixed(4)}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Transactions</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTransactions.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Avg. Per Transaction</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {avgVolume.toFixed(2)} NFTs
          </p>
        </motion.div>
      </div>

      {/* Volume Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800"
      >
        <h3 className="text-gray-900 dark:text-white font-medium mb-4">Volume</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ffbd" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ffbd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
              <XAxis
                dataKey="date"
                tickFormatter={date => format(date, timeRange === '24h' ? 'HH:mm' : 'MMM dd')}
                stroke="#4b5563"
                tick={{ fill: '#4b5563' }}
              />
              <YAxis
                stroke="#4b5563"
                tickFormatter={value => `${value} NFTs`}
                tick={{ fill: '#4b5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#00ffbd"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                animationDuration={1000}
                animationBegin={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {metrics.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 dark:text-gray-400">No volume data available</div>
        </motion.div>
      )}
    </div>
  );
} 