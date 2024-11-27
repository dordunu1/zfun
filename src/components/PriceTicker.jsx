import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TOKENS = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'ripple': 'XRP',
  'cardano': 'ADA',
  'solana': 'SOL',
  'polkadot': 'DOT',
  'dogecoin': 'DOGE',
  'avalanche-2': 'AVAX',
  'chainlink': 'LINK',
  'polygon': 'MATIC',
  'uniswap': 'UNI',
  'stellar': 'XLM',
  'cosmos': 'ATOM',
  'internet-computer': 'ICP',
  'filecoin': 'FIL',
  'ethereum-classic': 'ETC',
  'monero': 'XMR',
  'bitcoin-cash': 'BCH',
  'litecoin': 'LTC'
};

export default function PriceTicker() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price', {
            params: {
              ids: Object.keys(TOKENS).join(','),
              vs_currencies: 'usd',
              include_24hr_change: true
            }
          }
        );
        
        const formattedPrices = Object.entries(response.data).map(([id, data]) => ({
          id,
          symbol: TOKENS[id],
          price: data.usd,
          change24h: data.usd_24h_change
        }));
        
        setPrices(formattedPrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="flex-1 overflow-hidden">
      <div className="relative flex items-center">
        <div className="animate-ticker flex items-center gap-6 whitespace-nowrap">
          {[...prices, ...prices].map((coin, index) => (
            <div 
              key={`${coin.id}-${index}`}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {coin.symbol}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs ${
                coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {coin.change24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 