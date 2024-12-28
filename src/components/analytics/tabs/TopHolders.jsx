import React, { useState, useEffect } from 'react';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { FaCrown } from 'react-icons/fa';
import { RiMedalFill } from 'react-icons/ri';
import { ethers } from 'ethers';

// Get API key from environment variables
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Add error checking for API key
if (!ALCHEMY_API_KEY) {
  console.error('VITE_ALCHEMY_API_KEY is not set in environment variables');
}

const ALCHEMY_URLS = {
  'ethereum': 'https://eth-mainnet.g.alchemy.com/v2/',
  'sepolia': 'https://eth-sepolia.g.alchemy.com/v2/',
  'polygon': 'https://polygon-mainnet.g.alchemy.com/v2/',
  'mumbai': 'https://polygon-mumbai.g.alchemy.com/v2/',
  'arbitrum': 'https://arb-mainnet.g.alchemy.com/v2/',
  'optimism': 'https://opt-mainnet.g.alchemy.com/v2/',
  'unichain': 'https://unichain-sepolia.g.alchemy.com/v2/',
};

const formatAddress = (address) => {
  if (!address || typeof address !== 'string') return 'Invalid Address';
  // Ensure the address is properly formatted with 0x prefix
  const formattedAddress = address.startsWith('0x') ? address : `0x${address}`;
  return `${formattedAddress.substring(0, 6)}...${formattedAddress.substring(formattedAddress.length - 4)}`;
};

const getBadgeIcon = (index) => {
  switch (index) {
    case 0:
      return <FaCrown className="text-yellow-400" size={24} />;
    case 1:
      return <RiMedalFill className="text-gray-300" size={24} />;
    case 2:
      return <RiMedalFill className="text-amber-600" size={24} />;
    default:
      return null;
  }
};

const CustomTooltip = ({ active, payload, type }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1b1f] p-2 rounded-lg border border-gray-800">
        {type === 'pie' ? (
          <p className="text-[#00ffbd] text-xs">{`${payload[0].name}: ${payload[0].value} NFTs`}</p>
        ) : type === 'bar' ? (
          <div className="text-xs">
            <p className="text-white">{payload[0].payload.label}</p>
            <p className="text-[#00ffbd]">{payload[0].value} holders</p>
          </div>
        ) : (
          <p className="text-[#00ffbd] text-xs">{`${payload[0].value} NFTs`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function TopHolders({ collection }) {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check for API key first
        if (!ALCHEMY_API_KEY) {
          throw new Error('Alchemy API key is not configured');
        }

        if (!collection?.contractAddress) {
          throw new Error('No contract address available');
        }

        // Special handling for Unichain
        if (collection.network === 'unichain') {
          await loadUnichainHolders(collection.contractAddress);
          return;
        }

        // Map network name to Alchemy URL key for other networks
        const networkKey = collection.network === 'polygon' ? 'polygon' : 'sepolia';
        
        const baseUrl = ALCHEMY_URLS[networkKey];
        if (!baseUrl) {
          throw new Error(`Unsupported network: ${collection.network}`);
        }

        const contractAddress = collection.contractAddress;
        console.log('Using contract address:', contractAddress);

        const alchemyUrl = `${baseUrl}${ALCHEMY_API_KEY}/getOwnersForCollection?contractAddress=${contractAddress}&withTokenBalances=true`;
        const response = await fetch(alchemyUrl);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Alchemy API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        if (!data?.ownerAddresses) {
          throw new Error('Invalid response format from Alchemy API');
        }

        const holdersData = data.ownerAddresses
          .filter(owner => owner && typeof owner === 'object' && owner.ownerAddress)
          .map(owner => ({
            holderAddress: owner.ownerAddress,
            quantity: Array.isArray(owner.tokenBalances) 
              ? owner.tokenBalances.reduce((sum, token) => sum + Number(token.balance || 0), 0)
              : 0
          }))
          .filter(holder => holder.quantity > 0)
          .sort((a, b) => b.quantity - a.quantity);

        setHolders(holdersData);
        setError(null);
      } catch (error) {
        console.error('Error loading holders:', error);
        setError(error.message);
        toast.error(`Failed to load top holders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    // Function to load ERC721 holders
    const loadERC721Holders = async (contractAddress, provider) => {
      console.log('Processing ERC721 collection');
      const erc721Interface = ['event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'];
      const erc721Contract = new ethers.Contract(contractAddress, erc721Interface, provider);
      
      const events = await erc721Contract.queryFilter('Transfer', 0, 'latest');
      console.log('Found ERC721 transfer events:', events.length);
      
      // Track current token ownership
      const tokenOwners = new Map();
      for (const event of events) {
        const { to, tokenId } = event.args;
        tokenOwners.set(tokenId.toString(), to);
      }

      // Create a map of addresses to their token counts
      const holdersMap = new Map();
      for (const owner of tokenOwners.values()) {
        if (owner !== '0x0000000000000000000000000000000000000000') {
          const currentCount = holdersMap.get(owner) || 0;
          holdersMap.set(owner, currentCount + 1);
        }
      }

      // Convert to our format and sort
      return Array.from(holdersMap.entries())
        .map(([address, quantity]) => ({
          holderAddress: address,
          quantity
        }))
        .filter(holder => 
          holder.quantity > 0 && 
          holder.holderAddress !== '0x0000000000000000000000000000000000000000'
        )
        .sort((a, b) => b.quantity - a.quantity);
    };

    // Function to load ERC1155 holders
    const loadERC1155Holders = async (contractAddress, provider) => {
      console.log('Processing ERC1155 collection');
      const erc1155Interface = [
        'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
        'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)'
      ];
      
      const erc1155Contract = new ethers.Contract(contractAddress, erc1155Interface, provider);
      
      // Track balances for ERC1155
      const balances = new Map();
      
      // Get and process TransferSingle events
      const singleEvents = await erc1155Contract.queryFilter('TransferSingle', 0, 'latest');
      console.log('Found ERC1155 TransferSingle events:', singleEvents.length);
      
      for (const event of singleEvents) {
        const { from, to, value } = event.args;
        
        if (from !== '0x0000000000000000000000000000000000000000') {
          const fromBalance = balances.get(from) || 0;
          balances.set(from, Math.max(0, fromBalance - Number(value)));
        }
        
        if (to !== '0x0000000000000000000000000000000000000000') {
          const toBalance = balances.get(to) || 0;
          balances.set(to, toBalance + Number(value));
        }
      }

      // Get and process TransferBatch events
      const batchEvents = await erc1155Contract.queryFilter('TransferBatch', 0, 'latest');
      console.log('Found ERC1155 TransferBatch events:', batchEvents.length);
      
      for (const event of batchEvents) {
        const { from, to, values } = event.args;
        
        for (let i = 0; i < values.length; i++) {
          if (from !== '0x0000000000000000000000000000000000000000') {
            const fromBalance = balances.get(from) || 0;
            balances.set(from, Math.max(0, fromBalance - Number(values[i])));
          }
          
          if (to !== '0x0000000000000000000000000000000000000000') {
            const toBalance = balances.get(to) || 0;
            balances.set(to, toBalance + Number(values[i]));
          }
        }
      }

      // Convert balances to our format
      return Array.from(balances.entries())
        .map(([address, quantity]) => ({
          holderAddress: address,
          quantity
        }))
        .filter(holder => 
          holder.quantity > 0 && 
          holder.holderAddress !== '0x0000000000000000000000000000000000000000'
        )
        .sort((a, b) => b.quantity - a.quantity);
    };

    // Function to load Unichain holders using ethers.js
    const loadUnichainHolders = async (contractAddress) => {
      try {
        // Initialize ethers provider for Unichain Sepolia
        const provider = new ethers.JsonRpcProvider('https://sepolia.unichain.org');
        
        // Debug log to see what type we're getting
        console.log('Collection data:', {
          type: collection.type,
          tokenType: collection.tokenType,
          contractType: collection.contractType,
          collection
        });

        // Check for ERC1155 in multiple possible properties and formats
        const isERC1155 = collection.type?.toUpperCase().replace('-', '') === 'ERC1155' || 
                         collection.tokenType?.toUpperCase().replace('-', '') === 'ERC1155' ||
                         collection.contractType?.toUpperCase().replace('-', '') === 'ERC1155';
        
        console.log('Is ERC1155?', isERC1155);
        
        let holdersData;
        if (isERC1155) {
          holdersData = await loadERC1155Holders(contractAddress, provider);
          console.log('Processed ERC1155 holders:', holdersData);
        } else {
          holdersData = await loadERC721Holders(contractAddress, provider);
          console.log('Processed ERC721 holders:', holdersData);
        }

        setHolders(holdersData);
        setError(null);
      } catch (error) {
        console.error('Error loading Unichain holders:', error);
        setError(error.message);
        toast.error(`Failed to load holders: ${error.message}`);
      }
    };

    if (collection) {
      loadData();
    }
  }, [collection]);

  const prepareChartData = (holdersData) => {
    const totalNFTs = holdersData.reduce((sum, h) => sum + h.quantity, 0);
    const maxNFTs = Math.max(...holdersData.map(h => h.quantity));
    
    // Create dynamic ranges based on the maximum NFT count
    const createDynamicRanges = (max) => {
      if (max <= 5) {
        return [
          { min: 1, max: 1, label: '1 NFT' },
          { min: 2, max: 3, label: '2-3 NFTs' },
          { min: 4, max: 5, label: '4-5 NFTs' }
        ];
      } else if (max <= 10) {
        return [
          { min: 1, max: 2, label: '1-2 NFTs' },
          { min: 3, max: 5, label: '3-5 NFTs' },
          { min: 6, max: 10, label: '6-10 NFTs' }
        ];
      } else if (max <= 20) {
        return [
          { min: 1, max: 5, label: '1-5 NFTs' },
          { min: 6, max: 10, label: '6-10 NFTs' },
          { min: 11, max: 20, label: '11-20 NFTs' }
        ];
      } else {
        const step = Math.ceil(max / 4); // Split into 4 ranges
        return [
          { min: 1, max: step, label: `1-${step} NFTs` },
          { min: step + 1, max: step * 2, label: `${step + 1}-${step * 2} NFTs` },
          { min: step * 2 + 1, max: step * 3, label: `${step * 2 + 1}-${step * 3} NFTs` },
          { min: step * 3 + 1, max: max, label: `${step * 3 + 1}+ NFTs` }
        ];
      }
    };

    const ranges = createDynamicRanges(maxNFTs);
    
    // Distribution data for unique holders (bar chart)
    const distributionData = ranges.map(range => ({
      name: range.label,
      label: range.label,
      value: holdersData.filter(h => 
        h.quantity >= range.min && h.quantity <= range.max
      ).length
    })).filter(d => d.value > 0);

    // Top 10 holders data (pie chart)
    const top10Data = holdersData.slice(0, 10).map(h => ({
      name: formatAddress(h.holderAddress),
      value: h.quantity
    }));

    // Cumulative distribution (area chart)
    const cumulativeData = holdersData.map((h, i) => ({
      name: i,
      value: holdersData.slice(0, i + 1).reduce((sum, h) => sum + h.quantity, 0)
    }));

    return { distributionData, top10Data, cumulativeData };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 dark:text-red-400 mb-2">Error loading holders data</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{error}</div>
      </div>
    );
  }

  const { distributionData, top10Data, cumulativeData } = prepareChartData(holders);
  const totalQuantity = holders.reduce((sum, holder) => sum + holder.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Unique Holders</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{holders.length}</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={distributionData} 
                barSize={24}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={false}
                />
                <Tooltip 
                  content={props => <CustomTooltip {...props} type="bar" />}
                  cursor={{ fill: 'rgba(0, 255, 189, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#00ffbd"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Holder distribution by NFT count</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Top 10 Hold</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {totalQuantity > 0 ? 
              ((holders.slice(0, 10).reduce((sum, h) => sum + h.quantity, 0) / totalQuantity) * 100).toFixed(1) 
              : '0'}%
          </p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top10Data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                >
                  {top10Data.map((entry, index) => (
                    <Cell key={index} fill={`hsl(166, 100%, ${50 + (index * 5)}%)`} />
                  ))}
                </Pie>
                <Tooltip content={props => <CustomTooltip {...props} type="pie" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Top 10 holders by NFT count</p>
        </div>

        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Avg. Per Holder</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {holders.length > 0 ? (totalQuantity / holders.length).toFixed(1) : '0'}
          </p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffbd" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ffbd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip content={props => <CustomTooltip {...props} />} />
                <Area type="monotone" dataKey="value" stroke="#00ffbd" fill="url(#avgGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Cumulative NFT distribution</p>
        </div>
      </div>

      {/* Holders List */}
      <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Top Holders</h3>
        <div className="space-y-4">
          {holders.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No holders data yet
            </div>
          ) : (
            <div 
              className="overflow-y-auto" 
              style={{ 
                maxHeight: holders.length > 5 ? '250px' : 'auto',
                paddingRight: holders.length > 5 ? '8px' : '0',
                scrollbarWidth: 'thin',
                scrollbarColor: '#00ffbd transparent',
              }}
              css={`
                &::-webkit-scrollbar {
                  width: 4px;
                }
                &::-webkit-scrollbar-track {
                  background: transparent;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: #00ffbd;
                  border-radius: 20px;
                }
              `}
            >
              {holders.map((holder, index) => (
                <div 
                  key={holder.holderAddress} 
                  className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[40px]">
                      <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      {getBadgeIcon(index)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatAddress(holder.holderAddress)}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(holder.holderAddress);
                          toast.success('Address copied!');
                        }}
                        className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                      >
                        <BiCopy size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400">{holder.quantity} NFTs</span>
                    <span className="text-[#00ffbd] w-16 text-right">
                      {((holder.quantity / totalQuantity) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 