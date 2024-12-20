import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from './uniswap';

// Pair ABI for swap events
const PAIR_ABI = [
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
];

const VOLUME_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache for volumes

export class VolumeTracker {
  constructor() {
    this.volumeCache = new Map();
    this.lastCacheUpdate = 0;
    this.loadCacheFromStorage();
  }

  loadCacheFromStorage() {
    try {
      const cached = localStorage.getItem('volumeCache');
      if (cached) {
        const { volumes, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < VOLUME_CACHE_DURATION) {
          this.volumeCache = new Map(Object.entries(volumes));
          this.lastCacheUpdate = timestamp;
        }
      }
    } catch (error) {
      console.warn('Error loading volume cache:', error);
    }
  }

  saveCacheToStorage() {
    try {
      const volumes = Object.fromEntries(this.volumeCache);
      localStorage.setItem('volumeCache', JSON.stringify({
        volumes,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Error saving volume cache:', error);
    }
  }

  isStablecoin(tokenAddress) {
    const stablecoins = [
      UNISWAP_ADDRESSES.USDC.toLowerCase(),
      UNISWAP_ADDRESSES.USDT.toLowerCase()
    ];
    return stablecoins.includes(tokenAddress.toLowerCase());
  }

  getTokenPrice(reserves, token0Address, token1Address, token0Decimals, token1Decimals) {
    // Convert reserves to decimal format
    const reserve0 = Number(ethers.formatUnits(reserves[0], token0Decimals));
    const reserve1 = Number(ethers.formatUnits(reserves[1], token1Decimals));

    // If token0 is a stablecoin, price of token1 = reserve0/reserve1
    if (this.isStablecoin(token0Address)) {
      return reserve0 / reserve1;
    }
    // If token1 is a stablecoin, price of token0 = reserve1/reserve0
    if (this.isStablecoin(token1Address)) {
      return reserve1 / reserve0;
    }
    // If neither is a stablecoin, return 0 (we can't price it accurately)
    return 0;
  }

  async getPoolVolumes(pairAddress, pairContract, token0Decimals, token1Decimals) {
    try {
      // Check cache first
      const cacheKey = pairAddress.toLowerCase();
      const cachedData = this.volumeCache.get(cacheKey);
      const now = Date.now();

      if (cachedData && (now - cachedData.timestamp < VOLUME_CACHE_DURATION)) {
        console.log('Returning volume data from cache for:', pairAddress);
        return cachedData;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get current block
      const currentBlock = await provider.getBlockNumber();
      const currentBlockData = await provider.getBlock(currentBlock);

      // Get token addresses
      const [token0Address, token1Address] = await Promise.all([
        pairContract.token0(),
        pairContract.token1()
      ]);

      // Calculate block ranges for different periods
      const blocksPerDay = 7200; // ~12 seconds per block
      const oneDayBlocks = blocksPerDay;
      const sevenDayBlocks = blocksPerDay * 7;
      const thirtyDayBlocks = blocksPerDay * 30;

      // Get swap events for each period in parallel
      const swapFilter = pairContract.filters.Swap();
      
      const [oneDayEvents, sevenDayEvents, thirtyDayEvents, reserves] = await Promise.all([
        pairContract.queryFilter(swapFilter, currentBlock - oneDayBlocks, currentBlock),
        pairContract.queryFilter(swapFilter, currentBlock - sevenDayBlocks, currentBlock),
        pairContract.queryFilter(swapFilter, currentBlock - thirtyDayBlocks, currentBlock),
        pairContract.getReserves()
      ]);

      // Get token prices
      const token0Price = this.getTokenPrice(
        reserves,
        token0Address,
        token1Address,
        token0Decimals,
        token1Decimals
      );

      // Calculate volumes
      const calculateVolume = (events) => {
        let volume = 0;
        for (const event of events) {
          let eventVolume = 0;
          
          // Get amounts from the event
          const amount0In = Number(ethers.formatUnits(event.args.amount0In, token0Decimals));
          const amount0Out = Number(ethers.formatUnits(event.args.amount0Out, token0Decimals));
          const amount1In = Number(ethers.formatUnits(event.args.amount1In, token1Decimals));
          const amount1Out = Number(ethers.formatUnits(event.args.amount1Out, token1Decimals));

          // If token0 is a stablecoin, use its amounts directly
          if (this.isStablecoin(token0Address)) {
            eventVolume = amount0In + amount0Out;
          }
          // If token1 is a stablecoin, use its amounts directly
          else if (this.isStablecoin(token1Address)) {
            eventVolume = amount1In + amount1Out;
          }
          // If we have a price for token0, use that
          else if (token0Price > 0) {
            const token0Amount = amount0In + amount0Out;
            eventVolume = token0Amount * token0Price;
          }
          // If no stablecoin and no price, we can't calculate volume
          else {
            continue;
          }

          volume += eventVolume;
        }
        return volume;
      };

      const volumeData = {
        oneDayVolume: calculateVolume(oneDayEvents),
        sevenDayVolume: calculateVolume(sevenDayEvents),
        thirtyDayVolume: calculateVolume(thirtyDayEvents),
        oneDayTxCount: oneDayEvents.length,
        sevenDayTxCount: sevenDayEvents.length,
        thirtyDayTxCount: thirtyDayEvents.length,
        timestamp: now
      };

      // Update cache
      this.volumeCache.set(cacheKey, volumeData);
      this.saveCacheToStorage();

      console.log('Volume data for pool:', pairAddress, volumeData);
      return volumeData;
    } catch (error) {
      console.error('Error calculating pool volumes:', error);
      return {
        oneDayVolume: 0,
        sevenDayVolume: 0,
        thirtyDayVolume: 0,
        oneDayTxCount: 0,
        sevenDayTxCount: 0,
        thirtyDayTxCount: 0,
        timestamp: Date.now()
      };
    }
  }
} 