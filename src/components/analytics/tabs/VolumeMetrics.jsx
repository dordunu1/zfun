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
import { ethers } from 'ethers';

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

// Network RPC URLs
const NETWORK_RPC_URLS = {
  'moonwalker': 'https://moonwalker-rpc.eu-north-2.gateway.fm',
  'unichain': 'https://sepolia.unichain.org',
  'unichain-mainnet': 'https://unichain.blockscout.com'
};

// Helper function to get provider based on network/chainId
const getProvider = (network, chainId) => {
  if (chainId === 130) {
    return new ethers.JsonRpcProvider('https://unichain.blockscout.com');
  } else if (chainId === 1301) {
    return new ethers.JsonRpcProvider('https://sepolia.unichain.org');
  } else if (network === 'moonwalker' || chainId === 1828369849) {
    return new ethers.JsonRpcProvider(NETWORK_RPC_URLS.moonwalker);
  }
  return new ethers.BrowserProvider(window.ethereum);
};

// Helper function to get explorer URL
const getExplorerUrl = (network, chainId) => {
  if (chainId === 130) {
    return 'https://unichain.blockscout.com';
  } else if (chainId === 1301) {
    return 'https://unichain-sepolia.blockscout.com';
  } else if (network === 'moonwalker' || chainId === 1828369849) {
    return 'https://moonwalker-blockscout.eu-north-2.gateway.fm';
  } else if (network === 'polygon' || chainId === 137) {
    return 'https://polygon.blockscout.com';
  }
  return 'https://sepolia.etherscan.io';
};

const fetchTransferEvents = async (address, network, chainId) => {
  try {
    // Get the appropriate provider
    const provider = getProvider(network, chainId);
    
    // Create contract instance
    const contract = new ethers.Contract(address, ERC1155_ABI, provider);
    
    // Get the current block
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000); // Last 10000 blocks
    
    console.log('Fetching transfer events:', {
      network,
      chainId,
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
    throw error;
  }
};

const fetchPolygonData = async (address) => {
  try {
    const apiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY;
    if (!apiKey) {
      throw new Error('Polygonscan API key not found in environment variables');
    }

    // First, determine if this is an ERC721 or ERC1155
    const abiResponse = await fetch(`/polygon-api/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`);
    const abiData = await abiResponse.json();
    
    let isERC1155 = false;
    if (abiData.status === '1') {
      const abi = JSON.parse(abiData.result);
      isERC1155 = abi.some(item => 
        item.type === 'event' && 
        (item.name === 'TransferBatch' || item.name === 'TransferSingle')
      );
    }

    console.log('Contract type:', isERC1155 ? 'ERC1155' : 'ERC721');

    // Get token transfers based on contract type
    const transfersResponse = await fetch(`/polygon-api/api`, {
      params: {
        module: 'account',
        action: isERC1155 ? 'token1155tx' : 'tokennfttx', // Use tokennfttx for NFT transfers
        address: address,
        apikey: apiKey,
        sort: 'desc',
        startblock: 0,
        endblock: 99999999
      }
    });

    const data = await transfersResponse.json();
    console.log('Polygon transfer data:', data);

    if (data.status === '1' && data.result) {
      // Transform the data to match our expected format
      const transfers = data.result.map(tx => ({
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        type: isERC1155 ? 'ERC-1155' : 'ERC-721',
        value: isERC1155 ? tx.tokenValue : '1', // For ERC721, each transfer is 1 NFT
        blockNumber: parseInt(tx.blockNumber),
        from: tx.from.toLowerCase(),
        to: tx.to.toLowerCase()
      }));
      
      // Filter out self-transfers and only count actual transfers
      const validTransfers = transfers.filter(tx => 
        tx.from !== tx.to && // Exclude self-transfers
        tx.from !== '0x0000000000000000000000000000000000000000' // Include mints
      );

      return { 
        transfers: validTransfers, 
        tokenData: { 
          type: isERC1155 ? 'ERC-1155' : 'ERC-721'
        } 
      };
    }
    
    if (data.status === '0' && data.message === 'No transactions found') {
      console.log('No transactions found for address:', address);
    }
    
    return { transfers: [], tokenData: null };
  } catch (error) {
    console.error('Error fetching Polygon data:', error);
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Detailed error:', errorMessage);
    
    if (error.message.includes('CORS')) {
      console.error('CORS error detected. Please ensure CORS is properly configured');
    }
    
    throw error;
  }
};

const fetchBlockscoutData = async (address, network, chainId) => {
  try {
    const baseUrl = getExplorerUrl(network, chainId);
    console.log('Using Blockscout URL:', baseUrl);
    
    // Ensure the address is properly formatted
    const formattedAddress = address?.toLowerCase();
    
    // Get token info first to determine type
    const tokenEndpoint = `/api/v2/tokens/${formattedAddress}`;
    console.log('Fetching token info from:', `${baseUrl}${tokenEndpoint}`);
    const tokenResponse = await axios.get(`${baseUrl}${tokenEndpoint}`);
    const tokenData = tokenResponse.data;
    
    if (tokenData.type === 'ERC-1155') {
      // For ERC1155, use blockchain events
      const transfers = await fetchTransferEvents(address, network, chainId);
      return { transfers, tokenData };
    }
    
    // For other token types (ERC721), use Blockscout API
    const transfersEndpoint = `/api/v2/tokens/${formattedAddress}/transfers`;
    console.log('Fetching transfers from:', `${baseUrl}${transfersEndpoint}`);
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
  
  // Ensure data is an array before processing
  const transfers = Array.isArray(data) ? data : [];
  
  transfers.forEach(item => {
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

const CustomTooltip = ({ active, payload, label, collection, tokenLogo }) => {
  if (active && payload && payload.length) {
    const renderTokenIcon = () => {
      const tokenAddress = collection?.mintToken?.address?.toLowerCase();

      // Check for ZERO token by address first
      if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
        return <img src="/Zero.png" alt="ZERO" className="inline-block w-4 h-4 mr-1" />;
      }

      const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';
      if (isNativeToken) {
        if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) {
          return <img src="/Zero.png" alt="ZERO" className="inline-block w-4 h-4 mr-1" />;
        }
        if (collection?.network === 'polygon') {
          return <img src="/polygon.png" alt="POL" className="inline-block w-4 h-4 mr-1" />;
        }
        return <FaEthereum className="inline mr-1" />;
      }

      // For custom tokens
      if (collection?.mintToken?.type === 'custom' && tokenLogo) {
        return (
          <img 
            src={tokenLogo} 
            alt="Token" 
            className="inline-block w-4 h-4 mr-1 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.png';
            }}
          />
        );
      }

      return <FaEthereum className="inline mr-1" />;
    };

    const getTokenSymbol = () => {
      const tokenAddress = collection?.mintToken?.address?.toLowerCase();

      // Check for ZERO token by address first
      if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
        return 'ZERO';
      }

      const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';
      if (isNativeToken) {
        if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) {
          return 'ZERO';
        }
        if (collection?.network === 'polygon') {
          return 'POL';
        }
        return 'ETH';
      }

      return collection?.mintToken?.type === 'custom' ? collection.mintToken.symbol : 'ETH';
    };

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
        <p className="text-gray-400 text-sm flex items-center">
          {renderTokenIcon()}
          {payload[0].payload.ethVolume} {getTokenSymbol()}
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
  const [volumeData, setVolumeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const { prices } = useTokenPrices();
  const { symbol } = useParams();
  const [collection, setCollection] = useState(null);
  const [tokenLogo, setTokenLogo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get collection data first
        const collectionData = await getCollection(symbol);
        setCollection(collectionData);

        // Get the chainId from collection data
        const chainId = collectionData?.chainId;

        console.log('Loading volume data for:', {
          network,
          chainId,
          contractAddress
        });

        // Fetch data from Blockscout
        const { transfers, tokenData } = await fetchBlockscoutData(contractAddress, network, chainId);
        
        // Process volume data
        if (transfers && transfers.length > 0) {
          const processedData = processVolumeData(transfers, timeRange, collectionData);
          setVolumeData(processedData);
        } else {
          setVolumeData([]);
        }

        // Fetch token logo if available
        if (collectionData?.mintToken?.address) {
          const tokenDeployment = await getTokenDeploymentByAddress(collectionData.mintToken.address);
          if (tokenDeployment?.logo) {
            setTokenLogo(tokenDeployment.logo);
          }
        }
      } catch (error) {
        console.error('Error loading volume metrics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && symbol) {
      loadData();
    }
  }, [contractAddress, network, timeRange, symbol]);

  const renderTokenIcon = () => {
    const tokenAddress = collection?.mintToken?.address?.toLowerCase();

    // Check for ZERO token by address first
    if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
      return <img src="/Zero.png" alt="ZERO" className="inline-block w-4 h-4 mr-1" />;
    }

    const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';
    if (isNativeToken) {
      if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) {
        return <img src="/Zero.png" alt="ZERO" className="inline-block w-4 h-4 mr-1" />;
      }
      if (collection?.network === 'polygon') {
        return <img src="/polygon.png" alt="POL" className="inline-block w-4 h-4 mr-1" />;
      }
      return <FaEthereum className="inline mr-1" />;
    }

    // For custom tokens
    if (collection?.mintToken?.type === 'custom' && tokenLogo) {
      return (
        <img 
          src={tokenLogo} 
          alt="Token" 
          className="inline-block w-4 h-4 mr-1 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png';
          }}
        />
      );
    }

    return <FaEthereum className="inline mr-1" />;
  };

  // Calculate summary metrics
  const totalVolume = volumeData.reduce((sum, m) => sum + m.volume, 0);
  const totalEthVolume = volumeData.reduce((sum, m) => sum + Number(m.ethVolume.replace(/,/g, '')), 0);
  const totalTransactions = volumeData.reduce((sum, m) => sum + m.transactions, 0);
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
            {(() => {
              const tokenAddress = collection?.mintToken?.address?.toLowerCase();
              if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') return 'ZERO';
              
              const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';
              if (isNativeToken) {
                if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) return 'ZERO';
                if (collection?.network === 'polygon') return 'POL';
                return 'ETH';
              }
              
              return collection?.mintToken?.type === 'custom' ? collection.mintToken.symbol : 'ETH';
            })()} Volume
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
            <AreaChart data={volumeData}>
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
              <Tooltip content={<CustomTooltip collection={collection} tokenLogo={tokenLogo} />} />
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

      {volumeData.length === 0 && (
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