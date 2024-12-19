import { useState, useEffect } from 'react';
import { ChainlinkService } from '../services/chainlink';

export function useTokenPrices() {
  const [prices, setPrices] = useState({
    ETH: null,
    USDC: null,
    USDT: null
  });

  useEffect(() => {
    const chainlinkService = new ChainlinkService();
    let mounted = true;

    async function updatePrices() {
      try {
        const [ethPrice, usdcPrice, usdtPrice] = await Promise.all([
          chainlinkService.getETHPrice(),
          chainlinkService.getUSDCPrice(),
          chainlinkService.getUSDTPrice()
        ]);

        if (mounted) {
          setPrices({
            ETH: ethPrice,
            USDC: usdcPrice,
            USDT: usdtPrice
          });
        }
      } catch (error) {
        console.error('Error fetching token prices:', error);
      }
    }

    // Update prices immediately and then every 30 seconds
    updatePrices();
    const interval = setInterval(updatePrices, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const calculateUSDValue = async (token, amount) => {
    try {
      const chainlinkService = new ChainlinkService();
      return chainlinkService.calculateUSDValue(token.address, amount, token.decimals);
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return null;
    }
  };

  const formatUSD = (value) => {
    if (value === null || value === undefined) return '---';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return {
    prices,
    calculateUSDValue,
    formatUSD
  };
} 