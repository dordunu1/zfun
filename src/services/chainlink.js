import { ethers } from 'ethers';
import { UniswapService } from './uniswap';

// Chainlink Price Feed Addresses for different networks
export const CHAINLINK_FEEDS = {
  // Sepolia Testnet
  11155111: {
    ETH_USD: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    USDC_USD: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E',
    USDT_USD: '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E'
  },
  // Ethereum Mainnet
  1: {
    ETH_USD: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    USDC_USD: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    USDT_USD: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D'
  },
  // Polygon Mainnet
  137: {
    ETH_USD: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    USDC_USD: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
    USDT_USD: '0x0A6513e40db6EB1b165753AD52E80663aeA50545'
  },
  // BSC Mainnet
  56: {
    ETH_USD: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e',
    USDC_USD: '0x51597f405303C4377E36123cBc172b13269EA163',
    USDT_USD: '0xB97Ad0E74fa7d920791E90258A6E2085088b4320'
  },
  // Arbitrum One
  42161: {
    ETH_USD: '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
    USDC_USD: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3',
    USDT_USD: '0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7'
  },
  // Optimism
  10: {
    ETH_USD: '0x13e3Ee699D1909E989722E753853AE30b17e08c5',
    USDC_USD: '0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3',
    USDT_USD: '0xECef79E109e997bCA29c1c0897ec9d7b03647F5E'
  },
  // Unichain (using Optimism feeds since it's OP Stack based)
  1301: {
    ETH_USD: '0x13e3Ee699D1909E989722E753853AE30b17e08c5',
    USDC_USD: '0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3',
    USDT_USD: '0xECef79E109e997bCA29c1c0897ec9d7b03647F5E'
  }
};

// Stablecoin addresses for different networks
export const STABLECOINS = {
  // Sepolia Testnet
  11155111: {
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    USDT: '0x148b1ab3e2321d79027c4b71b6118e70434b4784'
  },
  // Ethereum Mainnet
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  // Polygon Mainnet
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  },
  // BSC Mainnet
  56: {
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDT: '0x55d398326f99059fF775485246999027B3197955'
  },
  // Arbitrum One
  42161: {
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
  },
  // Optimism
  10: {
    USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
  },
  // Unichain
  1301: {
    USDC: '0x9c891326Fd8b1a713982003a9733F03707103837', // Add your actual USDC address
    USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844'  // Add your actual USDT address
  }
};

// AggregatorV3Interface ABI for Price Feeds
const AGGREGATOR_ABI = [
  'function decimals() external view returns (uint8)',
  'function description() external view returns (string)',
  'function version() external view returns (uint256)',
  'function getRoundData(uint80 _roundId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
];

export class ChainlinkService {
  constructor() {
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.uniswap = new UniswapService();
    this.chainId = null;
  }

  async init() {
    if (!this.chainId) {
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
      console.log('ChainlinkService initialized for chain:', this.chainId);
    }
  }

  async getLatestPrice(feedAddress) {
    try {
      // Use Optimism RPC for price feeds since we're using Optimism's feeds
      const optimismProvider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
      const aggregator = new ethers.Contract(
        feedAddress,
        AGGREGATOR_ABI,
        optimismProvider
      );
      const [roundData] = await Promise.all([
        aggregator.latestRoundData(),
      ]);
      const price = Number(roundData.answer) / 1e8;
      return price;
    } catch (error) {
      console.error('Error getting latest price:', error);
      return null;
    }
  }

  async getETHPrice() {
    await this.init();
    const feeds = CHAINLINK_FEEDS[this.chainId];
    if (!feeds?.ETH_USD) {
      console.warn('No ETH/USD price feed found for chain:', this.chainId);
      return null;
    }
    return this.getLatestPrice(feeds.ETH_USD);
  }

  async getUSDCPrice() {
    await this.init();
    const feeds = CHAINLINK_FEEDS[this.chainId];
    if (!feeds?.USDC_USD) {
      console.warn('No USDC/USD price feed found for chain:', this.chainId);
      return 1; // Assume 1:1 if no feed available
    }
    return this.getLatestPrice(feeds.USDC_USD);
  }

  async getUSDTPrice() {
    await this.init();
    const feeds = CHAINLINK_FEEDS[this.chainId];
    if (!feeds?.USDT_USD) {
      console.warn('No USDT/USD price feed found for chain:', this.chainId);
      return 1; // Assume 1:1 if no feed available
    }
    return this.getLatestPrice(feeds.USDT_USD);
  }

  async getPriceFromStablePair(tokenAddress) {
    await this.init();
    const stablecoins = STABLECOINS[this.chainId];
    if (!stablecoins) {
      console.warn('No stablecoin addresses found for chain:', this.chainId);
      return null;
    }

    // Try USDC pool first
    try {
      const usdcPool = await this.uniswap.getPoolInfo(tokenAddress, stablecoins.USDC);
      if (usdcPool && usdcPool.reserve0 && usdcPool.reserve1) {
        console.log('Found USDC pool:', usdcPool);
        const { reserve0, reserve1, token0, token1 } = usdcPool;
        const isToken0 = tokenAddress.toLowerCase() === token0.address.toLowerCase();
        
        const tokenReserve = isToken0 ? reserve0 : reserve1;
        const usdcReserve = isToken0 ? reserve1 : reserve0;
        
        const tokenDecimals = isToken0 ? token0.decimals : token1.decimals;
        const usdcDecimals = isToken0 ? token1.decimals : token0.decimals;
        
        const normalizedTokenReserve = Number(ethers.formatUnits(tokenReserve, tokenDecimals));
        const normalizedUSDCReserve = Number(ethers.formatUnits(usdcReserve, usdcDecimals));
        
        const price = normalizedUSDCReserve / normalizedTokenReserve;
        console.log(`Price from USDC pool: $${price}`);
        return price;
      }
    } catch (error) {
      console.error('Error getting price from USDC pool:', error);
    }

    // Try USDT pool if USDC pool doesn't exist or failed
    try {
      const usdtPool = await this.uniswap.getPoolInfo(tokenAddress, stablecoins.USDT);
      if (usdtPool && usdtPool.reserve0 && usdtPool.reserve1) {
        console.log('Found USDT pool:', usdtPool);
        const { reserve0, reserve1, token0, token1 } = usdtPool;
        const isToken0 = tokenAddress.toLowerCase() === token0.address.toLowerCase();
        
        const tokenReserve = isToken0 ? reserve0 : reserve1;
        const usdtReserve = isToken0 ? reserve1 : reserve0;
        
        const tokenDecimals = isToken0 ? token0.decimals : token1.decimals;
        const usdtDecimals = isToken0 ? token1.decimals : token0.decimals;
        
        const normalizedTokenReserve = Number(ethers.formatUnits(tokenReserve, tokenDecimals));
        const normalizedUSDTReserve = Number(ethers.formatUnits(usdtReserve, usdtDecimals));
        
        const price = normalizedUSDTReserve / normalizedTokenReserve;
        console.log(`Price from USDT pool: $${price}`);
        return price;
      }
    } catch (error) {
      console.error('Error getting price from USDT pool:', error);
    }

    return null;
  }

  async calculateUSDValue(tokenAddress, amount, decimals) {
    try {
      await this.init();
      
      if (!tokenAddress || !amount || decimals === undefined) {
        console.log('Missing required parameters:', { tokenAddress, amount, decimals });
        return null;
      }

      console.log('Calculating USD value for:', { tokenAddress, amount, decimals });
      let price;
      
      // Handle known tokens
      const stablecoins = STABLECOINS[this.chainId];
      if (!stablecoins) {
        console.warn('No stablecoin addresses found for chain:', this.chainId);
        return null;
      }

      switch(tokenAddress.toLowerCase()) {
        case 'eth':
        case '0xfff9976782d46cc05630d1f6ebab18b2324d6b14': // WETH Sepolia
          price = await this.getETHPrice();
          break;
        case stablecoins.USDC.toLowerCase():
          price = 1; // USDC is pegged to USD
          break;
        case stablecoins.USDT.toLowerCase():
          price = 1; // USDT is pegged to USD
          break;
        default:
          // For unknown tokens, try to find their price through pool ratios
          price = await this.getPriceFromStablePair(tokenAddress);
      }

      if (!price) {
        console.log('Could not determine price for token:', tokenAddress);
        return null;
      }

      console.log('Token price:', price);
      const normalizedAmount = Number(ethers.formatUnits(amount, decimals));
      const usdValue = normalizedAmount * price;
      console.log('Calculated USD value:', usdValue);
      
      return usdValue;
    } catch (error) {
      console.error('Error calculating USD value:', error);
      return null;
    }
  }
} 