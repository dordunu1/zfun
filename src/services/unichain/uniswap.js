import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

// Uniswap V2 Contract Addresses
export const UNISWAP_ADDRESSES = {
  // Monad Testnet (10143)
  10143: {
    router: '0xfb8e1c3b833f9e67a71c859a132cf783b645e436',
    factory: '0x733e88f248b742db6c14c0b1713af5ad7fdd59d0',
    WETH: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701', // WMONA address
    USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
  },
  // Unichain Testnet (1301)
  1301: {
    router: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    WETH: '0x4200000000000000000000000000000000000006',
    USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
  },
  // Unichain Mainnet (130)
  130: {
    router: '0x284F11109359a7e1306C3e447ef14D38400063FF',
    factory: '0x1F98400000000000000000000000000000000002',
    WETH: '0x4200000000000000000000000000000000000006',
    USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
  }
};

// ERC20 ABI for token interactions
const ERC20_ABI = [
  'function approve(address spender, uint value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint)',
  'function balanceOf(address owner) external view returns (uint)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
];

// Router ABI from Uniswap V2 specification
const ROUTER_ABI = [
  // Factory and WETH
  'function factory() external pure returns (address)',
  'function WETH() external pure returns (address)',

  // Add liquidity
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',

  // Remove liquidity
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityWithPermit(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETHWithPermit(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountETH)',
  'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountETH)',

  // Swap
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',

  // Supporting fee-on-transfer tokens
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',

  // Price functions
  'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)',
  'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)'
];

// Add factory ABI after ROUTER_ABI
const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address)',
  'function createPair(address tokenA, address tokenB) external returns (address)',
  'function allPairs(uint) external view returns (address)',
  'function allPairsLength() external view returns (uint)',
  'function feeTo() external view returns (address)',
  'function feeToSetter() external view returns (address)'
];

// Add PAIR_ABI constant after FACTORY_ABI
const PAIR_ABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
];

// Add WETH ABI after other ABIs
const WETH_ABI = [
  'function deposit() external payable',
  'function withdraw(uint) external',
  'function balanceOf(address) external view returns (uint)',
  'function approve(address spender, uint value) external returns (bool)'
];

// Add Chainlink price feed addresses for Optimism
export const CHAINLINK_FEEDS = {
  'ETH/USD': '0x13e3ee699d1909e989722e753853ae30b17e08c5',
  'USDT/USD': '0xECef79E109e997bCA29c1c0897ec9d7b03647F5E'
};

// Add Chainlink aggregator ABI
const CHAINLINK_AGGREGATOR_ABI = [
  'function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() external view returns (uint8)'
];

export class UnichainUniswapService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.router = null;
    this.chainId = null;
    
    // Initialize cache
    this.poolCache = new Map();
    this.poolInfoCache = new Map();
    this.lastCacheUpdate = 0;
    this.CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
    
    // Load cache from localStorage
    this.loadCacheFromStorage();
  }

  // Cache management methods
  loadCacheFromStorage() {
    try {
      const storedCache = localStorage.getItem('unichainPoolCache');
      if (storedCache) {
        const { pools, poolInfo, timestamp } = JSON.parse(storedCache);
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          this.poolCache = new Map(pools);
          this.poolInfoCache = new Map(poolInfo);
          this.lastCacheUpdate = timestamp;
        }
      }
    } catch (error) {
      // Remove console.warn and handle silently
    }
  }

  saveCacheToStorage() {
    try {
      const cacheData = {
        pools: Array.from(this.poolCache.entries()),
        poolInfo: Array.from(this.poolInfoCache.entries()),
        timestamp: Date.now()
      };
      localStorage.setItem('unichainPoolCache', JSON.stringify(cacheData));
    } catch (error) {
      // Remove console.warn and handle silently
    }
  }

  clearCache() {
    this.poolCache.clear();
    this.poolInfoCache.clear();
    this.lastCacheUpdate = 0;
    localStorage.removeItem('unichainPoolCache');
  }

  isCacheValid() {
    return Date.now() - this.lastCacheUpdate < this.CACHE_DURATION;
  }

  async init() {
    if (!window.ethereum) throw new Error('No Web3 Provider found');

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    const network = await this.provider.getNetwork();
    this.chainId = Number(network.chainId);

    // Get the correct addresses for the current network
    const addresses = UNISWAP_ADDRESSES[this.chainId];
    if (!addresses) throw new Error('Unsupported network');

    this.router = new ethers.Contract(addresses.router, ROUTER_ABI, this.signer);
  }

  // Helper function to approve tokens
  async approveToken(tokenAddress, amount) {
    try {
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      const account = await this.signer.getAddress();
      const chainId = await this.signer.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      const allowance = await token.allowance(account, addresses.router);
      
      if (allowance < amount) {
        const tx = await token.approve(addresses.router, ethers.MaxUint256);
        await tx.wait();
      }
    } catch (error) {
      throw error;
    }
  }

  // Get token information
  async getTokenInfo(tokenAddress) {
    try {
      // Handle ETH specially
      if (tokenAddress === 'ETH') {
        return {
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18
        };
      }

      // Use window.ethereum provider to match user's network
      const provider = new ethers.BrowserProvider(window.ethereum);
      const token = new ethers.Contract(
        tokenAddress,
        [
          'function symbol() view returns (string)',
          'function name() view returns (string)',
          'function decimals() view returns (uint8)'
        ],
        provider
      );
      
      const [symbol, name, decimals] = await Promise.all([
        token.symbol().catch(() => 'Unknown'),
        token.name().catch(() => 'Unknown Token'),
        token.decimals().catch(() => 18)
      ]);
      
      return {
        symbol,
        name,
        decimals,
        address: tokenAddress
      };
    } catch (error) {
      console.error('Error in getTokenInfo:', error);
      return {
        symbol: 'Unknown',
        name: 'Unknown Token',
        decimals: 18,
        address: tokenAddress
      };
    }
  }

  // Calculate initial pool price
  calculateInitialPoolPrice(amount0, amount1, decimals0, decimals1) {
    try {
      // Convert BigInt amounts to decimal representation using ethers.formatUnits
      const amount0Decimal = Number(ethers.formatUnits(amount0, decimals0));
      const amount1Decimal = Number(ethers.formatUnits(amount1, decimals1));

      // Calculate price ratios
      const token0Price = amount1Decimal / amount0Decimal;
      const token1Price = amount0Decimal / amount1Decimal;

      return { 
        token0Price: token0Price.toFixed(6),
        token1Price: token1Price.toFixed(6)
      };
    } catch (error) {
      console.error('Error calculating initial pool price:', error);
      return {
        token0Price: '0',
        token1Price: '0'
      };
    }
  }

  // Modify createPool function
  async createPool(token0Address, token1Address, amount0, amount1) {
    try {
      if (!this.router) await this.init();
      
      const account = await this.signer.getAddress();
      const chainId = await this.signer.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      const isToken0WETH = token0Address.toLowerCase() === addresses.WETH.toLowerCase();
      const isToken1WETH = token1Address.toLowerCase() === addresses.WETH.toLowerCase();
      const isETHPair = isToken0WETH || isToken1WETH;

      const factoryAddress = await this.router.factory();
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, this.signer);

      const existingPair = await factory.getPair(token0Address, token1Address);
      const isNewPair = existingPair === '0x0000000000000000000000000000000000000000';

      if (isETHPair) {
        const tokenAddress = isToken0WETH ? token1Address : token0Address;
        const ethAmount = isToken0WETH ? amount0 : amount1;
        const tokenAmount = isToken0WETH ? amount1 : amount0;

        if (isNewPair) {
          const createPairTx = await factory.createPair(addresses.WETH, tokenAddress);
          await createPairTx.wait();
        }

        await this.approveToken(tokenAddress, tokenAmount);

        const tokenAmountMin = (tokenAmount * 990n) / 1000n;
        const ethAmountMin = (ethAmount * 990n) / 1000n;

        const tx = await this.router.addLiquidityETH(
          tokenAddress,
          tokenAmount,
          tokenAmountMin,
          ethAmountMin,
          account,
          deadline,
          {
            value: ethAmount,
            gasLimit: ethers.getBigInt(1000000)
          }
        );

        const receipt = await tx.wait();

        return {
          receipt,
          priceInfo: {
            token0Price: (Number(ethAmount) / Number(tokenAmount)).toFixed(6),
            token1Price: (Number(tokenAmount) / Number(ethAmount)).toFixed(6)
          }
        };
      } else {
        let finalAmount0Big = BigInt(amount0);
        let finalAmount1Big = BigInt(amount1);

        if (!isNewPair) {
          const pairContract = new ethers.Contract(existingPair, PAIR_ABI, this.provider);
          const [reserve0, reserve1] = await pairContract.getReserves();
          const token0InPair = await pairContract.token0();
          
          if (token0Address.toLowerCase() !== token0InPair.toLowerCase()) {
            [finalAmount0Big, finalAmount1Big] = [finalAmount1Big, finalAmount0Big];
            [token0Address, token1Address] = [token1Address, token0Address];
          }

          if (reserve0 > 0n && reserve1 > 0n) {
            try {
              const quote = await this.router.quote(finalAmount0Big, reserve0, reserve1);
              finalAmount1Big = quote;
            } catch (error) {
              throw new Error('Failed to calculate optimal amounts for the pool ratio');
            }
          }
        } else {
          const createPairTx = await factory.createPair(token0Address, token1Address);
          await createPairTx.wait();
        }

        const [token0Contract, token1Contract] = await Promise.all([
          new ethers.Contract(token0Address, ERC20_ABI, this.provider),
          new ethers.Contract(token1Address, ERC20_ABI, this.provider)
        ]);

        const [decimals0, decimals1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals()
        ]);

        const priceInfo = this.calculateInitialPoolPrice(finalAmount0Big, finalAmount1Big, decimals0, decimals1);

        await Promise.all([
          this.approveToken(token0Address, finalAmount0Big),
          this.approveToken(token1Address, finalAmount1Big)
        ]);

        const amountAMin = (finalAmount0Big * 990n) / 1000n;
        const amountBMin = (finalAmount1Big * 990n) / 1000n;

        const tx = await this.router.addLiquidity(
          token0Address,
          token1Address,
          finalAmount0Big,
          finalAmount1Big,
          amountAMin,
          amountBMin,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );

        const receipt = await tx.wait();

        return {
          receipt,
          priceInfo
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // Add ETH liquidity
  async addLiquidityETH(tokenAddress, amountToken, amountETH, target) {
    try {
      if (!this.router) await this.init();

      const chainId = await this.signer.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      // Approve token first
      await this.approveToken(tokenAddress, amountToken);

      // Calculate minimum amounts (1% slippage)
      const amountTokenMin = (amountToken * 990n) / 1000n;
      const amountETHMin = (amountETH * 990n) / 1000n;

      // Replace WETH with actual token address if it's WETH
      const actualTokenAddress = tokenAddress.toLowerCase() === addresses.WETH.toLowerCase() 
        ? addresses.WETH 
        : tokenAddress;

      const tx = await this.router.addLiquidityETH(
        actualTokenAddress,
        amountToken,
        amountTokenMin,
        amountETHMin,
        target,
        deadline,
        {
          value: amountETH,
          gasLimit: ethers.getBigInt(1000000)
        }
      );

      return tx;
    } catch (error) {
      throw error;
    }
  }

  // Add regular token-token liquidity
  async addLiquidity(token0Address, token1Address, amount0, amount1, account) {
    try {
      if (!this.router) await this.init();

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      // Approve both tokens
      await Promise.all([
        this.approveToken(token0Address, amount0),
        this.approveToken(token1Address, amount1)
      ]);

      // Calculate minimum amounts (allow for some slippage)
      const amount0Min = (amount0 * 990n) / 1000n; // 1% slippage
      const amount1Min = (amount1 * 990n) / 1000n; // 1% slippage

      // Get the signer's address if account is not provided
      const target = account || await this.signer.getAddress();

      const tx = await this.router.addLiquidity(
        token0Address,
        token1Address,
        amount0,
        amount1,
        amount0Min,
        amount1Min,
        target,
        deadline,
        {
          gasLimit: ethers.getBigInt(1000000)
        }
      );

      return tx;
    } catch (error) {
      throw error;
    }
  }

  // Add checkPoolExists method
  async checkPoolExists(tokenA, tokenB) {
    try {
      if (!this.router) await this.init();
      
      const chainId = await this.provider.getNetwork().then(n => Number(n.chainId));
      
      // For Monad testnet, use direct RPC calls
      if (chainId === 10143) {
        const factoryAddress = UNISWAP_ADDRESSES[10143].factory;
        
        // Encode the getPair function call
        const getPairData = ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'address'],
          [tokenA, tokenB]
        ).slice(2);
        
        const pairAddress = await window.ethereum.request({
          method: 'eth_call',
          params: [{
            to: factoryAddress,
            data: '0xe6a43905' + getPairData // getPair function selector
          }, 'latest']
        });
        
        return pairAddress !== '0x0000000000000000000000000000000000000000000000000000000000000000';
      }
      
      // For other networks, use the original implementation
      const factoryAddress = await this.router.factory();
      const factory = new ethers.Contract(
        factoryAddress,
        FACTORY_ABI,
        this.provider
      );

      const pairAddress = await factory.getPair(tokenA, tokenB);
      return pairAddress !== '0x0000000000000000000000000000000000000000';
    } catch (error) {
      console.error('Error checking pool exists:', error);
      return false;
    }
  }

  // Helper function to round amounts
  roundAmount(amount, decimals = 18) {
    try {
      // Convert to human readable with full decimals
      const fullAmount = ethers.formatUnits(amount, decimals);
      // Round to 4 decimal places maximum
      const roundedAmount = Number(fullAmount).toFixed(4);
      // Convert back to token units
      return ethers.parseUnits(roundedAmount, decimals);
    } catch (error) {
      console.error('Error rounding amount:', error);
      return amount;
    }
  }

  // Modify swap method
  async swap(fromToken, toToken, amountIn, amountOutMin, path, deadline) {
    try {
      if (!this.router) await this.init();
      
      const account = await this.signer.getAddress();
      const isFromNative = fromToken.symbol === 'ETH' || fromToken.symbol === 'MON';
      const isToNative = toToken.symbol === 'ETH' || toToken.symbol === 'MON';
      
      if (!isFromNative) {
        await this.approveToken(fromToken.address, amountIn);
      }

      const minOutWithSlippage = 0n;

      let tx;

      if (isFromNative) {
        // Use swapExactETHForTokens for native token (MON/ETH) to token swaps
        tx = await this.router.swapExactETHForTokens(
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            value: amountIn,
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else if (isToNative) {
        // Use swapExactTokensForETH for token to native token (MON/ETH) swaps
        tx = await this.router.swapExactTokensForETH(
          amountIn,
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else {
        // Regular token to token swap
        tx = await this.router.swapExactTokensForTokens(
          amountIn,
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      }

      return tx;
    } catch (error) {
      if (error.data) {
        throw new Error('Transaction failed: ' + error.data);
      }
      throw error;
    }
  }

  // Add getAmountOut method
  async getAmountOut(amountIn, path) {
    try {
      if (!this.router) await this.init();
      
      if (!amountIn || !path || path.length < 2) {
        return '0';
      }

      const amounts = await this.router.getAmountsOut(amountIn, path);
      return amounts[amounts.length - 1];
    } catch (error) {
      throw error;
    }
  }

  // Modify updateRoute method
  async updateRoute(fromToken, toToken, amount) {
    try {
      if (!this.router) await this.init();
      
      if (!fromToken || !toToken || !amount) {
        return {
          route: null,
          toAmount: '0'
        };
      }

      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      // Handle MON (native) token by using WMONAD
      const fromAddress = fromToken.symbol === 'MON' ? addresses.WETH : fromToken.address;
      const toAddress = toToken.symbol === 'MON' ? addresses.WETH : toToken.address;

      // Parse input amount - use 18 decimals for MON
      const amountIn = ethers.parseUnits(
        amount, 
        fromToken.symbol === 'MON' ? 18 : fromToken.decimals
      );

      // For Monad testnet, use direct RPC calls
      if (chainId === 10143) {
        // Try direct path first if not involving native MON
        if (fromToken.symbol !== 'MON' && toToken.symbol !== 'MON' && fromAddress !== toAddress) {
          const directPath = [fromAddress, toAddress];
          const hasDirectPair = await this.checkPoolExists(fromAddress, toAddress);
          
          if (hasDirectPair) {
            try {
              // Encode getAmountsOut function call
              const getAmountsOutData = ethers.AbiCoder.defaultAbiCoder().encode(
                ['uint256', 'address[]'],
                [amountIn, directPath]
              ).slice(2);
              
              const amountsHex = await window.ethereum.request({
                method: 'eth_call',
                params: [{
                  to: addresses.router,
                  data: '0xd06ca61f' + getAmountsOutData // getAmountsOut function selector
                }, 'latest']
              });
              
              const amounts = ethers.AbiCoder.defaultAbiCoder().decode(['uint256[]'], amountsHex)[0];
              const toAmount = ethers.formatUnits(
                amounts[amounts.length - 1],
                toToken.symbol === 'MON' ? 18 : toToken.decimals
              );

              return {
                route: `${fromToken.symbol} → ${toToken.symbol}`,
                toAmount,
                path: directPath
              };
            } catch (error) {
              console.log('Error getting amounts for direct path:', error);
            }
          }
        }

        // For MON to token or token to MON, always use WMONAD path
        const pathThroughWMONAD = fromToken.symbol === 'MON' ?
          [addresses.WETH, toAddress] :
          toToken.symbol === 'MON' ?
          [fromAddress, addresses.WETH] :
          [fromAddress, addresses.WETH, toAddress];

        const hasFirstPair = fromToken.symbol === 'MON' || await this.checkPoolExists(fromAddress, addresses.WETH);
        const hasSecondPair = toToken.symbol === 'MON' || await this.checkPoolExists(addresses.WETH, toAddress);
        
        if (hasFirstPair && hasSecondPair) {
          try {
            // For MON to token swaps, we need to account for wrapping MON first
            const effectiveAmountIn = fromToken.symbol === 'MON' ? amountIn : amountIn;
            
            // Encode getAmountsOut function call
            const getAmountsOutData = ethers.AbiCoder.defaultAbiCoder().encode(
              ['uint256', 'address[]'],
              [effectiveAmountIn, pathThroughWMONAD]
            ).slice(2);
            
            const amountsHex = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: addresses.router,
                data: '0xd06ca61f' + getAmountsOutData // getAmountsOut function selector
              }, 'latest']
            });
            
            const amounts = ethers.AbiCoder.defaultAbiCoder().decode(['uint256[]'], amountsHex)[0];
            const toAmount = ethers.formatUnits(
              amounts[amounts.length - 1],
              toToken.symbol === 'MON' ? 18 : toToken.decimals
            );
            
            const routeDescription = fromToken.symbol === 'MON' ?
              `${fromToken.symbol} → WMONAD → ${toToken.symbol}` :
              toToken.symbol === 'MON' ?
              `${fromToken.symbol} → WMONAD → ${toToken.symbol}` :
              `${fromToken.symbol} → WMONAD → ${toToken.symbol}`;

            return {
              route: routeDescription,
              toAmount,
              path: pathThroughWMONAD
            };
          } catch (error) {
            console.log('Error getting amounts through WMONAD:', error);
            throw new Error('Failed to calculate swap amounts');
          }
        }
      } else {
        // Original implementation for other networks
        // ... existing code for other networks ...
        try {
          // For token to token swaps, construct path through WETH
          const pathThroughWETH = [fromAddress, addresses.WETH, toAddress];
          
          // Check if pools exist
          const hasFirstPair = await this.checkPoolExists(fromAddress, addresses.WETH);
          const hasSecondPair = await this.checkPoolExists(addresses.WETH, toAddress);
          
          if (hasFirstPair && hasSecondPair) {
            try {
              const amounts = await this.router.getAmountsOut(amountIn, pathThroughWETH);
              const toAmount = ethers.formatUnits(
                amounts[amounts.length - 1],
                toToken.symbol === 'ETH' ? 18 : toToken.decimals
              );
              
              return {
                route: `${fromToken.symbol} → WETH → ${toToken.symbol}`,
                toAmount,
                path: pathThroughWETH
              };
            } catch (amountError) {
              console.log('Error getting amounts through WETH:', amountError);
            }
          }
        } catch (error) {
          console.log('Error checking WETH route:', error);
        }

        // Try direct path as fallback
        try {
          // Only try direct path if tokens are different
          if (fromAddress !== toAddress) {
            const directPath = [fromAddress, toAddress];
            const hasDirectPair = await this.checkPoolExists(fromAddress, toAddress);
            
            if (hasDirectPair) {
              try {
                const amounts = await this.router.getAmountsOut(amountIn, directPath);
                const toAmount = ethers.formatUnits(
                  amounts[amounts.length - 1],
                  toToken.symbol === 'ETH' ? 18 : toToken.decimals
                );

                return {
                  route: `${fromToken.symbol} → ${toToken.symbol}`,
                  toAmount,
                  path: directPath
                };
              } catch (amountError) {
                console.log('Error getting amounts for direct path:', amountError);
              }
            }
          }
        } catch (error) {
          console.log('Error checking direct path:', error);
        }
      }

      return {
        route: null,
        toAmount: '0',
        error: 'No valid route found'
      };
    } catch (error) {
      console.error('Error in updateRoute:', error);
      throw error;
    }
  }

  // Get token balance
  async getTokenBalance(tokenAddress, userAddress) {
    try {
      if (!this.provider) await this.init();

      // Handle ETH balance
      if (tokenAddress === 'ETH') {
        const balance = await this.provider.getBalance(userAddress);
        return ethers.formatEther(balance);
      }

      // Handle ERC20 token balance
      const token = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );

      const [balance, decimals] = await Promise.all([
        token.balanceOf(userAddress),
        token.decimals()
      ]);

      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      throw error;
    }
  }

  // Add wrapETH method
  async wrapETH(amount) {
    try {
      if (!this.signer) await this.init();

      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      // Create WETH contract instance
      const weth = new ethers.Contract(
        addresses.WETH,
        WETH_ABI,
        this.signer
      );

      // Call deposit with the ETH amount
      const tx = await weth.deposit({
        value: amount,
        gasLimit: ethers.getBigInt(100000)
      });

      return tx;
    } catch (error) {
      throw error;
    }
  }

  // Add unwrapWETH method
  async unwrapWETH(amount) {
    try {
      if (!this.signer) await this.init();

      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      // Create WETH contract instance
      const weth = new ethers.Contract(
        addresses.WETH,
        WETH_ABI,
        this.signer
      );

      // Call withdraw with the WETH amount
      const tx = await weth.withdraw(amount);

      return tx;
    } catch (error) {
      throw error;
    }
  }

  // Add getWETHBalance method
  async getWETHBalance(address) {
    try {
      if (!this.provider) await this.init();

      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      const weth = new ethers.Contract(
        addresses.WETH,
        WETH_ABI,
        this.provider
      );

      const balance = await weth.balanceOf(address);
      return balance;
    } catch (error) {
      throw error;
    }
  }

  // Get pools where user has LP tokens
  async getUserPools(userAddress) {
    try {
      if (!this.provider) await this.init();

      // Get factory contract
      const factory = new ethers.Contract(
        addresses.factory,
        FACTORY_ABI,
        this.provider
      );

      // Get total number of pairs
      const pairCount = await factory.allPairsLength();

      // Get all pair addresses
      const pairAddresses = await Promise.all(
        Array.from({ length: Number(pairCount) }, (_, i) => factory.allPairs(i))
      );

      // Check each pair for user's LP tokens
      const userPools = await Promise.all(
        pairAddresses.map(async (pairAddress) => {
          try {
            const pair = new ethers.Contract(
              pairAddress,
              [
                'function balanceOf(address) view returns (uint256)',
                'function token0() view returns (address)',
                'function token1() view returns (address)'
              ],
              this.provider
            );

            // Get user's balance
            const balance = await pair.balanceOf(userAddress);

            // If user has LP tokens, get token info
            if (balance > 0) {
              const [token0, token1] = await Promise.all([
                pair.token0(),
                pair.token1()
              ]);

              return {
                pairAddress,
                token0,
                token1,
                balance
              };
            }
            return null;
          } catch (err) {
            return null;
          }
        })
      );

      // Filter out null values (pairs where user has no balance)
      const validPools = userPools.filter(pool => pool !== null);

      return validPools.map(pool => pool.pairAddress);
    } catch (error) {
      throw error;
    }
  }

  // Get pool information
  async getPoolInfo(token0Address, token1Address) {
    try {
      const cacheKey = `${token0Address}-${token1Address}`;
      
      // Check cache first
      if (this.isCacheValid() && this.poolInfoCache.has(cacheKey)) {
        return this.poolInfoCache.get(cacheKey);
      }

      if (!this.provider) await this.init();

      // Get factory address from router
      const factoryAddress = await this.router.factory();
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, this.provider);

      // Get pair address
      const pairAddress = await factory.getPair(token0Address, token1Address);
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      // Get pair contract
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
      const [token0, token1, reserves] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves()
      ]);

      // Get token metadata
      const [token0Info, token1Info] = await Promise.all([
        token0Address === 'ETH' ? { symbol: 'ETH', name: 'Ethereum', decimals: 18 } : this.getTokenInfo(token0),
        token1Address === 'ETH' ? { symbol: 'ETH', name: 'Ethereum', decimals: 18 } : this.getTokenInfo(token1)
      ]);

      const poolInfo = {
        token0: { address: token0Address, ...token0Info },
        token1: { address: token1Address, ...token1Info },
        reserves: {
          reserve0: reserves[0],
          reserve1: reserves[1],
          blockTimestampLast: reserves[2]
        },
        pairAddress
      };

      // Update cache
      this.poolInfoCache.set(cacheKey, poolInfo);
      this.saveCacheToStorage();

      return poolInfo;
    } catch (error) {
      throw error;
    }
  }

  // Get pool information by address
  async getPoolInfoByAddress(pairAddress) {
    try {
      if (!this.provider) await this.init();

      // Get pair contract
      const pair = new ethers.Contract(
        pairAddress,
        [
          'function token0() view returns (address)',
          'function token1() view returns (address)',
          'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ],
        this.provider
      );

      // Get basic pool info
      const [token0Address, token1Address, reserves] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves()
      ]);

      // Get token metadata
      const [token0Info, token1Info] = await Promise.all([
        this.getTokenInfo(token0Address),
        this.getTokenInfo(token1Address)
      ]);

      return {
        token0: { ...token0Info, address: token0Address },
        token1: { ...token1Info, address: token1Address },
        reserves: {
          reserve0: reserves[0],
          reserve1: reserves[1],
          blockTimestampLast: reserves[2]
        },
        pairAddress
      };
    } catch (error) {
      throw error;
    }
  }

  // Add method to get price from Chainlink
  async getPriceFromChainlink(tokenSymbol) {
    try {
      let feedAddress;
      if (tokenSymbol === 'ETH' || tokenSymbol === 'WETH') {
        feedAddress = CHAINLINK_FEEDS['ETH/USD'];
      } else if (tokenSymbol === 'USDT') {
        feedAddress = CHAINLINK_FEEDS['USDT/USD'];
      }

      if (!feedAddress) return null;

      const feed = new ethers.Contract(
        feedAddress,
        CHAINLINK_AGGREGATOR_ABI,
        this.provider
      );

      const [price, decimals] = await Promise.all([
        feed.latestRoundData().then(data => data.answer),
        feed.decimals()
      ]);

      return Number(ethers.formatUnits(price, decimals));
    } catch (error) {
      throw error;
    }
  }

  // Add method to get price from pool ratio
  async getPriceFromPool(tokenAddress, quoteTokenAddress = addresses.USDT) {
    try {
      const factory = new ethers.Contract(
        addresses.factory,
        FACTORY_ABI,
        this.provider
      );

      const pairAddress = await factory.getPair(tokenAddress, quoteTokenAddress);
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      const pair = new ethers.Contract(
        pairAddress,
        PAIR_ABI,
        this.provider
      );

      const [reserves, token0] = await Promise.all([
        pair.getReserves(),
        pair.token0()
      ]);

      const [reserve0, reserve1] = reserves;
      const isToken0 = tokenAddress.toLowerCase() === token0.toLowerCase();

      // Get token decimals
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );
      const quoteTokenContract = new ethers.Contract(
        quoteTokenAddress,
        ERC20_ABI,
        this.provider
      );
      const [tokenDecimals, quoteTokenDecimals] = await Promise.all([
        tokenContract.decimals(),
        quoteTokenContract.decimals()
      ]);

      // Calculate price based on reserves
      if (isToken0) {
        return Number(ethers.formatUnits(reserve1, quoteTokenDecimals)) / 
               Number(ethers.formatUnits(reserve0, tokenDecimals));
      } else {
        return Number(ethers.formatUnits(reserve0, quoteTokenDecimals)) / 
               Number(ethers.formatUnits(reserve1, tokenDecimals));
      }
    } catch (error) {
      throw error;
    }
  }

  // Update getPools method to load more pools faster
  async getPools(tokenAddress) {
    if (!tokenAddress) {
      throw new Error('tokenAddress is required');
    }

    try {
      if (this.isCacheValid() && this.poolCache.has(tokenAddress)) {
        return this.poolCache.get(tokenAddress);
      }

      if (!this.provider) await this.init();
      
      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const addresses = UNISWAP_ADDRESSES[chainId];
      
      if (!addresses) {
        throw new Error('Network not supported');
      }

      const factory = new ethers.Contract(
        addresses.factory,
        FACTORY_ABI,
        this.provider
      );

      const pairCount = await factory.allPairsLength();
      const userAddress = await this.signer.getAddress();
      
      const uniquePairs = new Set();
      const pairs = [];
      
      const batchSize = 40;
      const maxPairsToCheck = Math.min(Number(pairCount), 200);
      
      for (let i = 0; i < maxPairsToCheck; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, maxPairsToCheck - i);
        const batch = Array.from({ length: currentBatchSize }, (_, j) => i + j);
        
        const pairAddresses = await Promise.all(
          batch.map(index => factory.allPairs(index))
        );
        
        const pairContracts = pairAddresses.map(addr => 
          new ethers.Contract(
            addr,
            [...PAIR_ABI, 'function balanceOf(address) view returns (uint256)'],
            this.provider
          )
        );
        
        const pairDataPromises = pairContracts.map(async (pair, idx) => {
          try {
            const pairAddress = pairAddresses[idx];
            if (uniquePairs.has(pairAddress)) return null;
            
            const [balance, token0Address, token1Address, reserves] = await Promise.all([
              pair.balanceOf(userAddress),
              pair.token0(),
              pair.token1(),
              pair.getReserves()
            ]);
            
            if (token0Address.toLowerCase() === tokenAddress.toLowerCase() || 
                token1Address.toLowerCase() === tokenAddress.toLowerCase()) {
              
              const [token0Info, token1Info] = await Promise.all([
                this.getTokenInfo(token0Address),
                this.getTokenInfo(token1Address)
              ]);

              return {
                address: pairAddress,
                token0: { address: token0Address, ...token0Info },
                token1: { address: token1Address, ...token1Info },
                reserves,
                owned: balance > 0
              };
            }
            return null;
          } catch (error) {
            return null;
          }
        });
        
        const batchResults = await Promise.all(pairDataPromises);
        const validResults = batchResults.filter(result => result !== null);
        
        for (const result of validResults) {
          if (!uniquePairs.has(result.address)) {
            uniquePairs.add(result.address);
            pairs.push(result);
          }
        }
        
        if (pairs.length >= 40) break;
      }

      pairs.sort((a, b) => {
        if (a.owned === b.owned) return 0;
        return a.owned ? -1 : 1;
      });

      this.poolCache.set(tokenAddress, pairs);
      this.lastCacheUpdate = Date.now();
      this.saveCacheToStorage();

      return pairs;
    } catch (error) {
      throw error;
    }
  }

  // Update getTokenBalance method to be more robust
  async getTokenBalance(tokenAddress, userAddress) {
    try {
      if (!this.provider) await this.init();

      // Handle ETH balance
      if (tokenAddress === 'ETH') {
        const balance = await this.provider.getBalance(userAddress);
        return ethers.formatEther(balance);
      }

      // Handle ERC20 token balance
      const token = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );

      const [balance, decimals] = await Promise.all([
        token.balanceOf(userAddress),
        token.decimals()
      ]);

      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      throw error;
    }
  }

  // Add method to get pool information with caching
  async getPoolInfo(token0Address, token1Address) {
    try {
      const cacheKey = `${token0Address}-${token1Address}`;
      
      // Check cache first
      if (this.isCacheValid() && this.poolInfoCache.has(cacheKey)) {
        return this.poolInfoCache.get(cacheKey);
      }

      if (!this.provider) await this.init();

      // Get factory address from router
      const factoryAddress = await this.router.factory();
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, this.provider);

      // Get pair address
      const pairAddress = await factory.getPair(token0Address, token1Address);
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      // Get pair contract
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
      const [token0, token1, reserves] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves()
      ]);

      // Get token metadata
      const [token0Info, token1Info] = await Promise.all([
        token0Address === 'ETH' ? { symbol: 'ETH', name: 'Ethereum', decimals: 18 } : this.getTokenInfo(token0),
        token1Address === 'ETH' ? { symbol: 'ETH', name: 'Ethereum', decimals: 18 } : this.getTokenInfo(token1)
      ]);

      const poolInfo = {
        token0: { address: token0Address, ...token0Info },
        token1: { address: token1Address, ...token1Info },
        reserves: {
          reserve0: reserves[0],
          reserve1: reserves[1],
          blockTimestampLast: reserves[2]
        },
        pairAddress
      };

      // Update cache
      this.poolInfoCache.set(cacheKey, poolInfo);
      this.saveCacheToStorage();

      return poolInfo;
    } catch (error) {
      throw error;
    }
  }

  // Add removeLiquidity function
  async removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to) {
    try {
      if (!this.router) await this.init();

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      // Check if one of the tokens is WETH
      const isTokenAWETH = tokenA.toLowerCase() === addresses.WETH.toLowerCase();
      const isTokenBWETH = tokenB.toLowerCase() === addresses.WETH.toLowerCase();

      let tx;
      if (isTokenAWETH || isTokenBWETH) {
        // Use removeLiquidityETH for ETH pairs
        const token = isTokenAWETH ? tokenB : tokenA;
        const amountTokenMin = isTokenAWETH ? amountBMin : amountAMin;
        const amountETHMin = isTokenAWETH ? amountAMin : amountBMin;

        tx = await this.router.removeLiquidityETH(
          token,
          liquidity,
          amountTokenMin,
          amountETHMin,
          to,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else {
        // Use regular removeLiquidity for token-token pairs
        tx = await this.router.removeLiquidity(
          tokenA,
          tokenB,
          liquidity,
          amountAMin,
          amountBMin,
          to,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      }

      return tx;
    } catch (error) {
      throw error;
    }
  }

  async swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline) {
    if (!this.router) await this.init();
    return this.router.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    );
  }

  async swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin, path, to, deadline, options) {
    if (!this.router) await this.init();
    return this.router.swapExactETHForTokensSupportingFeeOnTransferTokens(
      amountOutMin,
      path,
      to,
      deadline,
      options
    );
  }

  async swapExactTokensForETH(amountIn, amountOutMin, path, to, deadline) {
    if (!this.router) await this.init();
    return this.router.swapExactTokensForETH(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    );
  }

  async swapExactETHForTokens(amountOutMin, path, to, deadline, options) {
    if (!this.router) await this.init();
    return this.router.swapExactETHForTokens(
      amountOutMin,
      path,
      to,
      deadline,
      options
    );
  }

  async swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, to, deadline) {
    if (!this.router) await this.init();
    return this.router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline,
      {
        gasLimit: ethers.getBigInt(1000000)
      }
    );
  }
} 