import React, { useState, useEffect } from 'react';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';

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
};

const formatAddress = (address) => {
  if (typeof address !== 'string') return 'Invalid Address';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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

        const baseUrl = ALCHEMY_URLS[collection.network || 'sepolia'];
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

    if (collection) {
      loadData();
    }
  }, [collection]);

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

  const totalQuantity = holders.reduce((sum, holder) => sum + holder.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Unique Holders</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{holders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Top 10 Hold</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalQuantity > 0 ? 
              ((holders.slice(0, 10).reduce((sum, h) => sum + h.quantity, 0) / totalQuantity) * 100).toFixed(1) 
              : '0'}%
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Avg. Per Holder</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {holders.length > 0 ? (totalQuantity / holders.length).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      {/* Holders List */}
      <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-4">Top Holders</h3>
        <div className="space-y-4 overflow-y-auto max-h-[400px]">
          {holders.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No holders data yet
            </div>
          ) : (
            holders.map((holder, index) => (
              <div 
                key={holder.holderAddress} 
                className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 dark:text-gray-400 w-8">#{index + 1}</span>
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
                      <BiCopy size={14} />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
} 